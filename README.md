# Dragon Game Project

A lightweight browser game where a dino avoids a moving dragon, earns score for each successful pass, and gets progressively harder over time.

## Features

- Responsive game layout for desktop and mobile-sized viewports.
- Keyboard controls for jump and horizontal movement.
- Collision-based game over.
- Score tracking with increasing obstacle speed.
- Background music and game-over sound effects.
- Restart button to quickly replay.

## Project Structure

```text
Dragon-Game-Project/
|-- index.html
|-- css/
|   `-- style.css
|-- js/
|   `-- script.js
|-- assets/
|   |-- images/
|   |   |-- bg.png
|   |   |-- dino.png
|   |   `-- dragon.png
|   `-- audio/
|       |-- music.mp3
|       `-- gameover.mp3
`-- README.md
```

## Requirements

- Any modern browser (Chrome, Edge, Firefox).
- Optional local server tools:
	- Python 3, or
	- Node.js

## Run the Game

### Option 1: Python HTTP server

Run from the project root:

```powershell
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

### Option 2: Node static server

If you have `serve` installed globally:

```powershell
serve .
```

Or use any equivalent static server.

## Controls

- `ArrowUp`: Jump
- `ArrowRight`: Move right
- `ArrowLeft`: Move left

## Gameplay Rules

- The dragon moves from right to left continuously.
- You gain `+1` score each time the dragon successfully passes the dino.
- Dragon speed increases gradually after each point (up to a defined minimum animation duration).
- Touching the dragon ends the game.

## Main Logic Summary

- Input handling and game loop are in [js/script.js](js/script.js).
- Rendering and animations are in [css/style.css](css/style.css).
- Markup and script/style wiring are in [index.html](index.html).

## Known Behavior and Fixes Included

- Added a short start grace period to prevent instant game-over on smaller screens.
- Improved movement boundary clamping so the dino cannot leave the play area.
- Made scoring more reliable by counting passes based on obstacle position crossing the dino.
- Updated all asset paths after folder reorganization.

## Quick Validation Checklist

1. Start server and open the game URL.
2. Confirm background image and sprites load.
3. Press arrow keys and verify movement/jump.
4. Confirm score increments when obstacle passes.
5. Confirm collision shows game-over text and restart button.
6. Click restart and verify a fresh game starts.

## Troubleshooting

- No sound:
	- Click inside the page once and press a key (browser autoplay policies can block initial playback).
- Assets not loading:
	- Ensure you are serving from project root and not opening files directly with `file://`.
- Port already in use:
	- Start server on another port, for example `python -m http.server 5501`.

## License

This project currently has no explicit license file.