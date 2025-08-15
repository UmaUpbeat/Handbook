---
title: Charter
description: Rules, roles, and processes that keep Uma Upbeat community-driven and legally sound.
sidebar:
  label: Charter
  order: 3
---

# 📜 Uma Upbeat Charter

_version 1.0 – ratified 2025-08-16_

This document defines **how** the project is governed, **who** makes decisions, and **how** those decisions are enforced.  
It is itself governed by the same RFC process it describes.

---

## 1. Purpose

Provide a **transparent, inclusive, and legally safe** framework so the project can grow without losing its founding principles.

---

## 2. Roles & Responsibilities

| Role                                    | How to Become One                                   | Powers                                         | Duties                                   |
| --------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | ---------------------------------------- |
| **Contributor**                         | One merged PR or substantive doc fix                | Open issues & PRs, vote on RFCs                | Follow CoC, keep PRs small               |
| **Maintainer**                          | Nominated by 2 existing Maintainers, lazy-consensus | Merge to `main`, cut releases, moderate issues | Review RFCs, mentor newcomers            |
| **BDFL** (Benevolent Dictator for Life) | Project founder (Benito Anagua)                     | Veto only on licence or principle breaches     | Step in only when RFC deadlock ≥ 14 days |

> **Vacancies**: If a Maintainer is inactive for 90 days, any Contributor can open an RFC to remove them.

---

## 3. Decision-Making Process

| Type                            | Path                           | Time-box | Quorum                 |
| ------------------------------- | ------------------------------ | -------- | ---------------------- |
| **Bug Fix / Docs**              | Direct PR, 1 Maintainer review | 24 h     | 1 Maintainer           |
| **Feature / Breaking Change**   | **RFC Required** (see §4)      | 7 days   | Lazy consensus         |
| **Licence or Principle Change** | RFC + BDFL approval            | 14 days  | 2/3 Maintainers + BDFL |

---

## 4. RFC Workflow

1. **Open** issue with label `RFC`.
2. **Template** auto-populates:
   - Summary
   - Motivation
   - Specification
   - Backwards Compatibility
   - Alternatives
   - Migration Guide
3. **Discuss** for 7 days (extendable to 14 by Maintainer request).
4. **Resolve** objections (edits, amendments, or withdrawal).
5. **Vote**:
   - ✅ If zero unresolved objections → merge.
   - ❌ If unresolved objections → close or escalate to BDFL.
6. **Record** in `governance/adrs/`.

---

## 5. Code of Conduct

We enforce the **Contributor Covenant 2.1**.  
Report violations to `conduct@umaupbeat.org` or open a private GitHub issue tagged `conduct`.

---

## 6. Licence & IP

- **Code**: AGPL-3.0 only.
- **Docs & Media**: CC-BY-SA 4.0 unless specified.
- **Trademarks**: “Uma Upbeat” and logo are held by the project; use requires written permission for commercial use.

---

## 7. Financial Governance

- **Sponsorships** go through [Open Collective](https://opencollective.com/uma-upbeat).
- **Budget** is transparent; maintainers vote on > $500 expenses via public RFC.
- **Bounties** are posted as GitHub issues labelled `💰 bounty`.

---

## 8. Release Governance

- **Versioning**: SemVer (`vMajor.Minor.Patch`).
- **Release Captain**: rotating Maintainer, 6-week cycle.
- **LTS**: Every `vMajor.0` is supported for 12 months.

---

## 9. Conflict Resolution

1. Direct discussion in issue/PR.
2. Mediation by neutral Maintainer.
3. Escalation to BDFL (final).  
   All steps are logged publicly.

---

## 10. Amendments to This Charter

- Requires **RFC + 2/3 Maintainers + BDFL approval**.
- Takes effect **14 days** after merge.

---

> “Governance is not red tape; it is the rhythm that keeps the community in sync.”
