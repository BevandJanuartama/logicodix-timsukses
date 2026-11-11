---
name: graphify
description: Ubah codebase, dokumen, dan skema menjadi knowledge graph yang bisa di-query agar agen tidak membaca ulang file mentah. Gunakan untuk navigasi struktur proyek.
---

# graphify

Membangun `graphify-out/` (graph.json, graph.html, GRAPH_REPORT.md). Agen bertanya ke graph, bukan membaca banyak file. Sumber: https://github.com/Graphify-Labs/graphify

## Pasang
```bash
uv tool install graphifyy
graphify install --project
```
Nama paket PyPI memakai dua huruf y (`graphifyy`); perintahnya `graphify`. Butuh Python 3.10+.

## Pakai
- Bangun graph: `/graphify .` di Claude Code (di PowerShell biasa: `graphify .`).
- Setelah kode berubah: `graphify update .` (hanya memproses file yang berubah).
- Otomatis saat commit: `graphify hook install`.

Baca `graphify-out/GRAPH_REPORT.md` lebih dulu sebelum menelusuri banyak file.

## Versi lengkap
```bash
npx -y skills add Graphify-Labs/graphify --skill graphify
```
