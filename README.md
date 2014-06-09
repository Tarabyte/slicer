Slicer
======

**jQuery plugin to slice chars to apply different styles to each part.**

Usage
=====
- include jQuery

```html
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
```

- include `slicer.js` for development or `slicer.min.js` for production

```html
<script src="path_to_slicer.min.js"></script>
```

- slice your target

```javascript
$('selector').sliceVertical(5); //make vertical slices
$('selector').sliceHorizontal(3); //make horizontal slices
$('selector').sliceBoth(3, 2); //or even both
```

- customize by columns, rows, or separate slices

```css
.column-1-of-5 {
    /* CSS */
}

.row-2-of-3 {
    /* CSS */
}

.slice-1-2-of-3x2 {
    /* CSS */
}
```

Examples
========
Rainbow. Check `./examples/examples.html` for more.

```javascript
$(function() {
    $('.rainbow:eq(0)').sliceVertical(7);
    $('.rainbow:eq(1)').sliceHorizontal(7);
});
```

```html
<div class="rainbow">Vertical Rainbow</div>
<div class="rainbow">Horizontal Rainbow</div>
```

```css
.rainbow {
  font-size: 50px;
}
.rainbow .slice-1-of-7 {
  color: red;
}
.rainbow .slice-2-of-7 {
  color: orange;
}
.rainbow .slice-3-of-7 {
  color: yellow;
}
.rainbow .slice-4-of-7 {
  color: green;
}
.rainbow .slice-5-of-7 {
  color: blue;
}
.rainbow .slice-6-of-7 {
  color: indigo;
}
.rainbow .slice-7-of-7 {
  color: violet;
}
```