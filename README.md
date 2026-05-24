# Petlyo

AI-powered pet care matching platform. Answer a few questions about your pet and get matched with sitters who genuinely understand their needs — no guesswork, no generic search.

## Running the app

Open with **VS Code Live Server** (right-click `index.html` → *Open with Live Server*) or any static file server:

```bash
# Python
python3 -m http.server 3000

# Node (npx)
npx serve .
```

Then visit `http://localhost:3000`.

## File structure

```
petlyo/
├── index.html          Single-page app — all 5 views in one file
├── css/
│   └── style.css       Full design system, responsive, animations
├── js/
│   ├── data.js         6 sitter profiles with trait/environment data
│   ├── matching.js     Scoring algorithm, insight generator, reason generator
│   └── app.js          Page transitions, form state, rendering
└── README.md
```

## Pages

| Page | Description |
|------|-------------|
| **Landing** | Hero, how it works (4 steps), features (4 cards), footer |
| **Onboarding** | 5-step flow with progress bar — pet basics, traits, environment, routine, owner |
| **Matching** | Animated spinner + 5 sequential status messages with checkmarks |
| **Results** | Pet banner, AI insight, 3 ranked sitter cards with match % and reason |
| **Sitter Detail** | Bio, home facts, 4 animated compatibility bars, request CTA |

## Matching logic

Sitters are scored 0–99 based on:

- **60% trait compatibility** — average of each sitter's per-trait score for all selected traits
- **40% environment fit** — fraction of selected environment requirements the sitter meets

Natural language insight and per-sitter reasons are generated rule-based from the trait/environment combination — no API required.

## Tech stack

- **HTML + CSS + Vanilla JS** — no frameworks, no build step
- **DM Sans** (body) + **DM Serif Display** (headings) via Google Fonts
- **Primary colour** `#1D9E75`
- Smooth fade page transitions, animated compatibility bars, hover micro-animations
- Fully mobile responsive

