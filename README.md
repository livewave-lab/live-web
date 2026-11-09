# live-web

Mobile-first live streaming website with Douyin-style live rooms.

## Status
**Demo / prototype** (2026-11-09). The `demo/` folder is a clickable prototype with sample data, used to agree on the UI before building the production app.

- Live preview: open `demo/index.html` in a browser (no server needed)
- Production app (Nuxt 3 + TypeScript) will be added in this repository next

## Demo features
- Feed with two states, copied from Douyin:
  - **Preview** (browsing): full-screen 9:16 canvas, host and title, "Tap to enter live room". No chat, no viewer count.
  - **Entered**: host bar, follow, viewer avatars and online count, chat, bottom bar (say something, emoji, data, like, share). Swiping moves to the next room.
- The stream canvas is always vertical 9:16; streamers compose it in OBS (match + camera, match only, or camera only).
- Match data sheet: overview, lineups, head-to-head, form, standings.
- "Live discovery" panel: live hosts row and category chips.

## Structure
```
demo/
├── index.html
├── img/logo.png
├── css/style.css          layout and live room
├── css/match-sheet.css    match data sheet
└── js/
    ├── icons.js           inline SVG icons
    ├── i18n.js            UI text (EN default, ZH for internal review)
    ├── mock-data.js       sample rooms and chat lines
    ├── match-data.js      sample match data (production: TheSports API)
    ├── stage.js           9:16 canvas placeholder (production: Tencent Cloud player)
    ├── match-sheet.js     match data sheet
    └── app.js             feed, preview/entered states, chat, interactions
```
Scripts load in order with plain `<script>` tags (no modules), so the demo opens from the file system.

## Planned production stack
- Nuxt 3 + TypeScript (server-side rendering for SEO)
- Tencent Cloud live streaming (LEB) and IM for chat
- TheSports API for match data
- Supabase for members and database
- Claude API for AI match previews

## Security
Never commit secrets. API keys and passwords go in `.env` (ignored by git); `.env.example` lists the variable names only.
