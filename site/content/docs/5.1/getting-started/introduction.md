---
layout: docs
title: Introduction
description: Get started with the Bootstrap implementation of Princeton University's Jazz Design System.
group: getting-started
aliases:
  - "/docs/5.1/getting-started/"
  - "/docs/getting-started/"
  - "/getting-started/"
toc: true
---

## Jazz Design System &amp; Bootstrap

The Jazz Design System is Princeton University's Design System.

Because of its popularity and breadth/depth of functionality, Bootstrap has been used as a basis to implement a
reference implementation of the Jazz Design System.

## Approach

The Bootstrap implementation of the Jazz Design System is a "fork" of the Bootstrap project
(version 5.1.3, specifically).  Bootstrap covers most of the usual CSS layout, CSS utility,
and components necessary to create a web page or web application.  The Jazz Design System visual
designs have been applied to Bootstrap, and in some cases modify Bootstrap, to deliver the
distinctive look and feel of Princeton University's digital designs.

Developers utilize the Bootstrap implementation of the Jazz Design System **in place of** a standard
Bootstrap installation, and can use most of the Bootstrap capabilities that they already know and love.
In most cases, the Jazz Design System can serve as a drop in replacement of Bootstrap in systems
created with Bootstrap 5.

## This Documentation

This documentation is largely copied (in many cases without modification) from the Bootstrap project
to help document the deep capabilities of Bootstrap.  The original Bootstrap documentation has been
supplemented and/or modified to document capabilities that are specific to the Jazz Design System.

## Quick start

Using a package manager or need to download the source files? [Head to the downloads page]({{< docsref "/getting-started/download" >}}).

### CSS

Copy-paste the stylesheet `<link>` into your `<head>` before all other stylesheets to load our CSS.

```html
<link href="{{< param "cdn.css" >}}" rel="stylesheet">
```

### JS

Many Jazz Design System (and hence Bootstrap) components require the use of JavaScript to function.  If you are
utilizing a Javascript framework, then you can see the section about Frameworks below for possible
third-party projects that might work for your situation.

