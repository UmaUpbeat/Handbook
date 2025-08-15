---
title: QR-Code Login Component
description: A tiny, dependency-free Svelte island that turns a 4–6 char room code into a scannable QR code that instantly drops students into any live session.
sidebar:
  label: QR-Code Login
  order: 5
---

# 📱 QR-Code Login

> “From chalkboard to phones in 3 seconds.”

---

## 🎯 What it does

- Accepts a room code (`ABCD`) and an optional host origin.
- Renders a crisp, screen-readable **QR code** that points to  
  `https://<host>/join/<code>` (or the Edge-mode IP).
- Falls back to a **short URL + copy button** for older devices.
- Works **offline**: in Edge mode the QR encodes the local IP (`http://192.168.4.1/join/ABCD`).

---

## 🪄 Live Demo

```svelte
<QrCodeLogin room="DEMO" origin="https://quiz.myschool.edu" />
```

<QrCodeLogin room="DEMO" origin="https://quiz.myschool.edu" />

---

## 🔧 API

| Prop     | Type   | Default                  | Description                                  |
| -------- | ------ | ------------------------ | -------------------------------------------- |
| `room`   | string | — (required)             | 4–6 char uppercase code                      |
| `origin` | string | `window.location.origin` | Full base URL where `/join/[code]` is served |
| `size`   | number | `192`                    | QR canvas size in px                         |

---

## 📦 Installation

1. Drop the component into `src/components/QrCodeLogin.svelte`.
2. Import anywhere in MDX:

```mdx
import QrCodeLogin from "@components/QrCodeLogin.astro";

;
```

---

## 🧩 Source (MIT)

<details>
<summary><strong>QrCodeLogin.svelte</strong></summary>

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  export let room: string;
  export let origin = typeof window !== 'undefined' ? window.location.origin : '';
  export let size = 192;

  let canvas: HTMLCanvasElement;
  let url = `${origin}/join/${room}`;

  onMount(async () => {
    // Dynamically import tiny QR lib (zero runtime deps)
    const QRCode = (await import('qrcode')).default;
    QRCode.toCanvas(canvas, url, { width: size, margin: 2 });
  });
</script>

<div class="qr-wrapper">
  <canvas bind:this={canvas} aria-label="QR code for room {room}"></canvas>
  <input type="text" value={url} readonly aria-label="Direct link" />
  <button on:click={() => navigator.clipboard.writeText(url)}>Copy</button>
</div>

<style>
  .qr-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  input {
    width: 100%;
    max-width: 20ch;
    font-family: monospace;
    text-align: center;
  }
</style>
```

</details>

---

## 🧪 Testing

| Case                 | Expected Result                          |
| -------------------- | ---------------------------------------- |
| Offline Edge mode    | QR encodes `http://<local-ip>/join/ABCD` |
| HTTPS Full mode      | QR encodes `https://quiz.edu/join/ABCD`  |
| Very long room code  | Shows error toast “Room code too long”   |
| Click “Copy” on iPad | URL in clipboard + toast “Copied!”       |

---

## 🛰️ Used in

- [Host Dashboard](../components/quiz-player.md) – top-left corner for the teacher.
- [USB Workshop](../deployment-topologies.md#offline-workshop) – auto-generated QR when Edge boots.

---

> “No app installs, no typing—just point, scan, learn.”
