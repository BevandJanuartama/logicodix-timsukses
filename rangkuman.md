# DOKUMEN RANGKUMAN & SPESIFIKASI SUBMISSION LOGICODIX 2026
> **Status:** Living Document (Wajib diperbarui di setiap iterasi/prompting penambahan fitur, aset, dan konfigurasi)  
> **Standar Rujukan:** Guidebook LOGICODIX 2026 (Halaman 20 - Ketentuan Wajib Dokumentasi & Submission)

---

## 1. Identitas Tim & Anggota
* **Nama Tim:** Tim Sukses Logicodix
* **Daftar Anggota:**
  1. **Muhammad Bevand Januartama** (`BevandJanuartama`) - Lead & Fullstack 3D Developer
  2. *[Nama Anggota 2]* - UI/UX Designer & Frontend Engineer
  3. *[Nama Anggota 3]* - Medical Content & Knowledge Base Researcher
  4. *[Nama Anggota 4]* - QA & Product Researcher

---

## 2. Profil & Konsep Solusi Aplikasi
* **Kategori Aplikasi:** Web App (Interactive 3D Educational Platform)
* **Subtema:** Pendidikan & Kesehatan (*Health & Medical Education*)
* **Nama Aplikasi:** **Dental Explorer (DentaScope 3D)**
* **Masalah yang Diangkat:**
  * **Pernyataan Masalah:** Pelajar, mahasiswa, dan masyarakat umum membutuhkan media edukasi kesehatan gigi yang menyajikan anatomi, penyakit, faktor risiko, dan pencegahan secara terstruktur serta mudah dieksplorasi, tetapi materi konvensional berupa teks dan gambar statis 2D menyulitkan pengguna memahami hubungan spasial antara struktur internal gigi (email, dentin, pulpa, sementum, ligamen periodontal, tulang alveolar) dengan progresi penyakit.
  * **Bukti di Lapangan:** Berdasarkan rujukan WHO (*Oral Health Fact Sheet*) dan Survei Kesehatan Indonesia (SKI) 2023 Kemenkes RI (`SRC-001`, `SRC-010`), beban penyakit gigi dan mulut (khususnya karies dan penyakit periodontal) masih sangat tinggi akibat rendahnya literasi mengenai demineralisasi asam, area rawan plak interdental, serta anggapan keliru bahwa kerusakan gigi bersifat instan atau tidak dapat dicegah pada tahap awal (*white spot lesion*).
