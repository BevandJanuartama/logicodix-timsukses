# PROJECT PLAN & SPECIFICATION: DENTAL EXPLORER 3D

> **Acuan Dokumen Sumber:**
> - **Research Document:** `.agents/plan/01_Dental_Research.pdf` (Draft v1.0 — 11 Nov 2026)
> - **Product Requirements Document (PRD):** `.agents/plan/02_Dental_Explorer_PRD.pdf` (Draft v1.0 — 11 Nov 2026)
> - **Knowledge Base Dataset:** `.agents/plan/03_Dental_Knowledge_Base.xlsx` (11 Sheets: Anatomy, Tooth Types, Diseases, Disease Stages, Prevention, 3D Assets, Quiz, Data Dictionary, References, Research Gaps)
> - **Design & 3D Engine Benchmark:** `D:\test-bepan\dentascope` (DentaScope 3D — Clean Medical Tech Glassmorphism + Procedural React Three Fiber Engine)

---

## 1. Project Overview & Identity
- **Project Name:** Dental Explorer (DentaScope 3D Educational Platform)
- **Project Type:** Interactive 3D Web Educational Application (Next.js App Router + React Three Fiber)
- **Target Audience & Tone:** Pelajar, mahasiswa kesehatan, dan masyarakat umum. Tone: **Clean Medical Tech** — ilmiah, terstruktur, ramah pengguna, jelas, non-diagnostik, dan kredibel dengan rujukan institusional (WHO, NCBI, CDC, ADA, Kemenkes RI).
- **Core Mission:** Mempermudah pemahaman anatomi gigi secara spasial 3D (makro hingga penampang mikro), menyediakan katalog penyakit dengan rujukan ilmiah terverifikasi, memvisualisasikan tahapan kerusakan anatomi (*Damage Simulator*) dan praktik pembersihan (*Cleaning Simulator*), serta menguji pemahaman melalui materi pencegahan dan kuis interaktif.
- **Design Benchmark & Visual Anchor:** `D:\test-bepan\dentascope` — kanvas 3D interaktif layar penuh dengan *frosted glass panels* (`.glass`), latar *clean medical tech* (`.bg-app` radial dot-grid lembut), indikator Level of Detail (Makro · Meso · Mikro), dan panel responsif (floating sidebar di desktop, draggable bottom-sheet di mobile).

---

## 2. Sintesis Penelitian & Basis Data (`01_Dental_Research` & `03_Dental_Knowledge_Base`)

### A. Struktur Anatomi Gigi (`01_Anatomy` — 10 Entitas Wajib)
| ID | Struktur | Jenis Jaringan | 3D Object ID | Lokasi & Fungsi Utama | Catatan Klinis Wajib |
|---|---|---|---|---|---|
| `AN-001` | **Enamel (Email)** | Jaringan keras | `enamel` | Mahkota gigi; lapisan terluar sangat termineralisasi pelindung jaringan bawahnya | Tidak dapat tumbuh kembali; lesi awal dapat mengalami remineralisasi |
| `AN-002` | **Dentin** | Jaringan keras | `dentin` | Di bawah enamel (mahkota) & cementum (akar); membentuk sebagian besar struktur gigi | Memiliki tubulus dentin; sensitivitas dipengaruhi kondisi dan paparan dentin |
| `AN-003` | **Pulp (Pulpa)** | Jaringan lunak | `pulp` | Pulp chamber & root canal; jaringan ikat berisi pembuluh darah dan saraf | Jangan menyamakan pulp chamber dengan seluruh jaringan pulpa |
| `AN-004` | **Cementum (Sementum)** | Jaringan keras | `cementum` | Menutupi permukaan akar; tempat perlekatan serat periodontal | Bedakan cementum dari enamel |
| `AN-005` | **Gingiva (Gusi)** | Jaringan lunak | `gingiva` | Sekitar leher gigi; mengelilingi gigi & menutupi tulang alveolar | Gingivitis tidak selalu berkembang menjadi periodontitis |
| `AN-006` | **Periodontal Ligament (PDL)** | Jaringan ikat | `pd_ligament` | Antara akar & soket tulang; menghubungkan cementum ke tulang & meredam beban kunyah | Istilah disingkat PDL |
| `AN-007` | **Alveolar Bone** | Tulang | `alveolar_bone` | Rahang sekitar akar; membentuk soket penopang akar gigi | Perubahan tulang digambarkan secara edukatif, bukan diagnosis |
| `AN-008` | **Pulp Chamber** | Ruang anatomis | `pulp_chamber` | Bagian dalam mahkota yang berisi jaringan pulpa | Ini ruang anatomis, bukan jenis jaringan |
| `AN-009` | **Root Canal** | Ruang anatomis | `root_canal` | Saluran di akar berisi jaringan pulpa menuju foramen apikal | Jumlah & bentuk saluran bervariasi menurut jenis gigi |
| `AN-010` | **Cementoenamel Junction (CEJ)** | Landmark anatomi | `cej` | Leher gigi; batas pertemuan enamel mahkota dengan cementum akar | Batas anatomi; bukan jaringan tersendiri |

