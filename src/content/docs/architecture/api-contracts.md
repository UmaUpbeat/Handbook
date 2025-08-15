---
title: API Contracts
description: Endpoints, schemas, and real-time contracts for every runtime mode.
sidebar:
  label: API Contracts
  order: 5
---

# 📡 API Contracts

> “One backend, three doors: GraphQL, REST, and WebSocket.”

---

## 🔑 Quick Reference

| Protocol      | Entry                  | Auth            | Docs                         |
| ------------- | ---------------------- | --------------- | ---------------------------- |
| **GraphQL**   | `POST /graphql`        | JWT room-code   | [GraphQL Explorer](#graphql) |
| **REST**      | `GET /api/v1/*`        | JWT room-code   | [REST Reference](#rest)      |
| **WebSocket** | `wss://host/hubs/room` | JWT query-param | [Real-time](#websocket)      |

---

## 🔍 GraphQL {#graphql}

### Schema (SDL excerpt)

```graphql
type Query {
  room(code: String!): Room
}

type Mutation {
  createRoom(input: CreateRoomInput!): Room!
  submitAnswer(input: SubmitAnswerInput!): Boolean!
}

type Subscription {
  roomUpdated(code: String!): Room!
  leaderboardUpdated(code: String!): [Player!]!
}
```

### Example Query

```graphql
query GetRoom($code: String!) {
  room(code: $code) {
    title
    state
    questions {
      text
      options
    }
  }
}
```

### Example Mutation

```graphql
mutation Submit($input: SubmitAnswerInput!) {
  submitAnswer(input: $input)
}
```

### Example Subscription

```graphql
subscription Leaderboard($code: String!) {
  leaderboardUpdated(code: $code) {
    name
    score
  }
}
```

---

## 🛠️ REST {#rest}

### Base URL

`https://host/api/v1`

| Method | Path                   | Purpose               |
| ------ | ---------------------- | --------------------- |
| `GET`  | `/rooms/{code}`        | Room snapshot         |
| `POST` | `/rooms`               | Create room (import)  |
| `POST` | `/rooms/{code}/start`  | Begin live session    |
| `GET`  | `/rooms/{code}/export` | Export room JSON      |
| `GET`  | `/healthz`             | Health + runtime mode |

### Sample Response – Room

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "DEMO",
  "title": "Capitals Quiz",
  "state": "waiting",
  "questions": [
    {
      "id": "123...",
      "text": "Capital of Spain?",
      "type": "mc",
      "options": ["Madrid", "Barcelona"],
      "correctIndex": 0
    }
  ]
}
```

---

## ⚡ WebSocket / SignalR {#websocket}

### Endpoint

```
wss://host/hubs/room?room=DEMO&token=eyJ...
```

### Events

| Event                | Payload                               |
| -------------------- | ------------------------------------- |
| `roomStarted`        | `{ state: 'live', questionIndex: 0 }` |
| `playerJoined`       | `{ id, name }`                        |
| `playerAnswered`     | `{ playerId, correct, points }`       |
| `leaderboardUpdated` | `[ { name, score } ]`                 |

### JavaScript Client (simplified)

```js
import { HubConnectionBuilder } from "@microsoft/signalr";

const conn = new HubConnectionBuilder()
  .withUrl("/hubs/room?room=DEMO&token=...")
  .build();

await conn.start();

conn.on("leaderboardUpdated", (data) => {
  console.table(data);
});
```

---

## 🔐 Authentication

| Mode               | Token Source               | TTL    |
| ------------------ | -------------------------- | ------ |
| **Room-code auth** | `POST /rooms/{code}/token` | 15 min |
| **OAuth (Google)** | `POST /auth/google`        | 60 min |
| **Edge mode**      | **None** (file-based)      | —      |

---

## 📊 Rate Limits

| Endpoint             | Limit                      |
| -------------------- | -------------------------- |
| `POST /submitAnswer` | 20 req/min per IP          |
| GraphQL mutations    | 60 req/min per IP          |
| WebSocket messages   | 100 msg/min per connection |

---

## 🧪 Testing & Mocking

- **GraphQL Explorer** at `/graphql` (disabled in production).
- **REST mock server** via `pnpm run mock` (uses MSW).
- **WebSocket simulator** in `tests/ws-sim.js`.

---

## 🚀 Versioning

- **GraphQL**: breaking changes bump **major** version in URL (`/graphql/v2`).
- **REST**: `Accept: application/vnd.uma.v1+json` header.
- **WebSocket**: protocol version handshake (`protocol: "v1"`).

---

> “Design for humans, document for machines.”
