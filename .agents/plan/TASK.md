# TASK TRACKER: DENTAL EXPLORER 3D

**Project:** Dental Explorer 3D (Interactive Dental Anatomy & Pathology Platform)  
**Master Directives:** `AGENTS.md` (Plan-First, Anti-Rushing, Zero Comment, Anti-Slop, Living Docs)  
**Master Plan:** `.agents/plan/PLAN.md` (§1–8 Baseline History, §9 Redesign Blueprint Fase 7–11)  
**Sumber Klinis:** `01_Dental_Research.pdf`, `02_Dental_Explorer_PRD.pdf`, `03_Dental_Knowledge_Base.xlsx`  
**Referensi Utama:** [Awwwards](https://www.awwwards.com/) · [21st.dev](https://21st.dev/) · [framer-motion](https://www.npmjs.com/package/framer-motion) · `D:\test-bepan\dentascope`  

---

## PANDUAN PENGALIHAN MODEL CLAUDE (TOKEN OPTIMIZATION STRATEGY)

Gunakan perintah `/model <nama>` di Claude Code untuk beralih model sebelum mengeksekusi subtask:
- 🟢 **Haiku (`claude-haiku-5-5` / `haiku`):** Tugas mekanis cepat (eksekusi CLI skill, linting anti-slop, typecheck, audit 0 komentar, commit git, dan update docs). Hemat token ~90%.
- 🔵 **Sonnet (`claude-sonnet-5-5` / `sonnet`):** Pengerjaan komponen UI, hooks, store Zustand, integrasi framer-motion, 21st.dev, kuis, dan simulator.
- 🟣 **Opus (`claude-opus-5-5` / `opus`):** Arah seni konseptual (taste-skill + ui-ux-pro-max analysis), arsitektur geometri 3D prosedural, dan kalkulasi GLSL shader kompleks (SSS/Fresnel).

---

## BAGIAN I: RIWAYAT FASE BASELINE MVP (HISTORY — SELESAI)

- [x] **Fase 0: Discovery & Planning** — 🟣 Opus
  - [x] Analisis PRD, Research, 11 sheet Knowledge Base, audit `dentascope`.
  - [x] Susun `PLAN.md`, `TASK.md` (+ model & skill per task), sinkron `rangkuman.md`.

- [x] **Fase 1: Foundation, Scaffolding & Data Architecture** — 🔵 Sonnet *(SUDAH DI-PUSH: Commit `c5b114f`)*
  - [x] 1.1 🟢 Haiku: Scaffold Next.js 15 + React 19 + TS + Tailwind v4; konfigurasi dasar workspace.
  - [x] 1.2 🟢 Haiku: Install deps: `three @react-three/fiber @react-three/drei zustand lucide-react framer-motion`.
  - [x] 1.3 🟢 Haiku: Pasang token warna dasar, tema `.bg-app`, `.glass`.
  - [x] 1.4 🟢 Haiku: Skrip ekstrak 11 sheet xlsx → `lib/knowledgeBase.ts`, `lib/data/*` (`AN`, `TT`, `DIS`, `ST`, `PRE`, `AST`, `Q`, `SRC`, `GAP`).
  - [x] 1.5 🔵 Sonnet: `lib/types.ts`, `lib/store.ts`, `lib/*Store.ts`.
  - [x] 1.6 🟢 Haiku: Verifikasi `npm run typecheck`, commit & push Fase 1 ke `origin/main` (`feat: setup project foundation and dental knowledge base`).

- [x] **Fase 2: 3D Procedural Engine + Layer Visibility (Baseline)** — 🟣 Opus
  - [x] 2.1 🟢 Haiku: Porting modul geometri dan struktur data Three.js dari `dentascope` ke `lib/three/`.
  - [x] 2.2 🔵 Sonnet: Setup `Scene`, `Mouth`, `Tooth`, `CameraRig`, penambahan mesh `pd_ligament` & `cej`.
  - [x] 2.3 🟣 Opus: Raycasting `AN-001..010`, highlight lapisan, toggle visibilitas 10 struktur.
  - [x] 2.4 🔵 Sonnet: Verifikasi performa dan kestabilan render di 1440px & 375px.

- [x] **Fase 3: Shell, Hero, Anatomy & Diseases (Baseline)** — 🔵 Sonnet
  - [x] 3.1 🔵 Sonnet: `components/ui/shell/*`: `TopBar` (tab animasi `layoutId`), `Hero`, `ViewControls`, `LodIndicator`, `HoverTip`.
  - [x] 3.2 🔵 Sonnet: `Panel.tsx`: Glass floating panel (desktop) + bottom-sheet `drag="y"` (mobile).
  - [x] 3.3 🔵 Sonnet: `ExplorePanel`: Intro, `StructureDetail`, `OralRegionDetail`, `ToothSummary`, `LayerToggles`.
  - [x] 3.4 🔵 Sonnet: `DiseasesPanel`: Katalog 10 penyakit (`DIS-001..010`), filter kategori, aksi sorot 3D, sitasi `SRC-*`.

- [x] **Fase 4: Damage & Cleaning Simulator + Prevention (Baseline)** — 🟣 Opus & 🔵 Sonnet
  - [x] 4.1 🟣 Opus: Shader progresi karies & periodontal di `lib/three/toothShader.ts` & `toothEffects.ts`.
  - [x] 4.2 🔵 Sonnet: `SimulatorPanel`: Tahapan `ST-CAR` / `ST-PER`, 4 skenario kebiasaan, Kurva Stephan.
  - [x] 4.3 🟣 Opus: Interaksi pembersihan 3D: `cleaning.ts`, `PlaqueLayer`, `ToolCursor`, `CleaningController`.
  - [x] 4.4 🔵 Sonnet: `CleanPanel`, kalkulasi skor kebersihan, timer 2 menit, 5 Pilar Pencegahan (`PRE-001..005`).

- [x] **Fase 5: Quiz, References & Governance (Baseline)** — 🔵 Sonnet
  - [x] 5.1 🔵 Sonnet: `QuizPanel` (8 soal klinis, indikator skor, umpan balik langsung).
  - [x] 5.2 🔵 Sonnet: `Dialog` modal native untuk `ReferencesDialog` (12 `SRC`) & `GovernanceDialog` (status review, `AST`, `GAP`, disclaimer).
  - [x] 5.3 🟢 Haiku: `StatusBadge` pada seluruh kartu data dan integrasi `governanceStore`.

- [x] **Fase 6: Verification & Hardening (Baseline)** — 🟢 Haiku & 🔵 Sonnet
  - [x] 6.1 🟢 Haiku: Audit zero comment & linting kebersihan kode.
  - [x] 6.2 🟢 Haiku: Verifikasi `typecheck` dan `build` (statis 0 error).
  - [x] 6.3 🔵 Sonnet: Optimasi layout mobile 360–375px dan aksesibilitas dialog.

---

## BAGIAN II: FASE BARU — REDESIGN MODEL 3D & UI ANTI-SLOP (PROGRESSIVE EXECUTION)

> **Panduan Eksekusi untuk Claude Code:**  
> - Beralihlah ke model yang disarankan (`/model`) di awal setiap subtask untuk efisiensi token maksimal.  
> - Kerjakan **1 Fase per giliran**. Lakukan verifikasi dan commit sebelum melangkah ke fase berikutnya.

---

### Fase 7: Redesign Model 3D Prosedural, Custom Shaders & Studio Lighting (Awwwards Grade)
> **Model Utama:** 🟣 Opus (Shader & Matematika Geometri) → 🔵 Sonnet (Integrasi Komponen Scene)  
> **Skill Wajib:** `threejs-react-three-fiber`, `taste-skill`, `impeccable`  
> **Commit Target:** `feat: redesign procedural 3d tooth anatomy shaders and studio lighting`

- [x] **7.1** [🟢 Haiku] **Discovery Skill 3D:** Jalankan CLI routing dan baca skill terkait:
  ```bash
  python .agents/skills/skills-router/scripts/route.py "3d webgl tooth shader lighting"
  ```
- [x] **7.2** [🟣 Opus] **Anatomical Geometry Refinement:** Pertajam kontur geometris di `lib/three/teeth.ts` & `lib/three/mouth.ts`: morfologi mahkota (*cusps, fissures, cingulum, marginal ridges*), bifurkasi/trifurkasi akar gigi anterior vs posterior (`TT-001..004`), sabuk ligamen periodontal (`AN-006`), soket alveolar (`AN-007`), serta kontur gusi/papila interdental (`AN-010`).
- [x] **7.3** [🟣 Opus] **Physical SSS & Custom Procedural Shaders:** Perbarui `lib/three/toothShader.ts` dan material di `components/three/Tooth.tsx` & `Mouth.tsx`:
  - Enamel (`AN-001`): Translusensi mutiara (*subsurface scattering approximation*), Fresnel rim-light, dan specular micro-roughness.
  - Dentin (`AN-002`) & Sementum (`AN-005`): Rona hangat organik dengan tekstur mikro tubulus saat mode cutaway aktif.
  - Pulpa (`AN-003`), Saluran Akar (`AN-004`) & Apeks (`AN-009`): Pendaran vaskular halus (*subtle living pulse*).
  - Gingiva (`AN-010`): Specular *wetness* biologis dan variasi rona sehat vs meradang.
- [x] **7.4** [🔵 Sonnet] **Studio Lighting Rig & Layer Peel / Cross-Section:** Sempurnakan `components/three/DentalScene.tsx`, `CameraRig.tsx`, dan `SceneInspector.tsx` dengan pencahayaan studio 3-titik (*key, cool clinical rim, warm fill*), transisi fokus kamera halus, dan bidang *cutaway / layer peel* yang mulus.
- [x] **7.5** [🟢 Haiku] **Verifikasi & Commit Fase 7:** Pastikan 0 komentar kode, jalankan `npm run typecheck`, verifikasi 60 FPS di browser, sinkronkan `rangkuman.md`, lalu buat commit (tanpa push):
  ```bash
  git commit -m "feat: redesign procedural 3d tooth anatomy shaders and studio lighting"
  ```

---

### Fase 8: Redesign Design System, Spatial HUD Shell, Anatomy & Disease Explorer (Anti-Slop & 21st.dev)
> **Model Utama:** 🟣 Opus (Arah Seni & Sistem Token) → 🔵 Sonnet (Implementasi UI & Motion)  
> **Skill Wajib:** `taste-skill`, `ui-ux-pro-max`, `ui-styling`, `emil-design-eng`, `impeccable`, `design`  
> **Commit Target:** `feat: build spatial hud shell with anatomy and disease explorer`

- [ ] **8.1** [🟢 Haiku] **Discovery Desain via CLI Skill:** Jalankan generator arah seni dan simpan hasilnya:
  ```bash
  node .agents/skills/taste-skill/scripts/draw.mjs --app --kind studio --brief "Interactive 3D dental anatomy, pathology simulator, and clinical HUD explorer"
  python .agents/skills/ui-ux-pro-max/scripts/search.py "medical 3d interactive anatomy lab" --design-system --variance 7 --motion 7 --density 6 -p "Dental Explorer 3D"
  .agents\skills\impeccable\scripts\impeccable.cmd context
  ```
- [x] **8.2** [🟣 Opus] **Sistem Token 3-Lapis & Tipografi Anti-Slop:** Perbarui `app/globals.css` dan `app/layout.tsx` berdasarkan rekomendasi 8.1 (warna fungsional, kontras permukaan tonal, pasangan font berkarakter maksimal 2 font + 1 mono telemetri, kurva easing Emil Kowalski `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`).
- [x] **8.3** [🔵 Sonnet] **Spatial HUD Shell & Primitif 21st.dev:** Redesign `components/ui/shell/*` (`TopBar.tsx`, `Hero.tsx`, `Panel.tsx`, `ViewControls.tsx`, `LodIndicator.tsx`, `HoverTip.tsx`):
  - Navigasi spasial mengambang dengan indikator pegas `layoutId` (`framer-motion`), respons tekan `scale(0.97)`, dan popover sadar titik asal (*origin-aware* dari `scale(0.95)`).
  - Panel inspektor bergaya *precision surgical instrument* dan *draggable bottom-sheet* mobile (`velocity > 0.11` dismissal) yang menyisakan `>= 55%` kanvas 3D.
- [x] **8.4** [🔵 Sonnet] **Anatomy & Tooth Type Explorer:** Redesign `components/ui/explore/*` (`ExplorePanel.tsx`, `ExploreIntro.tsx`, `StructureView.tsx`, `ToothOverview.tsx`, `RegionView.tsx`, `LayerToggles.tsx`):
  - Matriks visibilitas 10 lapisan anatomi (`AN-001..010`), perbandingan dentisi `TT-001..004`, dan kartu statistik resmi WHO/Kemenkes tanpa grid kartu 3-kolom generik.
- [x] **8.5** [🔵 Sonnet] **Pathology & Disease Catalog:** Redesign `components/ui/diseases/*` (`DiseasesPanel.tsx`, `DiseaseCard.tsx`) untuk 10 penyakit (`DIS-001..010`) dengan filter cepat, lencana keparahan, sitasi `SRC-*`, dan aksi **"Lihat di 3D"** yang mengisolasi struktur terdampak.
- [x] **8.6** [🟢 Haiku] **Verifikasi & Commit Fase 8:** Jalankan `node .agents/skills/taste-skill/scripts/lint.mjs app/ components/`, `npm run typecheck`, pastikan 0 komentar kode, perbarui `rangkuman.md`, lalu buat commit:
  ```bash
  git commit -m "feat: build spatial hud shell with anatomy and disease explorer"
  ```

---

### Fase 9: Redesign Interactive Pathology Simulator & 3D Oral Hygiene Lab (Framer Motion & Particles)
> **Model Utama:** 🔵 Sonnet (Simulator Logic, Stephan Curve & 3D Hygiene Particles)  
> **Skill Wajib:** `animate`, `choreograph`, `emil-design-eng`, `threejs-react-three-fiber`  
> **Commit Target:** `feat: implement interactive pathology simulator and 3d hygiene lab`

- [x] **9.1** [🔵 Sonnet] **Caries & Periodontal Stage Scrubber:** Redesign `components/ui/simulator/*` (`SimulatorPanel.tsx`, `StephanCurve.tsx`) dan `components/three/simulation/*`:
  - Scrubber tahap interaktif (`ST-CAR-0..3` & `ST-PER-0..2`) dengan indikator pegas `layoutId`, transisi visual perbandingan, dan sinkronisasi real-time ke shader gigi/gusi/tulang 3D.
  - Visualisasi dinamis **Kurva pH Stephan** (titik kritis pH `< 5.5` vs remineralisasi) dan 4 skenario kebiasaan harian.
- [x] **9.2** [🔵 Sonnet] **3D Hygiene Lab & Prevention Pillars:** Redesign `components/ui/clean/*` (`CleanPanel.tsx`, `CleanToast.tsx`) dan `components/three/cleaning/*` (`PlaqueLayer.tsx`, `ToolCursor.tsx`, `CleaningController.tsx`):
  - Pengalaman interaktif pembersihan plak, kalkulus, dan noda langsung pada permukaan gigi 3D menggunakan Sikat Gigi Fluoride, Flosser, Scaler, dan Obat Kumur dengan umpan balik visual/partikel dan *Cleaning Score* (`0–100%`).
  - Integrasi 5 Pilar Pencegahan (`PRE-001..005`) dengan tata letak ringkas anti-slop.
- [x] **9.3** [🟢 Haiku] **Verifikasi & Commit Fase 9:** Jalankan `npm run typecheck`, `node .agents/skills/taste-skill/scripts/lint.mjs components/ui/simulator components/ui/clean`, perbarui `rangkuman.md`, lalu buat commit:
  ```bash
  git commit -m "feat: implement interactive pathology simulator and 3d hygiene lab"
  ```

---

### Fase 10: Redesign Clinical Quiz Assessment, Reference Library & Governance Dialogs
> **Model Utama:** 🔵 Sonnet (Dialog Components & Quiz Assessment Logic)  
> **Skill Wajib:** `impeccable`, `ui-styling`, `emil-design-eng`  
> **Commit Target:** `feat: add clinical quiz assessment reference library and governance dialogs`

- [x] **10.1** [🔵 Sonnet] **Clinical Quiz Experience:** Redesign `components/ui/quiz/*` (`QuizPanel.tsx`, `QuizSummary.tsx`):
  - Transisi pergantian soal dengan `AnimatePresence` (`scale(0.98)` + `opacity`), umpan balik instan, skor akhir, serta tombol **"Tunjukkan di 3D"** yang mengarahkan kamera ke struktur anatomi terkait.
- [x] **10.2** [🔵 Sonnet] **Reference Library & Governance Dialogs:** Redesign `components/ui/library/*` (`ReferencesDialog.tsx`, `GovernanceDialog.tsx`, `LibraryMenu.tsx`), `Dialog.tsx`, `Badge.tsx`, dan `StatusBadge.tsx`:
  - Dialog modal bergaya instrumen bedah presisi (`scale(0.95)` entry, backdrop blur, navigasi keyboard penuh) untuk 12 referensi institusional (`SRC-001..012`), status review konten (`draft` / `reviewed` / `approved`), matriks aset 3D (`AST-001..004`), daftar `GAP-001..006`, dan *Medical Disclaimer* (`FR-015`).
- [x] **10.3** [🟢 Haiku] **Verifikasi & Commit Fase 10:** Jalankan `npm run typecheck`, perbarui `rangkuman.md`, lalu buat commit:
  ```bash
  git commit -m "feat: add clinical quiz assessment reference library and governance dialogs"
  ```

---

### Fase 11: Anti-Slop Audit, Performance Hardening (60 FPS) & Verification
> **Model Utama:** 🔵 Sonnet (Perbaikan Bug/Visual) + 🟢 Haiku (Audit, Linter, Build & Docs)  
> **Skill Wajib:** `taste-skill`, `impeccable`, `web-design-guidelines`, `verification-before-completion`  
> **Commit Target:** `refactor: polish motion choreography accessibility and 60fps rendering`

- [x] **11.1** [🟢 Haiku] **Zero Comment & Anti-Slop Lint:** Pastikan 0 komentar kode di seluruh direktori `app/`, `components/`, dan `lib/`, serta verifikasi bebas slop via:
  ```bash
  node .agents/skills/taste-skill/scripts/lint.mjs app/ components/
  ```
- [x] **11.2** [🔵 Sonnet] **Live Browser Inspection & Responsiveness:** Uji tampilan langsung di desktop (`1440×900`) dan mobile (`375×812`) via:
  ```bash
  node .agents/skills/taste-skill/scripts/inspect.mjs http://localhost:3000 --app
  ```
  Pastikan bebas *overflow*, tidak ada elemen tumpang tindih, dan panel merespons sentuhan/drag dengan mulus.
- [x] **11.3** [🟢 Haiku] **Production Build & Final Documentation Sync:** Jalankan `npm run typecheck` dan `npm run build` hingga 100% lulus 0 error, sinkronkan seluruh pencatatan di `rangkuman.md` (Hukum 8), lalu buat commit penutup:
  ```bash
  git commit -m "refactor: polish motion choreography accessibility and 60fps rendering"
  ```