*(Ditambah struktur rongga mulut dari DentaScope: Sela Gigi/Papila Interdental, Langit-langit/Palatum, Dasar Mulut, serta 4 zona Lidah: Ujung, Punggung, Tepi, Pangkal).*

### B. Jenis Gigi (`02_Tooth_Types` — 4 Klasifikasi Dentisi)
| ID | Jenis Gigi | Regio | Fungsi | Gigi Sulung | Gigi Permanen | Catatan |
|---|---|---|---|---:|---:|---|
| `TT-001` | **Incisor / Gigi seri** | Anterior | Memotong makanan | 8 | 8 | Terdapat pada dentisi susu & permanen |
| `TT-002` | **Canine / Gigi taring** | Anterior | Membantu merobek makanan | 4 | 4 | Jumlah sama pada dentisi susu & permanen |
| `TT-003` | **Premolar / Geraham kecil** | Posterior | Menghancurkan dan menggiling makanan | 0 | 8 | Tidak terdapat pada dentisi susu |
| `TT-004` | **Molar / Geraham** | Posterior | Menggiling makanan | 8 | 12 | 12 pada permanen termasuk molar ketiga/bungsu |

### C. Katalog Penyakit & Kondisi (`03_Diseases` — 10 Topik)
1. `DIS-001` **Dental caries (Karies)** — *Penyakit jaringan keras* (Enamel, dentin, pulpa, akar) | Sumber: `SRC-001`, `SRC-002`, `SRC-006`, `SRC-008`
2. `DIS-002` **Gingivitis (Radang gusi)** — *Periodontal* (Gingiva; dapat pulih) | Sumber: `SRC-005`, `SRC-009`
3. `DIS-003` **Periodontitis (Penyakit periodontal)** — *Periodontal* (Gingiva, PDL, cementum, alveolar bone) | Sumber: `SRC-005`, `SRC-007`, `SRC-009`
4. `DIS-004` **Pulpitis (Peradangan pulpa)** — *Pulpal* (Pulp; karies dalam/trauma) | Sumber: `SRC-003`, `SRC-004`
5. `DIS-005` **Enamel erosion (Erosi enamel)** — *Jaringan keras* (Proses kimia non-bakterial asam) | Sumber: `SRC-004`, `SRC-011`
6. `DIS-006` **Dental calculus (Karang gigi)** — *Deposit* (Plak termineralisasi; wajib scaling profesional) | Sumber: `SRC-009`, `SRC-011`
7. `DIS-007` **Tooth fracture (Fraktur gigi)** — *Struktural* (Retak email, fraktur mahkota/akar) | Sumber: `SRC-003`, `SRC-011`
8. `DIS-008` **Dental abscess (Abses dental)** — *Infeksi* (Kumpulan nanah periapikal/periodontal) | Sumber: `SRC-003`, `SRC-011`
9. `DIS-009` **Bruxism (Bruksisme)** — *Kebiasaan/fungsi* (Menggemeretakkan gigi, atrisi & otot rahang) | Sumber: `SRC-011`
10. `DIS-010` **Malocclusion (Maloklusi)** — *Perkembangan/oklusi* (Susunan gigitan & rahang tidak sejajar) | Sumber: `SRC-003`, `SRC-012`

