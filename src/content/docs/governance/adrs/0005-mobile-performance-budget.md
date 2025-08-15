---
title: "ADR-0005: Mobile Performance Budget"
description: A hard cap on bundle size, runtime cost, and frame rate for all interactive experiences on mobile.
status: ✅ Accepted
date: 2025-08-16
deciders: benitoanagua, perf-team, ux-team
---

# ADR-0005 — Mobile Performance Budget

---

## Context

Teachers often run sessions on **2019-era Android handsets** (Moto G7, Galaxy A20) with:

- 3 GB RAM
- Snapdragon 632 / Mali-G71 GPU
- 3 G or spotty Wi-Fi

We must guarantee **smooth UX** without excluding low-end users.

---

## Decision

We enforce a **strict budget** across the _interactive layer_ (everything delivered to the browser after initial HTML):

| Metric                 | Limit                            | Enforcement                       |
| ---------------------- | -------------------------------- | --------------------------------- |
| **Compressed payload** | **≤ 3 MB** (gzip/brotli)         | CI fails build if larger          |
| **First paint**        | **≤ 2 s** on 3G (Fast 3G preset) | Lighthouse CI gate                |
| **Frame rate**         | **60 fps** median on Moto G7     | Chrome trace in CI                |
| **Max RAM**            | **≤ 120 MB** during quiz session | `performance.measure()` telemetry |

---

## Budget Breakdown (Illustrative)

| Asset             | Max Size   | Technique                      |
| ----------------- | ---------- | ------------------------------ |
| Core JS bundle    | 150 kB     | Tree-shaken Svelte + Vite      |
| Game engine       | 200 kB     | PixiJS micro-build             |
| Sprites atlas     | 500 kB     | 1 × 2048×2048 PNG, 256 sprites |
| Sounds            | 200 kB     | 10 × 1-sec Ogg @ 48 kbps       |
| CSS + fonts       | 200 kB     | Tailwind JIT + WOFF2 subset    |
| **Total gzipped** | **≤ 3 MB** | CI budget script               |

---

## Runtime Guardrails

| Area              | Rule               | Tooling                               |
| ----------------- | ------------------ | ------------------------------------- |
| **Draw calls**    | ≤ 20 per frame     | SpectorJS + CI trace                  |
| **JS heap**       | ≤ 80 MB steady     | Chrome DevTools snapshot on PR        |
| **Battery**       | No > 2 % drain/min | Web Vitals + `navigator.getBattery()` |
| **Touch targets** | ≥ 48 × 48 px       | axe-core lint                         |

---

## CI & QA Gates

```yaml
# .github/workflows/perf.yml
- name: Build & measure
  run: |
    npm run build
    npm run budget        # 3 MB gate
    npm run lighthouse    # 2 s / 60 fps gate
```

Thresholds are **hard fails**; PR cannot merge.

---

## Graceful Degradation

| Device Capability | Fallback                 |
| ----------------- | ------------------------ |
| WebGL disabled    | CSS 3-D transforms only  |
| < 2 GB RAM        | Auto-lock to 30 fps      |
| Slow CPU          | Disable particle effects |

---

## Consequences

| Pros                               | Cons / Mitigation                                     |
| ---------------------------------- | ----------------------------------------------------- |
| ✅ Runs on 4-year-old phones       | ⚠️ Limits fancy WebGL (mitigated by CSS fallbacks)    |
| ✅ Fast initial load in classrooms | ⚠️ Designers must optimise assets (automated tooling) |
| ✅ Predictable performance         | ⚠️ New features need budget approval (RFC + CI)       |

---

## Compliance Checklist

| Item                             | Status | PR                                                       |
| -------------------------------- | ------ | -------------------------------------------------------- |
| Budget script (`npm run budget`) | ✅     | [#130](https://github.com/UmaUpbeat/uma-upbeat/pull/130) |
| Lighthouse CI gate               | ✅     | [#131](https://github.com/UmaUpbeat/uma-upbeat/pull/131) |
| Moto G7 trace baseline           | ✅     | [#132](https://github.com/UmaUpbeat/uma-upbeat/pull/132) |

---

> Decision locked; supersede only via a new ADR.
