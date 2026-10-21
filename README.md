# Khaled Wael — Portfolio

Neo-Brutalist portfolio built with plain HTML, CSS and JavaScript (no build step).

## Structure
```
khaled-portfolio/
├── index.html                 # all page content
├── css/style.css              # design tokens (:root) + styles
├── js/script.js               # reveal animations, footer year, empty-image handling
└── assets/images/projects/    # put project images here
```

## Adding project images
Drop an image in `assets/images/projects/` using one of these names (or change the `src` in `index.html`):
`waey.png`, `business-assistant.png`, `leukocoria.png`, `optiverse.png`.
Until an image exists, the card shows a dashed "Add image" placeholder. Recommended size: about 640×380 px (landscape).

## Editing
- Colors, borders, shadows, fonts: CSS variables at the top of `css/style.css`.
- Text, links, tags: `index.html` (each project is one `<article class="card">`).

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder.