### D. Tahapan Simulasi Kerusakan (`04_Disease_Stages` + Skenario Interaktif)
- **Simulasi Karies (`DIS-001`):**
  - `ST-CAR-0` (Tahap 0): *Healthy* — Tidak ada lesi karies yang divisualisasikan.
  - `ST-CAR-1` (Tahap 1): *Initial enamel change* — Perubahan awal mineral enamel (*white spot lesion*).
  - `ST-CAR-2` (Tahap 2): *Dentin involvement* — Lesi menembus dan melibatkan dentin.
  - `ST-CAR-3` (Tahap 3): *Deep lesion / possible pulp proximity* — Lesi dalam mendekati/melibatkan pulpa.
- **Simulasi Periodontal (`DIS-003`):**
  - `ST-PER-0` (Tahap 0): *Healthy periodontium* — Gingiva dan tulang alveolar sehat.
  - `ST-PER-1` (Tahap 1): *Periodontal inflammation* — Peradangan gingiva tanpa mengklaim kehilangan tulang pasti.
  - `ST-PER-2` (Tahap 2): *Periodontal attachment/bone loss* — Kehilangan perlekatan & resorpsi tulang alveolar.
- **Skenario Kebiasaan Buruk & Kurva pH Stephan (Integrasi DentaScope):**
  - Skenario *Minuman Manis & Boba* (dengan grafik Kurva pH Plak Stephan: sekali minum vs diseruput 1 jam di bawah pH kritis 5,5), *Es Batu & Makanan Keras* (fraktur/retak), *Bruxism* (atrisi tonjol), dan *Malas Sikat Gigi & Merokok* (kalkulus & resesi).

### E. Materi Pencegahan (`05_Prevention`), Kuis (`07_Quiz`), & Referensi (`09_References`)
- **5 Pilar Pencegahan (`PRE-001` s/d `PRE-005`):** Menyikat gigi 2x sehari dengan pasta berfluoride, membersihkan sela gigi (floss/interdental brush), membatasi gula bebas (<10% energi harian, ideal <5% menurut WHO), pemeriksaan gigi berkala, dan menghindari tembakau.
- **Kuis Interaktif (`07_Quiz`):** Bank soal anatomi, periodontal, penyakit, dan pencegahan dilengkapi kunci jawaban, penjelasan edukatif, skor akhir, serta tautan sumber (`SRC-001` s/d `SRC-012`).
- **Governance & Status Review (`FR-014`, `FR-015`):** Setiap entitas memiliki status editorial (`Draft | Under Review | Approved`), atribusi lisensi model 3D (`AST-001`..`AST-004`), dan pencatatan *Research Gaps* (`GAP-001`..`GAP-006`).

---

## 3. Pemetaan Kebutuhan Fungsional PRD (`FR-001` s/d `FR-016`)

