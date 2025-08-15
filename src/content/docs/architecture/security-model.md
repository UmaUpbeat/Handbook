---
title: Security Model
description: Threat model, auth schemes, secrets handling, and privacy controls.
sidebar:
  label: Security Model
  order: 6
---

# 🛡️ Security Model

> “Privacy first, trust second, locks last.”

---

## 1. Threat Model (STRIDE)

| Threat                     | Asset               | Mitigation                       |
| -------------------------- | ------------------- | -------------------------------- |
| **Spoofing**               | Room owner identity | JWT room-code + optional OAuth   |
| **Tampering**              | Question data       | Signed tokens + checksums        |
| **Repudiation**            | Answer submissions  | Immutable audit log              |
| **Information Disclosure** | Student names       | Anonymised unless opted-in       |
| **Denial of Service**      | API                 | Rate limiting, file locks (Edge) |
| **Elevation of Privilege** | Admin routes        | Role-based scopes                |

---

## 2. Authentication & Authorization

| Flow               | Token                     | Lifetime | Scope              |
| ------------------ | ------------------------- | -------- | ------------------ |
| **Room-code**      | Short JWT (`room`, `exp`) | 15 min   | Read & answer      |
| **Host**           | Long JWT (`host`, `room`) | 1 h      | Start, next, close |
| **OAuth (Google)** | `id_token`                | 1 h      | Same as host       |
| **Edge mode**      | **None** (file-based)     | —        | Local only         |

Token sample:

```json
{
  "sub": "room:DEMO",
  "role": "host",
  "exp": 1699999999
}
```

---

## 3. Secrets & Key Management

| Secret          | Storage                            | Rotation       |
| --------------- | ---------------------------------- | -------------- |
| JWT signing key | `JWT__KEY` env var / Docker secret | Manual PR      |
| AI API keys     | Vault (Full) / localStorage (Edge) | User rotates   |
| DB creds        | `.env` or K8s secret               | Per-deployment |
| Edge DB file    | Encrypted at rest (optional)       | —              |

---

## 4. Transport Security

| Mode          | Transport                                        | TLS                       |
| ------------- | ------------------------------------------------ | ------------------------- |
| **Full**      | HTTPS                                            | Let’s Encrypt auto-renew  |
| **Edge**      | HTTPS (self-signed) or plain HTTP on `localhost` | User configurable         |
| **WebSocket** | WSS                                              | Same certificate as HTTPS |

---

## 5. Data Privacy & Retention

| Data         | Retention                                   | Anonymisation |
| ------------ | ------------------------------------------- | ------------- |
| Room content | 24 h (Edge) / 30 days (Full)                | —             |
| Player names | Session only (Edge) / 30 days (Full)        | Hash or nick  |
| AI prompts   | **Never stored** (tier 0) / 7 days (tier 2) | —             |

---

## 6. Secrets Scanning & CI

- **GitHub Advanced Security** on every push.
- **Trivy** container scan in CI.
- **Dependabot** auto-merge patch level.

---

## 7. Incident Response

1. **Detect** via monitoring alerts or community report.
2. **Disclose** in `security@umaupbeat.org` + GitHub Security tab.
3. **Patch** within 72 h for critical; release hotfix.
4. **Post-mortem** public blog post.

---

## 8. Compliance Snapshots

| Framework    | Status | Evidence                                  |
| ------------ | ------ | ----------------------------------------- |
| GDPR         | ✅     | Data-minimised, export & delete endpoints |
| FERPA        | ✅     | No persistent PII by default              |
| OWASP Top 10 | ✅     | SAST + DAST in pipeline                   |

---

> “Security is a feature, not a phase.”
