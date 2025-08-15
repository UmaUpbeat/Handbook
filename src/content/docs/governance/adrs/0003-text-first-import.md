---
title: "ADR-0003: Text-First Import Format"
description: A human-readable plain-text block that can be pasted anywhere and turned into a live quiz or poll without extra tooling.
status: ✅ Accepted
date: 2025-08-16
deciders: benitoanagua, alice-dev, mario-ling
---

# ADR-0003 — Text-First Import Format

---

## Context

Teachers share activities via email, chat, or forums.  
We need a **zero-friction** way to import content:

- No CSV or JSON editors
- Works offline
- Readable **even if the parser fails**

---

## Decision

Adopt a **lightweight plain-text format** triggered by the reserved sigil `@OPENQUIZ`.

### 1. File Signature

Every block **MUST** start with:

```
@OPENQUIZ
```

### 2. Front-matter Keys (YAML-like)

| Key        | Type                        | Description        | Required             |
| ---------- | --------------------------- | ------------------ | -------------------- |
| `title`    | string                      | Session title      | ✅                   |
| `language` | ISO code                    | Content language   | ❌ (default `en`)    |
| `type`     | `quiz` \| `poll` \| `flash` | Session type       | ✅                   |
| `shuffle`  | boolean                     | Randomise order    | ❌ (default `false`) |
| `pin`      | string 4-6 chars            | Room code override | ❌ (auto-generated)  |

### 3. Question Body

Each question starts with `#` followed by the prompt.  
Question types are inferred from the **first block**:

| Type                | Syntax                                       | Example                                               |
| ------------------- | -------------------------------------------- | ----------------------------------------------------- |
| **Multiple-choice** | `# question`<br>`- option 1`<br>`- option 2` | `# Capital of Spain?`<br>`- Madrid`<br>`- Barcelona`  |
| **True/False**      | `# statement`<br>`- True`<br>`- False`       | `# SignalR uses WebSockets?`<br>`- True`<br>`- False` |
| **Scale**           | `# prompt`<br>`scale: 1-5`                   | `# Rate your confidence`<br>`scale: 1-5`              |
| **Short-answer**    | `# prompt`                                   | `# Name the inventor of WWW`                          |

### 4. Correct Answer Markers

- Multiple-choice: **index** (0-based) on a new line
  ```
  # Capital of Spain?
  - Madrid
  - Barcelona
  - Valencia
  0
  ```
- True/False: `true` or `false`
- Scale / short-answer: **no marker** (manual grading).

---

## Parser Rules (Reference Implementation)

| Rule                | Behavior                  |
| ------------------- | ------------------------- |
| **Sigil detection** | Regex `^\s*@OPENQUIZ\s*$` |
| **Front-matter**    | YAML subset via `js-yaml` |
| **Encoding**        | UTF-8 only                |
| **Max size**        | 256 KB (prevents DoS)     |
| **Backward compat** | Unknown keys ignored      |

---

## Live Example

Copy-paste into the import box:

```
@OPENQUIZ
title: Quick Chemistry Check
language: es
type: quiz
shuffle: true
pin: QUIM

# ¿Cuál es el símbolo del Agua?
- H2O
- CO2
- NaCl
0

# ¿El helio es un gas noble?
- Verdadero
- Falso
true
```

API response:

```json
{
  "roomId": "QUIM",
  "title": "Quick Chemistry Check",
  "questions": [
    {
      "text": "¿Cuál es el símbolo del Agua?",
      "type": "MC",
      "options": ["H2O", "CO2", "NaCl"],
      "correct": 0
    },
    { "text": "¿El helio es un gas noble?", "type": "TF", "correct": true }
  ]
}
```

---

## Consequences

| Pros                              | Cons / Mitigation                                                          |
| --------------------------------- | -------------------------------------------------------------------------- |
| ✅ Works in emails, chat, GitHub  | ⚠️ No rich media (images, audio) – _future enhancement via URL references_ |
| ✅ Human-readable if parser fails | ⚠️ No inline formatting – _use Markdown in question text_                  |
| ✅ Zero tooling for authors       | ⚠️ Ambiguity risk – _strict linter in CI_                                  |

---

## Compliance Checklist

| Item                          | Status | PR / Commit                                              |
| ----------------------------- | ------ | -------------------------------------------------------- |
| Parser regex + YAML loader    | ✅     | [#101](https://github.com/UmaUpbeat/uma-upbeat/pull/101) |
| 256 KB limit & error handling | ✅     | [#102](https://github.com/UmaUpbeat/uma-upbeat/pull/102) |
| CLI linter `pnpm lint:text`   | ✅     | [#103](https://github.com/UmaUpbeat/uma-upbeat/pull/103) |

---

> Decision locked; supersede only via a new ADR.
