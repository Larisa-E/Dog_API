# Dog API Gallery

## Description
A responsive web app that uses Dog API to display images of any selected dog breed.  
Includes search, sub-breeds, pagination, and error handling.

## Features
- Fetches all breeds from Dog API
- Search/filter by breed
- Sub-breed support (e.g. bulldog/english)
- Responsive image gallery
- Load More pagination
- Loading spinner and error UI
- PHP backend proxy

## How to Run (Local)
1. Quick start (no install): open `index.html` directly in your browser or run the VS Code launch profile `Launch Dog API Gallery`.
2. Optional PHP mode (for backend proxy): place the folder in a PHP server (XAMPP/WAMP/MAMP), start Apache, then open `http://localhost/dog-api-app/index.html`.

## Run From GitHub (GitHub Pages)
You can run this as a static site on GitHub Pages.

1. On GitHub, go to your repo → **Settings** → **Pages**.
2. Under **Build and deployment**:
	- **Source**: Deploy from a branch
	- **Branch**: `main` / **(root)**
3. Save, then wait for GitHub to publish.

Your site will be available at:
https://Larisa-E.github.io/Dog_API/

Note: GitHub Pages does **not** run PHP. The app will still work because it automatically falls back to the public Dog API (`https://dog.ceo/...`) when the PHP proxy endpoints can't be used.

## Deployment (Web Server)
1. Upload the folder to your web server.
2. If using PHP proxy endpoints, make sure PHP is enabled.
3. Open the public URL in the browser.

## API Used
https://dog.ceo/dog-api/
