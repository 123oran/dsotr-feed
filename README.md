# DSOTR Feed — Poster Creator UI kit

An interactive, Instagram-native **poster creator**, built from this design system's components. Users mix & match an issue with a 3D model, write their story, and share the result as an Instagram post.

## Flow
1. **Create** — pick an **issue** (Suicide · Bullying · Identity · Safety · Politics) from the tab row *and* a **3D model** (head · fist · eye · hand · mouth) from the picker; the two are independent, so any combination works. The centre shows a **live preview** of the poster; **swipe left/right** (or tap the dots) to flip between the light "problem" page and the dark "solution" page.
2. **Add Your Story** — write a description for the post (`StoryField`).
3. **Mockup & share** — see the finished Instagram post with the story as its caption, then press the CMYK **SHARE »** pill to post it to the feed.

The bottom bar (`« Back · ●●○ · Next » / SHARE »`) drives the three steps.

## The live imagery
The prismatic poster art is rendered **live** by the project's own **CMYK Stack Viewer** (`cmyk-stack-viewer.vercel.app`) embedded per poster — the same engine described in the root `readme.md`. The viewer renders its own cream (CMY) or ink (RGB) background, so it drops straight into the poster area and the page colour always matches. `modelURL()` in `Feed.jsx` builds the embed URL from each model's tuned parameters (object type, ambient, spread, offset, scale), lifted from the original p5 sketch.

> Because the imagery is a live cross-origin iframe, it renders in a real browser but will **not** appear in the Design System tab's static thumbnail (which shows the chrome + text over the correct background colour) or in PDF/PPTX exports. For a fully self-contained still, bake CMY/RGB renders of each model and swap the iframe for an `<img>`.

## Files
- `index.html` — mounts the app (React → `_ds_bundle.js` → `posters.js` → `Feed.jsx`).
- `Feed.jsx` — the three-step creator; composes `PhoneFrame`, `IssueTab`, `NavButton`, `NavDots`, `ShareButton`, `StoryField`, `Avatar`, `ActionBar`, `StatBlock`, `Icon`, plus the live `LivePoster`.
- `posters.js` — the five issues' copy (`window.DSOTR_POSTERS`).

This is a cosmetic recreation — sharing is faked, not wired to a backend.

---

## Local layout (implemented copy)

This folder is **self-contained**: the design-system foundation it depends on
was co-located here rather than at the repo root, so the kit is portable and
touches nothing else in the project.

```
ui_kits/dsotr_feed/
├── index.html        · entry point — open this
├── Feed.jsx          · the three-step creator (React, compiled in-browser by Babel)
├── posters.js        · the five issues' copy → window.DSOTR_POSTERS
├── styles.css        · design-system entry (@imports tokens + figma-tokens)
├── _ds_bundle.js     · compiled components → window.DarkSideOfTheRainbowDesignSystem_939f41
├── tokens/           · colors · typography · spacing · fonts (@font-face)
├── figma-tokens/     · fig-tokens.css
└── assets/           · fonts · dither · picker · thumbs · posters · icons · source
```

The only change from the handoff sources is that the three code files reference
the foundation with `./…` instead of `../../…` (since it now sits beside them).

**Running it:** `index.html` loads React, ReactDOM and Babel from unpkg and
renders the prismatic poster art from a live cross-origin `cmyk-stack-viewer`
iframe, so it needs a network connection and must be served over `http(s)://`
(not opened as a `file://` URL). Any static server works, e.g. from this folder:
`python -m http.server 8000` → http://localhost:8000/ , or `npx serve`.

## Deploy to Vercel

This folder is a self-contained **static site** — no build step, `index.html` at
the root. Vercel serves it as-is (`vercel.json` only sets a long cache on fonts).

**Via GitHub (recommended):**
1. Create an empty repo on GitHub and push this folder to it (see the repo root).
2. In Vercel: **Add New → Project → Import** that repo.
3. Framework preset **Other**, Build Command **empty**, Output Directory **empty**
   (leave defaults — there is no build). Deploy.

**Via CLI:** `npm i -g vercel` then run `vercel` from this folder and accept the
defaults.

> The prismatic art is a live `cmyk-stack-viewer.vercel.app` iframe and the
> React/Babel runtime loads from unpkg — both are third-party and require the
> visitor to be online. Everything else (chrome, type, tokens, fonts) is served
> from this deployment.

