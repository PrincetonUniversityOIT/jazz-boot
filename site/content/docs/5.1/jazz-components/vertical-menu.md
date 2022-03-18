---
layout: docs
title: Vertical Menu
description: A vertical navigation menu built on top of Bootstrap's vertical navigation.
group: jazz-components
aliases: "/docs/5.1/jazz-components/vertical-menu/"
toc: true
---

## Jazzy Vertical Menu

Stack your navigation by changing the flex item direction with the `.flex-column` utility. Need to stack them on some viewports but not others? Use the responsive versions (e.g., `.flex-sm-column`).

{{< example >}}
<ul class="nav flex-column jazz-menu-vertical">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="#">Active</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link disabled">Disabled</a>
  </li>
</ul>
{{< /example >}}

As always, vertical navigation is possible without `<ul>`s, too.

{{< example >}}
<nav class="nav flex-column jazz-menu-vertical">
  <a class="nav-link active" aria-current="page" href="#">Active</a>
  <a class="nav-link" href="#">Link</a>
  <a class="nav-link" href="#">Link</a>
  <a class="nav-link disabled">Disabled</a>
</nav>
{{< /example >}}

## Jazzy Vertical Menu Headings

Stack your navigation by changing the flex item direction with the `.flex-column` utility. Need to stack them on some viewports but not others? Use the responsive versions (e.g., `.flex-sm-column`).

{{< example >}}
<nav role="navigation">
  <h2 class="jazz-menu-vertical-label fs-7 text-uppercase">Menu Group Label</h2>
  <ul class="nav flex-column jazz-menu-vertical">
    <li class="nav-item">
      <a class="nav-link active" aria-current="page" href="#">Active</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Link</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Link</a>
    </li>
    <li class="nav-item">
      <a class="nav-link disabled">Disabled</a>
    </li>
  </ul>
</nav>
{{< /example >}}

## Dark Background

Stack your navigation by changing the flex item direction with the `.flex-column` utility. Need to stack them on some viewports but not others? Use the responsive versions (e.g., `.flex-sm-column`).

{{< example >}}
<nav role="navigation" class="bg-dark text-light">
  <ul class="nav flex-column jazz-menu-vertical">
    <li class="nav-item">
      <a class="nav-link active text-light" aria-current="page" href="#">Active</a>
    </li>
    <li class="nav-item">
      <a class="nav-link text-light" href="#">Link</a>
    </li>
    <li class="nav-item">
      <a class="nav-link text-light" href="#">Link</a>
    </li>
    <li class="nav-item">
      <a class="nav-link disabled">Disabled</a>
    </li>
  </ul>
</nav>
{{< /example >}}

## Regarding accessibility

If you're using navs to provide a navigation bar, be sure to add a `role="navigation"` to the most logical parent container of the `<ul>`, or wrap a `<nav>` element around the whole navigation. Do not add the role to the `<ul>` itself, as this would prevent it from being announced as an actual list by assistive technologies.

Note that navigation bars, even if visually styled as tabs with the `.nav-tabs` class, should **not** be given `role="tablist"`, `role="tab"` or `role="tabpanel"` attributes. These are only appropriate for dynamic tabbed interfaces, as described in the [<abbr title="Web Accessibility Initiative">WAI</abbr> <abbr title="Accessible Rich Internet Applications">ARIA</abbr> Authoring Practices](https://www.w3.org/TR/wai-aria-practices/#tabpanel). See [JavaScript behavior](#javascript-behavior) for dynamic tabbed interfaces in this section for an example. The `aria-current` attribute is not necessary on dynamic tabbed interfaces since our JavaScript handles the selected state by adding `aria-selected="true"` on the active tab.
