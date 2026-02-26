# Merge Run (ad-inspired web game)

![Merge Run preview](assets/preview.svg)

This repository contains a complete, playable browser game inspired by short-form mobile game ads.

## Where you can run this

Because this is plain HTML/CSS/JS, you can run it in **any modern browser**:

- **Locally on your computer** (fastest): Python simple server, VS Code Live Server, etc.
- **Online static hosts**: GitHub Pages, Netlify, Vercel (static), Cloudflare Pages.
- **Browser IDEs**: CodeSandbox, StackBlitz, Replit (static web project).

## Run locally (recommended)

From this folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Alternative local options

### VS Code Live Server
1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.

### Node-based static server
```bash
npx serve .
```

## Controls

- Desktop: `A` / `D` or `←` / `→`
- Mobile: swipe left or right on the canvas

## Gameplay

- You control a numbered block.
- Collide with the same number to merge and level up.
- Smaller numbers give bonus points.
- Bigger numbers end the run.
- Coins grant score.
