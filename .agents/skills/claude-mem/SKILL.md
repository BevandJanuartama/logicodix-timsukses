---
name: claude-mem
description: Memori persisten lintas sesi dengan claude-mem. Gunakan saat memasang, memeriksa, atau memperbaiki memori sesi untuk Claude Code/Antigravity.
---

# claude-mem

Merekam aktivitas sesi, memampatkannya, lalu menyuntikkan konteks relevan ke sesi berikutnya. Sumber: https://github.com/thedotmack/claude-mem

## Pasang
```bash
npx claude-mem install --provider claude
npx claude-mem install --ide antigravity
```
Wajib lewat `npx claude-mem install`. `npm install -g claude-mem` hanya memasang SDK tanpa hook. Installer interaktif tanpa `--provider` dapat memilih layanan hosted berbayar secara default, jadi tentukan provider secara eksplisit.

## Periksa
```bash
npx claude-mem doctor
npx claude-mem status
npx claude-mem repair
```
Butuh Node.js 20+; Bun dipasang otomatis jika belum ada.
