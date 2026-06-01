# Crewcutt Media // Cinematic Art Production House

An immersive, avant-garde, and highly interactive digital showcase built for **Crewcutt Media**—a modern creative production house crafting high-energy commercial campaigns, brand stories, state-of-the-art CGI, and cinematic post-production masterpieces.

👉 **Preview Live Local Link**: [http://localhost:3000](http://localhost:3000)

---

## 🎨 Creative Architecture & Aesthetics

The interface deviates from standard agency templates to present a digital system styled as an active television studio monitor and editing console:

- **True Obsidian Base (`#040405`)**: Infinite black-hole canvas giving depth to neon assets.
- **Cyber-Neon Green (`#00FF66`)**: High-energy, glowing lime-green elements that define indicators, active track nodes, borders, and buttons.
- **Deep Moss Emerald (`#022010`)**: Transparent carbon-glass overlays providing atmospheric shadows and lens flare backdrops.
- **Space Mono Typography**: Technical monospaced text elements for rendering system logs, aperture ratings, and timestamps.

---

## ⚡ Immersive Interactive Features

### 1. Film Grain & CRT Scanline Shader
A global, continuous CSS keyframe noise simulator shifts and jitters dynamically across the viewport to reproduce the physical texture of celluloid movie reels. Intersecting this is a subtle vertical CRT scanline overlay representing studio engineering screens.

### 2. The Oscilloscope Canvas Background
Programmed a custom mathematical sine-wave oscilloscope. Four distinct, asynchronously undulating curves float across the viewport. Moving the cursor introduces frequency and amplitude disturbances, causing the waves to bend and distort dynamically as you glide.

### 3. Smooth Lerp Cursor & Magnetic Nudges
A custom cursor ring tracks the mouse position using low-pass interpolation filters (`lerp = 0.12`). On hovering over interactive panels, the cursor expands, alters saturation, and reveals contextual badges (`PLAY`, `VIEW`). Furthermore, buttons and navigation links physically snap/nudge toward the pointer.

### 4. Technical Viewfinder Viewports
- **Widescreen Anamorphic Ratio (`2.39:1`)**: Enforced strict cinema aspect ratios on all showcase grids and showreel preview frames.
- **Camera Monitor HUDs**: Framed headers with crop indicators, active blinking **`REC`** lights, timed SMPTE codes, shutter parameters (`SHUTTER 180°`), aperture marks (`f/1.2`), and focal crosshair targets `[+]` centered in the glass frame.

### 5. Sonar & Analogue Drone Audio (Sound Lounge)
Powered by the native browser **Web Audio API** (synthesized in real-time with zero asset loading lag):
- *Navigation Hover*: A high-Q resonant digital **sonar ping** (submarine echo).
- *Card/Section Hover*: A low-frequency **120Hz analogue synth sweep drone** sweeping through resonant filters.
- *Theatre Modal Launch*: A cinematic sub-bass filter drop paired with static noise celluloid clicks.
- *Brief Transmission*: A pentatonic arpeggio sweep celebrating successful data uploads.

### 6. Custom Skinned video Theatre
Clicking the showreel opens a custom widescreen HTML5 video player modal containing fully customized scrubbing bars, playback speed toggles (`0.75x` to `2.0x`), full-screen hooks, volume slider scales, and timed display readouts.

---

## 📁 File Structure
```
03- Crewcut Media/
├── index.html       # Viewfinder structure & semantic pages
├── style.css        # Glassmorphic tokens, grain noise keyframes, & CRT scanlines
├── app.js           # Oscilloscope engine, Web Audio synth library, & player controllers
├── .gitignore       # Git staging bypass paths
└── README.md        # Technical project handbook (this file)
```

---

## 🚀 Local Development Setup

To serve the files locally using Python's native web server:

1. Clone or navigate to the directory:
   ```bash
   cd "03- Crewcut Media"
   ```
2. Launch the HTTP server:
   ```bash
   python -m http.server 3000
   ```
3. Open your browser and navigate to:
   **[http://localhost:3000](http://localhost:3000)**
