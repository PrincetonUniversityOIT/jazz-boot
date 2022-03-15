---
layout: docs
title: Pagination - Jazz
description: Documentation and examples for showing pagination to indicate a series of related content exists across multiple pages.
group: jazz-components
toc: true
---

## Overview

This section demonstrates the recommended structure and design for pagination.

This particular design includes a couple of specific design elements that are worth noting:

* Icons - Any suitable icon could be used.  The example below utilizes Bootstrap Icons
  (specifically, arrow-left-short, arrow-right-short) that have been embedded to avoid
  the need to describe how to support external icon library dependencies.
* Overflow - In the case where there are many pages, the design uses ellipsis (...) to conserve space.  The application
  or website would need to handle the logic necessary to have the numbers shift as the user pages through the data.

{{< example >}}
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
<symbol id="arrow-left-short" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
</symbol>
<symbol id="arrow-right-short" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
</symbol>
</svg>
<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item"><a class="page-link" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#arrow-left-short"/></svg>Previous</a></li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item">...</li>
    <li class="page-item"><a class="page-link" href="#">8</a></li>
    <li class="page-item"><a class="page-link" href="#">9</a></li>
    <li class="page-item"><a class="page-link" href="#">10</a></li>
    <li class="page-item"><a class="page-link" href="#">11</a></li>
    <li class="page-item"><a class="page-link" href="#">12</a></li>
    <li class="page-item">...</li>
    <li class="page-item"><a class="page-link" href="#">20</a></li>
    <li class="page-item"><a class="page-link" href="#">Next<svg class="bi" width="24" height="24"><use xlink:href="#arrow-right-short"/></svg></a></li>
  </ul>
</nav>
{{< /example >}}

## SVG Icons

Icons can help to draw additional attention to the Previous &amp; Next options.

The example below demonstrates the use of inline SVG icons.  Any SVG image could be used, but these icons were taken
from the Bootstrap Icons library.

{{< example >}}
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
<symbol id="arrow-left-short" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
</symbol>
<symbol id="arrow-right-short" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
</symbol>
</svg>
<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item"><a class="page-link" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#arrow-left-short"/></svg>Previous</a></li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">Next<svg class="bi" width="24" height="24"><use xlink:href="#arrow-right-short"/></svg></a></li>
  </ul>
</nav>
{{< /example >}}

## Other Icons

Looking to use an icon or symbol in place of text for some pagination links? Be sure to provide proper screen reader support with `aria` attributes.

{{< example >}}
<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>
{{< /example >}}

## Disabled and active states

Pagination links are customizable for different circumstances. Use `.disabled` for links that appear un-clickable and `.active` to indicate the current page.

While the `.disabled` class uses `pointer-events: none` to _try_ to disable the link functionality of `<a>`s, that CSS property is not yet standardized and doesn't account for keyboard navigation. As such, you should always add `tabindex="-1"` on disabled links and use custom JavaScript to fully disable their functionality.

{{< example >}}
<nav aria-label="...">
  <ul class="pagination">
    <li class="page-item disabled">
      <a class="page-link">Previous</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active" aria-current="page">
      <a class="page-link" href="#">2</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
{{< /example >}}

You can optionally swap out active or disabled anchors for `<span>`, or omit the anchor in the case of the prev/next arrows, to remove click functionality and prevent keyboard focus while retaining intended styles.

{{< example >}}
<nav aria-label="...">
  <ul class="pagination">
    <li class="page-item disabled">
      <span class="page-link">Previous</span>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active" aria-current="page">
      <span class="page-link">2</span>
    </li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
{{< /example >}}

## Sizing

Fancy larger or smaller pagination? Add `.pagination-lg` or `.pagination-sm` for additional sizes.

{{< example >}}
<nav aria-label="...">
  <ul class="pagination pagination-lg">
    <li class="page-item active" aria-current="page">
      <span class="page-link">1</span>
    </li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
  </ul>
</nav>
{{< /example >}}

{{< example >}}
<nav aria-label="...">
  <ul class="pagination pagination-sm">
    <li class="page-item active" aria-current="page">
      <span class="page-link">1</span>
    </li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
  </ul>
</nav>
{{< /example >}}

## Alignment

Change the alignment of pagination components with [flexbox utilities]({{< docsref "/utilities/flex" >}}).

{{< example >}}
<nav aria-label="Page navigation example">
  <ul class="pagination justify-content-center">
    <li class="page-item disabled">
      <a class="page-link">Previous</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
{{< /example >}}

{{< example >}}
<nav aria-label="Page navigation example">
  <ul class="pagination justify-content-end">
    <li class="page-item disabled">
      <a class="page-link">Previous</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
{{< /example >}}

## &quot;Go To&quot;

Use the "Go To" pattern below to provide the ability to jump to a specific page.

This is useful in situations where there are so many pages that the ellipsis ("...") are used to fit the available
space.  The default value for the input field should match the current page as demonstrated in this example.

{{< example >}}
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
<symbol id="arrow-right-short" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
</symbol>
</svg>
<nav aria-label="Page navigation example">
  <div class="row d-flex align-items-center">
    <div class="col-auto">
      <ul class="pagination">
        <li class="page-item disabled">
          <a class="page-link">Previous</a>
        </li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item active"><a class="page-link" href="#">3</a></li>
        <li class="page-item">
          <a class="page-link" href="#">Next</a>
        </li>
      </ul>
    </div>
    <div class="col-2">
      <div class="input-group input-group-sm">
        <input type="text" class="form-control border-dark" value="3" aria-label="Go To Page Number">
        <button class="btn btn-outline-dark" type="button"><svg class="bi" width="24" height="24" style="fill: currentColor;"><use xlink:href="#arrow-right-short"/></svg></button>
      </div>
    </div>
  </div>
</nav>
{{< /example >}}


## Dark Background

Because the Jazz Pagination link design does not have the links contained within a border, Pagination requires
the inclusion of an additional class (`.pagination-bg-dark`) to indicate that the Pagination is being used on a dark background.  This allows
the styles to react to the dark background.

In cases where a library is wrapping Bootstrap, it may not be possible to change the element that is marked with
`.pagination`.  In those cases, `.pagination-bg-dark` can be specified on a parent element.

{{< example >}}
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
<symbol id="arrow-right-short" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
</symbol>
</svg>
<div class=" bg-dark">
<nav aria-label="...">
  <div class="row d-flex align-items-center">
    <div class="col-auto">
      <ul class="pagination pagination-bg-dark">
        <li class="page-item disabled">
          <span class="page-link">Previous</span>
        </li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item active" aria-current="page">
          <span class="page-link">2</span>
        </li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item">
          <a class="page-link" href="#">Next</a>
        </li>
      </ul>
    </div>
    <div class="col-2">
      <div class="input-group input-group-sm">
        <input type="text" class="form-control border-light bg-dark text-light" value="3" aria-label="Go To Page Number">
        <button class="btn btn-outline-light" type="button"><svg class="bi" width="24" height="24" style="fill: currentColor;"><use xlink:href="#arrow-right-short"/></svg></button>
      </div>
    </div>
  </div>
</nav>
</div>
{{< /example >}}
