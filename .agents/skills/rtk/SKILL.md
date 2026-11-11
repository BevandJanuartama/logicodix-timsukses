---
name: rtk
description: Hemat token output shell dengan rtk (Rust Token Killer). Gunakan saat memasang/memverifikasi rtk atau saat output git/ls/test terlalu panjang.
---

# rtk (Rust Token Killer)

Proxy CLI yang memampatkan output perintah shell sebelum masuk ke konteks agen. Sumber: https://github.com/rtk-ai/rtk

## Pasang & verifikasi
```bash
cargo install --git https://github.com/rtk-ai/rtk
rtk gain
```
`rtk gain` harus menampilkan statistik token. Jika error, kemungkinan paket `rtk` yang salah (Rust Type Kit): `cargo uninstall rtk`, lalu pasang ulang dari perintah di atas.

## Aktifkan hook
```bash
rtk init -g
rtk init --agent antigravity
rtk init --show
```
Restart agen setelahnya. Perintah seperti `git status` otomatis ditulis ulang menjadi `rtk git status`. Tool bawaan Read/Grep/Glob tidak melewati hook ini.

## Pantau
`rtk gain` (penghematan), `rtk discover` (perintah yang terlewat).
