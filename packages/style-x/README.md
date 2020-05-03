# Style X

The goal of Style X is to be a language and framework agnostic tool for creating and maintaining declarative user interfaces. It's not meant to be a turing complete language. Instead, it's meant to provide a set of rules that sit on top of layout engines to make responsive layout easier. Additionally, it does not handle any logic itself since it offloads the task to the language it's run on top of.

## Concepts

1. Component-based view layer. It shouldn't be used for any other purpose.
2. Declarative layouts (non-conflicting) with powerful semantic analysis so that the interpreter can understand the layout
3. Immutability: whatever data is passed in can only be rendered one way - this layer itself can't create side effects directly
4. No function declarations: function declarations imply logic and we don't want messy logic inside of our view code.

## Informal Grammar

Expression:

```stylex
expression = let <identifier> = value
conditional_expression = =>tuple = value
```

Values:

```stylex
value = number | string | boolean | object | array | tuple | function | range
number = floating point | integer | inf
string = `<string_value>`
boolean = true | false
array = value[]
object = [key: string]: value
tuple = (key: value, key2: value, ...)
function = identifier(object)(object)...
range = [a to b]
```

Object property access:

```stylex
identifier.property.property
```

## React & Typescript

Currently Style X will only be supported in React with Typescript.

### Transpiling

Transpiles `<name>.styleX` files into `<name>.styleX.ts` files which are stateless React components with props

### Importing modules

```stylex
import <ModuleName> from `<location>`
```

If no \<location> is set, then it looks for a styleX module in the directory with the same filename as the import.

In imports, can specifiy a path to a typescript file that has a default export as a stylex function. A stylex function is connected to the rest of the application logic, renders a Style X component, and provides props to the stylex component

## Layout concepts

Can be found in [design-system doc](../design-system/README.md).

## Standard Library

A component is called as a function inside of style-x components:

The following standard components:

```stylex
Box, Text, Image
```

`Box()` will render a `Box` component. We can think of these are pure functions, but can pass function parameters in as curried form. Additionally, we can specify function parameter names to pass them in arbitrary order.

Ex: `Box(layout = row, size = (800, 300))` is equivalent to `Box(layout = row)(size = (800, 300))`
