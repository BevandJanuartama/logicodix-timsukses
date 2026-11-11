@AGENTS.md

# Claude Code: aturan hemat token

- Skill hidup di `.agents/skills/` (sumber tunggal, dipakai juga oleh Antigravity). `.claude/skills` adalah junction ke folder itu.
- Di awal tugas, jalankan `python .agents/skills/skills-router/scripts/route.py "<intent>"`. Muat hanya SKILL.md yang direkomendasikan, jangan memuat banyak skill sekaligus.
- Jangan membaca `taste-skill/library/*.json`, `ui-ux-pro-max/data/*`, atau `impeccable/scripts/data/*` secara langsung. Gunakan script pencarian yang disediakan skill.
- Untuk kerangka website, ikuti alur: `brainstorming` → `writing-plans` → `executing-plans` (satu fase per giliran) → `verification-before-completion`.
- Balasan singkat: tanpa pengulangan isi file yang baru ditulis, tanpa ringkasan langkah.
