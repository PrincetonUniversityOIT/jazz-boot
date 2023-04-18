---
layout: docs
title: Icons
description: Jazz Recommendations for Using External Icon Libraries
group: jazz-components
aliases:
  - "/jazz-components/"
  - "/docs/5.1/jazz-components/"
toc: true
---

## Best Practices

<ul>
    <li>Use icons to enhance pieces of your design, not to replace pieces of your design. Icons are most useful as part of another component (Button, Link,Tab, Menu, etc…), and should be paired with text wherever possible.</li>
    <li>Use icons that have a well-established meaning. If a legend or training is necessary to explain the meaning of icons, then the icons should be made more clear or excluded from the design altogether.</li>
    <li>Use icons consistently. Icons should have a single meaning within the context that they are being used. Icons should have a consistent meaning across all University sites.</li>
    <li>Avoid attempting to represent abstract concepts with icons.</li>
    <li>Keep icons simple. A limited space is available to convey meaning.</li>
    <li>Consider assistive devices. If the icon is next to equivalent text, mark it as decorative. If it is not, provide a visually hidden text alternative.</li>
</ul>

## Recommended Icon Sets

While most icon sets include multiple file formats, we prefer SVG implementations for their improved accessibility and vector support.

Here are some icon sets that we recommend you use:
{{< markdown >}}
{{< jazz-icons.inline >}}
{{- $type := .Get "type" | default "preferred" -}}

{{- range (index .Site.Data.jazzicons $type) }}
- [{{ .name }}]({{ .website }})
  {{- end }}
  {{< /jazz-icons.inline >}}
  {{< /markdown >}}

## Using Icon Fonts

Some icon sets include classes for every icon, you can reference the class names in your HTML.

{{< example >}}
<i class="bi-balloon-heart"></i>
{{< /example >}}

You can use `font-size` and `color` to change the appearance of the icon.

{{< example >}}
<i class="bi-balloon-heart" style="font-size: 2rem; color: purple;"></i>
{{< /example >}}

## Using External Images

Copy the SVGs to a directory and reference them like normal images with the `<img>` tag. For images you can size the icon by changing
the `width` and `height`.
{{< example >}}
<img src="/docs/{{< param docs_version >}}/assets/brand/bootstrap-logo.svg" alt="Bootstrap" width="32" height="32">
{{< /example >}}

## Using CSS
You can also use the SVG within your CSS (be sure to escape any characters, such as # to %23 when specifying hex color values). When no dimensions are specified via width and height on the `<svg>`, the icon will fill the available space.

The viewBox attribute is required if you wish to resize icons with background-size. Note that the xmlns attribute is required.

{{< example show_preview=false >}}
.bi::before {
display: inline-block;
content: "";
vertical-align: -.125em;
background-image: url("data:image/svg+xml,<svg viewBox='0 0 16 16' fill='%23333' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z' clip-rule='evenodd'/></svg>");
background-repeat: no-repeat;
background-size: 1rem 1rem;
}
{{< /example >}}

You can use the following jazz-icon CSS classes as well for your convenience.

<table class="table">
  <thead>
    <tr>
      <td>Class</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>jazz-icon</td>
      <td>Icon will take the size of its surrounding text</td>
    </tr>
    <tr>
      <td>jazz-icon-2x</td>
      <td>Icon height and width of 2em</td>
    </tr>
    <tr>
      <td>jazz-icon-3x</td>
      <td>Icon height and width of 3em</td>
    </tr>
    <tr>
      <td>jazz-icon-5x</td>
      <td>Icon height and width of 5em</td>
    </tr>
    <tr>
      <td>jazz-icon-7x</td>
      <td>Icon height and width of 7em</td>
    </tr>
    <tr>
      <td>jazz-icon-9x</td>
      <td>Icon height and width of 9em</td>
    </tr>
  </tbody>
</table>

You can extend this to use other SVGs by adding your own icon classes as shown in the example below.

{{< example >}}
<style>
.jazz-icon-facebook {
  -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyBpZD0iUmF3IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij4NCiAgPHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9Im5vbmUiLz4NCiAgPGNpcmNsZSBjeD0iMTI4IiBjeT0iMTI4IiByPSI5NiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMTYiLz4NCiAgPHBhdGggZD0iTTE2OCw4OC4wMDA5NEgxNTJhMjQsMjQsMCwwLDAtMjQsMjR2MTEyIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxNiIvPg0KICA8bGluZSB4MT0iOTYiIHkxPSIxNDQuMDAwOTQiIHgyPSIxNjAiIHkyPSIxNDQuMDAwOTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjE2Ii8+DQo8L3N2Zz4NCg==);
  mask-image: url(data:image/svg+xml;base64,PHN2ZyBpZD0iUmF3IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij4NCiAgPHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9Im5vbmUiLz4NCiAgPGNpcmNsZSBjeD0iMTI4IiBjeT0iMTI4IiByPSI5NiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMTYiLz4NCiAgPHBhdGggZD0iTTE2OCw4OC4wMDA5NEgxNTJhMjQsMjQsMCwwLDAtMjQsMjR2MTEyIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxNiIvPg0KICA8bGluZSB4MT0iOTYiIHkxPSIxNDQuMDAwOTQiIHgyPSIxNjAiIHkyPSIxNDQuMDAwOTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjE2Ii8+DQo8L3N2Zz4NCg==);
}
</style>
<i class="jazz-icon jazz-icon-3x jazz-icon-facebook"></i>
{{< /example >}}

## Changing SVG Colors

You can typically override the color property in your CSS to change the color of the icon

{{< example >}}
<i class="bi-arrow-down-circle" style="font-size: 2rem; color: orange;"></i>
{{< /example >}}

Some of the font libaries have filled in versions

{{< example >}}
<i class="bi-arrow-down-circle-fill" style="font-size: 2rem; color: orange;"></i>
{{< /example >}}

## Accessibility

For purely decorative icons, add `aria-hidden="true"`. Otherwise, provide an appropriate text alternative.
{{< example >}}
<img src="/docs/5.1/assets/brand/bootstrap-logo.svg" alt="Bootstrap" width="32" height="32">
{{< /example >}}

{{< example >}}
<img src="/docs/5.1/assets/brand/bootstrap-logo.svg" aria-hidden="true" width="32" height="32">
{{< /example >}}

## Known Issues with SVGs

<ul>
  <li>SVGs receive focus by default in Internet Explorer and Edge Legacy. When embedding your SVGs, add <code>focusable="false"</code> to the <code>&lt;svg&gt;</code> element.</li>
  <li>When using SVGs with <code>&lt;img&gt;</code> elements, screen readers may not announce them as images, or skip the image completely. Include an additional <code>role="img"</code> on the <code>&lt;img&gt;</code> element to avoid any issues.</li>
</ul>
