---
title: Building Islands
description: Step-by-step guide for creating, shipping, and documenting your own Svelte “islands” inside the Starlight handbook.
sidebar:
  label: Building Islands
  order: 99
---

# 🏝️ Building Islands

> “Turn every demo into deployable reality.”

---

## 🧭 30-Second Map

1. **Create** a `.svelte` file in `src/components/`.
2. **Expose** it via an Astro wrapper (`*.astro`) so Starlight can import it.
3. **Document** it on a new page in `src/content/docs/components/`.
4. **Ship** — zero config; every commit auto-deploys to GitHub Pages.

---

## 1. Scaffolding

```bash
# 1. Create the island
touch src/components/MyIsland.svelte

# 2. (Optional) Astro wrapper
touch src/components/MyIsland.astro
```

> Wrappers are only needed when you want to **pre-props** or **hydrate** with Astro directives.

---

## 2. Svelte Component (Example)

```svelte
<!-- src/components/MyIsland.svelte -->
<script lang="ts">
  export let name = 'World';
</script>

<button on:click={() => alert(`Hi ${name}!`)}>Greet</button>
```

---

## 3. Astro Wrapper (Optional)

```astro
---
// src/components/MyIsland.astro
import MyIsland from './MyIsland.svelte';
export interface Props {
  name?: string;
}
const { name = 'World' } = Astro.props;
---
<MyIsland client:load name={name} />
```

- `client:load` → hydrates on page load.
- Swap to `client:idle` or `client:visible` for lighter pages.

---

## 4. Documenting in MDX

Create `src/content/docs/components/my-island.md`:

```mdx
---
title: My Island
description: Demo of the new greeting button.
---

import MyIsland from "@components/MyIsland.astro";

# My Island

Hello from **interactive land**:

<MyIsland name="Uma" />
```

> `@components` is auto-aliased in `tsconfig.json`.

---

## 5. Styling Guidelines

- Prefer **CSS custom properties** so islands inherit Starlight’s dark/light themes.
- Use `.island-wrapper` class for consistent spacing.

```css
/* src/styles/islands.css */
.island-wrapper {
  margin-block: 1.5rem;
}
```

---

## 6. Props & Slots Cheat-Sheet

| Mechanism       | Works in Svelte | Works in MDX                       |
| --------------- | --------------- | ---------------------------------- |
| Props           | ✅ `export let` | ✅ Astro attr                      |
| Slots           | ✅ `<slot/>`    | ✅ `<MyIsland>fallback</MyIsland>` |
| Events (`on:*`) | ✅              | ✅ via `createEventDispatcher`     |

---

## 7. Type-Safety

Enable strict mode in `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "paths": {
      "@components/*": ["src/components/*"]
    }
  }
}
```

---

## 8. Testing Islands

Run headless in **Vitest** + **jsdom**:

```ts
// src/components/MyIsland.test.ts
import { render, fireEvent } from "@testing-library/svelte";
import MyIsland from "./MyIsland.svelte";

it("greets", async () => {
  const { getByRole } = render(MyIsland, { name: "Ada" });
  await fireEvent.click(getByRole("button"));
  expect(getByRole("button")).toHaveTextContent("Hi Ada!");
});
```

---

## 9. Performance Tips

| Flag             | When to Use                                  |
| ---------------- | -------------------------------------------- |
| `client:idle`    | Heavy island below the fold                  |
| `client:visible` | Carousel, charts that appear on scroll       |
| `client:load`    | Critical UI (quiz timer, live leaderboard)   |
| `client:only`    | Needs third-party libs that break SSR (maps) |

---

## 10. Publishing Checklist

- [ ] Component compiles with `astro check`.
- [ ] Lighthouse score ≥ 95 on mobile.
- [ ] Props documented in JSDoc.
- [ ] Added to `src/content/docs/components/index.md` index.
- [ ] Screenshots/GIFs optimized and placed in `src/assets/`.

---

## 🧩 Starter Generator CLI

Want a one-liner?

```bash
# Copy-paste into root
npm run gen:island TimerCircle --duration=30
# Creates TimerCircle.svelte + docs page stub
```

---

> “An island is just a component with an ocean view.”
