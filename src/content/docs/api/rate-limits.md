---
title: Rate Limits & Throttling
description: Per-endpoint quotas, headers, retry behavior, and how to handle 429 responses.
sidebar:
  label: Rate Limits
order: 6
---

# 🚦 Rate Limits & Throttling

Uma Upbeat enforces **tiered, per-IP** quotas to keep classrooms snappy and abuse-free.  
Limits reset on a **rolling window** and every response tells you exactly where you stand.

---

## 📊 Quick Glance

| Tier               | What it covers               | Limit (per IP) | Window |
| ------------------ | ---------------------------- | -------------- | ------ |
| **REST read**      | GET `/rooms/{code}` etc.     | 120 req/min    | 60 s   |
| **REST write**     | POST mutations, room actions | 60 req/min     | 60 s   |
| **GraphQL**        | All queries & mutations      | 120 req/min    | 60 s   |
| **WebSocket**      | Messages (not connect)       | 100 msg/min    | 60 s   |
| **Token Issuance** | `POST /rooms/{code}/token`   | 10 req/min     | 60 s   |
| **Import**         | Text or JSON upload          | 30 req/h       | 1 h    |

Edge mode disables limits on `localhost/127.0.0.1`.

---

## 🔍 Response Headers

Every **rate-limited** endpoint returns:

```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 119
X-RateLimit-Reset: 1692189000   // Unix epoch seconds
Retry-After: 42                 // seconds to wait after 429
```

---

## 🔄 When You Hit 429

### HTTP APIs

- Status: `429 Too Many Requests`
- Body: `{ "error": "RATE_LIMITED", "retryAfter": 42 }`

**Backoff Strategy (recommended)**  
Exponential + jitter: `sleep(min(60, base * 2^n + random(0,1000)))`

### WebSocket

- The server emits an error frame:
  ```json
  { "type": "rateLimited", "retryAfter": 42 }
  ```
- Client should close and reconnect after the delay.

---

## 🧪 cURL Example

```bash
# Hit the limit intentionally
for i in {1..130}; do
  curl -s -o /dev/null -w "%{http_code} %{header_json}\n" \
    https://host/api/v1/rooms/ABCD
done
```

Watch for `429` and `Retry-After: 58`.

---

## 🛠️ Bypass & Overrides

| Scenario              | How to raise limit                             |
| --------------------- | ---------------------------------------------- |
| **Load testing CI**   | Set env `RATE_LIMIT_DISABLED=true` (Edge only) |
| **Trusted school IP** | Add `TRUSTED_CIDRS=203.0.113.0/24`             |
| **Sponsor / SaaS**    | Per-key quotas via API key header (future)     |

---

## 📈 Monitoring

Metrics endpoint (Full mode):  
`GET /metrics` (Prometheus)

```
uma_http_requests_total{code="429"}  18
```

---

## 🧩 SDK Helpers

### JavaScript (auto-retry)

```ts
import ky from "ky";

const api = ky.create({
  prefixUrl: "https://host/api/v1",
  retry: {
    limit: 3,
    methods: ["get", "post"],
    statusCodes: [429],
  },
});
```

### Python (tenacity)

```python
from tenacity import retry, wait_exponential_jitter

@retry(wait=wait_exponential_jitter(initial=1, max=10))
def create_room(payload):
    return requests.post("https://host/api/v1/rooms", json=payload)
```

---

## 📄 Reference Table

| Path                         | Method | Limit   | Notes          |
| ---------------------------- | ------ | ------- | -------------- |
| `/healthz`                   | GET    | none    | health         |
| `/api/v1/rooms`              | POST   | 30/h    | import         |
| `/api/v1/rooms/{code}`       | GET    | 120/min | snapshot       |
| `/api/v1/rooms/{code}/start` | POST   | 60/min  | host action    |
| `/graphql`                   | POST   | 120/min | global         |
| `/hubs/room` (WS messages)   | —      | 100/min | per socket     |
| `/rooms/{code}/token`        | POST   | 10/min  | token issuance |

---

> Respect the limits, follow the headers, and your quizzes will never miss a beat.
