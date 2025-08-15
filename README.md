# 📘 Uma Upbeat Handbook

> “One mind, one beat – interactive learning without limits.”

This is the **single source of truth** for the Uma Upbeat project.  
It contains **governance, architecture, APIs, component demos,** and **plug-in guides** – all rendered as a fast, accessible documentation site powered by [Astro Starlight](https://starlight.astro.build).

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/UmaUpbeat/Handbook.git
cd Handbook

# 2. Install & run
pnpm install
pnpm dev        # localhost:4321
```

---

## 📂 What’s Inside

| Folder                           | Purpose                                  |
| -------------------------------- | ---------------------------------------- |
| `src/content/docs/`              | All documentation pages (Markdown / MDX) |
| `src/content/docs/governance/`   | Vision, mission, principles, ADRs        |
| `src/content/docs/architecture/` | Diagrams, decision records               |
| `src/content/docs/api/`          | GraphQL & REST references                |
| `src/content/docs/components/`   | Live **Svelte** component demos          |
| `src/components/`                | Re-usable Svelte islands                 |
| `public/`                        | Static assets (favicons, images)         |

---

## 🧞 CLI Cheat-Sheet

| Command                 | Action                   |
| ----------------------- | ------------------------ |
| `pnpm dev`              | Start dev server         |
| `pnpm build`            | Build to `./dist/`       |
| `pnpm preview`          | Preview production build |
| `pnpm astro add svelte` | Add Svelte integration   |
| `pnpm astro check`      | Type-check Astro & MDX   |

---

## 🤝 Contribute

1. **Edit**: any `.md` or `.mdx` file.
2. **Demo**: drop a Svelte component into `src/components/` and import it in an MDX page.
3. **Propose**: open a PR or discuss in [Discussions](https://github.com/UmaUpbeat/Handbook/discussions).

---

## 📄 Licence

AGPL-3.0 © Uma Upbeat Contributors.
