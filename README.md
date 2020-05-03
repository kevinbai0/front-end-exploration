# Design UI

A monorepo for an exploration of design-systems, a design language, and a design tool.

The project structure looks like:

```none
├── packages
    ├── design-system
    ├── design-ui
    ├── style-x
```

1. `design-system` contains a repo of a current design system setup that I use.
2. `style-x` is a language I'm working on that takes advantage of the current concepts inside of `design-system`.
3. `design-ui` is a design tool and its goal is to create a Figma-like tool that can generate purely front-end code for UIs.
