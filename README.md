# 🌍 AeroJukebox — Earth Information Center Telemetry & Sonification

![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Denizli-0B3D91?style=for-the-badge&logo=nasa)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-00D2FF?style=for-the-badge)
![Audio](https://img.shields.io/badge/Audio-Web%20Audio%20API-10B981?style=for-the-badge)
![Languages](https://img.shields.io/badge/Languages-TR%20%7C%20EN%20%7C%20DE%20%7C%20FR%20%7C%20CS-8B5CF6?style=for-the-badge)

**AeroJukebox** is a multi-sensory Earth observatory built for the NASA Space Apps Challenge *"The Earth Information Jukebox"* track. It transforms real-time NASA satellite telemetry, air quality pollutants, active global wildfires, and night-time light pollution into a **living procedural Biosphere Tree**, **cinematic real-time Web Audio sonification**, and **accessible voice narration**.

---

## 🎯 Problem & Solution

NASA’s Earth Information Center (EIC) produces remarkable visualizations tracking our changing planet, yet relying exclusively on visual media limits accessibility for blind and low-vision users and weakens the public’s emotional connection to complex Earth science data.

**AeroJukebox** bridges this gap by translating sight into sound and living ecology:
- Click anywhere on the globe to stream live NASA and atmospheric telemetry.
- Experience the data through a **5-stage fractal botanical tree simulation** and **musically quantized, non-fatiguing soundscapes**.
- Navigate effortlessly in **5 languages** with Web Speech API narration, full keyboard accessibility, and **AeroAI** (context-aware Google Gemini assistant).

---

## ✨ Key Features

### 1. 🛰️ 3 Independent Global Satellite Radar Maps
- **🌫️ Air Quality Radar:** Combines Open-Meteo (Copernicus CAMS) and NASA POWER telemetry to monitor `PM2.5`, `PM10`, `NO₂`, `O₃`, `CO`, `NASA Solar Irradiance (kWh/m²)`, Temperature (`°C`), Relative Humidity (`%`), `EAQI`, and `US AQI`.
- **🔥 Wildfire & Thermal Risk Radar:** Completely independent from air quality. Plots **live active global wildfires from NASA EONET** directly on the map and computes the **Fire Weather Index (FWI 5%–100%)** from temperature, low humidity, and coarse dust.
- **🌌 Light Pollution Radar:** Overlays the official **NASA GIBS VIIRS Black Marble** night-lights satellite layer and calculates artificial skyglow (`%`) on the **Bortle Scale (1–9)**.

### 2. 🌳 ULTRA Procedural Fractal Biosphere Tree (60 FPS Canvas)
- **Air Quality Mode (5 Stages):** Smoothly transitions from lush emerald foliage, blossoms, and rising O₂ orbs (*Stage 1*) to chlorophyll loss and physics-driven falling amber leaves (*Stages 3–4*), down to a bare fractured skeleton inside a PM2.5 smog storm (*Stage 5*).
- **Wildfire Mode:** Above `50%` FWI, the trunk chars and dynamic flames with rising glowing embers erupt across the branches.
- **Light Pollution Mode:** Under dark skies (*Bortle 1–3*), twinkling stars and dancing fireflies appear; under severe urban glare (*Bortle 7–9*), artificial spotlight cones wash out the stars and trap nocturnal moths.

### 3. 🎵 Cinematic Web Audio API Sonification Engine
- Synthesized in real time in the browser with zero external audio files.
- Equipped with a **`DynamicsCompressor` + `2.2x Makeup Gain`** stage for rich, loud, clipping-free playback.
- **Data → Visual → Sound Mapping:**

| Mode / Stage | Biosphere Reaction | Musical Scale & Sound Design |
| :--- | :--- | :--- |
| **Stage 1 (Excellent)** | Lush emerald leaves, blossoms, O₂ orbs | C Lydian pad + crystalline pentatonic chimes |
| **Stage 2 (Balanced)** | Healthy green canopy | C Maj9 chords + warm kalimba pulse |
| **Stage 3 (Mild Stress)** | Amber foliage, early leaf shedding | D Dorian / Sus4 + melancholic descending notes |
| **Stage 4 (High Stress)** | Heavy leaf fall, gusty winds | E Phrygian + rhythmic heartbeat sub-bass |
| **Stage 5 (Critical Alarm)** | Bare fractured skeleton, PM2.5 storm | 380 Hz low-pass cinematic sub drone + sonar alert |
| **Wildfire (FWI ≥ 50%)** | Burning branches & rising embers | F-Minor tension drone + layered wood crackles |
| **Light (Bortle 1–3 vs 7–9)** | Starry night vs urban skyglow | Starlight harp vs 60 Hz city neon hum |

### 4. 🤖 CosmoAI (Google Gemini Telemetry Assistant)
- Injects live coordinates, all 8 sensor metrics, active radar mode, and tree stage directly into the AI prompt context.
- Supports multi-turn conversation memory, strictly filters out off-topic queries, and includes a smart intent-aware offline analysis fallback when API key not working.

### 5. ⏳ 1750–2026 Historical Simulator & Universal Accessibility
- **Historical Comparison:** Compares live 2026 satellite measurements against a pre-industrial 1750 baseline using an exponential anthropogenic emission curve.
- **5 Languages:** Turkish (`TR`), English (`EN`), German (`DE`), French (`FR`), and Czech (`CS`).
- **Accessibility (WCAG):** Web Speech API voice narration (`V`), `aria-live` screen-reader announcements, Dark/Light themes, mobile-responsive layout, and a 6-step **Spotlight Onboarding Tour (`H`)**.

---

## 📁 Project Structure

```text
aerojukebox/
├── index.html                  # Main application layout, ARIA semantics, and modals
├── css/
│   └── style.css               # Space telemetry theme (Dark/Light), responsive grid, tour & AI UI
├── js/
│   ├── api/
│   │   └── telemetryApi.js     # NASA POWER, NASA EONET, Open-Meteo, Bortle & FWI models
│   ├── audio/
│   │   └── audioEngine.js      # DynamicsCompressor + 2.2x Boost Web Audio synthesizer
│   ├── map/
│   │   └── mapManager.js       # Leaflet monochrome map, NASA GIBS VIIRS & EONET wildfire pins
│   ├── tour/
│   │   └── onboardingTour.js   # 5-language interactive Spotlight onboarding tour
│   ├── tree/
│   │   ├── particleSystem.js   # O₂, falling leaves, smog, fire embers & firefly physics
│   │   └── treeRenderer.js     # Procedural fractal tree, starry night & wildfire rendering
│   └── app.js                  # Core orchestrator, 5-language i18n dictionary & Gemini AI
└── assets/
    ├── nasa.jpg                # Splash screen NASA Space Apps logo
    └── ttcs.jpg                # Splash screen team logo
    └── cosmo-happy.png         #   cosmoai model
    └── cosmo-thinking.png      #   cosmoai model
    └── cosmo-head.png          #   cosmoai head icon
    └── cosmo.svg               #   cosmoai icon