| ID | Modul | Kebutuhan PRD | Prioritas | Implementasi di Aplikasi |
|---|---|---|:---:|---|
| `FR-001` | **Home** | Pengenalan produk dan navigasi utama | Must | Glass Hero Overlay + TopBar Mode Switcher dengan akses cepat ke semua modul |
| `FR-002` | **3D Explorer** | Memuat model gigi dan gusi 3D | Must | Procedural 3D Mouth & Molar Cross-Section Engine (R3F + Three.js, 0 MB unduhan eksternal) |
| `FR-003` | **3D Explorer** | Rotate, zoom, pan, dan reset camera | Must | `CameraRig` + `ViewControls` (Zoom In/Out, Reset, 5 Preset Sudut Pandang, Mode Bedah) |
| `FR-004` | **3D Explorer** | Memilih mesh anatomi berdasarkan object ID | Must | Raycasting interaktif pada gigi (FDI 11–48), layer internal (`enamel`, `dentin`, `pulp`, `cementum`, `pd_ligament`, `alveolar_bone`, `cej`), dan jaringan lunak |
| `FR-005` | **3D Explorer** | Panel informasi berubah sesuai objek terpilih | Must | `ExplorePanel` reaktif menampilkan detail klinis, fungsi, kerentanan, penyakit terkait, & sumber |
| `FR-006` | **3D Explorer** | Show/hide layer anatomi | Should | Layer Visibility Toggle (Show/Hide Email, Dentin, Pulpa, Sementum/PDL, Gusi, Tulang) + Cutaway |
| `FR-007` | **Anatomy** | Definisi, fungsi, lokasi, dan relasi struktur | Must | Katalog 10 Struktur Anatomi (`AN-001`..`AN-010`) + 4 Jenis Gigi (`TT-001`..`TT-004`) dengan tabel dentisi sulung/permanen |
| `FR-008` | **Diseases** | Daftar dan detail penyakit/kondisi | Must | Modul/Tab **Penyakit (`DiseasesPanel`)** berisi 10 penyakit (`DIS-001`..`DIS-010`) dengan filter kategori |
| `FR-009` | **Diseases** | Faktor risiko, gejala, bagian terdampak, pencegahan, sumber | Must | Kartu detail penyakit dengan tombol "Lihat di 3D", tombol "Buka di Simulator", *safety note*, & kutipan `SRC-xxx` |
| `FR-010` | **Simulator** | Memilih penyakit dan tahap visualisasi | Must | Pilihan simulasi berbasis tahap klinis PRD (`DIS-001` Karies 4 tahap, `DIS-003` Periodontal 3 tahap) & skenario faktor risiko + *Cleaning Simulator* |
| `FR-011` | **Simulator** | Model dan deskripsi berubah sesuai tahap terpilih | Must | Shader 3D, geometri lesi/gusi/tulang, dan deskripsi tahap (`ST-CAR-0..3`, `ST-PER-0..2`) berubah real-time |
| `FR-012` | **Knowledge** | Menampilkan artikel/materi edukasi yang disetujui | Should | Modul Pencegahan & Edukasi (`PRE-001`..`PRE-005`) dengan filter status review & Kurva pH Stephan |
| `FR-013` | **Quiz** | Menjawab kuis dan melihat skor serta pembahasan | Should | Modul **Kuis Interaktif (`QuizPanel`)** dengan progres soal, umpan balik instan, skor akhir, & pembahasan ber-sumber |
| `FR-014` | **Content Admin** | Mengelola/meninjau anatomi, penyakit, tahap, artikel, sumber | Should | Modal/Drawer **Content Governance & Admin Inspector** untuk melihat/mengubah status review & inspeksi dataset |
| `FR-015` | **Governance** | Konten memiliki status `Draft`, `Under Review`, `Approved` | Must | Badge status editorial pada setiap materi + filter status konten |
| `FR-016` | **References** | Membuka referensi yang mendukung konten | Must | Drawer/Modal **Daftar Referensi Ilmiah (`SRC-001`..`SRC-012`)** yang dapat diklik langsung dari setiap kartu materi |

---

## 4. Visual Theme & Token Architecture (Gaya `D:\test-bepan\dentascope`)

