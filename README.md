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

## Share → post to Instagram

Page 3's **SHARE »** button posts the poster as a **2-video carousel** — slide 1
the light "problem" loop, slide 2 the dark "solution" loop — captioned with the
user's story. It's a real post via the Instagram Graph API. (Publishing on an
account's behalf needs a **Business/Creator** account — expected, fine for a demo.)

Moving parts:
- [`Feed.jsx`](Feed.jsx) — on Share, POSTs `{ issue, model, caption }` to `/api/publish`
  and shows *Posting…* → *"Posted to Instagram · view post »"* (or an error).
- [`api/publish.js`](api/publish.js) — Vercel serverless function. Looks up the two
  clips for the chosen issue+model and runs the carousel publish (2 video
  containers → wait for processing → carousel → publish → permalink). **The token
  lives only in env vars**, never in the page.
- `media/<issue>-<model>-{light,dark}.mp4` — the 50 pre-rendered clips, hosted on
  this deployment so Instagram can fetch them by public URL.
- [`render/`](render/) — the offline batch renderer that produces those clips.

### 1 · One-time Meta setup

All doable in the app's **Development mode** — no App Review needed to post to your
own account:
1. An **Instagram Business or Creator** account, linked to a **Facebook Page**.
2. A **Facebook developer app** (Meta for Developers) with the *Instagram Graph API*.
3. Your IG account added to that app as admin / developer / tester.
4. A **long-lived access token** with `instagram_basic` + `instagram_content_publish`,
   plus your **IG user-id**.

Set them as Vercel env vars (Project → Settings → Environment Variables), per
[`.env.example`](.env.example):

```
IG_USER_ID=…
IG_ACCESS_TOKEN=…
GRAPH_VERSION=v21.0     # optional; bump if that version retires
```

### 2 · Render the clips

The prismatic art is a cross-origin iframe, so it can't be screen-grabbed from the
page — the renderer drives a headless browser instead:

```
cd render
npm install
npx playwright install chromium
npm run render          # all 50 clips → ../media   (~10–15 min)
npm run render:one      # just suicide-head (both sides), to eyeball first
```

The model spins continuously, so a clip loops seamlessly only when `--seconds`
equals one full rotation — nudge it until the wrap is invisible, then render the
set: `node render-clips.mjs --only suicide-head --seconds 5.6`.

Commit the resulting `media/*.mp4` so they deploy (~1–2 MB each). If the repo gets
heavy, use **Git LFS** or host the clips on a bucket and set `PUBLIC_BASE_URL`.

### 3 · Deploy & post

Instagram pulls each video from a **public URL**, so a real post only works on the
**deployed** site — localhost clips aren't reachable by Meta. Push → let Vercel
deploy → open the live URL → build a poster → **SHARE »**. (Limit: 25 API posts /
24 h.)

> **Local UI check:** `vercel dev` runs the function locally so you can watch the
> Posting…/error states, but an actual post still needs the public clips.

