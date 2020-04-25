import { createParser, markers, Parser, primitiveTypes } from "./tokenizer_definitions"
import { tokenizeIncompleteCharacter, retokenizeToken, tokenizeCharacter } from "./tokenize_methods"

const comparatorParser = createParser("parseComparator", /[<>&|]/s, {
    parseFirst: (char, ln, pos) => tokenizeIncompleteCharacter("comparator", char, ln, pos),
    parseNext: (char, token, ln, pos) => {
        if (token.value == "&" && char == "&") return retokenizeToken("comparator", token, "&&", { complete: true })
        if (token.value == "|" && char == "|") return retokenizeToken("comparator", token, "||", { complete: true })
        if (token.value == ">" && char == "=") return retokenizeToken("comparator", token, ">=", { complete: true })
        if (token.value == "<" && char == "=") return retokenizeToken("comparator", token, "<=", { complete: true })
        else if (token.value == ">") return retokenizeToken("comparator", token, ">", { complete: true })
        else if (token.value == "<") return retokenizeToken("comparator", token, "<", { complete: true })
        throw new Error(`Unexpected token ${token.value + char} on line ${ln}:${pos}`)
    }
})

const equalParser = createParser("parseEqual", /=/s, {
    parseFirst: (char, ln, pos) => tokenizeIncompleteCharacter("equal", char, ln, pos),
    parseNext: (char, token, ln, pos) => {
        if (char == ">") return retokenizeToken("arrow", token, "=>", { complete: true })
        else if (char == "=") return retokenizeToken("comparator", token, "==", { complete: true })
        else return retokenizeToken("equal", token, "=", { complete: true, unget: true })
    }
})

const breakParser = createParser("parseBreakSymbol", /[,;]/s, {
    parseFirst: (char, ln, pos) => tokenizeCharacter("break", char, ln, pos)
})

const dotParser = createParser("parseDotSymbol", /\./s, {
    parseFirst: (char, ln, pos) => tokenizeCharacter("dot", char, ln, pos)
})

const colonParser = createParser("parseColonSymbol", /:/s, {
    parseFirst: (char, ln, pos) => tokenizeCharacter("colon", char, ln, pos)
})

const questionParser = createParser("parseQuestionSymbol", /\?/s, {
    parseFirst: (char, ln, pos) => tokenizeCharacter("questionMark", char, ln, pos)
})

const parenParser = createParser("parseParenSymbol", /[{}()[\]]/s, {
    parseFirst: (char, ln, pos) => {
        if (char == "(" || char == ")") return tokenizeCharacter("paren", char, ln, pos)
        if (char == "{" || char == "}") return tokenizeCharacter("curly_brace", char, ln, pos)
        if (char == "[" || char == "]") return tokenizeCharacter("square_brace", char, ln, pos)
        throw new Error(`Unexpected token ${char} on line ${ln}:${pos}`)
    }
})

const whitespaceParser = createParser("parseWhitespace", /[ \n]/s, {
    parseFirst: () => null
})

const commentParser = createParser("parseComment", /\//s, {
    parseFirst: (char, ln, pos) => tokenizeIncompleteCharacter("comment", char, ln, pos),
    parseNext: (char, token) => {
        if (token.value == "//" && char != "\n") return { token, complete: false, unget: false }
        else if (token.value == "//") return { token, complete: true, unget: false }
        else if (token.value == "/" && char == "/") return retokenizeToken("comment", token, "//", { complete: true })
        throw new Error(`Unexpected token / on line ${token.lineNumber}:${token.position}`)
    }
})

const identifierParser = createParser("parseIdentifier", /[a-zA-Z_]/s, {
    parseFirst: (char, ln, pos) => tokenizeIncompleteCharacter("identifier", char, ln, pos),
    parseNext: (char, token, ln, pos) => {
        const alphanum = char.match(/[a-zA-Z_]/s)
        if (!alphanum) {
            const primitive = primitiveTypes.find(type => type == token.value)
            if (primitive) return retokenizeToken("primitive_type", token, primitive, { complete: true, unget: true })
            return retokenizeToken("primitive_type", token, token.value, { complete: true, unget: true })
        }
        return retokenizeToken("identifier", token, token.value + char, { complete: false })
    }
})

const stringParser = createParser("parseString", /`/s, {
    parseFirst: (char, ln, pos) => tokenizeIncompleteCharacter("string", char, ln, pos),
    parseNext: (char, token) => retokenizeToken("string", token, token.value + char, { complete: char == "`" })
})

const numberParser = createParser("parseNumber", /[0-9.]/s, {
    parseFirst: (char, ln, pos) => tokenizeIncompleteCharacter("number", char, ln, pos),
    parseNext: (char, token, ln, pos) => {
        const numeric = char.match(/[0-9.]/s)
        if (numeric) return retokenizeToken("number", token, token.value + char, { complete: false })
        return retokenizeToken("number", token, token.value, { complete: true, unget: true })
    }
})

const markerParser = createParser("parseMarker", /@/s, {
    parseFirst: (char, ln, pos) => tokenizeIncompleteCharacter("marker", char, ln, pos),
    parseNext: (char, token, ln, pos) => {
        if (char.match(identifierParser.exp)) return retokenizeToken("marker", token, token.value + char, { complete: false })
        const match = markers.find(value => value == token.value)
        if (match) return retokenizeToken("marker", token, match, { complete: true })
        throw new Error(`Unexpected marker "${token.value}" found on line ${ln}:${pos}`)
    }
})

export const parsers: Parser[] = [
    comparatorParser,
    equalParser,
    breakParser,
    dotParser,
    colonParser,
    parenParser,
    questionParser,
    whitespaceParser,
    commentParser,
    identifierParser,
    stringParser,
    numberParser,
    markerParser
]
