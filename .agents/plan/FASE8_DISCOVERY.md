# Fase 8 - Discovery Desain (Subtask 8.1)

> Tanggal: 2026-11-12. Bagian bertanda **[Usulan]** adalah rumusan dari temuan, bukan output langsung skill.

## 1. Status Perintah

| # | Perintah | Status | Catatan |
|---|---|---|---|
| 1 | `taste-skill/scripts/draw.mjs --app --kind studio` | GAGAL | `--kind` tidak valid untuk `--app`. Nilai yang diterima: finance, wallet, commerce, analytics, devtools, builder, creator, smb-admin, workspace, community, support, markets, report. `studio` tidak ada. |
| 2 | `ui-ux-pro-max/scripts/search.py --design-system` | BERHASIL | Hasil kurang cocok untuk domain medis 3D (lihat bagian 3 dan 4). |
| 3 | `impeccable.cmd context` | BERHASIL | Tidak ada PRODUCT.md maupun DESIGN.md. Repo sudah punya implementasi visual. |

## 2. Konteks Impeccable

- Kode dan aset yang ada adalah otoritas untuk refinement. Perubahan besar (redesign shell) memerlukan PRODUCT.md.
- PRODUCT.md disepakati dengan pengguna lewat `/impeccable init` sebelum subtask 8.3.
- Setelah UI web selesai, jalankan satu kali: `.agents\skills\impeccable\scripts\impeccable.cmd detect --json <target>`.

## 3. Palet Fungsional

Sumber: ui-ux-pro-max (dirancang untuk halaman terang).

- Primary `#1E3A5F` (navy) untuk permukaan dan aksen institusional
- Secondary `#2563EB` untuk status aktif dan tautan
- Accent `#A16207` untuk sorotan temuan ringan
- Destructive `#DC2626` untuk keparahan tinggi
- Background `#F8FAFC`, Foreground `#0F172A`, Muted `#E9EEF5`, Muted-foreground `#475569`, Border `#CBD5E1`
- **[Usulan]** Untuk HUD 3D, token ini dipetakan ulang ke permukaan gelap (latar hitam OLED). Nilai terang dipakai apa adanya tidak cukup.
- **[Usulan]** Keparahan dan status selalu dikodekan dengan warna plus teks atau ikon, tidak hanya warna.

## 4. Tipografi

- Pasangan yang dihasilkan generator (EB Garamond + Crimson Text, serif akademik) **ditolak** karena tidak cocok dengan telemetri HUD.
- **[Usulan]** Maksimal 2 font sans (display dan body, boleh sama) plus 1 font mono telemetri.
- Mono dipakai untuk ID (`AN-001`, `DIS-001`, `SRC-*`), koordinat, dan skor LOD. Gunakan `font-variant-numeric: tabular-nums`.
- Headline maksimal 2 baris. Paragraf maksimal 25 kata (AGENTS.md Hukum 4).
- Nama font konkret dipilih di subtask 8.2 dan diverifikasi lewat `npx ctx7`.

## 5. Spacing dan Radius

- **[Usulan]** Skala spacing berbasis 4px: 4, 8, 12, 16, 24, 32, 48, 64.
- Grid 12 kolom dengan gap 16px (`repeat(12, 1fr)`, gap `1rem`).
- **[Usulan]** Dua tingkat radius: 6px untuk kontrol dan chip, 12px untuk panel. Hindari pill berlebihan.
- **[Usulan]** Panel HUD memakai border 1px beropasitas rendah, bukan bayangan lembut.

## 6. Kurva Easing dan Motion

- Easing utama: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` (Emil Kowalski, dari TASK 8.2).
- Generator merekomendasikan `back.out(1.4)` untuk stagger GSAP. **Ditolak** agar konsisten dengan kurva Emil.
- Durasi: 150-300ms untuk hover dan tekan, 300-450ms untuk masuk panel.
- Tekan `scale(0.97)`. Popover `scale(0.95)` dengan transform-origin dari titik pemicu.
- Indikator navigasi memakai pegas `layoutId` (framer-motion).
- Hanya animasikan `transform` dan `opacity`. Properti layout (`width`, `height`, `top`, `left`, `margin`) dilarang saat scroll.
- `prefers-reduced-motion` menonaktifkan motion non-esensial.
- Listener dan animasi dibersihkan saat unmount (AGENTS.md Hukum 3).

## 7. Aturan Anti-Slop yang Berlaku

Dilarang:
- Kartu 3 kolom SaaS generik dengan ikon dalam kotak pastel membulat
- Gradien ungu-ke-pink atau pelangi tanpa sumber cahaya
- Pill badge atau eyebrow berlebihan di atas setiap judul
- Foto terpotong atau terdistorsi menjadi bentuk geometris
- Lorem ipsum dan statistik rekayasa palsu (statistik harus merujuk `SRC-*`)

Wajib:
- Tata letak bespoke: asimetris, berlapis, panel melayang
- Pencahayaan realistis (rim-light, backlit) di atas latar hitam OLED
- Minimal satu elemen interaktif yang hidup (The One Live Thing)
- Ikon SVG (Lucide atau Heroicons), bukan emoji
- Kontras teks 4.5:1, focus-visible terlihat, `cursor-pointer` pada elemen klik

## 8. Keputusan Desain Utama

1. **[Usulan]** Dark-first: permukaan gelap dengan token fungsional navy dan biru. Mode terang opsional.
2. Dua font sans plus satu mono telemetri. Serif EB Garamond ditolak.
3. Easing `cubic-bezier(0.23, 1, 0.32, 1)`. `back.out` ditolak.
4. Animasi hanya `transform` dan `opacity`. Navigasi memakai pegas `layoutId`.
5. Keparahan dan status dikodekan warna plus teks atau ikon.

## 9. Langkah Berikutnya

- Jalankan `/impeccable init` untuk membuat PRODUCT.md bersama pengguna sebelum 8.3.
- Subtask 8.2 memakai bagian 3 sampai 6 sebagai dasar token di `app/globals.css`.