### 🎨 Color Palette & Surface Tokens (`app/globals.css`)
| Token Semantic | Nilai Hex / Formula | Peran & Karakter |
|---|---|---|
| `--color-ink` | `#0d1b2a` | Teks utama kontras tinggi & tombol aksi primer (Deep Medical Navy) |
| `--color-brand` | `#0b8f8c` | Aksen utama *Anatomy & Explorer* (Clinical Teal) |
| `--color-brand-50` | `#e7f7f6` | Latar pill badge & highlight lembut |
| `--color-brand-100` | `#c9eeec` | Border aksen & hover state |
| `--color-brand-600` | `#0a7f7c` | State aktif tombol brand |
| `--color-mint` | `#12b886` | Aksen *Prevention, Care & Cleaning Simulator* (Health Emerald) |
| `--color-coral` | `#ef5b4c` | Aksen *Diseases & Damage Simulator* (Pathology Coral) |
| `--color-amber` | `#f59e0b` | Aksen *Quiz, Knowledge & Under Review Badge* |
| `.bg-app` | Radial `#ffffff` + `#dff1f0` di atas `#f4f9fb -> #e5eef3` + dot grid | Latar belakang *clean medical lab* yang terang, bersih, dan menonjolkan model 3D |
| `.glass` | `rgba(255, 255, 255, 0.82)` + `backdrop-filter: blur(18px)` | Panel mengambang (*floating HUD*) dengan border putih kristal dan bayangan lembut |

### 🔤 Typography Pairing
1. **Primary Sans Font:** `Plus Jakarta Sans` (`--font-jakarta`)
   - Digunakan di seluruh UI dengan hierarki ketebalan tegas (`font-extrabold` untuk judul, `font-bold` untuk label, `font-medium`/`regular` untuk narasi medis) dan `tabular-nums` untuk angka/skor/persentase.

---

## 5. Key Interactive Features (The "One Live Thing" & Beyond)

1. **Interactive 3D Multi-Scale Dental Explorer (Makro → Meso → Mikro + Layer Visibility):**
   - Pengguna dapat memutar 360° lengkung rahang lengkap (32 gigi FDI), mengeklik satu gigi untuk *smooth-zoom* ke level Meso, dan melakukan *cutaway* (belah penampang) di level Mikro untuk menginspeksi `enamel`, `dentin`, `pulp` (arteri, vena, saraf), `cementum`, `pd_ligament`, `cej`, `gingiva`, dan `alveolar_bone`, lengkap dengan fitur **Show/Hide Layer (`FR-006`)**.
2. **Stage-Based Damage & Habit Simulator (`ST-CAR-0..3` & `ST-PER-0..2`):**
   - Scrubber tahapan klinis resmi PRD (Karies Tahap 0–3 & Periodontitis Tahap 0–2) serta simulasi kebiasaan buruk (Boba + grafik Kurva pH Stephan, Es Batu, Bruxism, Merokok) yang mengubah visual gigi/gusi/tulang secara *real-time* di kanvas 3D.
3. **Real-Time 3D Cleaning Simulator & Interactive Quiz:**
   - Simulasi menggosok plak 3D dengan sikat gigi, benang gigi (floss), dan pembersih lidah, dilanjutkan dengan **Kuis Evaluasi Interaktif** berbasiskan sumber ilmiah.

---

## 6. Execution Roadmap & Phases

> **Aturan Eksekusi (`AGENTS.md`):** Kerjakan secara bertahap, pastikan kode bersih (*Zero Comment Policy*, modular, 60 FPS), dan sinkronkan progres di `TASK.md` serta `rangkuman.md`.

- [ ] **Fase 1: Foundation, Project Scaffolding & Knowledge Base Data Architecture**
  - Setup proyek Next.js 15 + React 19 + R3F + Drei + Three.js + Zustand + Tailwind CSS v4 + `framer-motion` + shadcn CLI (untuk komponen 21st.dev) di root workspace `d:\test-bepan\logicodix-timsukses` dengan desain `.bg-app` & `.glass` dari `dentascope`.
  - Membangun basis data terstruktur (`lib/knowledgeBase.ts`, `lib/anatomy.ts`, `lib/scenarios.ts`) yang memuat 100% data dari `03_Dental_Knowledge_Base.xlsx` (`AN-001..010`, `TT-001..004`, `DIS-001..010`, `ST-CAR-0..3`, `ST-PER-0..2`, `PRE-001..005`, `AST-001..004`, `Q-001..008`, `SRC-001..012`, `GAP-001..006`).
  - Memperbarui state global (`lib/store.ts`) untuk mendukung seluruh modul PRD (`explore`, `diseases`, `simulator`, `clean`, `quiz`) + layer visibility (`FR-006`) + modal Referensi & Content Governance (`FR-014..016`).

