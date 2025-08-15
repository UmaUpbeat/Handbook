---
title: WebSocket / SignalR API
description: Real-time events, connection handshake, and client snippets for live quizzes, polls, and leaderboards.
sidebar:
  label: WebSocket
order: 3
---

# ⚡ WebSocket / SignalR API

Endpoint:  
`wss://host/hubs/room?room={CODE}&token={JWT}`

Protocol: SignalR over WebSocket (`json`)  
Fallbacks: Long-polling, Server-Sent Events (auto-negotiated)

---

## 🔐 Connection

### 1. Obtain a token

```bash
curl -X POST https://host/api/v1/rooms/ABCD/token \
  -d '{"role":"participant"}'
# → { "token": "eyJ..." }
```

### 2. Connect

```js
import { HubConnectionBuilder } from "@microsoft/signalr";

const conn = new HubConnectionBuilder()
  .withUrl("wss://host/hubs/room?room=ABCD&token=eyJ...")
  .withAutomaticReconnect()
  .build();

await conn.start();
```

---

## 📡 Events

All payloads are JSON.  
Listen with `conn.on('eventName', handler)`.

| Event                | Direction | Payload Example                                                      | Description               |
| -------------------- | --------- | -------------------------------------------------------------------- | ------------------------- |
| `roomStarted`        | Server →  | `{ state: 'live', questionIndex: 0 }`                                | Host pressed Start        |
| `nextQuestion`       | Server →  | `{ questionIndex: 1, text: "New Q", options: [...], timeLimit: 30 }` | Host advanced             |
| `playerJoined`       | Server →  | `{ id: "u123", name: "Ada" }`                                        | New participant           |
| `playerAnswered`     | Server →  | `{ playerId: "u123", correct: true, points: 10 }`                    | Someone answered          |
| `leaderboardUpdated` | Server →  | `[{ name: "Ada", score: 40 }, ...]`                                  | Ordered leaderboard       |
| `roomClosed`         | Server →  | `{ finalLeaderboard: [...] }`                                        | Host ended the session    |
| `submitAnswer`       | Client →  | `{ questionId: "q456", value: "Madrid" }`                            | _(Client invokes method)_ |

---

## 🎯 Client-Side Patterns

### 1. Basic listener

```js
conn.on("leaderboardUpdated", (board) => {
  console.table(board);
});
```

### 2. Submitting an answer

```js
await conn.invoke("submitAnswer", {
  questionId: "q456",
  value: "Madrid",
});
```

### 3. React Hook (Svelte/React)

```ts
import { useEffect } from "react";

export function useQuizRoom(roomCode: string, token: string) {
  const [board, setBoard] = useState<Player[]>([]);

  useEffect(() => {
    const conn = new HubConnectionBuilder()
      .withUrl(`/hubs/room?room=${roomCode}&token=${token}`)
      .build();

    conn.on("leaderboardUpdated", setBoard);
    conn.start();

    return () => conn.stop();
  }, [roomCode, token]);

  return { leaderboard: board };
}
```

---

## 🔁 Reconnection & Errors

| Scenario            | Behavior                        |
| ------------------- | ------------------------------- |
| Network drop        | Auto-reconnect (exponential)    |
| Invalid/expired JWT | `close` with `401 Unauthorized` |
| Room not found      | `close` with `404 Not Found`    |

---

## 🧪 Raw WebSocket (non-SignalR)

If you prefer vanilla WebSocket (no fallback):

```
GET wss://host/ws/raw?room=ABCD&token=JWT
```

Protocol:  
Each message is a JSON object with `type` and `payload`.

Example inbound:

```json
{
  "type": "submitAnswer",
  "payload": { "questionId": "q456", "value": "Madrid" }
}
```

Example outbound:

```json
{"type":"leaderboardUpdated","payload":[...]}
```

---

## 🛡️ Rate Limits

| Scope              | Limit       |
| ------------------ | ----------- |
| Messages / min     | 100 per IP  |
| Concurrent sockets | 10 per room |

Headers returned on HTTP upgrade:  
`X-RateLimit-Remaining: 99`

---

## 📦 TypeScript Types (generated)

```ts
interface RoomStartedEvent {
  state: "live";
  questionIndex: number;
}

interface PlayerJoinedEvent {
  id: string;
  name: string;
}

interface SubmitAnswerArgs {
  questionId: string;
  value: string;
}
```

---

> Connect once, stay in sync—every click, every score, every cheer—delivered in real time.
