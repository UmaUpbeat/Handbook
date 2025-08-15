---
title: REST API
description: Resource-oriented endpoints, export routes, health checks, and sample snippets for every runtime mode.
sidebar:
  label: REST
  order: 2
---

# 🚪 REST API

Base URL: `https://host/api/v1`  
Auth: `Authorization: Bearer <jwt-room-code>` (except `/healthz`)  
Content-Type: `application/json`

---

## 🔑 Quick Reference

| Endpoint               | Method | Purpose                                | Auth |
| ---------------------- | ------ | -------------------------------------- | ---- |
| `/healthz`             | GET    | Health + runtime mode                  | No   |
| `/rooms`               | POST   | Create room (import)                   | No¹  |
| `/rooms/{code}`        | GET    | Room snapshot                          | Yes  |
| `/rooms/{code}/start`  | POST   | Begin live session                     | Host |
| `/rooms/{code}/next`   | POST   | Advance to next question               | Host |
| `/rooms/{code}/close`  | POST   | End session and freeze scores          | Host |
| `/rooms/{code}/export` | GET    | Export session as JSON blob            | Host |
| `/rooms/{code}/token`  | POST   | Issue short-lived JWT for participants | No   |

¹Import endpoints allow anonymous creation by default; restrict via env var `IMPORT_ALLOW_ANON=false`.

---

## 📖 Detailed Specs

### 1. Health Check

**GET /healthz**  
Returns 200 and a brief status object.

```json
{
  "status": "ok",
  "mode": "edge",
  "version": "0.1.0",
  "uptime": "3.2s"
}
```

---

### 2. Create Room (Text-First Import)

**POST /rooms**  
Body: JSON or raw `@OPENQUIZ` text block.

#### 2.1 Text body example

```
@OPENQUIZ
title: Quick Check
type: quiz
shuffle: true

# 2 + 2 = ?
- 3
- 4
- 5
1
```

Headers: `Content-Type: text/plain`

Response:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "ABCD",
  "title": "Quick Check",
  "state": "waiting"
}
```

#### 2.2 JSON body example

Headers: `Content-Type: application/json`

```json
{
  "title": "Capitals",
  "questions": [
    {
      "text": "Capital of Spain?",
      "type": "mc",
      "options": ["Madrid", "Barcelona"],
      "correctIndex": 0
    }
  ]
}
```

---

### 3. Room Snapshot

**GET /rooms/{code}**  
Returns the complete room state (questions, players, leaderboard).

```json
{
  "id": "...",
  "code": "ABCD",
  "title": "Capitals",
  "state": "live",
  "questions": [ ... ],
  "players": [
    { "id": "...", "name": "Ada", "score": 120 }
  ],
  "leaderboard": [ ... ]
}
```

---

### 4. Host Actions

All host actions require a JWT with `"role": "host"` in the payload.

#### Start Session

**POST /rooms/{code}/start**  
Empty body → 204 No Content on success.

#### Next Question

**POST /rooms/{code}/next**  
Optional body:

```json
{ "timeLimit": 30 }
```

#### Close Session

**POST /rooms/{code}/close**  
Returns final leaderboard snapshot.

---

### 5. Export Room

**GET /rooms/{code}/export**  
Returns a single JSON blob that matches the exact import schema (≤ 256 KB).

Headers:

```
Content-Type: application/json
Content-Disposition: attachment; filename="ABCD.json"
```

---

### 6. Issue Token (Room-Code Auth)

**POST /rooms/{code}/token**  
Body:

```json
{ "role": "participant" } // or "host"
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2025-08-16T20:00:00Z"
}
```

---

## 🧪 cURL Cheat-Sheet

```bash
# Health
curl https://demo.umaupbeat.org/api/v1/healthz

# Import from file
curl -X POST https://demo.umaupbeat.org/api/v1/rooms \
  -H "Content-Type: text/plain" \
  --data-binary @quiz.txt

# Get room
curl https://demo.umaupbeat.org/api/v1/rooms/ABCD \
  -H "Authorization: Bearer $TOKEN"

# Start session
curl -X POST https://demo.umaupbeat.org/api/v1/rooms/ABCD/start \
  -H "Authorization: Bearer $HOST_TOKEN"
```

---

## ⚡ Rate Limits (REST only)

| Endpoint         | Limit              |
| ---------------- | ------------------ |
| `POST /rooms`    | 30 req/h per IP    |
| All other routes | 120 req/min per IP |

Headers returned: `X-RateLimit-*`

---

## 🔄 Versioning

- **URI**: `/api/v1/*`
- **Breaking changes** bump to `/api/v2`
- **Backwards-compatible** additions are additive and documented in release notes.

---

## 🛡️ Security Notes

- HTTPS only (HSTS).
- JWT signed with `HS256`; key from `JWT__KEY` env var.
- Edge mode skips auth when running on `localhost`.

---

> REST is the fastest way to script Uma Upbeat—one curl away from a live quiz.
