# vid-cut — Epics & Tickets

**Product:** CapCut-like web video editor (Path B)  
**Base:** [OpenCut classic](https://github.com/OpenCut-app/opencut-classic) (MIT) — ideas only from Concat, no AGPL code  
**Stack:** Next.js + React + TypeScript + Tailwind + browser/WASM media  
**Constraint:** $0 infra (no paid APIs; auth/DB optional / off for MVP)  
**Deploy:** Vercel free (primary); Astro landing optional  

**Priorities:** `P0` MVP ship · `P1` CapCut-like parity · `P2` polish · `P3` later  
**Statuses:** `todo` · `doing` · `done` · `blocked` · `wontfix`

---

## Epic map

| Epic | Title | Goal | Priority |
|------|--------|------|----------|
| E01 | Foundation & rebrand | Fork classic → vid-cut identity | P0 |
| E02 | Zero-cost platform | Run without Postgres/Redis/paid services | P0 |
| E03 | Media import & library | Bring media into a project | P0 |
| E04 | Timeline core | CapCut-style multi-track editing | P0 |
| E05 | Preview & playback | WYSIWYG preview | P0 |
| E06 | Transform & aspect | Crop, scale, rotate, ratios | P0 |
| E07 | Audio | Volume, mute, fade, detach | P0 |
| E08 | Text & titles | On-timeline text | P0 |
| E09 | Export | Local H.264 export, no watermark | P0 |
| E10 | Project persistence | Save/load projects locally | P0 |
| E11 | History & shortcuts | Undo/redo + keyboard | P0 |
| E12 | Captions | Auto + manual captions | P1 |
| E13 | Transitions | Cut + common transitions | P1 |
| E14 | Effects & filters | Visual FX library (original / OSS) | P1 |
| E15 | Keyframes | Animate properties over time | P1 |
| E16 | Speed & time tools | Speed, freeze, reverse | P1 |
| E17 | Stickers & overlays | Images/GIFs as overlay tracks | P1 |
| E18 | Performance | Scrub/export on mid hardware | P1 |
| E19 | Marketing site | Astro landing on free host | P2 |
| E20 | Deploy & release | Vercel prod + CI | P0 |
| E21 | QA & a11y | Browser matrix, a11y basics | P1 |
| E22 | Legal & privacy | MIT attribution, privacy, no CapCut IP | P0 |
| E23 | Templates (original) | Starter templates you own | P2 |
| E24 | PWA / offline | Installable, offline edit | P2 |
| E25 | Desktop (optional) | Later shell if needed | P3 |
| E26 | Mobile wrap (optional) | TWA / Capacitor later | P3 |
| E27 | Differentiation | Features that make vid-cut unique | P2 |

---

## E01 — Foundation & rebrand

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-001 | Clone OpenCut classic into `vid-cut` repo | P0 | — | **done** — cf5e79e, remote=`upstream` |
| VID-002 | Rename packages/apps from opencut → vid-cut | P0 | VID-001 | **done** — `vid-cut` / `@vid-cut/web` |
| VID-003 | Replace branding (name, logo, favicon, OG) | P0 | VID-002 | **done** — brand.ts + new SVG logo |
| VID-004 | Change app/bundle IDs & public URLs | P0 | VID-002 | **done** — SITE_URL via env / localhost |
| VID-005 | Document upstream attribution in NOTICE/README | P0 | VID-001 | **done** — NOTICE + README |
| VID-006 | Baseline: `bun install` + `bun dev:web` runs | P0 | VID-001 | **done** — `localhost:3000` → 200 |

---

## E02 — Zero-cost platform

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-010 | Inventory paid/ops deps (Postgres, Redis, Better Auth, Upstash, fal) | P0 | VID-006 | **done** — see `env/features.ts` |
| VID-011 | Make editor usable with auth disabled | P0 | VID-010 | **done** — `AUTH_ENABLED=false` → 501 |
| VID-012 | Remove or stub Redis/rate-limit for local+Vercel free | P0 | VID-010 | **done** — no-op without Redis |
| VID-013 | Remove or stub Postgres/Drizzle for MVP | P0 | VID-010 | **done** — lazy DB; no import connect |
| VID-014 | Strip cloud AI / paid media APIs from default path | P0 | VID-010 | **done** — Freesound/Marble/analytics off |
| VID-015 | Env template for free deploy (no secrets required) | P0 | VID-011–014 | **done** — `.env.example` |
| VID-016 | Docker optional; document “no Docker” path | P1 | VID-015 | **done** — `docs/FREE_SETUP.md` |

---

## E03 — Media import & library

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-020 | Import video (mp4/webm/mov where browser allows) | P0 | VID-006 | **done** — `processMediaAssets` + mediabunny |
| VID-021 | Import audio (mp3/wav/aac/m4a) | P0 | VID-006 | **done** |
| VID-022 | Import images (png/jpg/webp/gif) | P0 | VID-006 | **done** |
| VID-023 | Media library panel (thumbnails, duration, type) | P0 | VID-020–022 | **done** — `MediaView` |
| VID-024 | Drag media from library → timeline | P0 | VID-023, E04 | **done** — drag-drop controller |
| VID-025 | Replace / detach / delete media safely | P0 | VID-023 | **done** — remove cleans orphans |
| VID-026 | Probe metadata (fps, res, duration, codec) | P1 | VID-020 | **done** — persist fps/hasAudio/codec |
| VID-027 | Large-file handling + progress UI | P1 | VID-020 | **done** — quota + toast progress |
| VID-028 | Multi-select import | P2 | VID-023 | **done** — `multiple: true` + ext accept |

---

## E04 — Timeline core

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-030 | Multi-track timeline (V/A tracks) | P0 | VID-006 | **done** — overlay/main/audio |
| VID-031 | Add / remove / reorder tracks | P0 | VID-030 | **done** — add/remove; lane order via placement |
| VID-032 | Trim clip in/out | P0 | VID-030 | **done** — resize controller |
| VID-033 | Split clip at playhead | P0 | VID-030 | **done** — `split` / q / w |
| VID-034 | Move / ripple move clips | P0 | VID-030 | **done** — ripple toggle |
| VID-035 | Snap to edges / playhead | P0 | VID-030 | **done** — snapping module |
| VID-036 | Zoom timeline (fit / scroll) | P0 | VID-030 | **done** — zoom controller |
| VID-037 | Selection (single + multi) | P0 | VID-030 | **done** — box select |
| VID-038 | Copy / paste / duplicate clips | P1 | VID-037 | **done** — clipboard + ctrl+d |
| VID-039 | Magnetic timeline mode (optional) | P2 | VID-034 | **done** — snap + ripple (magnet UI) |
| VID-040 | Track lock / mute / solo / hide | P1 | VID-030 | **done** — mute/hide/lock; solo deferred |
| VID-041 | Nested sequences / compound clips | P3 | VID-030 | **deferred** |

---

## E05 — Preview & playback

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-050 | Preview canvas synced to playhead | P0 | VID-030 | **done** — CanvasRenderer + playhead RAF |
| VID-051 | Play / pause / scrub | P0 | VID-050 | **done** — toggle-play + EditableTimecode |
| VID-052 | Frame step (←/→) | P1 | VID-051 | **done** — frame-step-forward/backward |
| VID-053 | Safe areas / aspect letterbox | P1 | VID-050 | **done** — GridPopover guides re-enabled |
| VID-054 | Preview quality modes (full / proxy) | P1 | VID-050 | **done** — full=2048 / performance=1024 |
| VID-055 | Fullscreen preview | P2 | VID-050 | **done** — useFullscreen |

---

## E06 — Transform & aspect

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-060 | Position / scale / rotate clip | P0 | VID-050 | **done** — handles + Transform params |
| VID-061 | Opacity | P0 | VID-060 | **done** — Blending tab |
| VID-062 | Crop | P0 | VID-060 | **done** — rectangle mask |
| VID-063 | Flip H/V | P1 | VID-060 | **done** — negate scale + Transform buttons |
| VID-064 | Project aspect ratios (9:16, 16:9, 1:1, 4:5) | P0 | VID-050 | **done** — presets incl. 1080×1350 |
| VID-065 | Fit / fill / stretch modes | P1 | VID-064 | **done** — `transform.scaleMode` |

---

## E07 — Audio

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-070 | Per-clip volume | P0 | VID-030 | **done** — Audio tab + volume line |
| VID-071 | Mute clip / track | P0 | VID-070 | **done** — clip mute + track mute |
| VID-072 | Fade in / fade out | P1 | VID-070 | **done** — volume keyframes + Audio UI |
| VID-073 | Detach audio from video | P1 | VID-020, VID-021 | **done** — source audio separation |
| VID-074 | Waveform on timeline | P1 | VID-021 | **done** — AudioWaveform |
| VID-075 | Basic denoise / loudness (client, free models only) | P2 | VID-070 | **deferred** — mastering limiter only |
| VID-076 | Audio effects (chipmunk/robot) | P3 | VID-070 | **deferred** |

---

## E08 — Text & titles

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-080 | Add text clip to timeline | P0 | VID-030 | **done** — Text assets + drag/drop |
| VID-081 | Font, size, color, align | P0 | VID-080 | **done** — Text properties tab |
| VID-082 | Stroke / shadow / background plate | P1 | VID-081 | **done** — stroke/shadow params + bg |
| VID-083 | Title presets (original designs) | P1 | VID-082 | **done** — 6 original presets |
| VID-084 | Text animation presets (in/out) | P2 | VID-080, E15 | **deferred** — needs E15 |

---

## E09 — Export

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-090 | Export H.264 MP4 in browser | P0 | VID-050 | **done** — mediabunny AVC MP4, no watermark |
| VID-091 | Resolution presets (720p / 1080p) | P0 | VID-090 | **done** — 720p / 1080p / project |
| VID-092 | FPS / bitrate options | P1 | VID-090 | **done** — fps select + quality bitrate |
| VID-093 | Export progress + cancel | P0 | VID-090 | **done** — Progress + cancel |
| VID-094 | Export audio-only | P2 | VID-090 | **done** — m4a / webm audio |
| VID-095 | 4K export (where device allows) | P2 | VID-090 | **done** — 4K box, scaled frames |
| VID-096 | HEVC / AV1 optional | P3 | VID-090 | **done** — shown if encoder supports |

---

## E10 — Project persistence

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-100 | Save project to IndexedDB | P0 | VID-030 | |
| VID-101 | Autosave | P0 | VID-100 | |
| VID-102 | Open recent projects | P0 | VID-100 | |
| VID-103 | Export/import project JSON (+ media refs) | P1 | VID-100 | |
| VID-104 | New project wizard (ratio, name) | P0 | VID-064 | |
| VID-105 | Duplicate / delete project | P1 | VID-100 | |

---

## E11 — History & shortcuts

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-110 | Undo / redo stack | P0 | VID-030 | **done** — cap 100, reactors on undo, subscribe, header buttons |
| VID-111 | Keyboard shortcuts (cut, split, play, delete) | P0 | VID-110 | **done** — `ctrl+x` cut; split/play/delete already bound |
| VID-112 | Shortcuts cheatsheet UI | P2 | VID-111 | **done** — dialog + `ctrl+/` / `?`; unbound rows shown |
| VID-113 | Action history panel | P3 | VID-110 | **done** — header panel, jump-to-index, `ctrl+shift+h` |

---

## E12 — Captions

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-120 | Manual caption clips / SRT import | P1 | VID-080 | |
| VID-121 | Auto-captions via client Whisper/transformers (free, local) | P1 | VID-020 | Heavy; optional download |
| VID-122 | Caption style presets | P1 | VID-120 | |
| VID-123 | Burn captions into export | P1 | VID-090, VID-120 | |
| VID-124 | Word-level karaoke captions | P2 | VID-121 | CapCut-like |

---

## E13 — Transitions

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-130 | Hard cut (default) | P0 | VID-030 | Baseline |
| VID-131 | Dissolve / fade | P1 | VID-130 | |
| VID-132 | Slide / wipe set (small OSS set) | P1 | VID-131 | |
| VID-133 | Transition duration control | P1 | VID-131 | |
| VID-134 | Transition gallery UI | P2 | VID-132 | |

---

## E14 — Effects & filters

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-140 | Effect apply pipeline (preview + export) | P1 | VID-050, VID-090 | Align with classic `effects-renderer` |
| VID-141 | Color filters (brightness, contrast, sat, temp) | P1 | VID-140 | |
| VID-142 | Curated filter presets (original) | P1 | VID-141 | |
| VID-143 | Blur / vignette / sharpen | P1 | VID-140 | |
| VID-144 | Effect intensity + enable/disable | P1 | VID-140 | |
| VID-145 | Expand effect library (own GLSL/WASM) | P2 | VID-140 | No CapCut packs |

---

## E15 — Keyframes

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-150 | Keyframe position/scale/rotation/opacity | P1 | VID-060 | Classic has docs |
| VID-151 | Keyframe volume | P1 | VID-070 | |
| VID-152 | Easing curves | P2 | VID-150 | |
| VID-153 | Keyframe UI on timeline | P1 | VID-150 | |
| VID-154 | Effect param keyframes | P2 | VID-140, VID-150 | |

---

## E16 — Speed & time tools

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-160 | Clip speed (0.25x–4x) | P1 | VID-032 | |
| VID-161 | Freeze frame | P1 | VID-033 | |
| VID-162 | Reverse clip | P1 | VID-160 | |
| VID-163 | Curve speed (optional) | P3 | VID-160 | |

---

## E17 — Stickers & overlays

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-170 | Image/GIF overlay track | P1 | VID-022 | |
| VID-171 | Overlay blend modes (basic) | P2 | VID-170 | |
| VID-172 | Original sticker pack (optional) | P2 | VID-170 | You create assets |

---

## E18 — Performance

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-180 | Proxy/low-res scrub path | P1 | VID-054 | |
| VID-181 | Virtualize timeline/media lists | P1 | VID-023, VID-030 | |
| VID-182 | Memory budget + warnings | P1 | VID-027 | |
| VID-183 | Export worker off main thread | P1 | VID-090 | |
| VID-184 | Perf budget doc (target devices) | P2 | VID-180 | |

---

## E19 — Marketing site (Astro)

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-190 | Astro landing (features, CTA → editor) | P2 | VID-003 | Free host |
| VID-191 | Privacy + terms pages | P0 | VID-190 or app routes | Needed for release |
| VID-192 | Screenshots / demo GIF (your builds) | P2 | VID-090 | |

---

## E20 — Deploy & release

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-200 | GitHub repo + branch protection (manual by you) | P0 | VID-001 | You run git/push |
| VID-201 | Vercel free project wiring | P0 | VID-015 | |
| VID-202 | Production build green | P0 | VID-201 | |
| VID-203 | Preview deployments per PR | P1 | VID-201 | |
| VID-204 | CI: lint + typecheck + unit smoke | P1 | VID-200 | |
| VID-205 | Versioning + changelog | P2 | VID-202 | |

---

## E21 — QA & accessibility

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-210 | Chrome/Edge smoke checklist | P0 | VID-090 | Primary |
| VID-211 | Firefox/Safari known limits doc | P1 | VID-210 | Codecs differ |
| VID-212 | Keyboard-only edit path | P1 | VID-111 | |
| VID-213 | Contrast / focus states | P1 | VID-003 | |
| VID-214 | E2E happy path (import→cut→export) | P1 | VID-090 | Playwright free |

---

## E22 — Legal & privacy

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-220 | Preserve MIT + third-party notices | P0 | VID-005 | |
| VID-221 | No CapCut assets/trademarks/code | P0 | — | Ongoing rule |
| VID-222 | Privacy: local-first statement | P0 | VID-191 | |
| VID-223 | License check before shipping templates/models | P0 | VID-121, VID-172 | Whisper/models OK? |

---

## E23 — Templates (original)

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-230 | Template format (project JSON + placeholders) | P2 | VID-100 | |
| VID-231 | 3–5 starter templates (Shorts/Reels/Talking-head) | P2 | VID-230 | Original |
| VID-232 | Template picker UI | P2 | VID-231 | |

---

## E24 — PWA / offline

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-240 | PWA manifest + install | P2 | VID-202 | |
| VID-241 | Service worker for shell assets | P2 | VID-240 | Not media cache by default |
| VID-242 | Offline edit when project local | P2 | VID-100, VID-241 | |

---

## E25 — Desktop (optional)

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-250 | Evaluate classic GPUI desktop vs Tauri wrap | P3 | MVP done | Decision only |
| VID-251 | Desktop packaging if chosen | P3 | VID-250 | |

---

## E26 — Mobile wrap (optional)

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-260 | Evaluate TWA / Capacitor for Android | P3 | VID-202 | Web-first still |
| VID-261 | Touch timeline gestures | P3 | VID-260 | |

---

## E27 — Differentiation

| ID | Ticket | Priority | Depends | Notes |
|----|--------|----------|---------|-------|
| VID-270 | Scripting/API for batch cuts (your design) | P2 | VID-090 | Inspired by Concat MCP idea — own impl |
| VID-271 | Headless export page/worker | P3 | VID-270 | |
| VID-272 | Plugin hook points (MIT-safe) | P3 | rewrite learnings | Optional |

---

## MVP slice (ship first)

Do these epics in order:

1. **E01 → E02 → E20** (repo, free stack, deploy)  
2. **E03 → E04 → E05 → E06 → E07 → E08 → E09 → E10 → E11** (core editor)  
3. **E22** (legal) concurrent with above  
4. Then **E12–E17**, **E18**, **E21**  
5. Then **E19**, **E23**, **E24**, **E27**  
6. **E25/E26** only if needed  

**MVP definition of done:** Guest opens site → new 9:16 project → import clip → trim/split → text → export MP4 → no account → no paid services → MIT attribution present.

---

## Explicitly out of scope

- CapCut APK reverse / subscription unlock / asset theft  
- Copying Concat AGPL code into this MIT tree  
- Paid cloud render / paid TTS / paid stock libraries (unless later budget)  

---

## Suggested first sprint (2 weeks)

| Day focus | Tickets |
|-----------|---------|
| 1–2 | VID-001–006, VID-010–015 |
| 3–5 | VID-020–025, VID-030–037, VID-050–051 |
| 6–8 | VID-060–064, VID-070–071, VID-080–081, VID-100–104 |
| 9–11 | VID-090–093, VID-110–111 |
| 12–14 | VID-200–202, VID-210, VID-220–222, smoke demo |

---

*Source bases: OpenCut classic feature docs (timeline, keyframes, effects-renderer) + CapCut-like feature checklist for parity planning. Concat used only as a feature checklist, not as a code source.*
