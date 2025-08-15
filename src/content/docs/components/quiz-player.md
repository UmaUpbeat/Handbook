---
title: QuizPlayer Component
description: Drop-in, 60 fps interactive quiz widget that connects to any room.
sidebar:
  label: QuizPlayer
  order: 1
---

# 🎯 QuizPlayer

A **self-contained quiz session** that joins a room, renders questions, collects answers, and shows results—**< 2.3 KB gzipped**.

<ClientOnly>
  <QuizPlayer client:load roomCode="DEMO" />
</ClientOnly>

---

## 🚀 Quick Start

```mdx
---
title: Live Demo
---

import QuizPlayer from "@components/QuizPlayer.svelte";

<QuizPlayer client:load roomCode="ABCD" autoStart={false} />
```

---

## ⚙️ Props

| Prop        | Type    | Default | Description                 |
| ----------- | ------- | ------- | --------------------------- |
| `roomCode`  | string  | —       | 4-6 char room code          |
| `autoStart` | boolean | false   | Auto-join on mount          |
| `theme`     | string  | "auto"  | "light" \| "dark" \| "auto" |

---

## 🧩 Events

| Event      | Detail                            | Fired when               |
| ---------- | --------------------------------- | ------------------------ |
| `ready`    | `{ room }`                        | Successfully joined room |
| `answered` | `{ questionId, correct, points }` | User submits an answer   |
| `finished` | `{ leaderboard }`                 | Host closed the room     |

---

## 📦 Usage Example (React)

```tsx
import { useRef, useEffect } from "react";
import "@umaupbeat/components/QuizPlayer"; // web-component build

export default function Page() {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.addEventListener("finished", (e) => {
      console.table(e.detail.leaderboard);
    });
  }, []);

  return <quiz-player ref={ref} roomCode="MATH101" />;
}
```

---

## 🎨 Styling

All visuals use **CSS custom properties**:

```css
quiz-player {
  --bg: #111;
  --primary: #00b894;
  --font-size: 1.125rem;
}
```

---

## 🔐 Auth

Component requests a **participant token** automatically via  
`POST /api/v1/rooms/{code}/token`.

---

## 🗂️ File Reference

```
src/components/QuizPlayer.svelte
├── lib/api.ts          // thin fetch wrapper
├── lib/roomStore.ts    // Svelte store
└── QuizPlayer.svelte   // main component
```

---

> Copy the snippet above and you’ve got a live quiz in any HTML page.
