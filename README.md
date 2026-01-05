## Site: www.arnav.id
[![CI](https://github.com/arnav-42/website/actions/workflows/ci.yml/badge.svg)](https://github.com/arnav-42/website/actions/workflows/ci.yml)

**This is my experimental site where I push and test changes before deploying to my main website at [www.arnav.id](https://www.arnav.id/).**

### Stack
- Pelican (Python static site generator)
- Custom Pelican theme in `theme/` (reuses existing CSS/JS)
- Cloudflare Pages hosting (build produces `output/`)

### Structure
- `content/pages/*.md` — page content (Home, Research, Notes, Repositories, Blog, Contact, Tools)
- `content/assets/` — CSS, JS, images, research PDFs
- `content/notes/` — course PDFs
- `theme/templates/` — Jinja templates (`base.html`, `page.html`, `article.html`)
- `pelicanconf.py` — local/dev config (uses relative URLs)
- `publishconf.py` — production config (set `SITEURL` via env)

### History
These files were originally from another personal-website repo and have been fully rewritten here to avoid conflicts with the older template code.
