## Site: www.arnav.id
[![CI](https://github.com/arnav-42/personalwebsite/actions/workflows/ci.yml/badge.svg)](https://github.com/arnav-42/personalwebsite/actions/workflows/ci.yml)

Now powered by [Pelican](https://getpelican.com) for templating and content management.

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

### Local usage
1) Install deps (Python 3.9+): `python -m pip install -r requirements.txt`
2) Build: `pelican content`
3) Preview: `pelican --listen` (serves `output/` at http://localhost:8000)

For production builds use `pelican content -s publishconf.py` with `SITEURL` exported.

### JS animation
- `content/assets/js/nav.js` keeps the dropdown and draws a red, fading laser trail when you click-drag on the page (canvas overlay with a fade loop).

### History
These files were originally from another personal-website repo and have been fully rewritten here to avoid conflicts with the older template code.
## Site: www.arnav.id
[![CI](https://github.com/arnav-42/personalwebsite/actions/workflows/ci.yml/badge.svg)](https://github.com/arnav-42/personalwebsite/actions/workflows/ci.yml)

Now powered by [Pelican](https://getpelican.com) for templating and content management.

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

### Local usage
1) Install deps (Python 3.9+): `python -m pip install -r requirements.txt`
2) Build: `pelican content`
3) Preview: `pelican --listen` (serves `output/` at http://localhost:8000)

For production builds use `pelican content -s publishconf.py` with `SITEURL` exported.

### JS animation
<<<<<<< HEAD
- `content/assets/js/nav.js` keeps the dropdown + red laser trail canvas overlay.
=======
- `assets/js/nav.js` also draws a red, fading laser trail when you click-drag on the page (canvas overlay with a fade loop).


```
Note:
These files were previously from another repo for my personal website.
This website started off following a template, and as time went on, I completely custom rewrote the website.
Conflicts with the original template code in the repo prompted me to move my new clean code here.
```
>>>>>>> ea0bb6a2dd446a99aa10fbddeb5980a835fa3993
