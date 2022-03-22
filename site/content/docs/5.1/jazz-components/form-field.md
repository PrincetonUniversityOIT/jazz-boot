---
layout: docs
title: Form Field
description: A robust pattern that provides a supporting structure for an individual form field.
group: jazz-components
toc: true
---

## Simple Form Field

{{< example >}}
<div class="d-flex flex-column gap-2">
  <label for="exampleFormControlInput1" class="form-label mb-0 fw-bold">Email address</label>
  <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
</div>
{{< /example >}}

## Assistive Text

{{< example >}}
<div class="d-flex flex-column gap-2">
  <label for="exampleFormControlInput2" class="form-label mb-0 fw-bold">Email address</label>
  <span class="fs-7">Assistive Text Goes Here.  This ensures proper reading order for the user.</span>
  <input type="email" class="form-control" id="exampleFormControlInput2" placeholder="name@example.com">
</div>
{{< /example >}}

## Status Text

{{< example >}}
<div class="d-flex flex-column gap-2">
  <label for="exampleFormControlInput3" class="form-label mb-0 fw-bold">Email address</label>
  <span class="fs-7">Assistive Text Goes Here.  This ensures proper reading order for the user.</span>
  <input type="email" class="form-control" id="exampleFormControlInput3" placeholder="name@example.com">
  <span class="fs-7">320 characters remaining</span>
</div>
{{< /example >}}

## Error Pattern

{{< example >}}
<div class="d-flex flex-column gap-2">
  <label for="exampleFormControlInput4" class="form-label mb-0 fw-bold">Email address</label>
  <span class="fs-7">Assistive Text Goes Here.  This ensures proper reading order for the user.</span>
  <input type="email" class="form-control is-invalid" id="exampleFormControlInput4" placeholder="name@example.com">
  <span class="fs-7">320 characters remaining</span>
  <div class="alert alert-danger mb-0" role="alert">
    <span class="fs-7">A simple danger alert—check it out!</span>
  </div>
</div>
{{< /example >}}

## Success Pattern

{{< example >}}
<div class="d-flex flex-column gap-2">
  <label for="exampleFormControlInput5" class="form-label mb-0 fw-bold">Email address</label>
  <span class="fs-7">Assistive Text Goes Here.  This ensures proper reading order for the user.</span>
  <input type="email" class="form-control is-valid" id="exampleFormControlInput5" placeholder="name@example.com">
  <span class="fs-7">320 characters remaining</span>
  <div class="alert alert-success mb-0" role="alert">
    <span class="fs-7">A simple danger alert—check it out!</span>
  </div>
</div>
{{< /example >}}

## Required/Optional

In cases where the majority of the fields in a form are optional, indicate which fields are required.

{{< example >}}
<div class="d-flex flex-column gap-2">
  <label for="exampleInput6" class="form-label mb-0 fw-bold">Email address (required)</label>
  <input required aria-required="true" type="email" class="form-control" id="exampleInput6" placeholder="name@example.com">
</div>
{{< /example >}}

In cases where the majority of the fields in a form are required, indicate which fields are optional.

{{< example >}}
<div class="d-flex flex-column gap-2">
  <label for="exampleFormControlInput7" class="form-label mb-0 fw-bold">Email address (optional)</label>
  <input type="email" class="form-control" id="exampleFormControlInput7" placeholder="name@example.com">
</div>
{{< /example >}}

## Horizontal Layout

{{< example >}}
<div class="container">
  <div class="row">
    <div class="col-md-6">
      <div class="d-flex flex-column gap-2">
        <label for="exampleInput8" class="form-label mb-0 fw-bold">Email address (required)</label>
        <span class="fs-7">Assistive Text Goes Here.  This ensures proper reading order for the user.</span>
        <input required aria-required="true" type="email" class="form-control" id="exampleInput8" placeholder="name@example.com">
      </div>
    </div>
    <div class="col-md-6">
      <div class="d-flex flex-column gap-2">
        <label for="exampleInput9" class="form-label mb-0 fw-bold">Email address (required)</label>
        <span class="fs-7">Assistive Text Goes Here.  This ensures proper reading order for the user.</span>
        <input required aria-required="true" type="email" class="form-control" id="exampleInput9" placeholder="name@example.com">
      </div>
    </div>
  </div>
</div>
{{< /example >}}
