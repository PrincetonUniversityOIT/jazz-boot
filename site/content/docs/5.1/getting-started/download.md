---
layout: docs
title: Download
description: Download the Bootstrap implementation of the Jazz Design System to get the compiled CSS and JavaScript, source code, or include it with your favorite package managers like npm.
group: getting-started
toc: true
---

## Compiled CSS and JS

Download ready-to-use compiled code for the Bootstrap implementation of the Jazz Design System to easily drop
into your project, which includes:

- Compiled and minified CSS bundles (see [CSS files comparison]({{< docsref "/getting-started/contents#css-files" >}}))
- Compiled and minified JavaScript plugins (see [JS files comparison]({{< docsref "/getting-started/contents#js-files" >}}))

This doesn't include documentation, source files, or any optional JavaScript dependencies like Popper.

<a href="{{< param "download.dist" >}}" class="btn btn-bd-primary" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download Bootstrap');">Download</a>

## Source files

Compile the Bootstrap implementation of the Jazz Design System with your own asset pipeline by downloading
source Sass, JavaScript, and documentation files. This option requires some additional tooling:

- [Sass compiler]({{< docsref "/getting-started/contribute#sass" >}}) for compiling Sass source files into CSS files
- [Autoprefixer](https://github.com/postcss/autoprefixer) for CSS vendor prefixing

Should you require the full set of [build tools]({{< docsref "/getting-started/contribute#tooling-setup" >}}), they
are included for developing Bootstrap, the Jazz Design System, and its docs, but they are likely unsuitable
for your own purposes.

<a href="{{< param "download.source" >}}" class="btn btn-bd-primary" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Download source</a>

## Examples

If you want to download and examine our [examples]({{< docsref "/examples" >}}), you can grab the already built examples:

<a href="{{< param "download.dist_examples" >}}" class="btn btn-bd-primary" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download Examples');">Download Examples</a>

## Package managers

Pull in **source files** for the Bootstrap implementation of the Design System into nearly any project with
some of the most popular package managers. No matter the package manager,
the Bootstrap implementation of the Design system will
**require a [Sass compiler]({{< docsref "/getting-started/contribute#sass" >}})
and [Autoprefixer](https://github.com/postcss/autoprefixer)** for a setup that matches
the official compiled versions of Bootstrap.

### npm

Install the Jazz Design System in your Node.js powered apps with [the npm package](https://www.npmjs.com/package/bootstrap):

```sh
npm install @princeton-design/jazz-boot
```

`const bootstrap = require('bootstrap')` or `import bootstrap from 'bootstrap'` will load all of Bootstrap's plugins onto a `bootstrap` object.
The `bootstrap` module itself exports all of our plugins. You can manually load Bootstrap's plugins individually by loading the `/js/dist/*.js` files under the package's top-level directory.

Bootstrap's `package.json` contains some additional metadata under the following keys:

- `sass` - path to Bootstrap's main [Sass](https://sass-lang.com/) source file
- `style` - path to Bootstrap's non-minified CSS that's been precompiled using the default settings (no customization)

### yarn

Install the Bootstrap implementation of the Jazz Design System in your Node.js
powered apps with [the yarn package](https://yarnpkg.com/en/package/bootstrap):

```sh
yarn add @princeton-design/jazz-boot
```
