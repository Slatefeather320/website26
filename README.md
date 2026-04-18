# Markdown Website

This site is generated from markdown files in the `mds` folder.

## How it works

- `scripts/build-content.mjs` scans all `*.md` files in the `mds` folder.
- It writes `data/notes.json`, which powers the website UI.
- The frontend loads and renders notes, including Obsidian links:
  - `[[Other Note]]` -> internal navigation
  - `![[image.png]]` -> embedded image

## Commands

- Build content:

```bash
npm run build
```

- Build + run local server:

```bash
npm run dev
```

Then open: `http://localhost:5173`

## Add more notes later

1. Drop new `.md` files (and images) into `mds/`.
2. Run `npm run build`.
3. Refresh the browser.
