---
title: Schemas & Types
description: JSON, TypeScript, and Protobuf contracts for rooms, questions, players, answers, and imports.
sidebar:
  label: Schemas
  order: 4
---

# 🗂️ Schemas & Types

All canonical shapes are **versioned** (`"schema": 1`) and stable within a major release.  
Use these schemas to validate imports, generate client SDKs, or build plug-ins.

---

## 1. Room Export Schema (JSON Schema Draft-07)

<details>
<summary>Room.json</summary>

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "$id": "https://umaupbeat.org/schemas/room/v1",
  "type": "object",
  "required": ["schema", "id", "code", "title", "state", "questions"],
  "properties": {
    "schema": { "const": 1 },
    "id": { "type": "string", "format": "uuid" },
    "code": { "type": "string", "pattern": "^[A-Z0-9]{4,6}$" },
    "title": { "type": "string", "maxLength": 120 },
    "language": {
      "type": "string",
      "default": "en",
      "minLength": 2,
      "maxLength": 5
    },
    "state": { "enum": ["waiting", "live", "finished"] },
    "questions": { "type": "array", "items": { "$ref": "#/$defs/question" } },
    "players": { "type": "array", "items": { "$ref": "#/$defs/player" } },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "$defs": {
    "question": {
      "type": "object",
      "required": ["id", "text", "type", "options"],
      "properties": {
        "id": { "type": "string", "format": "uuid" },
        "text": { "type": "string", "maxLength": 500 },
        "type": { "enum": ["mc", "tf", "scale", "text"] },
        "options": {
          "type": "array",
          "items": { "type": "string", "maxLength": 200 },
          "maxItems": 8
        },
        "correctIndex": { "type": ["integer", "null"], "minimum": 0 },
        "timeLimit": {
          "type": ["integer", "null"],
          "minimum": 5,
          "maximum": 300
        }
      }
    },
    "player": {
      "type": "object",
      "required": ["id", "name", "score"],
      "properties": {
        "id": { "type": "string", "format": "uuid" },
        "name": { "type": "string", "maxLength": 30 },
        "score": { "type": "integer", "minimum": 0 },
        "answers": { "type": "array", "items": { "$ref": "#/$defs/answer" } }
      }
    },
    "answer": {
      "type": "object",
      "required": ["questionId", "value", "isCorrect", "points"],
      "properties": {
        "questionId": { "type": "string", "format": "uuid" },
        "value": { "type": "string" },
        "isCorrect": { "type": "boolean" },
        "points": { "type": "integer" },
        "answeredAt": { "type": "string", "format": "date-time" }
      }
    }
  }
}
```

</details>

---

## 2. TypeScript Types (Auto-Generated)

Install via NPM (optional):

```bash
npm install @umaupbeat/types
```

```ts
export interface RoomV1 {
  schema: 1;
  id: string;
  code: string;
  title: string;
  language?: string;
  state: "waiting" | "live" | "finished";
  questions: QuestionV1[];
  players?: PlayerV1[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionV1 {
  id: string;
  text: string;
  type: "mc" | "tf" | "scale" | "text";
  options: string[];
  correctIndex?: number | null;
  timeLimit?: number | null;
}

export interface PlayerV1 {
  id: string;
  name: string;
  score: number;
  answers?: AnswerV1[];
}

export interface AnswerV1 {
  questionId: string;
  value: string;
  isCorrect: boolean;
  points: number;
  answeredAt?: string;
}
```

---

## 3. Protobuf (gRPC Optional)

When running in “Full” mode behind an internal gRPC gateway:

<details>
<summary>room.proto</summary>

```proto
syntax = "proto3";
package uma.v1;

message Room {
  string id = 1;
  string code = 2;
  string title = 3;
  string state = 4;
  repeated Question questions = 5;
  repeated Player players = 6;
}

message Question {
  string id = 1;
  string text = 2;
  enum Type {
    MC = 0;
    TF = 1;
    SCALE = 2;
    TEXT = 3;
  }
  Type type = 3;
  repeated string options = 4;
  optional int32 correct_index = 5;
  optional int32 time_limit = 6;
}

message Player {
  string id = 1;
  string name = 2;
  int32 score = 3;
  repeated Answer answers = 4;
}

message Answer {
  string question_id = 1;
  string value = 2;
  bool is_correct = 3;
  int32 points = 4;
}
```

</details>

---

## 4. Text-First Import Grammar (EBNF)

```
import_block = "@OPENQUIZ", newline, front_matter, newline, question_list
front_matter = key_value, { newline, key_value }
key_value    = identifier, ":", space, value
question_list= question, { newline, question }
question     = "#", text, newline, option_list, newline, answer_marker
option_list  = "-", text, { newline, "-", text }
answer_marker= integer | "true" | "false"
```

Identifiers: `title`, `language`, `type`, `shuffle`, `pin`, etc.

---

## 5. Edge vs Full Storage Mappings

| Logical Field | Edge JSON file | PostgreSQL Table | Redis Key        |
| ------------- | -------------- | ---------------- | ---------------- |
| Room          | root object    | `rooms`          | `room:{code}`    |
| Question      | `questions[]`  | `questions`      | —                |
| Player        | `players[]`    | `players`        | `players:{code}` |
| Answer        | `answers[]`    | `answers`        | —                |

---

## 6. Versioning Policy

- **Major** (`schema: 2`) → breaking change; new URI `/schemas/room/v2`.
- **Minor** → additive only; clients ignore unknown keys.
- **Patch** → bug-fix in description or constraints; no code changes.

---

> Copy these schemas into your validators, SDK generators, or OpenAPI specs—your data will always round-trip safely.