* **Deskripsi Solusi:**
  * **Dental Explorer (DentaScope 3D)** adalah platform edukasi kesehatan gigi berbasis web dengan pendekatan visual *hybrid*: menggabungkan model anatomi rongga mulut & gigi 3D prosedural interaktif (dari skala Makro lengkung rahang 32 gigi FDI, Meso fokus gigi, hingga Mikro penampang melintang/*cross-section*) dengan lapisan berwarna, kontrol visibilitas layer, katalog 10 penyakit gigi terverifikasi, *Damage Simulator* (simulasi tahapan klinis Karies `ST-CAR-0..3` & Periodontitis `ST-PER-0..2` serta kebiasaan buruk & Kurva pH Stephan), *Cleaning Simulator* (latihan menyikat gigi, flossing, dan pembersih lidah real-time), materi 5 pilar pencegahan, kuis interaktif, serta sistem tata kelola referensi ilmiah (`SRC-001` s/d `SRC-012`).
* **Target Pengguna:**
  * **Pengguna Primer:** Pelajar, mahasiswa kedokteran gigi/kesehatan, dan masyarakat umum yang ingin mempelajari anatomi serta pencegahan penyakit gigi secara visual.
  * **Pengguna Sekunder:** Tenaga pendidik, penyuluh kesehatan gigi, dan reviewer medis (dokter gigi) yang meninjau akurasi materi edukasi (`Draft | Under Review | Approved`).

---

## 3. Daftar Fitur Utama (MVP Roadmap & Status)
*Catatan: Seluruh fitur di bawah merefleksikan kebutuhan fungsional PRD (`FR-001` s/d `FR-016`) dan Knowledge Base (`03_Dental_Knowledge_Base.xlsx`).*

| No | Fitur Utama | Modul PRD | Deskripsi Alur & Fungsi | Status Implementasi |
|:--:|---|---|---|:--:|
| 1 | **Home & Quick Mode Switcher** | `FR-001` | Pengenalan produk dengan antarmuka krem terang *Ruang Praktik Hangat* (Fase 12) dan navigasi cepat antar-modul | `Selesai (Fase 3)` — Hero + tab Anatomi/Penyakit; tab Simulator/Kuis menyusul Fase 4–5 |
| 2 | **3D Dental & Mouth Explorer (LOD Makro–Meso–Mikro)** | `FR-002`..`FR-006` | Eksplorasi 3D 32 gigi (FDI), *rotate/zoom/pan/reset*, pemilih mesh berdasarkan object ID, *cutaway cross-section*, dan *Show/Hide Layer Anatomi* | `Selesai (Fase 2)` — engine 3D, raycast 10 struktur + 7 zona rongga mulut, toggle 10 lapisan, cutaway |
| 3 | **Katalog Anatomi & Klasifikasi Jenis Gigi** | `FR-007` | Informasi mendalam 10 struktur (`AN-001` Enamel s/d `AN-010` CEJ) & 4 jenis gigi (`TT-001`..`TT-004` sulung vs permanen) beserta meter kerentanan | `Selesai (Fase 3)` — tanpa meter kerentanan (tidak ada di Knowledge Base) |
| 4 | **Katalog 10 Penyakit & Kondisi Gigi** | `FR-008`..`FR-009` | Direktori `DIS-001` s/d `DIS-010` lengkap dengan definisi, faktor risiko, gejala umum, bagian terdampak, pencegahan, *safety note*, dan rujukan `SRC-xxx` | `Selesai (Fase 3)` — + tombol "Lihat di 3D"; "Buka Simulator" di Fase 4 |
| 5 | **Damage Simulator (Tahapan Klinis & Kebiasaan)** | `FR-010`..`FR-011` | Visualisasi tahapan karies (`ST-CAR-0..3`), periodontitis (`ST-PER-0..2`), skenario es batu, bruxism, boba (Kurva pH Stephan), & merokok pada model 3D | `Selesai (Fase 4, redesign Fase 9)` — scrubber tahap ST-CAR/ST-PER dengan tahan-bandingkan, Kurva Stephan dengan zona kritis pH < 5,5; partikel es & bakteri belum diport; 4 skenario Stephan masih pola editorial belum bersumber |
| 6 | **3D Cleaning Simulator & 5 Pilar Pencegahan** | `FR-012` | Simulasi interaktif membersihkan plak dengan sikat gigi, benang gigi, & pembersih lidah real-time + materi edukasi `PRE-001`..`PRE-005` | `Selesai (Fase 4, redesign Fase 9)` — hygiene lab dengan partikel instanced, skor kebersihan 0–100%, 5 pilar pencegahan dalam lipatan; scaler, kalkulus, dan noda belum ada di logika |
| 7 | **Interactive Dental Quiz** | `FR-013` | Kuis evaluasi pemahaman anatomi, penyakit, dan pencegahan dengan transisi antar soal, umpan balik instan, skor akhir, navigasi keyboard (1–4, panah, Enter), pembahasan + tautan referensi, dan tombol "Tunjukkan di 3D" | `Selesai (Fase 5, redesign Fase 10)` — peta struktur soal Q-001..Q-006 (`lib/data/quizFocus.ts`) belum ditinjau klinisi |
| 8 | **Content Governance & Scientific References** | `FR-014`..`FR-016` | Dialog referensi ilmiah 12 SRC (`SRC-001`..`SRC-012`) dengan sorotan; dialog tata kelola bertab (status konten, AST `AST-001`..`AST-004`, GAP, & *Medical Disclaimer* FR-015); status review (`Draft`, `Under Review`, `Approved`) | `Selesai (Fase 5, redesign Fase 10)` — perubahan status disimpan lokal di peramban |

---

## 4. Arsitektur Teknologi (Tech Stack)
* **Frontend & 3D Engine:**
  * Framework: **Next.js 15** (App Router) + **React 19** + **TypeScript 5.9**
  * 3D Rendering: **Three.js (`0.180`)** + **React Three Fiber (`@react-three/fiber` v9)** + **`@react-three/drei` v10** (Procedural Geometry + Custom GLSL Shaders + Local Clipping Planes + `InstancedMesh` + `PerformanceMonitor`)
  * State Management: **Zustand v5** (Reactive UI store + non-reactive 60 FPS simulation state `sim.ts`)
  * Styling & UI: **Tailwind CSS v4** (`@tailwindcss/postcss`) + Design System Token Tiga Lapis (primitif → semantik → komponen) dengan satu tema krem terang (cream `#FBF5EE`, paper `#FFFCF8`, ink `#2A201B`, coral `#E2643F` non-teks, coral-deep `#A93E1F` untuk teks dan tombol; status ok `#2E7048`, warn `#8F5300`, danger `#B42318`)
  * Tipografi: **`Newsreader`** (display) dan **`Atkinson Hyperlegible Next`** (teks), skala `text-display` / `title` / `subtitle` / `body` (17px) / `caption` (15px)
  * Motion & UI Components: **framer-motion** + komponen dari **21st.dev** (shadcn registry, di-restyle ke token desain)
  * Iconography: **Lucide React** + Custom Clinical Dental SVG Icons
* **Data & Knowledge Base Architecture:**
  * Structured Seed Dataset: TypeScript Knowledge Base (`lib/knowledgeBase.ts` + `lib/data/*.ts`, dihasilkan dari xlsx; kuis diperkaya menjadi 8 soal berstatus `Draft`) yang mengimplementasikan seluruh 11 tabel dari `03_Dental_Knowledge_Base.xlsx` (`tooth_structures`, `tooth_types`, `dental_diseases`, `disease_stages`, `prevention_topics`, `dental_models`, `quiz_questions`, `sources`, `research_gaps`).
* **Deployment & Hosting:**
  * Platform: Vercel / Node.js Server (`npm run build && npm run start`)

---

## 5. Diagram Arsitektur Sistem & Alur Data

### A. Diagram Arsitektur Sistem
```mermaid
graph TD
    User["Pengguna (Desktop / Tablet / Mobile)"]
    UI["Next.js 15 App Router UI Layer (HUD krem)"]
    Store["Zustand Reactive Store & 60FPS Sim State"]
    R3F["React Three Fiber 3D Scene Engine"]
    Proc["Procedural Tooth/Mouth Geometry & Custom Shaders"]
    KB[("Dental Knowledge Base (AN / TT / DIS / ST / PRE / SRC)")]

    User -->|Klik / Geser / Pinch / Gosok| UI
    User -->|Orbit / Raycast Mesh Selection| R3F
    UI -->|Dispatch Action (Mode, Tooth, Stage, Layer, Quiz)| Store
    R3F -->|Select Object ID & Update LOD/Clean Score| Store
    Store -->|Sync State| UI
    Store -->|Uniforms & Clipping Planes| Proc
    Proc -->|Render 60 FPS| R3F
    KB -->|Data Anatomi, Penyakit, Tahap, Kuis & Sumber| UI
```

### B. Alur Perjalanan Pengguna (User Journey sesuai PRD Bagian 6)
```mermaid
sequenceDiagram
    autonumber
    actor U as Pengguna
    participant H as Home / Hero
    participant E as 3D Explorer & Anatomy
    participant D as Diseases Catalog
    participant S as Damage & Clean Simulator
    participant Q as Prevention & Quiz
    participant R as References & Governance

    U->>H: Buka aplikasi & pilih mulai eksplorasi (FR-001)
    H->>E: Muat model rongga mulut & gigi 3D (FR-002..FR-006)
    U->>E: Klik gigi / struktur anatomi (enamel, dentin, pulp, dll.) & atur Show/Hide Layer
    E->>D: Klik penyakit terkait dari struktur anatomi (FR-007..FR-009)
    D->>S: Jalankan simulasi tahapan penyakit (ST-CAR-0..3 / ST-PER-0..2) & kebiasaan buruk (FR-010..FR-011)
    S->>Q: Latih pembersihan plak 3D & pelajari 5 pilar pencegahan lalu kerjakan Kuis (FR-012..FR-013)
    Q->>R: Verifikasi kutipan sumber ilmiah (SRC-001..SRC-012) & status review medis (FR-014..FR-016)
```

---

## 6. Panduan Instalasi, Konfigurasi & Menjalankan Aplikasi

### A. Prasyarat Sistem
* Node.js v18.18.0 atau lebih baru (disarankan v20 atau v22 LTS)
* Paket manajer: `npm`

### B. Langkah Instalasi Dependensi
```bash
# 1. Kloning repositori
git clone https://github.com/BevandJanuartama/logicodix-timsukses.git
cd logicodix-timsukses

# 2. Pasang paket dependensi
npm install
```

### C. Konfigurasi Variabel Lingkungan (`.env.example`)
Aplikasi berjalan secara *self-contained* tanpa ketergantungan kunci API berbayar saat runtime agar dapat diuji secara instan oleh dewan juri:
```bash
cp .env.example .env
```

| Nama Variabel | Wajib / Opsional | Deskripsi & Contoh Nilai |
|---|:---:|---|
| `NEXT_PUBLIC_APP_NAME` | Opsional | Nama aplikasi (`Dental Explorer 3D`) |
| `NEXT_PUBLIC_DEFAULT_REVIEW_FILTER` | Opsional | Filter tata kelola konten (`all` atau `Approved`) |

### D. Menjalankan Aplikasi di Localhost
```bash
# Menjalankan server pengembangan (development)
npm run dev

# Memeriksa tipe TypeScript
npm run typecheck

# Membangun dan menjalankan versi produksi (production build)
npm run build
npm run start
```
Akses aplikasi melalui peramban web di `http://localhost:3000`.

---

## 7. Tata Kelola Konten (Content Governance & Review Mode)
Sesuai kebutuhan `FR-014` dan `FR-015` pada PRD, aplikasi menyertakan fitur **Content Governance & Admin Inspector** yang dapat diakses langsung dari bilah atas tanpa memerlukan login kredensial eksternal:
* **Status Editorial (`review_status`):** Setiap item anatomi, penyakit, tahapan simulasi, dan soal kuis memiliki status `Approved`, `Under Review`, atau `Draft`.
* **Reviewer Mode Toggle:** Pengguna/juri dapat mengalihkan tampilan antara seluruh konten dataset atau memfilter khusus konten berstatus `Approved` serta memeriksa matriks aset 3D (`AST-001`..`AST-004`) dan *Research Gaps* (`GAP-001`..`GAP-006`).

---

## 8. Dokumentasi Arsitektur Komputasi & Visualisasi Prosedural
1. **3D Prosedural Tanpa Beban Aset Eksternal (`NFR-001`):** Seluruh 32 gigi (seri, taring, premolar, geraham) beserta lapisan internal (`enamel`, `dentin`, `pulp` dengan pembuluh arteri/vena/saraf, `cementum`, `pd_ligament`, `alveolar_bone`, `gingiva`, dan lidah) dibangkitkan secara matematis/prosedural menggunakan *lathe profiles* dan *custom GLSL shaders*, menghasilkan waktu muat instan dan performa 60 FPS di perangkat mobile maupun desktop.
2. **Simulasi Biokimia & Klinis Deterministik:** Perhitungan kurva demineralisasi pH plak (Kurva Stephan dengan ambang kritis pH 5,5) serta interpolasi tahapan kerusakan (`ST-CAR-0..3` & `ST-PER-0..2`) dihitung secara deterministik berdasarkan rujukan ilmiah.
3. **Pemetaan Object ID 3D → Knowledge Base (`FR-004`):** Raycast memetakan mesh ke `AN-001..010` (`enamel` = mahkota luar, `cementum` = akar luar, `pulp_chamber`/`root_canal` = rongga pulpa di atas/bawah CEJ, `pulp` = pembuluh & saraf, `cej` = cincin batas email–sementum, `pd_ligament` = cangkang tipis di sekitar akar) serta zona papila, palatum, dasar mulut, dan 4 zona lidah. Lapisan tersembunyi dibuang di shader (`discard` per pita CEJ) dan dilewati raycast sehingga lapisan di bawahnya tetap dapat diklik.
4. **Anggaran Render:** ±41 draw call dan ±58 ribu segitiga per frame pada tampilan makro; geometri prosedural di-cache per gigi, resolusi tinggi hanya untuk gigi terpilih, DPR adaptif via `PerformanceMonitor`.
5. **Batas Keamanan Medis (`NFR-006`):** Seluruh modul menampilkan *Medical Disclaimer* bahwa visualisasi bersifat edukatif dan bukan alat diagnosis mandiri maupun *personal risk scoring*.
6. **Redesign Visual Fase 7 (Geometri Anatomi, Shader Jaringan & Studio Lighting):**
   * **Morfologi mahkota** (`lib/three/crownMorphology.ts`): cusp, fisura, fossa sentral, cingulum, dan marginal ridge dibentuk lewat deformasi vertex prosedural. **Akar** (`lib/three/toothRoots.ts`): bifurkasi/trifurkasi gigi anterior vs posterior (`TT-001..004`) dengan alur furkasi.
   * **Kontur CEJ** (`lib/three/cejContour.ts`): kurva batas email–sementum per jenis gigi, dirender lewat GLSL `CEJ_GLSL`.
   * **Shader email & dentin** (`lib/three/toothShader.ts`, `lib/three/toothOptics.ts`): aproksimasi *subsurface scattering* untuk translusensi mutiara, Fresnel rim-light, dan micro-roughness (`AN-001`, `AN-002`).
   * **Shader gusi** (`lib/three/gingivaShader.ts`, `lib/three/softTissue.ts`): specular *wetness* saliva (Schlick Fresnel) dan rona sehat vs meradang lewat `uGumInflammation` (`AN-010`).
   * **Studio lighting** (`components/three/StudioLights.tsx`): rig tiga titik (key hangat-putih, cool rim dari belakang, warm fill) ditambah hemisphere light; rig berotasi mengikuti azimuth kamera dengan damping.
7. **Redesign Design System & Shell HUD Fase 8 (Token Tiga Lapis, Explore & Katalog Penyakit):**
   * **Token tiga lapis** (`app/globals.css`): primitif `--p-*`, semantik `--surface-*` / `--text-*` / `--status-*`, dan komponen `--panel-*`, `--button-*`, `--chip-*`; tema terang dan gelap lewat `data-theme` (tema gelap dihapus Fase 12, lihat item 11); kurva easing `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`.
   * **Tipografi:** digantikan pada Fase 12 (lihat item 11).
   * **Shell HUD** (`components/ui/shell/*`): navigasi spasial dengan indikator `layoutId`, panel inspektor, dan bottom-sheet mobile yang dapat di-drag.
   * **Explore** (`components/ui/explore/*`): bagian detail dapat dilipat (`ExploreDisclosure`), matriks lapisan `AN-001..010`, dan perbandingan `TT-001..004`.
   * **Katalog penyakit** (`components/ui/diseases/*`): kartu `DiseaseCard` dengan lencana tingkat perhatian editorial (`Ringan` / `Sedang` / `Segera`, dari `diseaseSeverity.ts`), filter cepat, sitasi `SRC-*`, dan aksi "Lihat di 3D".
   * **Catatan klinis:** pemetaan tingkat perhatian keparahan per penyakit (`DIS-001..010`) adalah penataan editorial internal dan **belum ditinjau klinisi**. Tingkat ini bukan penilaian risiko personal (lihat `NFR-006`).
8. **Redesign Simulator Patologi & 3D Hygiene Lab Fase 9 (Scrubber, Kurva Stephan & Partikel Instanced):**
   * **Scrubber tahap** (`components/ui/simulator/StageScrubber.tsx`, `CompareHold.tsx`, `TimelinePlayer.tsx`): tahap `ST-CAR-0..3` & `ST-PER-0..2` dengan indikator pegas `layoutId`, tombol tahan-bandingkan untuk membandingkan tahap, dan sinkronisasi real-time ke shader gigi/gusi/tulang 3D.
   * **Kurva Stephan** (`components/ui/simulator/StephanCurve.tsx`, `lib/data/stephanScenarios.ts`): zona kritis pH `< 5,5` ditandai secara visual dibanding kondisi remineralisasi; 4 skenario kebiasaan harian.
   * **Hygiene lab** (`components/three/cleaning/PlaqueLayer.tsx`, `CleaningSparkles.tsx`): plak dan percikan partikel dirender sebagai `InstancedMesh` untuk menjaga jumlah draw call tetap rendah.
   * **Skor kebersihan** (`components/ui/clean/ScoreSummary.tsx`, `CleanFeedback.tsx`): *Cleaning Score* 0–100% dengan umpan balik per alat.
   * **5 pilar pencegahan** (`components/ui/clean/PreventionPillars.tsx`): materi `PRE-001..005` disajikan dalam lipatan agar panel tetap ringkas.
   * **Catatan terbuka:** (a) 4 skenario Stephan di `lib/data/stephanScenarios.ts` adalah pola editorial yang **belum bersumber** dan belum ditinjau klinisi; (b) alat yang tersedia saat ini adalah sikat, benang gigi, pembersih lidah, dan obat kumur; scaler, kalkulus, dan noda **belum ada di logika**.

9. **Redesign Kuis, Referensi & Tata Kelola Fase 10 (Transisi Soal, Dialog Native & Badge):**
   * **Kuis** (`components/ui/quiz/*`, `useQuizKeyboard.ts`): transisi antar soal, umpan balik instan per jawaban (`AnswerFeedback`), skor akhir (`QuizResult`), navigasi keyboard 1–4 / panah / Enter, dan tombol "Tunjukkan di 3D".
   * **Dialog native** (`components/ui/shell/Dialog.tsx`): tema gelap dengan animasi `scale(0.95)`; **Referensi** (`ReferencesDialog.tsx`): 12 SRC dengan sorotan; **Tata Kelola** (`GovernanceDialog.tsx`): bertab dengan status konten (`ContentStatusList`), AST, GAP (`GapList`), dan disclaimer FR-015 (`MedicalDisclaimer`).
   * **Badge** (`components/ui/shell/StatusBadge.tsx`, `Badge.tsx`): lencana status dengan ikon.
   * **Catatan terbuka:** peta struktur soal di `lib/data/quizFocus.ts` (Q-001..Q-006) adalah keputusan editorial yang **belum ditinjau klinisi**.
10. **Audit & Hardening Fase 11 (Verifikasi Kode, Lint, Inspeksi Browser & Target Sentuh):**
   * **Audit kode:** 0 komentar kode, 0 impor/parameter tak terpakai (`tsc --noUnusedLocals --noUnusedParameters`).
   * **Lint anti-slop (`taste-skill`):** 16 FAIL + 8 WARN, seluruhnya temuan desain (mono, shadow, hairline, glass, outlined-box, bounce, numbering) yang **belum diputuskan**.
   * **Inspeksi browser:** 1440x900 dan 375x812 pada 5 mode (Anatomi, Penyakit, Simulasi, Bersihkan, Kuis) serta dialog Referensi dan Tata Kelola: tanpa overflow horizontal, tanpa kontras teks < 4,5:1, tanpa error konsol.
   * **Perbaikan:** target sentuh minimal 40px (ModeTabs, BottomSheet handle, ExploreChip, ToothTypeTable, ContentStatusList, GovernanceDialog, AnswerFeedback, ViewPresetMenu, CompareHold, SimulatorPanel, DiseaseDetail); label LOD 11px; ID referensi tidak terpecah dan judul line-clamp-2 di ReferencesDialog.
   * **Build produksi:** `npm run typecheck` dan `npm run build` lulus 0 error (Next.js 15.5); route `/` 187 kB, First Load JS 290 kB, shared 103 kB.
   * **Belum terverifikasi:** FPS 60 (panel browser tersembunyi), drag sentuh nyata, dan perangkat nyata.
   * **Ringkasan catatan terbuka:** (a) tingkat keparahan penyakit (`components/ui/diseases/diseaseSeverity.ts`), (b) 4 skenario Stephan (`lib/data/stephanScenarios.ts`), dan (c) peta fokus kuis Q-001..Q-006 (`lib/data/quizFocus.ts`) adalah keputusan editorial yang **belum ditinjau klinisi**; (d) angka Kemenkes SKI belum tersedia (GAP-004).
11. **Redesign Arah "Ruang Praktik Hangat" Fase 12 (Tema Krem Terang, Tipografi & Alas 3D):**
   * **Arah desain** (`.agents/plan/FASE12_DIRECTION.md`): nama tab tetap; tema gelap dihapus; thumbnail rail dibuat dari render model sendiri.
   * **Tema tunggal** (`app/globals.css`): satu tema krem terang; nama token lama dipertahankan sebagai alias. Dihapus: tema gelap, `.glass`, rim-light, dan palet navy/biru.
   * **Tipografi** (`app/layout.tsx`): `Newsreader` (display, `--font-display`) dan `Atkinson Hyperlegible Next` (teks, `--font-body`) menggantikan `Archivo`, `Instrument Sans`, dan `JetBrains Mono`; `colorScheme: light`, `themeColor #FBF5EE`. Kelas telemetri kini alias `tabular-nums`.
   * **Keterbacaan:** 50 file komponen; label mono/kapital kecil dan teks di bawah 15px diganti ke skala baru.
   * **Alas 3D:** latar canvas `#F6ECE1` (CSS, tidak terkena tone mapping); alas baru `components/three/Pedestal.tsx` (silinder `#EADBCB` + `ContactShadows` dari drei); lampu hangat (hemisphere `#FFF7EE`/`#E8CDB9`, key `#FFF1E0`, fill `#FFD9BD`, rim `#FFE2CF`); exposure 1.05.
   * **Verifikasi:** `typecheck` dan `build` produksi lulus (route `/` 187 kB, First Load JS 290 kB); tampilan krem terlihat di browser 1440x900 dan 375x812.
   * **Catatan terbuka (dijadwalkan Fase 13–14):** (a) indikator Makro/Meso/Mikro sempit setelah teks membesar; (b) kode `TT-` membungkus dua baris di tabel jenis gigi; (c) framing kamera awal terlalu dekat di desktop.

---

## 9. Atribusi Sumber Daya & Referensi Ilmiah (`SRC-001` s/d `SRC-012`)

### A. Pustaka Kode Pihak Ketiga
* **Next.js & React** (Lisensi MIT)
* **Three.js, `@react-three/fiber`, `@react-three/drei`** (Lisensi MIT)
* **Zustand** (Lisensi MIT)
* **framer-motion & camera-controls** (Lisensi MIT)
* **Engine prosedural & konten skenario** diadaptasi dari proyek referensi `D:\test-bepan\dentascope`
* **Tailwind CSS v4 & Lucide React** (Lisensi MIT / ISC)
* **Tipografi:** `Newsreader` dan `Atkinson Hyperlegible Next` via Google Fonts (OFL, dimuat lewat `next/font`)

### B. Referensi Ilmiah & Medis Resmi (Sesuai `01_Dental_Research` & `03_Dental_Knowledge_Base`)
* **`SRC-001`** — World Health Organization (WHO). *Oral health*. https://www.who.int/news-room/fact-sheets/detail/oral-health
* **`SRC-002`** — World Health Organization (WHO). *Sugars and dental caries*. https://www.who.int/news-room/fact-sheets/detail/sugars-and-dental-caries
* **`SRC-003`** — National Center for Biotechnology Information (NCBI). *Anatomy, Head and Neck: Teeth*. https://www.ncbi.nlm.nih.gov/books/
* **`SRC-004`** — National Center for Biotechnology Information (NCBI). *Histology, Tooth*. https://www.ncbi.nlm.nih.gov/books/
* **`SRC-005`** — National Center for Biotechnology Information (NCBI). *Histology, Periodontium*. https://www.ncbi.nlm.nih.gov/books/
* **`SRC-006`** — Pitts NB et al. *Dental caries*. Nature Reviews Disease Primers (2017), 3, 17030. https://doi.org/10.1038/nrdp.2017.30
* **`SRC-007`** — Papapanou PN et al. *Periodontitis: Consensus report of workgroup 2 of the 2017 World Workshop*. J Clin Periodontol (2018).
* **`SRC-008`** — International Caries Classification and Management System (ICCMS). *ICCMS Guide / resources*. https://www.iccms-web.com/
* **`SRC-009`** — Centers for Disease Control and Prevention (CDC). *About Periodontal (Gum) Disease*. https://www.cdc.gov/oral-health/about/gum-periodontal-disease.html
* **`SRC-010`** — Kementerian Kesehatan Republik Indonesia. *Survei Kesehatan Indonesia (SKI) 2023 — Laporan Tematik Kesehatan Gigi dan Mulut*. https://www.badankebijakan.kemkes.go.id/
* **`SRC-011`** — American Dental Association (ADA). *MouthHealthy / Dental topics and tooth anatomy resources*. https://www.mouthhealthy.org/
* **`SRC-012`** — Queen Mary University of London. *Atlas of tooth development and eruption*. https://www.qmul.ac.uk/dentistry/

---

## 10. Log Pembaruan Dokumen (Changelog)
*Dokumen ini wajib dimutakhirkan secara konsisten setiap kali terjadi perubahan:*

| Versi | Tanggal | Bagian yang Diperbarui | Keterangan Perubahan |
|:---:|:---:|---|---|
| `v0.1.0` | 11/11/2026 | Inisialisasi Berkas | Pembuatan struktur panduan rujukan resmi submission |
| `v0.1.1` | 12/11/2026 | Integrasi Tooling & MCP | Konfigurasi Model Context Protocol (MCP) GitHub via `@modelcontextprotocol/server-github` dan autentikasi akun BevandJanuartama |
| `v0.2.0` | 12/11/2026 | Perencanaan Produk, Riset & Arsitektur | Sinkronisasi PRD (`02_Dental_Explorer_PRD`), Research (`01_Dental_Research`), Knowledge Base (`03_Dental_Knowledge_Base.xlsx`), dan referensi visual `dentascope` ke dalam `PLAN.md`, `TASK.md`, serta `rangkuman.md` |
| `v0.2.1` | 12/11/2026 | Rencana UI Motion & Strategi Model | Menambah layer UI 21st.dev (shadcn CLI / 21st MCP) + `framer-motion` ke `PLAN.md` §7, strategi model Haiku/Sonnet/Opus & hemat token §8, serta rekomendasi model + skill per subtask di `TASK.md` |
| `v0.3.0` | 12/11/2026 | Fase 1: Foundation | Scaffold Next.js 15 + Tailwind v4 + R3F + Zustand + `framer-motion`; tema `.bg-app`/`.glass`; `lib/types.ts`, `lib/data/*` (10 anatomi, 4 jenis gigi, 10 penyakit, 7 tahap, 5 pencegahan, 4 aset, 8 kuis, 12 referensi, 6 gap), `lib/store.ts`; typecheck & build lulus |
| `v0.4.0` | 12/11/2026 | Fase 2: 3D Engine & Layer Visibility | Port engine prosedural `dentascope` ke `lib/three/*` & `components/three/*` (layout FDI, geometri lathe, shader lapisan, jaringan lunak, clipping); mesh baru `pd_ligament` & `cej`; pemisahan `enamel`/`cementum` dan `pulp_chamber`/`root_canal` via shader; raycast AN-001..010 + highlight; toggle 10 lapisan (`LayerToggles`) & cutaway (`SceneInspector`); store: hover, LOD, cutaway, perintah kamera; typecheck lulus, diuji di browser 1440px & 375px |
| `v0.5.0` | 12/11/2026 | Fase 3: Shell, Anatomi & Penyakit | `components/ui/shell/*` (TopBar tab animasi `layoutId`, Hero, ViewControls, LodIndicator, HoverTip, Panel glass + bottom-sheet drag), `components/ui/explore/*` (intro, detail struktur AN, zona rongga mulut, ringkasan gigi + tabel TT, toggle lapisan), `components/ui/diseases/*` (katalog 10 penyakit, filter kategori/struktur, sumber SRC, Lihat di 3D); data baru `lib/data/oralRegions.ts` (konten zona mulut dari `dentascope`), `lib/data/diseaseLinks.ts` (pemetaan penyakit → struktur & fokus kamera, diturunkan dari kolom *affected structures*); store `intro`; tanpa dependensi baru |
| `v0.6.0` | 12/11/2026 | Fase 4: Simulator & Pembersihan | Store baru `lib/simulatorStore.ts` & `lib/cleaningStore.ts`; engine efek `lib/three/toothShader.ts`, `toothEffects.ts`, `cleaning.ts`, `math.ts`; komponen 3D `simulation/*` (SimulationClock, TartarLayer) & `cleaning/*` (PlaqueLayer, ToolCursor, CleaningController); UI `simulator/*` (tahap ST-CAR/ST-PER dari KB, 4 skenario kebiasaan, Kurva Stephan) & `clean/*` (skor, alat, obat kumur, toast, 5 Pilar Pencegahan); data `lib/data/habitScenarios.ts` (konten skenario dari `dentascope`); tab Simulasi & Bersihkan; dependensi langsung baru `camera-controls@^3.1.2` (sebelumnya transitif via drei) |
| `v0.7.0` | 12/11/2026 | Fase 5: Kuis, Referensi & Tata Kelola | `components/ui/quiz/*` (8 soal KB, umpan balik, skor, pembahasan + SRC), `components/ui/library/*` (dialog Referensi 12 SRC, dialog Tata Kelola: disclaimer, status konten + ubah status, AST, GAP), `Dialog` native, `LibraryMenu`, `StatusBadge` di semua kartu; store `lib/quizStore.ts`, `lib/governanceStore.ts` (localStorage key `dental-explorer-review-status`), `lib/data/contentRegistry.ts`; token warna `--color-amber-ink`, `--color-mint-ink`; tanpa dependensi baru |
| `v0.8.0` | 12/11/2026 | Fase 6: Verifikasi & Hardening | Audit: 0 komentar/dead code, `typecheck` & `build` lulus (statis, `/` 288 kB First Load JS). Perbaikan: `next.config.mjs` + `outputFileTracingRoot` (hilangkan peringatan multi-lockfile), `app/icon.svg` (favicon 404), `aria-label` tombol beranda memuat teks terlihat, TopBar muat di 360–375px (padding, label tab aktif disembunyikan <400px, tombol Library 40px), `Dialog` memakai `useId` (id judul unik). Lighthouse (headless, WebGL perangkat lunak): aksesibilitas 100, SEO 100, best-practices 96, performa 60 mobile / 83 desktop (TBT dominan dari render WebGL SwiftShader); review kode level high: 6 temuan, 2 diperbaiki. Tanpa dependensi atau aset baru |
| `v0.9.0` | 12/11/2026 | Penambahan Fase Redesign Baru (Fase 7–11) | Penambahan Fase Baru (Fase 7 s.d. Fase 11) di `.agents/plan/PLAN.md` (§9) dan `.agents/plan/TASK.md` (Bagian II) untuk Redesign Model 3D & UI Anti-Slop berbasis *discovery skill* (`taste-skill`, `ui-ux-pro-max`, `impeccable`, `ui-styling`, `emil-design-eng`, `threejs-react-three-fiber`) dengan penanda model per subtask (Haiku / Sonnet / Opus) untuk penghematan token, serta mempertahankan riwayat Fase 0–6 secara utuh |
| `v1.0.0` | 12/11/2026 | Fase 7: Redesign Model 3D, Shaders & Studio Lighting | Redesign shader anatomi 3D (enamel SSS, Fresnel rim-light, pulpa vaskular, gusi wetness), CEJ contouring, lighting studio 3-titik, transisi kamera halus; penyertaan kode baseline kuis (`components/ui/quiz/*`), pustaka referensi & tata kelola (`components/ui/library/*`), serta integrasi shell (`components/Experience.tsx`, `app/page.tsx`); sinkronisasi TASK.md & rangkuman.md |
| `v0.10.0` | 12/11/2026 | Fase 7: Redesign Model 3D, Shader & Studio Lighting | Geometri anatomi diperhalus (`crownMorphology.ts`, `toothRoots.ts`, `cejContour.ts`, `softTissue.ts`); shader email/dentin (`toothShader.ts`, `toothOptics.ts`) dan gusi (`gingivaShader.ts`); rig studio 3-titik (`StudioLights.tsx`); audit: 0 komentar kode, `typecheck` lulus; tanpa dependensi atau aset baru |
| `v1.1.0` | 12/11/2026 | Fase 8: Redesign Design System, Shell HUD & Explorer | Token tiga lapis di `app/globals.css` (primitif, semantik, komponen; easing `--ease-out`); font baru `Archivo`, `Instrument Sans`, `JetBrains Mono` di `app/layout.tsx` (menggantikan `Plus Jakarta Sans`); shell HUD spasial dan bottom-sheet (`components/ui/shell/*`); explore dengan bagian lipat (`components/ui/explore/*`); katalog penyakit dengan lencana tingkat perhatian editorial (`components/ui/diseases/*`, `diseaseSeverity.ts`). Audit: 0 komentar kode, `typecheck` dan `build` lulus. Lint anti-slop: temuan desain dilaporkan, belum diperbaiki. Tingkat perhatian keparahan **belum ditinjau klinisi**. Tanpa dependensi paket baru |
| `v1.2.0` | 12/11/2026 | Fase 9: Redesign Simulator Patologi & 3D Hygiene Lab | Scrubber tahap ST-CAR/ST-PER dengan indikator `layoutId` dan tombol tahan-bandingkan (`StageScrubber`, `CompareHold`, `TimelinePlayer`); Kurva Stephan dengan zona kritis pH `< 5,5`; hygiene lab dengan partikel `InstancedMesh` (`PlaqueLayer`, `CleaningSparkles`); skor kebersihan 0–100%; 5 pilar pencegahan dalam lipatan. Audit: 0 komentar kode, `typecheck` lulus. Lint anti-slop: temuan desain dilaporkan, belum diperbaiki. Catatan terbuka: (a) 4 skenario Stephan di `lib/data/stephanScenarios.ts` adalah pola editorial yang belum bersumber; (b) alat yang tersedia adalah sikat, benang gigi, pembersih lidah, dan obat kumur; scaler, kalkulus, dan noda belum ada di logika. Tanpa dependensi paket baru |
| `v1.3.0` | 12/11/2026 | Fase 10: Redesign Kuis, Referensi & Tata Kelola | Kuis dengan transisi soal, umpan balik instan, skor akhir, navigasi keyboard 1–4/panah/Enter, dan tombol "Tunjukkan di 3D" (`components/ui/quiz/*`, `useQuizKeyboard.ts`); `Dialog` native gelap dengan `scale(0.95)`; ReferencesDialog 12 SRC dengan sorotan; GovernanceDialog bertab (status konten, AST, GAP, disclaimer FR-015); `StatusBadge` dan `Badge` baru dengan ikon. Audit: 0 komentar kode, `typecheck` lulus, `build` tidak dijalankan pada iterasi ini. Lint anti-slop: temuan desain dilaporkan, belum diperbaiki. Catatan terbuka: peta struktur soal `lib/data/quizFocus.ts` (Q-001..Q-006) adalah keputusan editorial yang belum ditinjau klinisi. Tanpa dependensi paket baru |
| `v1.5.0` | 12/11/2026 | Fase 12: Redesign Arah "Ruang Praktik Hangat" | Tema krem terang tunggal di `app/globals.css` (tema gelap, `.glass`, rim-light, dan palet navy dihapus; token lama dipertahankan sebagai alias; coral-deep `#A93E1F` untuk teks dan tombol); font `Newsreader` dan `Atkinson Hyperlegible Next` di `app/layout.tsx` (menggantikan Archivo, Instrument Sans, JetBrains Mono); skala tipografi baru `text-display`/`title`/`subtitle`/`body`/`caption`; 50 file komponen disesuaikan ke skala baru; alas 3D `components/three/Pedestal.tsx`, lampu hangat dan latar canvas krem; thumbnail rail dari render model sendiri. `typecheck` dan `build` lulus (route `/` 187 kB, First Load JS 290 kB); tampilan krem diperiksa di browser 1440x900 dan 375x812. Catatan terbuka dijadwalkan Fase 13–14: indikator Makro/Meso/Mikro sempit, kode `TT-` membungkus, framing kamera awal terlalu dekat |
| `v1.4.0` | 12/11/2026 | Fase 11: Audit & Hardening | Audit: 0 komentar kode, 0 impor/parameter tak terpakai (`tsc --noUnusedLocals --noUnusedParameters`). Lint anti-slop `taste-skill`: 16 FAIL + 8 WARN (temuan desain, belum diputuskan). Inspeksi browser 1440x900 dan 375x812 di 5 mode serta dialog Referensi dan Tata Kelola: tanpa overflow horizontal, tanpa kontras teks < 4,5:1, tanpa error konsol. Perbaikan: target sentuh minimal 40px (ModeTabs, BottomSheet handle, ExploreChip, ToothTypeTable, ContentStatusList, GovernanceDialog, AnswerFeedback, ViewPresetMenu, CompareHold, SimulatorPanel, DiseaseDetail), label LOD 11px, ID referensi tidak terpecah dan judul line-clamp-2 di ReferencesDialog. `npm run typecheck` dan `npm run build` lulus 0 error (Next.js 15.5; route `/` 187 kB, First Load JS 290 kB, shared 103 kB). Belum terverifikasi: FPS 60 (panel browser tersembunyi), drag sentuh nyata, perangkat nyata. Catatan terbuka: tingkat keparahan penyakit, 4 skenario Stephan, dan peta kuis Q-001..Q-006 belum ditinjau klinisi; angka Kemenkes SKI belum tersedia (GAP-004). Tanpa dependensi paket baru |
