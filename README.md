# Patomy VC

Single-page site in plain HTML, CSS and native JavaScript (ES modules), implementing the
[Figma design](https://www.figma.com/design/KmLG4TC7pj0Kmpq0BmQiFq/Patomy-VC?node-id=61-13770&m=dev).

## Run

ES modules need a server (not `file://`):

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Structure

```
index.html          page shell; one <section> per Figma block
css/
  reset.css         minimal reset
  tokens.css        design tokens (colors, type, spacing) from Figma
  base.css          element defaults
  layout.css        container, sections, grid helpers
  components.css    per-section/component styles
js/
  main.js           entry point; wires up components
  components/       one module per component, exporting init(root)
assets/
  images/ icons/ fonts/
```

## Conventions

- Add a section to `index.html`, its styles to `css/components.css`, and (if interactive) a module in `js/components/`.
- Use tokens from `tokens.css` instead of hard-coded values.
- No build tools or dependencies.

## Build

`scripts/build.sh` assembles `_site/` for GitHub Pages: the site at the root, plus a copy under `/v2/` so older
links keep working. The GitHub Pages workflow runs it on every push to `main`.
