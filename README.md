# hacxy/agents

Personal AI agent definitions for Claude Code.

Based on [agency-agents](https://github.com/msitarzewski/agency-agents) — customized for ship workflow (React + Elysia.js + SQLite + Drizzle ORM + Bun).

## Structure

```
agents/
├── engineering/
│   ├── tech-architect.md      # TDD + project scaffold (Stage 2-3)
│   ├── backend-engineer.md    # Elysia.js + Drizzle ORM (Stage 6)
│   ├── frontend-engineer.md   # React + Vite + TanStack Query (Stage 7)
│   ├── code-reviewer.md       # Security + quality gate (Stage 8)
│   └── devops-engineer.md     # Deploy + browser verification (Stage 10)
├── design/
│   └── ui-designer.md         # HTML prototypes (Stage 4)
├── product/
│   └── product-manager.md     # PRD authoring (Stage 1)
├── testing/
│   └── test-engineer.md       # Test skeleton + QA validation (Stage 5 + 9)
└── scripts/
    └── install.sh
```

## Install

```bash
./scripts/install.sh
```

Copies all agents to `~/.claude/agents/`. Restart Claude Code to activate.

## Update

```bash
git pull && ./scripts/install.sh
```
