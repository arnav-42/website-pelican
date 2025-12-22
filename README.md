## Site: www.arnav.id
[![CI](https://github.com/arnav-42/personalwebsite/actions/workflows/ci.yml/badge.svg)](https://github.com/arnav-42/personalwebsite/actions/workflows/ci.yml)
### Stack
- Static HTML/CSS/JS
- Cloudflare Pages hosting

### Structure
- `/index.html` home
- `/research.html`, `/repositories.html`, `/notes.html`, `/blog.html`, `/contact.html`, `/tools.html`
- Assets in `assets/css`, `assets/js`, `assets/img`, and `assets/materials`.
- Notes PDFs in `notes/`

### Notes roadmap
- I may split notes into a separate repo and use GitHub Actions to sync or publish them into `notes/` here for easier updates.

### Future themes
- I discovered Jekyll after this refactor. I might migrate to a Jekyll theme in the future for templating and easier content management.

### JS animation
- `assets/js/nav.js` also draws a red, fading laser trail when you click-drag on the page (canvas overlay with a fade loop).
