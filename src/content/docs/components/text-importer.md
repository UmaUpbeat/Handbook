---
title: TextImporter Component
description: Drag-and-drop or paste an @OPENQUIZ block and instantly preview + export valid JSON.
sidebar:
  label: TextImporter
  order: 3
---

# 📝 TextImporter

A **zero-config importer** that converts plain-text `@OPENQUIZ` blocks into validated JSON—**< 1.1 KB gzipped**.

<ClientOnly>
  <TextImporter client:visible />
</ClientOnly>

---

## 🚀 Quick Start

```mdx
import TextImporter from "@components/TextImporter.svelte";

<TextImporter client:load onParsed={(e) => console.log(e.detail)} />
```

---

## ⚙️ Props

| Prop          | Type    | Default                 | Description         |
| ------------- | ------- | ----------------------- | ------------------- |
| `placeholder` | string  | "Paste @OPENQUIZ here…" | Empty-state text    |
| `strict`      | boolean | true                    | Reject unknown keys |

---

## 🎁 Events

| Event    | Detail                 | Fired when         |
| -------- | ---------------------- | ------------------ |
| `parsed` | `{ json, errors }`     | Valid parse        |
| `error`  | `{ errors: string[] }` | Validation failure |

---

## 🧩 Live Example (Vanilla)

```html
<script type="module">
  import "https://esm.sh/@umaupbeat/components/TextImporter.js";

  const el = document.createElement("text-importer");
  el.addEventListener("parsed", (e) => {
    fetch("/api/v1/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(e.detail.json),
    });
  });
  document.body.appendChild(el);
</script>
```

---

## 📥 Accepts

- **Plain text** with `@OPENQUIZ` sigil
- **File drop** (`.txt`, `.md`)
- **Paste** from clipboard (auto-detects UTF-8)

Example input

```
@OPENQUIZ
title: Quick Check
shuffle: true

# Capital of Spain?
- Madrid
- Barcelona
- Valencia
0
```

---

## 🎨 Styling

```css
text-importer {
  --border: #ccc;
  --bg-error: #ffeaea;
  --font-mono: "Fira Code", monospace;
}
```

---

## 🔗 API Fallback

If you only need the parser without UI:

```ts
import { parseOpenQuiz } from "@umaupbeat/components/lib/textImporter.js";
const result = parseOpenQuiz(text);
```

---

## 🗂️ Location

```
src/components/TextImporter.svelte
```

Copy, paste, teach—zero friction.
