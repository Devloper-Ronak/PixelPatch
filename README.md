# PixelPatch

A React + Vite pixel-art editor with a warm paper-and-forest palette.

## Run locally

1. Install Node.js (LTS) if it is not already installed.
2. Open this folder in VS Code.
3. Open Terminal in the project folder and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite (usually http://localhost:5173).

## Features

- Pencil, eraser, flood fill, colour picker, line, rectangle, and circle tools
- Built-in palette and custom colour picker
- 8×8, 16×16, 24×24, and 32×32 canvases
- Grid toggle, mirror drawing, horizontal/vertical flip, zoom, undo/redo
- Save/open/delete artwork in browser localStorage
- PNG export with configurable pixel scale and transparent/cream background
- Keyboard shortcuts and responsive layout

## Project map

- `src/App.jsx`: shared state and application wiring
- `src/components/`: toolbar, board, palette/settings, gallery, dialogs
- `src/hooks/useHistory.js`: undo/redo history
- `src/utils/`: drawing algorithms, storage, constants
- `src/styles/`: tokens, global styles, layout, components, dialogs, responsive rules

Saved artwork is stored in this browser only; clearing browser site data may remove it.
