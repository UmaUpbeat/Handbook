---
title: Principles
description: The ten non-negotiable rules that every line of code, issue and release must respect — with rationale and bite-sized examples.
sidebar:
  label: Principles
  order: 2
---

# ⚖️ Principles

> “Rules are guard-rails, not cages.”

These ten principles are **ranked**.  
Lower-numbered principles **override** higher-numbered ones in case of conflict.  
Nothing is merged unless it passes **all ten gates**.

---

## P1 – Absolute Freedom 🔓

**AGPL-3.0 only.**  
No dual licence, no closed-source core, no “enterprise edition”.

> ❌ **Rejected**: “Let’s add a paid plug-in store in the core repo.”  
> ✅ **Accepted**: “Keep the store in a separate MIT repo that _imports_ the AGPL core.”

---

## P2 – Zero-Config Dual Runtime ⚙️

A single artefact must start in **two modes** with **zero edits**.

| Mode     | Trigger                         | Storage                              |
| -------- | ------------------------------- | ------------------------------------ |
| **Full** | `POSTGRES_URL` env var detected | PostgreSQL + Redis                   |
| **Edge** | No env var                      | `./data/*.json` or SQLite in-process |

> **Test**
>
> ```bash
> # Full
> POSTGRES_URL=postgres://u:p@db/quiz ./uma
>
> # Edge
> ./uma          # ← same binary
> ```

---

## P3 – Text-First Contract 📝

Any UTF-8 block prefixed with `@OPENQUIZ` must **round-trip** losslessly.

Copy-paste example (works in email, chat, GitHub issue):

```

@OPENQUIZ
title: Capitals
shuffle: true
pin: DEMO

# Capital of Spain?

- Madrid
- Barcelona
- Valencia

```

Import endpoint:

```bash
curl -X POST /api/import/text -d "@OPENQUIZ\ntitle:Capitals..."
# → 200 OK { roomId: "DEMO" }
```

---

## P4 – Privacy by Default 🛡️

AI, telemetry or external calls default to **OFF**.

| Setting             | Default  | Override                |
| ------------------- | -------- | ----------------------- |
| `AI.Provider`       | `"null"` | `"local"` or `"openai"` |
| `Telemetry.Enabled` | `false`  | `true` via env var      |

> ❌ **Rejected**: “Send user answers to improve our cloud model by default.”  
> ✅ **Accepted**: “Add a toggle defaulted to OFF with clear consent copy.”

---

## P5 – Mobile-First Performance Budget 📱

Interactive layer (scripts + assets) **≤ 3 MB gzipped**, **60 fps** on 2019 mid-tier ARM.

| Asset                | Size          | Note                 |
| -------------------- | ------------- | -------------------- |
| `interactive.min.js` | 110 kB        | Svelte bundle        |
| `sprites.atlas.png`  | 400 kB        | 1 atlas, 256 sprites |
| `sounds.webm`        | 120 kB        | 10 SFX clips         |
| **Total**            | **630 kB ✅** | Still < 3 MB         |

---

## P6 – Single-Command Deploy 🚀

Entire stack starts in **≤ 30 s** with **one** command or double-click.

| Path   | Command                 | Time               |
| ------ | ----------------------- | ------------------ |
| Docker | `docker compose up`     | 27 s (CI average)  |
| Native | `./uma` (static binary) | 2.8 s (cold start) |

---

## P7 – Accessibility & Open Standards ♿

WCAG 2.1 AA, semantic HTML, open protocols (REST, GraphQL, WebSocket).

```html
<button role="button" aria-label="Start quiz" aria-pressed="false">
  Start
</button>
```

---

## P8 – Hot-Swap Extensibility 🔌

Plugins declare **semver contracts** and load at runtime **without restart**.

Plugin manifest:

```json
{
  "name": "qr-login",
  "version": "2.3.0",
  "contracts": ["auth@^1.4"],
  "entry": "./plugins/qr-login/index.js"
}
```

---

## P9 – State Portability 🧳

Any session exports to **≤ 256 KB JSON** and re-imports **bit-perfect**.

```bash
GET /api/rooms/DEMO/export
# 204 kB JSON blob
```

---

## P10 – Transparent Governance 🗳️

- **Public RFCs** in GitHub Discussions
- **Lazy consensus**: 7 days, zero unresolved objections → merge
- **Contributor Covenant 2.1** enforced

### Challenging a Principle

1. Open issue with label `RFC`.
2. Discuss for 7 days.
3. Resolve objections.
4. Merge or close with rationale.

---

> “Principles are the music sheet; the code is the orchestra.”
