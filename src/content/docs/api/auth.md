---
title: Authentication & Authorization
description: JWT flows, room-code tokens, OAuth integration, scopes, and revocation.
sidebar:
  label: Auth
  order: 5
---

# 🔐 Authentication & Authorization

Uma Upbeat uses **short-lived, signed JWTs** to grant the _least privilege_ necessary for a session.  
There are **no long-lived API keys** and **no user accounts** by default—only **rooms, roles, and time-boxed tokens**.

---

## 🧭 Token Types

| Token         | Lifetime | Issued By                  | Scope / Role  | Transport              |
| ------------- | -------- | -------------------------- | ------------- | ---------------------- |
| **Room-code** | 15 min   | `POST /rooms/{code}/token` | `participant` | Query string or header |
| **Host**      | 60 min   | Same endpoint¹             | `host`        | Header                 |
| **OAuth**     | 60 min   | Google SSO flow            | `host`        | Cookie²                |

¹Include `"role": "host"` in the request body **and** prove ownership (first IP to create the room gets host rights).  
²Only available in Full mode behind HTTPS.

---

## 🔑 Obtaining a Token

### 1. Anonymous Participant

```bash
curl -X POST https://host/api/v1/rooms/ABCD/token \
  -d '{"role":"participant"}'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2025-08-16T15:30:00Z"
}
```

### 2. Host Token

```bash
curl -X POST https://host/api/v1/rooms/ABCD/token \
  -H "Content-Type: application/json" \
  -d '{"role":"host"}'
```

> The first request from the room creator’s IP is automatically granted `host`; subsequent requests require a valid host JWT in the `Authorization` header to upgrade.

---

## 🧬 JWT Payload Schema

Header

```json
{ "alg": "HS256", "typ": "JWT" }
```

Payload

```json
{
  "sub": "room:ABCD", // subject
  "role": "host", // or "participant"
  "iat": 1692188400, // issued at
  "exp": 1692189000, // expiry (15 min or 60 min)
  "jti": "uuid" // unique id (revocation list)
}
```

Signature  
`HMACSHA256(base64Url(header) + "." + base64Url(payload), JWT__KEY)`

---

## 📡 Using the Token

### REST

```http
Authorization: Bearer <jwt>
```

### WebSocket

```
wss://host/hubs/room?room=ABCD&token=<jwt>
```

### GraphQL

```http
Authorization: Bearer <jwt>
```

---

## 🔐 OAuth (Google) — Full Mode Only

1. Redirect browser to  
   `https://host/auth/google?redirect_uri=https://myschool.edu/callback`
2. After consent, Google returns an `id_token`.
3. Exchange for a host JWT:
   ```http
   POST /auth/google/exchange
   { "id_token": "..." }
   ```
4. Receive the same 60-minute host JWT.

---

## 🔐 Scopes / Permissions Matrix

| Resource / Action         | Participant | Host | OAuth Host |
| ------------------------- | ----------- | ---- | ---------- |
| View room snapshot        | ✅          | ✅   | ✅         |
| Submit answer             | ✅          | ✅   | ✅         |
| Start / next / close room | ❌          | ✅   | ✅         |
| Export room               | ❌          | ✅   | ✅         |
| Revoke any token          | ❌          | ✅   | ✅         |

---

## 🚪 Revocation & Logout

### Self-Revoke

```http
POST /auth/revoke
Authorization: Bearer <jwt>
```

Adds `jti` to an in-memory deny-list (Redis) with TTL = token remaining life.

### Host Revoke All

```http
POST /rooms/{code}/revoke-all
Authorization: Bearer <host-jwt>
```

Invalidates **every** token for the room.

---

## 🛡️ Security Features

| Control                       | Implementation                             |
| ----------------------------- | ------------------------------------------ |
| **Key rotation**              | `JWT__KEY` env var; restart required       |
| **Replay protection**         | `jti` deny-list in Redis                   |
| **Rate-limit token issuance** | 10 req/min per IP                          |
| **Edge mode**                 | No tokens on `localhost`; file trust model |
| **HTTPS enforcement**         | Redirects HTTP→HTTPS in Full mode          |

---

## 🧪 cURL Cheat-Sheet

```bash
# 1. Get participant token
TOKEN=$(curl -s -X POST https://host/api/v1/rooms/ABCD/token \
  -d '{"role":"participant"}' | jq -r .token)

# 2. Use it
curl -H "Authorization: Bearer $TOKEN" \
     https://host/api/v1/rooms/ABCD

# 3. Revoke
curl -X POST https://host/api/v1/auth/revoke \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🗂️ Error Codes

| HTTP | Code             | Meaning                   |
| ---- | ---------------- | ------------------------- |
| 401  | `UNAUTHORIZED`   | Missing or invalid token  |
| 403  | `FORBIDDEN`      | Token lacks required role |
| 404  | `ROOM_NOT_FOUND` | Room code does not exist  |
| 429  | `RATE_LIMITED`   | Too many token requests   |

---

> Tokens are short, scopes are tight, and everything is auditable—privacy first, friction last.
