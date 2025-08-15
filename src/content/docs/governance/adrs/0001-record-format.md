---
title: "ADR-0001: Record Format"
description: How we write, store, and version Architectural Decision Records.
sidebar:
  label: ADR-0001
  order: 1
---

# ADR-0001 — Record Format

_Status: ✅ Accepted_  
_Date: 2025-08-16_  
_Deciders: Benito Anagua, Maintainers_

---

## Context

We needed a **consistent, lightweight** way to capture architectural decisions so future contributors can understand _why_ something was done without reading Git blame.

---

## Decision

We will use **Markdown-based ADRs** stored in  
`/docs/src/content/docs/governance/adrs/`  
with the following **mandatory sections**:

| Section       | Purpose                                       | Max chars |
| ------------- | --------------------------------------------- | --------- |
| `title`       | ADR number + short name                       | 80        |
| `description` | One-line summary                              | 140       |
| `status`      | `Proposed / Accepted / Rejected / Superseded` | —         |
| `date`        | ISO-8601                                      | —         |
| `deciders`    | GitHub handles                                | —         |
| Context       | Why this decision mattered                    | 500       |
| Decision      | What we decided                               | 300       |
| Consequences  | Pros / Cons / Risks                           | 400       |
| Compliance    | Link to PR that implements it                 | —         |

---

## File Naming

`NNNN-short-name.md`  
Example: `0002-dual-runtime.md`

---

## Example Skeleton

```markdown
---
title: "ADR-0002: Dual Runtime"
description: Use a single binary that can start in Full or Edge mode.
status: Accepted
date: 2025-08-16
deciders: benitoanagua, alice-dev
---

## Context

- Need offline usage without Docker.
- Need scale with PostgreSQL.

## Decision

Single Go/Rust binary detects `POSTGRES_URL`; else falls back to SQLite.

## Consequences

✅ Zero config for teachers  
⚠️ Binary size ↑ ~2 MB
```

---

## Versioning

- ADRs never edited after `Accepted`.
- Superseded? Create a **new ADR** and mark old one `Superseded by ADR-NNNN`.

---

## Tooling

- `pnpm run adr:new "short-name"` scaffolds file.
- `pnpm run adr:list` prints table in CLI.
- GitHub Action fails PR if new ADR lacks required frontmatter.

---

## Consequences

✅ **Uniform** reading experience  
✅ **Searchable** via Starlight sidebar  
⚠️ Requires discipline: **no edits after merge**

---

## Compliance

- PR [#42](https://github.com/UmaUpbeat/Handbook/pull/42) adds the template and CLI.