- [ ] **Fase 2: 3D Procedural Mouth & Tooth Engine + Layer Visibility (`FR-002`..`FR-006`)**
  - Mengintegrasikan komponen 3D dari `dentascope` (`Scene.tsx`, `Mouth.tsx`, `Tooth.tsx`, `CameraRig.tsx`, `CleaningLayer.tsx`, `DestructionFX.tsx`, `toothGeometry.ts`, `toothMaterial.ts`, `softTissue.ts`, `clip.ts`).
  - Menambahkan dukungan pemilihan & penyorotan seluruh struktur `AN-001` s/d `AN-010` (termasuk `cementum`, `pd_ligament`, `pulp_chamber`, `root_canal`, `cej`) dan fitur **Show/Hide Layer Anatomi (`FR-006`)**.

- [ ] **Fase 3: Navigation Shell, Hero, Anatomy & Diseases Modules (`FR-001`, `FR-007`..`FR-009`)**
  - Membangun `TopBar.tsx`, `Hero.tsx`, `ViewControls.tsx`, `LodIndicator.tsx`, dan `HoverTip.tsx`.
  - Membangun `ExplorePanel.tsx` yang menampilkan 10 struktur anatomi + tabel perbandingan 4 jenis gigi (`TT-001..004` sulung vs permanen) + toggle layer anatomi + tautan ke penyakit terkait.
  - Membangun `DiseasesPanel.tsx` untuk katalog 10 penyakit (`DIS-001..010`) lengkap dengan filter kategori, gejala, faktor risiko, pencegahan, *safety note*, tombol sorot struktur di 3D, dan kutipan sumber `SRC-xxx`.

- [ ] **Fase 4: Damage Simulator (`ST-CAR` / `ST-PER`), Cleaning Simulator & Prevention (`FR-010`..`FR-012`)**
  - Menyempurnakan `DestroyPanel.tsx` agar memiliki mode **Tahapan Klinis PRD** (`DIS-001` Karies Tahap 0–3 & `DIS-003` Periodontitis Tahap 0–2) berdampingan dengan **Simulasi Faktor Risiko Kebiasaan** (Boba + Kurva Stephan, Es Batu, Bruxism, Merokok).
  - Mengintegrasikan `CleanPanel.tsx`, `CleanSuccess.tsx`, `MouthwashOverlay.tsx`, serta seksi **5 Pilar Pencegahan (`PRE-001..005`)**.

- [ ] **Fase 5: Interactive Quiz, Scientific References & Content Governance (`FR-013`..`FR-016`)**
  - Membangun `QuizPanel.tsx` untuk kuis interaktif (`07_Quiz` diperkaya menjadi 8 soal komprehensif dari seluruh materi PRD) dengan skor akhir, indikator jawaban benar/salah, dan pembahasan ber-rujukan `SRC-xxx`.
  - Membangun `ReferencesModal.tsx` & `GovernanceModal.tsx` untuk menampilkan 12 referensi ilmiah (`SRC-001..012`), status review konten (`Draft | Under Review | Approved`), daftar aset 3D (`AST-001..004`), serta *Medical Disclaimer* resmi.

- [ ] **Fase 6: Verification, Build Audit & Living Documentation Sync**
  - Menjalankan `npm run typecheck` dan `npm run build` hingga 100% lulus tanpa error.
  - Memastikan kepatuhan penuh pada `AGENTS.md` (*Zero Comment Policy*, responsivitas mobile & desktop, fallback aksesibilitas `NFR-003`/`NFR-004`).
  - Sinkronisasi akhir `rangkuman.md` dan `TASK.md`.

