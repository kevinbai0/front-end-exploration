import { createSubLexer, SubLexer } from "./lexerDefinitions"
import { tokenizeIncompleteCharacter, retokenizeToken, tokenizeCharacter } from "./lexerMethods"
import { markers } from "../lang/keywords"

const comparatorLexer = createSubLexer("parseComparator", /[<>&|]/s, {
    tokenizeFirst: (char, ln, pos) => tokenizeIncompleteCharacter("comparator", char, ln, pos),
    tokenizeNext: (char, token, ln, pos) => {
        if (token.value == "&" && char == "&")
            return retokenizeToken("comparator", token, "&&", { complete: true })
        if (token.value == "|" && char == "|")
            return retokenizeToken("comparator", token, "||", { complete: true })
        if (token.value == ">" && char == "=")
            return retokenizeToken("comparator", token, ">=", { complete: true })
        if (token.value == "<" && char == "=")
            return retokenizeToken("comparator", token, "<=", { complete: true })
        else if (token.value == ">")
            return retokenizeToken("comparator", token, ">", { complete: true })
        else if (token.value == "<")
            return retokenizeToken("comparator", token, "<", { complete: true })
        throw new Error(`Unexpected token ${token.value + char} on line ${ln}:${pos}`)
    }
})

const operatorLexer = createSubLexer("parseOperator", /[+%]/s, {
    tokenizeFirst: (char, ln, pos) => tokenizeCharacter("operator", char, ln, pos)
})

const equalLexer = createSubLexer("parseEqual", /=/s, {
    tokenizeFirst: (char, ln, pos) => tokenizeIncompleteCharacter("equal", char, ln, pos),
    tokenizeNext: (char, token) => {
        if (char == ">") return retokenizeToken("arrow", token, "=>", { complete: true })
        else if (char == "=") return retokenizeToken("comparator", token, "==", { complete: true })
        else return retokenizeToken("equal", token, "=", { complete: true, unget: true })
    }
})

const breakLexer = createSubLexer("parseBreakSymbol", /[,;]/s, {
    tokenizeFirst: (char, ln, pos) => tokenizeCharacter("break", char, ln, pos)
})

const dotLexer = createSubLexer("parseDotSymbol", /\./s, {
    tokenizeFirst: (char, ln, pos) => tokenizeCharacter("dot", char, ln, pos)
})

const colonLexer = createSubLexer("parseColonSymbol", /:/s, {
    tokenizeFirst: (char, ln, pos) => tokenizeCharacter("colon", char, ln, pos)
})

const questionLexer = createSubLexer("parseQuestionSymbol", /\?/s, {
    tokenizeFirst: (char, ln, pos) => tokenizeCharacter("questionMark", char, ln, pos)
})

const parenLexer = createSubLexer("parseParenSymbol", /[{}()[\]]/s, {
    tokenizeFirst: (char, ln, pos) => {
        if (char == "(" || char == ")") return tokenizeCharacter("paren", char, ln, pos)
        if (char == "{" || char == "}") return tokenizeCharacter("curly_brace", char, ln, pos)
        if (char == "[" || char == "]") return tokenizeCharacter("square_brace", char, ln, pos)
        throw new Error(`Unexpected token ${char} on line ${ln}:${pos}`)
    }
})

const whitespaceLexer = createSubLexer("parseWhitespace", /[ \n]/s, {
    tokenizeFirst: () => null
})

const commentLexer = createSubLexer("parseComment", /\//s, {
    tokenizeFirst: (char, ln, pos) => tokenizeIncompleteCharacter("comment", char, ln, pos),
    tokenizeNext: (char, token) => {
        if (token.value == "//" && char != "\n") return { token, complete: false, unget: false }
        else if (token.value == "//") return { token, complete: true, unget: false }
        else if (token.value == "/" && char == "/")
            return retokenizeToken("comment", token, "//", { complete: false })
        throw new Error(`Unexpected token / on line ${token.lineNumber}:${token.position}`)
    }
})

const identifierLexer = createSubLexer("parseIdentifier", /[a-zA-Z_]/s, {
    tokenizeFirst: (char, ln, pos) => tokenizeIncompleteCharacter("identifier", char, ln, pos),
    tokenizeNext: (char, token, ln, pos) => {
        const alphanum = char.match(/[a-zA-Z_]/s)
        if (!alphanum) {
            if (token.value == "inf")
                return retokenizeToken("number", token, "inf", { complete: true, unget: true })

            return retokenizeToken("identifier", token, token.value, {
                complete: true,
                unget: true
            })
        }
        return retokenizeToken("identifier", token, token.value + char, { complete: false })
    }
})

const stringLexer = createSubLexer("parseString", /`/s, {
    tokenizeFirst: (char, ln, pos) => tokenizeIncompleteCharacter("string", char, ln, pos),
    tokenizeNext: (char, token) =>
        retokenizeToken("string", token, token.value + char, { complete: char == "`" })
})

const numberLexer = createSubLexer("parseNumber", /[0-9.]/s, {
    tokenizeFirst: (char, ln, pos) => tokenizeIncompleteCharacter("number", char, ln, pos),
    tokenizeNext: (char, token) => {
        const numeric = char.match(/[0-9.]/s)
        if (numeric)
            return retokenizeToken("number", token, token.value + char, { complete: false })
        return retokenizeToken("number", token, token.value, { complete: true, unget: true })
    }
})

const markerLexer = createSubLexer("parseMarker", /@/s, {
    tokenizeFirst: (char, ln, pos) => tokenizeIncompleteCharacter("marker", char, ln, pos),
    tokenizeNext: (char, token, ln, pos) => {
        if (char.match(identifierLexer.exp))
            return retokenizeToken("marker", token, token.value + char, { complete: false })
        const match = markers.find(value => value == token.value)
        if (match) return retokenizeToken("marker", token, match, { complete: true })
        throw new Error(`Unexpected marker "${token.value}" found on line ${ln}:${pos}`)
    }
})

const conditionalLexer = createSubLexer("parseConditional", /-/s, {
    tokenizeFirst: (char, ln, pos) => tokenizeIncompleteCharacter("conditional", char, ln, pos),
    tokenizeNext: (char, token, ln, pos) => {
        if (char == ">")
            return retokenizeToken("conditional", token, token.value + char, { complete: true })
        throw new Error(`Unexpected symbol "${char}" after "-" symbol on line ${ln}:${pos}`)
    }
})

export const lexers: SubLexer[] = [
    comparatorLexer,
    operatorLexer,
    equalLexer,
    breakLexer,
    dotLexer,
    colonLexer,
    parenLexer,
    questionLexer,
    whitespaceLexer,
    commentLexer,
    identifierLexer,
    stringLexer,
    numberLexer,
    markerLexer,
    conditionalLexer
]
