<p align="center">
    <img width="20%" src="https://raw.githubusercontent.com/stefanwittwer/FigType/main/static/figtype-logo.svg" alt="FigType Icon" />
    <h1 align="center">FigType</h1>
</p>
<p align="center">
    The easiest way to model anything in Figma.
</p>

<p align="center">
  <a href="https://github.com/stefanwittwer/FigType/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/stefanwittwer/FigType" alt="License" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-%23007ACC.svg?logo=typescript&logoColor=white" alt="TypeScript" />
</p>

## What is FigType?

🪄 FigType is a widget that makes modeling simple types and entities in Figma and FigJam made easy.

Works great for planning out:

- Interface types, database models, classes, etc. in development;
- Properties for design system components;
- Fields in a marketing website CMS

## Screenshot

![Screenshot of FigType widget](https://raw.githubusercontent.com/stefanwittwer/FigType/main/static/screenshot.png)

## Build scripts

This codebase was initially created through Figma's "New widget..." menu in the desktop app.
However, some modifications to the build scripts and `tsconfig.json` have been made:

- There is an additional `postbuild` step that is automatically executed when compiling the TypeScript source, which automatically appends the line `widget.register(Widget);` to the very end of the compiled JavaScript. This is a workaround for an issue where this line of code would be executed to early when the Widget code is split up into multiple files, resulting in "Lexical variable is not initialised" crashes at runtime.
- `tsconfig.json` has been modified to bundle all .ts and .tsx source files into a single, combined `code.js`. This codebase does not use modules because Figma widgets don't seem to support `import` and `export`.

## License and copyright

FigType's source code is available under the MIT license. [Read the full license terms here.](https://github.com/stefanwittwer/FigType/blob/main/LICENSE.md)