If you are not utilizing a specific Javascript framework, then you would utilize the Javascript files
provided by this library as described below.  They require the Bootstrap JavaScript
plugins and [Popper](https://popper.js.org/). Place **one of the following `<script>`s** near the end of your pages, right before the closing `</body>` tag, to enable them.

#### Bundle

Include every Bootstrap JavaScript plugin and dependency with one of our two bundles. Both `bootstrap.bundle.js` and `bootstrap.bundle.min.js` include [Popper](https://popper.js.org/) for our tooltips and popovers. For more information about what's included in Bootstrap, please see our [contents]({{< docsref "/getting-started/contents#precompiled-bootstrap" >}}) section.

```html
<script src="{{< param "cdn.js_bundle" >}}"></script>
```

#### Separate

If you decide to go with the separate scripts solution, Popper must come first (if you're using tooltips or popovers), and then our JavaScript plugins.

```html
<script src="{{< param "cdn.popper" >}}" integrity="{{< param "cdn.popper_hash" >}}" crossorigin="anonymous"></script>
<script src="{{< param "cdn.js" >}}" integrity="{{< param "cdn.js_hash" >}}" crossorigin="anonymous"></script>
```

#### Modules

If you use `<script type="module">`, please refer to our [using Bootstrap as a module]({{< docsref "/getting-started/javascript#using-bootstrap-as-a-module" >}}) section.

#### Frameworks

The libraries described below are not necessarily endorsed as part of the Jazz Design System initiative, but are likely
viable options for projects that use these specific frameworks:

* **Angular** - the [ng-bootstrap](https://github.com/ng-bootstrap/ng-bootstrap) project provides an Angular
  implementation of the Bootstrap library that supports Bootstrap 5.x, on which this Jazz Design System
  implementation is based.
* **Vue.js** - The [bootstrap-vue](https://coreui.io/bootstrap-vue/) supports Bootstrap 5.x for Vue applications.
* **React.js** - The [react-bootstrap](https://react-bootstrap.github.io/) project supports Bootstrap 5.x for React applications.

#### Components

Curious which components explicitly require our JavaScript and Popper? Click the show components link below. If you're at all unsure about the general page structure, keep reading for an example page template.

<details>
<summary class="text-primary mb-3">Show components requiring JavaScript</summary>
{{< markdown >}}
- Alerts for dismissing
- Buttons for toggling states and checkbox/radio functionality
- Carousel for all slide behaviors, controls, and indicators
- Collapse for toggling visibility of content
- Dropdowns for displaying and positioning (also requires [Popper](https://popper.js.org/))
- Modals for displaying, positioning, and scroll behavior
- Navbar for extending our Collapse plugin to implement responsive behavior
- Offcanvases for displaying, positioning, and scroll behavior
- Toasts for displaying and dismissing
- Tooltips and popovers for displaying and positioning (also requires [Popper](https://popper.js.org/))
- Scrollspy for scroll behavior and navigation updates
{{< /markdown >}}
</details>

## Starter template

Be sure to have your pages set up with the latest design and development standards. That means using an HTML5 doctype and including a viewport meta tag for proper responsive behaviors. Put it all together and your pages should look like this:

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="{{< param "cdn.css" >}}" rel="stylesheet">

    <title>Hello, world!</title>
  </head>
  <body>
    <h1>Hello, world!</h1>

    <!-- Optional JavaScript; choose one of the two! -->

    <!-- Option 1: Bootstrap Bundle with Popper -->
    <script src="{{< param "cdn.js_bundle" >}}" integrity="{{< param "cdn.js_bundle_hash" >}}" crossorigin="anonymous"></script>

    <!-- Option 2: Separate Popper and Bootstrap JS -->
    <!--
    <script src="{{< param "cdn.popper" >}}" integrity="{{< param "cdn.popper_hash" >}}" crossorigin="anonymous"></script>
    <script src="{{< param "cdn.js" >}}" integrity="{{< param "cdn.js_hash" >}}" crossorigin="anonymous"></script>
    -->
  </body>
</html>
```

For next steps, visit the [Layout docs]({{< docsref "/layout/grid" >}}) or [our official examples]({{< docsref "/examples" >}}) to start laying out your site's content and components.

## Important globals

Bootstrap employs a handful of important global styles and settings that you'll need to be aware of when using it, all of which are almost exclusively geared towards the *normalization* of cross browser styles. Let's dive in.

### HTML5 doctype

Bootstrap requires the use of the HTML5 doctype. Without it, you'll see some funky incomplete styling, but including it shouldn't cause any considerable hiccups.

```html
<!doctype html>
<html lang="en">
  ...
</html>
```

### Responsive meta tag

Bootstrap is developed *mobile first*, a strategy in which we optimize code for mobile devices first and then scale up components as necessary using CSS media queries. To ensure proper rendering and touch zooming for all devices, **add the responsive viewport meta tag** to your `<head>`.

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

You can see an example of this in action in the [starter template](#starter-template).

### Box-sizing

For more straightforward sizing in CSS, we switch the global `box-sizing` value from `content-box` to `border-box`. This ensures `padding` does not affect the final computed width of an element, but it can cause problems with some third-party software like Google Maps and Google Custom Search Engine.

On the rare occasion you need to override it, use something like the following:

```css
.selector-for-some-widget {
  box-sizing: content-box;
}
```

With the above snippet, nested elements—including generated content via `::before` and `::after`—will all inherit the specified `box-sizing` for that `.selector-for-some-widget`.

Learn more about [box model and sizing at CSS Tricks](https://css-tricks.com/box-sizing/).

### Reboot

For improved cross-browser rendering, we use [Reboot]({{< docsref "/content/reboot" >}}) to correct inconsistencies across browsers and devices while providing slightly more opinionated resets to common HTML elements.
