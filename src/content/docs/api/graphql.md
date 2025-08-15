---
title: GraphQL API
description: SDL, queries, mutations, subscriptions, and playground links.
sidebar:
  label: GraphQL
  order: 1
---

# 🎡 GraphQL API

Base URL: `https://host/graphql`  
Auth: `Authorization: Bearer <jwt-room-code>`  
Content-Type: `application/json`

---

## 1. SDL (Concise)

```graphql
scalar DateTime

type Query {
  room(code: String!): Room
  session(code: String!): Session # alias for room
}

type Mutation {
  createRoom(input: CreateRoomInput!): Room!
  addQuestion(roomId: ID!, input: QuestionInput!): Question!
  startRoom(roomId: ID!): Boolean!
  nextQuestion(roomId: ID!): Boolean!
  submitAnswer(input: SubmitAnswerInput!): Boolean!
  closeRoom(roomId: ID!): Boolean!
}

type Subscription {
  roomUpdated(code: String!): Room!
  leaderboardUpdated(code: String!): [Player!]!
}

# ========== TYPES ==========
type Room {
  id: ID!
  code: String!
  title: String!
  language: String!
  state: RoomState!
  questions: [Question!]!
  players: [Player!]!
  leaderboard: [Player!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Question {
  id: ID!
  text: String!
  type: QuestionType!
  options: [String!]!
  correctIndex: Int
  timeLimit: Int
}

type Player {
  id: ID!
  name: String!
  score: Int!
  answers: [Answer!]!
}

type Answer {
  id: ID!
  questionId: ID!
  value: String!
  isCorrect: Boolean!
  points: Int!
  answeredAt: DateTime!
}

# ========== ENUMS ==========
enum RoomState {
  WAITING
  LIVE
  FINISHED
}
enum QuestionType {
  MC
  TF
  SCALE
  TEXT
}

# ========== INPUTS ==========
input CreateRoomInput {
  title: String!
  language: String = "en"
  type: SessionType = QUIZ
  questions: [QuestionInput!]!
}

input QuestionInput {
  text: String!
  type: QuestionType!
  options: [String!]!
  correctIndex: Int
  timeLimit: Int
}

input SubmitAnswerInput {
  roomId: ID!
  questionId: ID!
  value: String!
}
```

---

## 2. Authentication

Send JWT via HTTP header or WebSocket query param:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Token payload:

```json
{
  "sub": "room:DEMO",
  "role": "host",
  "exp": 1699999999
}
```

---

## 3. Sample Queries

### 3.1 Room Snapshot

```graphql
query GetRoom($code: String!) {
  room(code: $code) {
    id
    title
    questions {
      id
      text
      type
      options
      timeLimit
    }
    players {
      id
      name
      score
    }
  }
}
```

### 3.2 Create Room

```graphql
mutation Create($input: CreateRoomInput!) {
  createRoom(input: $input) {
    id
    code
  }
}
```

### 3.3 Real-time Leaderboard

```graphql
subscription Leaderboard($code: String!) {
  leaderboardUpdated(code: $code) {
    name
    score
  }
}
```

---

## 4. Variables Example

```json
{
  "code": "DEMO"
}
```

---

## 5. Error Format

```json
{
  "errors": [
    { "message": "Room not found", "extensions": { "code": "NOT_FOUND" } }
  ]
}
```

---

## 6. Playground & Introspection

- **Dev**: `http://localhost:4321/graphql`
- **Prod**: `/graphql` with **introspection disabled** by default (`--env=prod`).

---

## 7. Rate Limits

| Operation     | Limit                            |
| ------------- | -------------------------------- |
| Queries       | 120 req/min per IP               |
| Mutations     | 60 req/min per IP                |
| Subscriptions | 10 conn/IP, 100 msg/min per conn |

Headers returned:

```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 119
X-RateLimit-Reset: 1699999999
```

---

## 8. Versioning

GraphQL **major** version in path:  
`POST /graphql/v1`  
Breaking changes bump the path segment.

---

> Explore live schema at `/graphql` when running locally.
