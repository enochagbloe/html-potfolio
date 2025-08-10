# Portfolio Menu Overlay Template

A simple, static HTML/CSS/JS template featuring a fixed navbar with a hamburger toggle, a full-screen overlay menu with animated text, and smooth scrolling.

## Overview

- HTML in `folder/index.html` links `index.css` and `index.js`.
- CSS uses `clip-path` on `.menu-overlay` for the open/close reveal and `vh` viewport units for predictable sizing.
- JavaScript bootstraps animations with GSAP and smooth scrolling with Lenis. SplitText (a GSAP Club plugin) is optional and falls back gracefully if unavailable.
- Assets (images) live in `public/` and are referenced relatively from `folder/` (e.g., `../public/hero.jpeg`).

## Key Implementation Details

- Navbar: `.menu-bar` is interactive while the parent `nav` has `pointer-events: none` to keep the overlay clickable behind; `.menu-bar` restores pointer events.
- Hamburger: `.menu-hamburger-icon` toggles the `active` class to morph lines into an “X”.
- Overlay: `.menu-overlay` starts collapsed via `clip-path: polygon(0% 0%, 100% 0, 100% 0%, 0% 0%)` and expands to full screen on open.
- Sections: `section { height: 100vh; }` with `z-index: 0` so the overlay (z-index: 1) sits above.
- Text animation: When available, SplitText splits `a, p` into lines and animates them from `y: -110%` to `0%`. If not available, a simple fade/slide fallback runs instead.

## How to Run

Choose one of the options below.

- Option A: Open directly

  - Double-click `folder/index.html` to open in your browser.

- Option B: VS Code Live Server

  - Install the “Live Server” extension.
  - Right‑click `folder/index.html` > “Open with Live Server”.

- Option C: Lightweight local server (PowerShell)
  ```powershell
  cd "C:\Users\user\Documents\enoch delight\port-template\folder"
  npx serve .
  ```
  Then open the URL printed in the terminal.

## Troubleshooting

- Nothing happens on click

  - Open DevTools Console and check for errors.
  - Ensure the toggle element exists: `.menu-toggle-btn` and `.menu-hamburger-icon`.
  - Confirm `index.js` is loading (no 404 errors).

- CDN errors (GSAP/Lenis not loading)

  - Check your internet connection or firewall. The script falls back where possible, but GSAP is required.

- Images not visible

  - Confirm image paths are correct from `folder/` (e.g., `../public/hero.jpeg`).

- Overlay not covering the page
  - Ensure CSS uses `vh` (not `svh`) and `.menu-overlay` has `position: fixed` and correct `clip-path`.

## Folder Structure

```
port-template/
  folder/
    index.html
    index.css
    index.js
  public/
    hero.jpeg
    media.png
    logo.png
```

## Notes

- If you prefer npm-based imports (`import gsap from 'gsap'`), set up a bundler/dev server (e.g., Vite). The current setup uses CDN modules to keep it simple and bundler‑free.
