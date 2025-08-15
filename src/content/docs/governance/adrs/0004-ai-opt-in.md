---
title: "ADR-0004: AI Layer Opt-In"
description: All artificial-intelligence features are disabled by default; users must explicitly enable them.
status: ✅ Accepted
date: 2025-08-16
deciders: benitoanagua, alice-dev, carlos-llama
---

# ADR-0004 — AI Layer Opt-In

---

## Context

Educators operate under strict privacy regulations (GDPR, FERPA).  
Cloud AI services (OpenAI, Anthropic, etc.) can leak sensitive data **unless** users opt in.

---

## Decision

We will implement an **opt-in AI layer** with a **tiered provider model**:

| Tier          | Provider                        | Data Flow                           | Enabled By                                  |
| ------------- | ------------------------------- | ----------------------------------- | ------------------------------------------- |
| **0 - Null**  | none                            | **zero outbound calls**             | default                                     |
| **1 - Local** | `llama.cpp` via LLamaSharp WASM | **runs entirely on device**         | env var `AI_PROVIDER=local`                 |
| **2 - Cloud** | OpenAI, Anthropic, etc.         | **HTTPS only; user-controlled key** | env var `AI_PROVIDER=openai` + `AI_API_KEY` |

---

## Configuration API

```jsonc
// appsettings.json (Edge) or Helm values (Full)
"AI": {
  "Provider": "null",         // "null" | "local" | "openai" | "anthropic"
  "ApiKey": null,             // required for cloud tiers
  "LocalModelPath": "./models/llama-3-8b-q4.gguf"
}
```

---

## UI / UX Flow

| Step                 | UI State                                                              |
| -------------------- | --------------------------------------------------------------------- |
| 1. First boot        | Toggle **disabled**, copy explains privacy                            |
| 2. User flips toggle | Reveal **provider selector** + **key field**                          |
| 3. Confirm           | **Encrypted** key stored in `localStorage` (Edge) or **vault** (Full) |

---

## Technical Safeguards

| Safeguard               | Implementation                                                         |
| ----------------------- | ---------------------------------------------------------------------- |
| **No silent fallbacks** | If tier > 0 and key absent → **hard error**                            |
| **Audit trail**         | `POST /api/ai/enrich` logs **provider + timestamp**, **never prompts** |
| **Revoke**              | One-click **Delete key & restart** resets to tier 0                    |

---

## Example Usage

### 1. Local LLM (tier 1)

```bash
export AI_PROVIDER=local
export AI_MODEL_PATH=./models/llama-3-8b-q4.gguf
./uma
```

Payload stays **entirely on device**.

### 2. Cloud LLM (tier 2)

```bash
export AI_PROVIDER=openai
export AI_API_KEY=sk-xxx
./uma
```

Prompts sent **only** to OpenAI; **never logged** by our servers.

---

## Consequences

| Pros                                               | Cons / Mitigation                                                      |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| ✅ GDPR/FERPA compliant by default                 | ⚠️ Slightly longer onboarding (mitigated by copy + tooltips)           |
| ✅ Users keep full control                         | ⚠️ Local tier increases binary size (model is optional download)       |
| ✅ Zero outbound traffic unless explicitly enabled | ⚠️ Cloud tier requires user key management (docs + vault integrations) |

---

## Compliance Checklist

| Item                                    | Status | PR                                                       |
| --------------------------------------- | ------ | -------------------------------------------------------- |
| `AIProvider` enum + null-object pattern | ✅     | [#120](https://github.com/UmaUpbeat/uma-upbeat/pull/120) |
| UI toggle & consent screen              | ✅     | [#121](https://github.com/UmaUpbeat/uma-upbeat/pull/121) |
| Audit logging middleware                | ✅     | [#122](https://github.com/UmaUpbeat/uma-upbeat/pull/122) |

---

> Decision locked; supersede only via a new ADR.
