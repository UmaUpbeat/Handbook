---
title: API Overview
description: One-stop index to every public interface—GraphQL, REST, WebSocket, schemas, and limits.
sidebar:
  label: Overview
  order: 0
---

# 📡 API Overview

> “Three doors, one key.”

Welcome to the **public surface** of Uma Upbeat. Everything you need to build a client, embed quizzes, or automate classrooms is documented here.

---

## 🧭 Quick Links

| Page                            | What You’ll Learn                         |
| ------------------------------- | ----------------------------------------- |
| [GraphQL](/api/graphql)         | SDL, queries, mutations, subscriptions    |
| [REST](/api/rest)               | Resource endpoints, export routes, health |
| [WebSocket](/api/websocket)     | Real-time hub protocol & events           |
| [Schemas](/api/schemas)         | JSON, protobuf, and TypeScript types      |
| [Auth](/api/auth)               | JWT, OAuth, and room-code flows           |
| [Rate Limits](/api/rate-limits) | Throttling rules and headers              |

---

## 🌟 One-Minute Cheat Sheet

| Protocol      | Base URL     | Auth            | Content-Type       |
| ------------- | ------------ | --------------- | ------------------ |
| **GraphQL**   | `/graphql`   | JWT room-code   | `application/json` |
| **REST**      | `/api/v1/*`  | JWT room-code   | `application/json` |
| **WebSocket** | `/hubs/room` | JWT query-param | `application/json` |

---

## 🧪 Quick Test

```bash
# Health check
curl https://demo.umaupbeat.org/api/v1/healthz

# GraphQL introspection
curl -X POST https://demo.umaupbeat.org/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}'
```

---

> Start with GraphQL for new integrations, fall back to REST for one-off scripts, and use WebSocket for real-time dashboards.
