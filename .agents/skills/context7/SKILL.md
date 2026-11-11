---
name: context7
description: Query live, up-to-date documentation and code snippets for any library, SDK, or framework using Context7 CLI (npx ctx7). Use before implementing unfamiliar, new, or changing third-party APIs.
---

# Context7 Documentation & API Verification Skill

This skill enables agents to look up live, accurate documentation, API signatures, and code examples directly from official package documentation and repositories using Context7 (`npx ctx7`).

## When to Use

- When writing code using external packages or SDKs (React, Vite, Next.js, Gemini API, Tailwind, KaTeX, Skulpt, etc.).
- When checking for breaking changes, deprecated methods, or updated syntax.
- When an API throws a deprecation error (e.g. `model is no longer available`).

## Available Commands

### 1. Search for a Library
Find the exact library identifier in Context7:
```bash
npx ctx7 library <name> "[optional topic]"
```
Example:
```bash
npx ctx7 library react "useState hook"
npx ctx7 library katex "renderToString"
npx ctx7 library @google/genai "generateContent"
```

### 2. Fetch Documentation & Code Snippets
Query specific documentation for a resolved library ID:
```bash
npx ctx7 docs <libraryId> "<query>"
```
Example:
```bash
npx ctx7 docs /reactjs/react.dev "useEffect cleanup"
```

### 3. Setup Context7
```bash
# Setup CLI + Skills mode for current project
npx ctx7 setup --antigravity --cli --project -y

# Setup MCP server mode
npx ctx7 setup --mcp
```

