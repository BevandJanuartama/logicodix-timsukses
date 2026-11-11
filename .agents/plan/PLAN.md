# PROJECT PLAN & SPECIFICATION: DENTAL EXPLORER 3D

> **Acuan Dokumen Sumber:**
> - **Research Document:** `.agents/plan/01_Dental_Research.pdf` (Draft v1.0 — 11 Nov 2026)
> - **Product Requirements Document (PRD):** `.agents/plan/02_Dental_Explorer_PRD.pdf` (Draft v1.0 — 11 Nov 2026)
> - **Knowledge Base Dataset:** `.agents/plan/03_Dental_Knowledge_Base.xlsx` (11 Sheets: Anatomy, Tooth Types, Diseases, Disease Stages, Prevention, 3D Assets, Quiz, Data Dictionary, References, Research Gaps)
> - **Design & 3D Engine Benchmark:** `D:\test-bepan\dentascope` (DentaScope 3D — Clean Medical Tech Glassmorphism + Procedural React Three Fiber Engine)
> - **Referensi Redesign Anti-Slop:** [Awwwards](https://www.awwwards.com/) · [21st.dev](https://21st.dev/) · [framer-motion](https://www.npmjs.com/package/framer-motion)

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

### C. Katalog Penyakit & Tahapan (`03_Diseases` & `04_Disease_Stages`)
- **10 Penyakit Wajib (`DIS-001` s/d `DIS-010`):** Karies Gigi, Gingivitis, Periodontitis, Pulpitis, Abses Periapikal, Erosi Gigi, Abrasio Gigi, Hipersensitivitas Dentin, Maloklusi, Impaksi Gigi.
- **Tahapan Karies (`ST-CAR-0` s/d `ST-CAR-3`):** Sehat → Lesi Dini (White Spot Enamel) → Karies Dentin Lanjut → Karies Melibatkan Pulpa.
- **Tahapan Periodontal (`ST-PER-0` s/d `ST-PER-2`):** Sehat → Gingivitis (Eritema & Edema) → Periodontitis (Resesi, Poket, Resorpsi Tulang).

---

## 3. Pemetaan Kebutuhan Fungsional PRD (`FR-001` s/d `FR-016`)
- **`FR-001` s/d `FR-006`:** Kanvas 3D Interaktif (Orbit, Zoom, Pan, Reset), Anatomi 3D Makro & Mikro, Penampang Melintang (*Cutaway*), Visibilitas Layer Independen (`AN-001..010`), Highlight Saat Hover & Klik, serta Indikator Level of Detail.
- **`FR-007` s/d `FR-009`:** Katalog Penyakit Komprehensif (Gejala, Faktor Risiko, Pencegahan, Catatan Klinis), Peta Hubungan Struktur Terkait (*Affected Structures*), dan Visualisasi Spasial Penyakit pada Model 3D.
- **`FR-010` s/d `FR-012`:** Simulator Kerusakan Interaktif (*Caries & Periodontal Stages* + Skenario Kebiasaan), Simulator Pembersihan Gigi 3D (*The One Live Thing* dengan skor kebersihan & timer), serta Panduan 5 Pilar Pencegahan (`PRE-001..005`).
- **`FR-013` s/d `FR-016`:** Kuis Interaktif Klinis (8 Soal KB dengan skor & umpan balik rujukan ilmiah), Pustaka Referensi Resmi (`SRC-001..012`), Tata Kelola Konten & Status Review (`AST`, `GAP`, `Draft/Reviewed/Approved`), serta *Medical Disclaimer* Edukatif.

---

## 4. Visual Theme & Token Architecture (Baseline)
- **Dasar Styling:** Dark medical-tech glassmorphism (`.bg-app`, `.glass`, border 1px translucent, aksen cyan, mint, amber, coral).
- **Tipografi:** Plus Jakarta Sans & JetBrains Mono (data telemetri).

---

## 5. Key Interactive Features (The "One Live Thing" & Beyond)
1. **Interactive 3D Oral Cavity & Tooth Mesh:** Orbit, zoom, raycast highlight 10 struktur anatomi dan 7 zona mulut.
2. **Dynamic Cutaway Plane:** Pemotongan bidang penampang melintang secara real-time.
3. **The "One Live Thing" — 3D Hygiene Simulator:** Pembersihan plak gigi secara langsung dengan kursor alat interaktif dan kalkulasi *cleaning score*.
4. **Stephan pH Curve & Habit Scenarios:** Visualisasi dinamis keasaman mulut dan demineralisasi enamel.

---

## 6. Execution Roadmap & Phases (Riwayat Baseline)

- [x] **Fase 0: Discovery & Planning** — Analisis PRD, KB, penyusunan `PLAN.md` & `TASK.md`.
- [x] **Fase 1: Foundation, Scaffolding & Data Architecture** — Scaffold Next.js 15, ekstrak 11 sheet KB, setup store Zustand. *(Sudah di-push ke git: Commit `c5b114f`)*.
- [x] **Fase 2: 3D Procedural Engine + Layer Visibility** — Porting geometri, raycasting AN-001..010, mesh periodontal & CEJ, cutaway plane.
- [x] **Fase 3: Shell, Hero, Anatomy & Diseases** — TopBar, Hero 3D, ExplorePanel, DiseasesPanel.
- [x] **Fase 4: Damage & Cleaning Simulator + Prevention** — Shader karies & periodontal, Kurva Stephan, simulasi pembersihan plak 3D.
- [x] **Fase 5: Quiz, References & Governance** — 8 soal kuis interaktif, dialog 12 SRC, dialog tata kelola & disclaimer.
- [x] **Fase 6: Verification & Hardening** — Audit zero comment, build passing statis 100%, optimasi mobile 360–375px.

---

## 7. UI Motion Layer: 21st.dev + Framer Motion (Baseline Strategy)
- Kurasi komponen interaktif dari [21st.dev](https://21st.dev/) (Hero, Navigation Tabs `layoutId`, Cards, Sliders, Modals).
- Motion engine: `framer-motion` (`transform` & `opacity` only, 60 FPS, menghormati `useReducedMotion`).

---

## 8. Strategi Eksekusi Hemat Token & Rekomendasi Model
- **Opus:** Geometri 3D, GLSL shader, raycasting, art direction.
- **Sonnet:** Komponen UI, motion, simulator, kuis.
- **Haiku:** Linting, audit komentar, sinkronisasi docs.

---

## 9. Architecture & Blueprint Redesign Model 3D & UI Anti-Slop (Fase 7 s.d. 11)

> **Mandat Redesign untuk Claude Code:**  
> Bagian ini adalah **fase baru** yang dirancang agar Claude tidak mengunci desain secara kaku, melainkan **mengekstraksi arah seni (*art direction*) dan token langsung dari rekomendasi skill lokal**, terinspirasi dari **Awwwards**, **21st.dev**, dan **Framer Motion**, dengan kepatuhan 100% pada **Hukum Anti-Slop** (`AGENTS.md`).

### A. Tiga Referensi Eksternal Utama
1. **[Awwwards](https://www.awwwards.com/) (via `taste-skill`):** Benchmark *spatial medical showcase*, pencahayaan studio 3D klinis, dan instrumen HUD modern.
2. **[21st.dev](https://21st.dev/) (via `ui-styling` & shadcn CLI / 21st MCP):** Pola komponen interaktif modern (floating dock, scrubber, drawer, popover).
3. **[Framer Motion](https://www.npmjs.com/package/framer-motion) (via `emil-design-eng`, `animate`, `choreograph`, `apple-design`):** Fisika pegas (*spring physics*), `layoutId`, transisi kontekstual `AnimatePresence`, dan gesture sheet dismissal berbasis kecepatan (*velocity > 0.11*).

### B. Protokol Eksekusi Skill CLI untuk Claude (Discovery-Driven Design)
Sebelum menyentuh kode di setiap fase redesign, Claude **WAJIB** menjalankan skill berikut untuk mendapatkan panduan visual terbaik:
```bash
# 1. Routing skill otomatis
python .agents/skills/skills-router/scripts/route.py "<intent fase saat ini>"

# 2. Tarik Art Direction dari pustaka 247 situs Awwwards (taste-skill)
node .agents/skills/taste-skill/scripts/draw.mjs --app --kind studio --brief "Interactive 3D dental anatomy, pathology simulator, and clinical HUD explorer"
node .agents/skills/taste-skill/scripts/draw.mjs --sector health --brief "Interactive 3D dental anatomy and pathology showcase" --options 3

# 3. Hasilkan Design System, Palet Warna & Tipografi (ui-ux-pro-max)
python .agents/skills/ui-ux-pro-max/scripts/search.py "medical 3d interactive anatomy lab" --design-system --variance 7 --motion 7 --density 6 -p "Dental Explorer 3D"

# 4. Muat panduan craft surface (impeccable)
.agents\skills\impeccable\scripts\impeccable.cmd context

# 5. Audit Anti-Slop & Inspeksi Browser setelah coding (taste-skill)
node .agents/skills/taste-skill/scripts/lint.mjs app/ components/
node .agents/skills/taste-skill/scripts/inspect.mjs http://localhost:3000 --app
```

### C. Blueprint Redesign Model 3D & Custom Shaders (Fase 7)
- **Morfologi Anatomi Organik (`lib/three/*`):** Pertajam mahkota (*cusps, fissures, cingulum*), bifurkasi/trifurkasi akar (`TT-001..004`), kontur gusi/papila interdental (`AN-010`), soket tulang alveolar (`AN-007`), sabuk ligamen periodontal (`AN-006`), dan garis servikal CEJ (`AN-008`).
- **Material Fisik & Subsurface Scattering (SSS):**
  - Enamel (`AN-001`): Translusensi mutiara (*subsurface scattering approximation*) + Fresnel rim-light.
  - Dentin (`AN-002`) & Sementum (`AN-005`): Rona hangat organik dengan tekstur mikro tubulus.
  - Pulpa (`AN-003`), Saluran Akar (`AN-004`) & Apeks (`AN-009`): Pendaran vaskular halus (*subtle living pulse*).
  - Gingiva (`AN-010`): Specular *wetness* biologis dan variasi rona sehat vs meradang.
- **Studio Lighting & Layer Peel:** Pencahayaan studio 3-titik, pergerakan kamera halus, dan bidang *cutaway / layer peel* interaktif.

### D. Blueprint Redesign UI, HUD & Motion (Fase 8 – 10)
- **Canvas-First, Precision HUD:** Kanvas 3D memimpin sejak viewport pertama. Panel UI mengambang sebagai instrumen HUD presisi medis (*high contrast border-hairline*, WCAG AA `>= 4.5:1`).
- **Hukum Motion Emil Kowalski (`emil-design-eng` + `framer-motion`):**
  - Easing khusus: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`.
  - Umpan balik tekan `scale(0.97)`; kemunculan elemen sadar titik asal dari `scale(0.95)` (bukan 0).
  - Transisi tab & selektor tahap menggunakan pegas `layoutId`.
  - Stagger item 30–50ms (total durasi `<300ms`).
  - Mobile bottom-sheet dengan *velocity dismissal* (`velocity > 0.11`) menyisakan `>= 55%` layar untuk memutar kanvas 3D.
- **Larangan Mutlak Anti-Slop:** Dilarang kartu 3-kolom SaaS generik dengan ikon dalam kotak pastel; dilarang gradien ungu-ke-pink bot; dilarang pill badge berlebihan; dilarang teks placeholder *Lorem Ipsum*; dilarang komentar kode apa pun.

### E. Roadmap Fase Baru & Target Git Commit (Guidebook Logicodix Compliant)
Eksekusi dilakukan bertahap per fase, satu fase per giliran, dengan alokasi model Claude yang dioptimasi untuk menghemat token (`/model`):

| Fase Baru | Deskripsi & Target Pengerjaan | Model Rekomendasi | Commit Message Target |
|:---:|---|:---:|---|
| **Fase 7** | Redesign Model 3D Prosedural, Custom Shaders & Studio Lighting | 🟣 **Opus** (Shader & 3D Math) → 🔵 **Sonnet** (Scene) | `feat: redesign procedural 3d tooth anatomy shaders and studio lighting` |
| **Fase 8** | Redesign Design System, Spatial HUD Shell, Anatomy & Disease Explorer | 🟣 **Opus** (Art Direction & Tokens) → 🔵 **Sonnet** (UI) | `feat: build spatial hud shell with anatomy and disease explorer` |
| **Fase 9** | Redesign Interactive Pathology Simulator & 3D Oral Hygiene Lab | 🔵 **Sonnet** (Simulator Logic & Particles) | `feat: implement interactive pathology simulator and 3d hygiene lab` |
| **Fase 10** | Redesign Clinical Quiz Assessment, Reference Library & Governance Dialogs | 🔵 **Sonnet** (Dialogs & Quiz Logic) | `feat: add clinical quiz assessment reference library and governance dialogs` |
| **Fase 11** | Anti-Slop Audit, Performance Hardening (60 FPS) & Final Verification | 🔵 **Sonnet** (Bugfix) + 🟢 **Haiku** (Audit & Build) | `refactor: polish motion choreography accessibility and 60fps rendering` |
