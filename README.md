# Dog API Gallery

## Project Overview
Dog API Gallery is a responsive web application that lets users explore dog breeds and view images for each selected breed.

The project was built to practice:
- Working with a public API
- Client-side development with JavaScript (`fetch` + JSON)
- Responsive UI design
- Optional backend integration with PHP
- Version control and documentation

## Purpose
This app demonstrates how to consume and display external API data in a user-friendly interface.
Users can quickly find a breed, select it, and browse matching images in a gallery layout that works on desktop and mobile.

## Features
- Fetches and lists all breeds from Dog API
- Search/filter for faster breed selection
- Sub-breed support (for example, `bulldog/english`)
- Responsive image gallery
- Pagination with `Load More`
- Loading spinner while requests run
- Error handling UI
- Optional PHP proxy endpoints (`api/breeds.php`, `api/images.php`)

## Core Requirements Covered
- Uses Dog API as the main data source: https://dog.ceo/dog-api/
- Uses AJAX requests (via `fetch`) without page reloads
- Uses JSON responses from the API
- Lets users select and browse dog breeds
- Uses a responsive layout suitable for desktop and mobile

## API Operations Implemented
- List all breeds
- List images by breed
- List images by sub-breed

## Technologies Used
- HTML
- CSS
- JavaScript
- AJAX (`fetch`)
- JSON
- PHP (optional backend proxy)
- Git

## Project Structure
- `index.html` – Main app page
- `assets/app.js` – App logic and API calls
- `assets/style.css` – App styling
- `api/breeds.php` – Optional backend proxy for breeds
- `api/images.php` – Optional backend proxy for images
- `start.bat` – Local startup helper

## Architecture / Data Flow
1. Browser loads `index.html`, which includes `assets/style.css` and `assets/app.js`.
2. On page load, `app.js` calls:
	- `loadBreeds()` to get breed data
	- `loadBackgroundCollage()` to fetch random decorative images
3. `loadBreeds()` uses `fetchJsonWithFallback()`:
	- Primary: `api/breeds.php` (PHP proxy)
	- Fallback: `https://dog.ceo/api/breeds/list/all`
4. User selects breed/sub-breed, then `loadImagesForSelection()` runs.
5. `loadImagesForSelection()` also uses `fetchJsonWithFallback()`:
	- Primary: `api/images.php?breed=...&subBreed=...`
	- Fallback: Dog API direct image endpoint
6. Returned image URLs are stored in `currentImages`; `renderImages()` displays them in pages of 12 with `Load More`.
7. Clicking a gallery image opens the modal; download tries blob download first and falls back to opening the image in a new tab.

## File Connection Summary
- `index.html` defines all UI elements referenced by IDs in `app.js`.
- `style.css` styles those same IDs/classes and visual components.
- `app.js` drives all interaction and API communication.
- `api/breeds.php` and `api/images.php` are thin server-side pass-through endpoints to Dog API.
- If PHP endpoints are unavailable (for example on GitHub Pages), the frontend automatically uses direct Dog API URLs.

Public URL:
https://Larisa-E.github.io/Dog_API/

