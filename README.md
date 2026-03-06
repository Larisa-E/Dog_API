# Dog API Gallery

## Demo
![Dog API Gallery Demo](docs/demo%20(1).gif)

## Live App
https://Larisa-E.github.io/Dog_API/

Anyone can open this link and use the app without installing anything.

## Overview
Dog API Gallery is a responsive web app where users can search dog breeds, select optional sub-breeds, and view matching images.

This project was built to practice:
- Public API integration
- JavaScript interactivity (`fetch` + JSON)
- Responsive UI design
- Optional PHP backend proxy
- Documentation and version control

## Features
- Fetches and lists all breeds from Dog API
- Search/filter for faster breed selection
- Sub-breed support (for example, `bulldog/english`)
- Responsive image gallery
- Pagination with `Load More`
- Loading spinner while requests run
- Error handling UI
- Optional PHP proxy endpoints (`api/breeds.php`, `api/images.php`)

## Quick Run
- Open `index.html` directly in your browser, or run `start.bat`.
- No installation is required for normal use.

## Technologies Used
- HTML
- CSS
- JavaScript
- AJAX (`fetch`)
- JSON
- PHP (optional backend proxy)
- Git

## File Roles (Easy Guide)

### Main app
- `index.html` — Page structure (search box, dropdowns, gallery, modal, buttons) and script/style imports.
- `style.css` — All visual design: colors, layout, collage style, modal look, button styling.
- `app.js` — Main controller: connects everything, handles user events, controls app state.
- `api.js` — API layer: fetches breeds/images, handles fallback and timeout logic.
- `ui.js` — UI helper layer: renders dropdowns, gallery items, status text, spinner/errors.
- `modal.js` — Modal behavior: open/close image preview and download handling.

### Backend proxy (optional)
- `breeds.php` — Returns breed list from Dog API (JSON).
- `images.php` — Returns images for selected breed/sub-breed (JSON).

## Request Flow (who calls who)
1. User opens `index.html`
2. `app.js` starts and asks `api.js` for data
3. `api.js` calls `breeds.php` / `images.php` (or Dog API fallback)
4. `ui.js` renders dropdowns, status, and gallery
5. `modal.js` handles image preview and download

## API Used
- Dog CEO API: https://dog.ceo/dog-api/
- Operations used:
	- List all breeds
	- List images by breed
	- List images by sub-breed