---

## 7. UI Motion Layer: 21st.dev + Framer Motion

- **Sumber komponen:** [21st.dev](https://21st.dev/) (registry React/Tailwind/shadcn). Komponen disalin ke repo via `npx shadcn@latest add "https://21st.dev/r/<author>/<component>"` atau lewat **21st MCP** (`npx @21st-dev/cli@latest init --client claude`, API key dari `21st.dev/mcp`). Kuota gratis: 2 salinan komponen/hari, jadi pilih dengan hemat.
- **Motion engine:** `npm i framer-motion` (import `motion`, `AnimatePresence`, `useReducedMotion`). Verifikasi API via `npx ctx7 docs` sebelum dipakai (Hukum 6).
- **Kurasi komponen 21st.dev (maks. 8, wajib di-restyle ke token `.glass` / `--color-*`):**
  | Kebutuhan | Kategori 21st.dev | Dipakai di |
  |---|---|---|
  | Hero overlay | Heroes | `Hero.tsx` |
  | Mode switcher | Navigation Menus / Tabs (animated underline `layoutId`) | `TopBar.tsx` |
  | Panel detail | Cards (spotlight/glass) | `ExplorePanel`, `DiseasesPanel` |
  | Scrubber tahap | Sliders / Steppers | `DestroyPanel` |
  | Kuis | Radio Groups + Progress | `QuizPanel` |
  | Referensi & governance | Dialogs/Modals | `ReferencesModal`, `GovernanceModal` |
  | Umpan balik | Toasts | `CleanSuccess`, kuis |
  | Bantuan | Tooltips | `HoverTip`, `ViewControls` |
- **Aturan motion:** hanya `transform`/`opacity`, durasi 150–350 ms, spring untuk panel, `useReducedMotion` wajib dihormati, tidak ada animasi DOM yang berjalan saat kamera 3D bergerak (jaga 60 FPS kanvas). Bottom-sheet mobile dibuat dengan `motion.div drag="y"`.
- **Anti-slop gate:** komponen 21st.dev yang membawa gradien ungu-pink, kartu 3 kolom ikon pastel, atau eyebrow pill spam dilarang dipakai apa adanya.

---

## 8. Strategi Eksekusi Hemat Token & Rekomendasi Model

| Model | Kapan dipakai | Effort |
|---|---|---|
| **Haiku 5.5** (`claude-haiku-5-5`) | Scaffolding, transkripsi data xlsx → TS, sinkron docs, eksplorasi file (subagent `Explore`), lint/typecheck berulang | low |
| **Sonnet 5.5** (`claude-sonnet-5-5`) | Komponen UI/panel, integrasi 21st.dev + framer-motion, store Zustand, kuis | medium |
| **Opus 5.5** (`claude-opus-5-5`) | Engine 3D prosedural, shader/clipping, raycasting, simulator tahap, debugging sulit, review arsitektur | high |

**Aturan hemat token:**
1. Satu fase per sesi; `/clear` setelah fase selesai dan dicatat di `TASK.md` (konteks baru cukup baca `PLAN.md` §relevan + `TASK.md`).
2. Selalu `python .agents/skills/skills-router/scripts/route.py "<intent>"` dulu, muat hanya 1 SKILL.md.
3. Eksplorasi `D:\test-bepan\dentascope` lewat subagent `Explore` (model haiku), jangan membaca file besar ke konteks utama.
4. Pakai skill token: `rtk` (kompres output shell), `caveman` (balasan ringkas), `graphify` (peta codebase sebelum fase 3+), `claude-mem` (memori lintas sesi), `headroom` (kompres konteks panjang).
5. Data `03_Dental_Knowledge_Base.xlsx` diekstrak sekali ke JSON di scratchpad oleh skrip Python, lalu dikonversi ke TS; jangan menempel isi xlsx ke chat.
6. Verifikasi pakai `npm run typecheck` sebelum `npm run build` (lebih murah); screenshot browser hanya di akhir fase.
