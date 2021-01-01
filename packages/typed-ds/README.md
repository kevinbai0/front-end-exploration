# Typed DS

Not trying to recreate `theme-ui`.

## Ideas

Maybe this project turns serves as a core-transpiler to CSS and other style specs for higher level style-languages and systems that rely on a strong typing.

Trying to explore

- CSS is probably too powerful 99% of the time. That means we should simplify the way we our UI for 99% of use cases. For example, design systems do this for "atoms" but could possibly simplify more complex stuff such as layout, handling selectors, and modifiers.
- Everything right now is loosely typed and checks are done on run-time. Clear tooling & developer experience improvements can be made with compile time checks
- Composing and augmenting themes are commonly done, but, it's not possible (that I know of) to maintain good type-checking if overrides are relied on global type merging. Type definitions should be modular and scoped.
- Can coming up with a more modular way to define UIs help solve no-code tools that have trouble managing complexity.
- Automatically aggregating front-end components in a project and being able to see visually see/modify variants and other properties

## Current usage

Example found in [typed-ds-samples](../typed-ds-samples/src/test1.ts)