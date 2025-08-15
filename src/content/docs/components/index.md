---
title: Components Overview
description: Drop-in Svelte islands you can copy, remix, and embed anywhere.
sidebar:
  label: Overview
  order: 0
---

# 🧩 Components Overview

Welcome to the **live component gallery** for Uma Upbeat.  
Every widget here is a self-contained **Svelte island** that ships < 3 KB gzipped, runs at 60 fps on a 2019 Android, and can be pasted straight into any Astro/MDX page or external site.

---

## 🚀 One-Minute Start

```mdx
---
title: My Page
---

import QuizPlayer from "@components/QuizPlayer.svelte";

<QuizPlayer client:load roomCode="DEMO" />
```

That’s it—no build steps, no npm installs.

---

## 📦 What You’ll Find

| Component                              | Purpose                       | Bundle Size |
| -------------------------------------- | ----------------------------- | ----------- |
| [Quiz Player](./quiz-player)           | Full interactive quiz session | 2.3 KB      |
| [Live Leaderboard](./live-leaderboard) | Real-time scoreboard          | 0.8 KB      |
| [Text Importer](./text-importer)       | Paste `@OPENQUIZ` → JSON      | 1.1 KB      |
| [QR Code Login](./qrcode-login)        | One-tap room join via QR      | 0.6 KB      |
| [Timer Circle](./timer-circle)         | 60 fps countdown ring         | 0.4 KB      |
| [Building Islands](./building-islands) | Authoring guide & specs       | —           |

---

## 🎯 Typical Use-Cases

- **Docs & Demos** – embed live quizzes inside this handbook.
- **LMS Plug-ins** – drop an island into Canvas, Moodle, or Google Classroom.
- **Conference Booths** – USB-sticks with offline Edge mode + islands.
- **Custom Themes** – fork any island; styles are CSS custom-properties.

---

## 🧩 Copy-Paste Cheatsheet

```svelte
<!-- QuizPlayer.svelte -->
<script>
  export let roomCode;
</script>

<svelte:head>
  <link rel="stylesheet" href="/components/quiz-player.css" />
</svelte:head>

<div class="quiz-player" data-room={roomCode}>
  <!-- 60 fps logic -->
</div>
```

---

## 📁 Folder Map

```
src/content/docs/components/
├── index.md          ← this page
├── quiz-player.md
├── live-leaderboard.md
├── text-importer.md
├── qrcode-login.md
├── timer-circle.md
└── building-islands.md
```

---

> Ready to remix? Pick an island and ship it in the next 30 seconds.
