# Design UI

A monorepo for exploring projects everything related to front-end.

## Projects

Each "project" is essentially a different folder under `packages`. Some projects are related related, but all projects are organized horizontally in `packages/` rather than nested trees.

### Primary Active projects

#### [typed-ds](packages/typed-ds/README.md)

Exploring a way to create a framework agnostic type-based design system. Goal is to integrate with selectors such as `hover` and `focus`, media query breakpoints, theme, and variants concisely for rapid development.

### Sub-projects

#### [typed-ds-samples](./packages/typed-ds-samples/README.md)

Samples and exploring usage with [typed-ds](#typed-ds) project

### Archived Projects

#### [design-system](./packages/design-system/README.md) 

A design system iterated over many projects - inspired by Styled System. Essentially wrote my own version of it to better handle types for design systems.

#### [style-ui](./packages/style-x/README.md)

A design language I began working on. Wrote a lexer/parser and began writing a simple parser. Objective was to transpile a powerful layout/style spec to functional React components (so logic is handled in Javascript, but layout/style was generated from the language).

#### [design-ui](./packages/design-ui/README.md)

Explored creating a figma-like design tool - created a zooming/panning features (tested on Mac trackpad) and ability to add/translate/delete rectangles.
