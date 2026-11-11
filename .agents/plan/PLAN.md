# PROJECT PLAN & SPECIFICATION: [NAMA_PROYEK]

> **Petunjuk Template:**  
> File ini adalah template spesifikasi proyek kosongan. Isi setiap bagian di bawah ini saat memulai proyek baru. Agen akan membaca file ini sebagai acuan tunggal konteks dan identitas proyek, sementara standar mutu kode dan arsitektur mengacu pada `AGENTS.md`.

---

## 1. Project Overview & Identity
- **Project Name:** [Nama Proyek / Aplikasi]
- **Project Type:** [Landing Page / Web App / Scrollytelling Showcase / Dashboard / Portofolio]
- **Target Audience & Tone:** [Audiens sasaran dan kesan yang ingin disampaikan, misal: elegan, futuristik, hangat, minimalis, profesional]
- **Core Mission:** [Tujuan utama pembuatan proyek dan pesan utama yang ingin disampaikan]
- **Design Benchmark & Visual Anchor:** [Komponen atau situs acuan sebagai standar kualitas visual proyek ini]

---

## 2. Design Intelligence & Skill Anchors
Dokumentasikan hasil penelusuran dari skill-skill desain lokal:
- **Surface Mode (`impeccable`):** `[Persuade / Operate / Read / Experience]` (Tentukan fokus mode interaksi pengguna)
- **Art Direction Archetype (`taste-skill`):** `[Hasil node draw.mjs / konsep spesifik yang diangkat dari subjek klien]`
- **Design System Profile (`ui-ux-pro-max`):** `[Hasil query search.py --design-system]`
- **Motion Character:** `[Misal: GSAP ScrollTrigger Pinned Timeline, focus-pull blur transition, kurva expo.out]`

---

## 3. Visual Theme & Token Architecture

Tentukan sistem visual dan warna yang akan digunakan dalam proyek ini:

### 🎨 Color Palette & Lighting Tokens
| Token Semantic | Nilai Hex / Formula | Peran & Karakter |
|---|---|---|
| `--bg-canvas` | `[#Hex / HSL]` | Latar belakang dasar utama (misal: pure dark void atau light canvas) |
| `--bg-surface` | `[#Hex / HSL]` | Lapis permukaan kartu atau container |
| `--accent-glow` | `[#Hex / HSL]` | Warna pendar / cahaya aksen utama (rim lighting / ambient halo) |
| `--accent-secondary` | `[#Hex / HSL]` | Warna aksen pendukung / highlight interaktif |
| `--text-primary` | `[#Hex / HSL]` | Teks kontras tinggi (100% opacity untuk headline) |
| `--text-secondary` | `[#Hex / HSL]` | Teks kontras menengah untuk paragraf & narasi |
| `--text-muted` | `[#Hex / HSL]` | Teks kontras rendah untuk micro-labels & timestamps |

### 🔤 Typography Pairing (Maksimal 2 Typeface)
1. **Primary Display / Headline Font:** `[Nama Font Display]`
   - Karakter: [Geometris / Punchy / Modern / dll.]
   - Digunakan untuk: Judul besar, monogram, dan headline utama.
2. **Body / Narasi Font:** `[Nama Font Body]`
   - Karakter: [Bersih, modern, nyaman dibaca]
   - Digunakan untuk: Seluruh paragraf, deskripsi fitur, label tombol, dan micro-copy.

---

## 4. Asset Inventory & Data Sources

Daftar aset asli dan sumber data riil yang digunakan (dilarang menggunakan data palsu / lorem ipsum):
- **Direktori Aset:** `[misal: assets/images/ atau public/assets/]`
- **Daftar Aset Utama:**
  - `[aset_1.png]` — [Keterangan penggunaan]
  - `[aset_2.svg]` — [Keterangan penggunaan]
  - `[aset_3.webp]` — [Keterangan penggunaan]
- **Sumber Data / Konten:** [File JSON di `src/data/`, API endpoint, atau copy teks terverifikasi]

---

## 5. Key Interactive Feature (The "One Live Thing")
- **Fitur Interaktif:** [Tentukan 1 momen interaktif yang memukau, misal: audio visualizer, interactive 3D tilt stage, drag-and-scrub memory slider, simulator interaktif, atau dynamic canvas]
- **Mekanisme Interaksi:** [Jelaskan responsivitas saat pengguna mengklik, menggeser, atau menyentuh elemen ini]

---

## 6. Execution Roadmap & Phases

> **Aturan Eksekusi:** Kerjakan satu fase per giliran (*step-by-step*). Lakukan verifikasi sebelum melangkah ke fase berikutnya.

- [ ] **Fase 1: Foundation & Setup**
  - Setup token CSS variables atau Tailwind config sesuai palet di atas.
  - Setup font pairing dan konfigurasi pustaka animasi (misal: GSAP / motion).
  - Setup struktur folder modular (`src/components/`, `src/data/`, dll.).

- [ ] **Fase 2: Visual Anchor / Hero Section**
  - Implementasi headline maksimal 2 baris dengan font display.
  - Penataan pencahayaan fisik dan komposisi visual utama.
  - Verifikasi responsif mobile, tablet, dan desktop pada 60 FPS.

- [ ] **Fase 3: Core Feature / Story Section**
  - Implementasi tata letak non-kartu generik (radial arc, perspective cluster, atau pinned timeline).
  - Integrasi aset media otentik.

- [ ] **Fase 4: Interactive Feature Implementation ("One Live Thing")**
  - Pembangunan komponen interaktif utama.
  - Uji interaktivitas pada perangkat sentuh (touch/mobile) dan mouse (desktop).

- [ ] **Fase 5: Secondary Content & Showcase Flow**
  - Implementasi section pendukung dan penutup.
  - Transisi sinematik masuk/keluar adegan.

- [ ] **Fase 6: Polish, Performance & Verification Audit**
  - Audit kepatuhan terhadap `DESIGN_ANTI_SLOP.md` & `RULES.md`.
  - Pengecekan 100% zero dead code & zero comments.
  - Verifikasi performa 60 FPS dan lifecycle cleanup pada seluruh listener/animasi.
