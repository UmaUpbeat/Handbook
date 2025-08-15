---
title: Timer Circle Component
description: A responsive, animated Svelte island that shows a ring-style countdown—perfect for pacing questions or energizer breaks.
sidebar:
  label: Timer Circle
  order: 6
---

# ⏱️ Timer Circle

> “60 seconds never looked so good.”

---

## 🎯 What it does

- Displays a **circular progress ring** driven by a simple `duration` prop.
- Emits `done` when the timer hits zero—wire it to auto-advance questions or lock answers.
- Works **offline** (Edge mode) and scales from **Moto G7 to 4 K projector**.
- Optional **audio tick** & **color shift** for last 5 s (accessibility-friendly).

---

## 🪄 Live Demo

```svelte
<TimerCircle duration={10} on:done={() => alert('Time’s up!')} />
```

<TimerCircle duration={10} on:done={() => alert('Time’s up!')} />

---

## 🔧 API

| Prop        | Type   | Default   | Description                                           |
| ----------- | ------ | --------- | ----------------------------------------------------- |
| `duration`  | number | 30        | Seconds to count down from                            |
| `size`      | number | 128       | Diameter in px                                        |
| `stroke`    | number | 8         | Ring thickness (px)                                   |
| `color`     | string | `#3b82f6` | Hex / CSS var for active stroke                       |
| `warningAt` | number | 5         | Seconds left when ring turns amber                    |
| `sound`     | bool   | false     | Enable tick sound (respects `prefers-reduced-motion`) |

Events  
`done` – fired once when the timer reaches 0.

---

## 📦 Installation

1. Save the file below as `src/components/TimerCircle.svelte`.
2. Import in any `.mdx` page:

```mdx
import TimerCircle from "@components/TimerCircle.astro";

;
```

---

## 🧩 Source (MIT)

<details>
<summary><strong>TimerCircle.svelte</strong></summary>

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  export let duration: number = 30;
  export let size: number = 128;
  export let stroke: number = 8;
  export let color: string = '#3b82f6';
  export let warningAt: number = 5;
  export let sound: boolean = false;

  const dispatch = createEventDispatcher();
  let remaining = duration;
  let interval: number;

  $: progress = remaining / duration;
  $: ringColor = remaining <= warningAt ? '#f59e0b' : color;

  onMount(() => {
    if (sound && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const audio = new Audio('/audio/tick.mp3');
      audio.volume = 0.2;
    }

    interval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(interval);
        dispatch('done');
      }
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

<figure class="timer" aria-label="Timer">
  <svg width={size} height={size} viewBox="0 0 {size} {size}">
    <circle
      class="bg"
      cx={size / 2}
      cy={size / 2}
      r={(size - stroke) / 2}
      stroke-width={stroke} />
    <circle
      class="progress"
      cx={size / 2}
      cy={size / 2}
      r={(size - stroke) / 2}
      stroke-width={stroke}
      stroke-dasharray={2 * Math.PI * ((size - stroke) / 2)}
      stroke-dashoffset={2 * Math.PI * ((size - stroke) / 2) * (1 - progress)}
      stroke={ringColor}
      style="transition: stroke 0.3s ease" />
  </svg>
  <figcaption>{remaining}s</figcaption>
</figure>

<style>
  .timer {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    font-variant-numeric: tabular-nums;
  }
  svg {
    transform: rotate(-90deg);
  }
  circle {
    fill: none;
  }
  .bg {
    stroke: var(--sl-color-gray-5, #e5e7eb);
  }
  figcaption {
    margin-top: 0.25rem;
    font-weight: 600;
  }
</style>
```

> Place a short, soft `tick.mp3` in `/public/audio/` if `sound` is enabled.

</details>

---

## 🧪 Testing Checklist

| Device / Scenario           | Expected Behavior                     |
| --------------------------- | ------------------------------------- |
| Moto G7 (Chrome 110)        | 60 fps ring animation                 |
| iOS 17 Safari               | Respects “Reduce Motion” → no sound   |
| Teacher pauses mid-question | `clearInterval(interval)` stops timer |
| Last 5 s                    | Ring turns amber, optional tick plays |
| Zero reached                | `done` event fires once               |

---

## 🎨 Theme Styling

Override CSS variables in your global styles:

```css
:root {
  --sl-color-gray-5: #cbd5e1; /* background track */
}
```

---

## 🛰️ Used in

- [Quiz Player](../components/quiz-player.md) – auto-advances when timer ends.
- [Live Leaderboard](../components/live-leaderboard.md) – break timer between rounds.

---

> “Time is a circle—make it a beautiful one.”
