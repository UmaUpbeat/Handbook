---
title: "ADR-0002: Dual Runtime Architecture"
description: One binary, two operational modes—Full (external services) and Edge (zero external deps).
status: ✅ Accepted
date: 2025-08-16
deciders: benitoanagua, jose-armella, marcelo-quispe
---

# ADR-0002 — Dual Runtime Architecture

---

## Context

| Stakeholder           | Need                                       |
| --------------------- | ------------------------------------------ |
| **Classroom teacher** | Run offline from a USB stick               |
| **University IT**     | Scale horizontally with PostgreSQL & Redis |
| **NGOs**              | Deploy in low-bandwidth zones              |
| **DevOps team**       | Single Docker image for both use-cases     |

---

## Decision

We will ship **one executable** that detects its environment at **startup** and chooses between two mutually-exclusive runtimes:

| Runtime  | Detection Rule                 | Storage                     | Services                               |
| -------- | ------------------------------ | --------------------------- | -------------------------------------- |
| **Full** | `POSTGRES_URL` env var present | PostgreSQL + Redis          | SignalR backplane, rate-limit, pub/sub |
| **Edge** | `POSTGRES_URL` **absent**      | SQLite / LiteDB / in-memory | None                                   |

Code sketch:

```csharp
var mode = Environment.GetEnvironmentVariable("POSTGRES_URL") switch
{
    null => RuntimeMode.Edge,
    _  => RuntimeMode.Full
};
services.AddSingleton<IRoomStore>(mode switch
{
    RuntimeMode.Edge => new JsonFileRoomStore(),
    RuntimeMode.Full => new EfRoomStore()
});
```

---

## Implementation Details

1. **Build Flags**

   - `dotnet publish -c Release -r win-x64 --self-contained` → single `uma.exe`.
   - Same binary for `linux-musl-x64`, `osx-x64`, etc.

2. **Data Path**

   - Edge mode writes to `./data/*.json` (git-ignored).
   - Full mode uses mounted volume or cloud DB.

3. **Health Endpoint**
   - `GET /healthz` returns runtime mode (`"edge"` or `"full"`).

---

## Consequences

| Pros                                        | Cons / Mitigation                                                  |
| ------------------------------------------- | ------------------------------------------------------------------ |
| ✅ Zero-config for teachers                 | ⚠️ Binary size ↑ ~2 MB (acceptable)                                |
| ✅ Same code path tested daily              | ⚠️ Edge mode lacks concurrent-writer safety (lock-file mitigation) |
| ✅ Docker `docker run uma` works everywhere | —                                                                  |

---

## Compliance Checklist

| Item                            | Status | PR / Commit                                            |
| ------------------------------- | ------ | ------------------------------------------------------ |
| `IRoomStore` abstraction merged | ✅     | [#78](https://github.com/UmaUpbeat/uma-upbeat/pull/78) |
| `RuntimeDetector` unit tests    | ✅     | [#79](https://github.com/UmaUpbeat/uma-upbeat/pull/79) |
| CI matrix (Edge + Full)         | ✅     | [#80](https://github.com/UmaUpbeat/uma-upbeat/pull/80) |

---

## Future Work (Non-breaking)

- **Hybrid mode**: allow SQLite _and_ Redis (for pub/sub only).
- **Hot reload**: switch mode at runtime via `/admin/runtime` (needs ADR).

---

> Decision locked until superseded by a new ADR.
