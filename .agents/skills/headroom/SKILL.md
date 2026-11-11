---
name: headroom
description: Kompresi konteks LLM (tool output, log, file) dengan headroom proxy/MCP. Gunakan saat memasang headroom atau menjalankan Claude lewat wrapper.
---

# headroom

Lapisan kompresi konteks yang berjalan lokal antara agen dan penyedia LLM; kompresi bersifat reversibel. Sumber: https://github.com/headroomlabs-ai/headroom

## Pasang
```bash
uv tool install --python 3.13 "headroom-ai[all]"
```
Alternatif: `pip install "headroom-ai[all]"` (Python 3.10+). Startup pertama mengunduh model sekitar 500 MB.

## Pakai
```bash
headroom wrap claude
headroom proxy --port 8787
headroom mcp install
headroom perf
```
- `wrap claude`: menjalankan proxy lalu Claude Code.
- `proxy`: tanpa perubahan kode, arahkan base URL klien ke localhost.
- `mcp install`: menambah tool `headroom_compress`, `headroom_retrieve`, `headroom_stats`.
