---
title: LiveLeaderboard Component
description: Real-time, 60 fps scoreboard that updates via WebSocket.
sidebar:
  label: LiveLeaderboard
  order: 2
---

# 🏆 LiveLeaderboard

A **real-time scoreboard** that subscribes to `leaderboardUpdated` events and re-renders rows at 60 fps—**< 0.8 KB gzipped**.

<ClientOnly>
  <LiveLeaderboard client:load roomCode="DEMO" />
</ClientOnly>

---

## 🚀 Quick Start

```mdx
import LiveLeaderboard from "@components/LiveLeaderboard.svelte";

<LiveLeaderboard client:load roomCode="ABCD" />
```

---

## ⚙️ Props

| Prop       | Type   | Default | Description                 |
| ---------- | ------ | ------- | --------------------------- |
| `roomCode` | string | —       | Room to watch               |
| `maxRows`  | number | 10      | Truncate list after N rows  |
| `theme`    | string | "auto"  | "light" \| "dark" \| "auto" |

---

## 🎨 Styling Slots

```css
live-leaderboard {
  --bg: #1e1e2f;
  --primary: #00b894;
  --row-height: 3rem;
}
```

---

## 🧩 Events

| Event    | Detail                  | Fired when       |
| -------- | ----------------------- | ---------------- |
| `update` | `{ players: Player[] }` | Any score change |

---

## 📦 Vanilla JS Example

```html
<script type="module">
  import "https://esm.sh/@umaupbeat/components/LiveLeaderboard.js";

  const board = document.createElement("live-leaderboard");
  board.roomCode = "CHEM202";
  board.maxRows = 5;
  document.body.appendChild(board);
</script>
```

---

## 🔧 WebSocket Details

Connects to  
`wss://host/hubs/room?room={code}&token={jwt}`  
and listens for `leaderboardUpdated`.

---

## 🗂️ Source

```
src/components/LiveLeaderboard.svelte
```

Drop it anywhere—no build step required.
