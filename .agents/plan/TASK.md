# TASK TRACKER: DENTAL EXPLORER 3D

**Project:** Dental Explorer (DentaScope 3D Educational Platform)
**Master Directives:** `AGENTS.md` (Plan-First, Anti-Rushing, Zero Comment, Anti-Slop, Living Docs)
**Master Plan:** `.agents/plan/PLAN.md` (§7 Motion Layer, §8 Strategi Model)
**Sumber:** `01_Dental_Research.pdf`, `02_Dental_Explorer_PRD.pdf`, `03_Dental_Knowledge_Base.xlsx`
**Referensi visual & engine:** `D:\test-bepan\dentascope` · UI: [21st.dev](https://21st.dev/) · Motion: `framer-motion`
**Current Active Phase:** Fase 6 selesai — semua fase rampung

Legenda model: 🟢 Haiku 5.5 (low) · 🔵 Sonnet 5.5 (medium) · 🟣 Opus 5.5 (high)
Format: `[model] task — skill` · Satu fase per sesi, `/clear` setelah fase ditutup.

---

- [x] **Fase 0: Discovery & Planning** — 🟣 Opus
  - [x] Analisis PRD, Research, 11 sheet Knowledge Base, audit `dentascope`
  - [x] Susun `PLAN.md`, `TASK.md` (+ model & skill per task), sinkron `rangkuman.md`

- [x] **Fase 1: Foundation, Scaffolding & Data Architecture** — sesi utama 🔵 Sonnet
  - [x] 1.1 🟢 Scaffold Next.js 15 + React 19 + TS + Tailwind v4; salin config dari `dentascope` — `context7`, `rtk`
  - [x] 1.2 🟢 Install deps: `three @react-three/fiber @react-three/drei zustand lucide-react framer-motion`; shadcn init ditunda ke Fase 3.1 (saat komponen 21st.dev pertama dipasang) — `context7`
  - [ ] 1.3 🟢 (opsional) Pasang 21st MCP: `npx @21st-dev/cli@latest init --client claude` (API key diisi user sendiri)
  - [x] 1.4 🔵 `app/globals.css`: token `--color-*`, `.bg-app`, `.glass`, font Plus Jakarta Sans — `design-system`, `ui-styling`
  - [x] 1.5 🟢 Skrip Python ekstrak xlsx → JSON (scratchpad), lalu tulis `lib/knowledgeBase.ts` (AN, TT, DIS, ST, PRE, AST, Q, SRC, GAP) — `xlsx`
  - [x] 1.6 🔵 `lib/types.ts`, `lib/store.ts` (mode `explore|diseases|destroy|clean|quiz`, layer visibility, modal) — `writing-plans`
  - [x] 1.7 🟢 Verifikasi `npm run typecheck`, update `TASK.md` & `rangkuman.md` — `verification-before-completion`

- [x] **Fase 2: 3D Procedural Engine + Layer Visibility (FR-002..006)** — sesi utama 🟣 Opus
  - [x] 2.1 🟢 Petakan dependensi `dentascope/lib` & `components/three` (dibaca langsung; cakupan kecil)
  - [x] 2.2 🔵 Port `layout`, `toothGeometry`, `toothMaterial`, `softTissue`, `clip`, `registry` ke `lib/three/` (efek kerusakan ditunda ke Fase 4)
  - [x] 2.3 🟣 Port `Scene`, `Mouth`/`JawContent`, `Tooth`, `CameraRig`; mesh baru `pd_ligament`, `cej`; `cementum`/`pulp_chamber`/`root_canal` lewat pita shader di CEJ
  - [x] 2.4 🟣 Raycasting AN-001..010 + 7 zona rongga mulut (`lib/three/hitTargets.ts`), highlight, `LayerToggles`, `SceneInspector` (cutaway, reset, LOD)
  - [x] 2.5 🔵 Uji di browser pane 1440px & 375px: 41 draw call / ~58k segitiga per frame, tanpa error konsol. FPS absolut belum valid (pane tersembunyi, dev mode) → ulangi di Fase 6

- [x] **Fase 3: Shell, Hero, Anatomy & Diseases (FR-001, FR-007..009)** — sesi utama 🔵 Sonnet
  - [x] 3.1 🔵 21st MCP belum terpasang (1.3 opsional, butuh API key) → komponen dibangun bespoke dengan `framer-motion` + token `.glass`; kurasi 21st.dev bisa menyusul
  - [x] 3.2 🔵 `components/ui/shell/*`: `TopBar` (tab `layoutId`), `Hero` (`AnimatePresence`, kamera berayun ±0,5 rad, hormati reduced-motion), `ViewControls` (zoom, reset, 5 preset, cutaway), `LodIndicator` (bar `scaleX`), `HoverTip`
  - [x] 3.3 🔵 `Panel.tsx`: glass 400px (≥1024px) + bottom-sheet `drag="y"` via handle, snap buka/tutup berdasar offset & velocity
  - [x] 3.4 🔵 `ExplorePanel`: intro (target cepat, langkah LOD, tabel TT sulung/permanen), `StructureDetail` (AN + catatan klinis + link penyakit), `OralRegionDetail`, `ToothSummary` (10 struktur per gigi), `LayerToggles`
  - [x] 3.5 🔵 `DiseasesPanel`: 10 penyakit, filter kategori + filter struktur terpilih di 3D, accordion detail, safety note, "Lihat di 3D" (`lib/data/diseaseLinks.ts`), tautan SRC. Tombol "Buka Simulator" dipindah ke 4.2 (mode simulator belum ada)
  - [x] 3.6 🟢 Audit: 0 komentar kode, 0 tombol tanpa nama aksesibel, `aria-pressed/expanded/current`, tanpa grid ikon pastel; uji 1440px & 375px

- [x] **Fase 4: Damage & Cleaning Simulator + Prevention (FR-010..012)** — sesi utama 🟣 Opus
  - [x] 4.1 🟣 Engine efek: `lib/three/toothShader.ts` (lesi karies + cekungan, aus/gompal, noda, radang pulpa), `toothEffects.ts` (ST-CAR pada gigi 36/46, ST-PER: radang, bengkak, resesi gusi, resorpsi tulang), retak es, karang gigi, gerak rahang es/bruxism. Partikel es & bakteri dari dentascope ditunda
  - [x] 4.2 🔵 Tab Simulasi + tombol "Buka simulator" (DIS-001/003); `SimulatorPanel`: stepper tahap KB + catatan batasan + sumber, 4 skenario kebiasaan (player, kecepatan, tahap), Kurva Stephan SVG `motion.path` pathLength
  - [x] 4.3 🟣 `lib/three/cleaning.ts` + `PlaqueLayer`, `ToolCursor` (sikat/flosser/pembersih lidah), `CleaningController` (skor tiap 0,15 s, kilau), kontrol kamera klik-kanan/2 jari saat membersihkan
  - [x] 4.4 🔵 `CleanPanel` (skor cincin + meter `scaleX`, timer 2 menit, pemilih alat, obat kumur, ulangi), `CleanSuccessToast`, `MouthwashOverlay`, `PreventionPillars` PRE-001..005
  - [x] 4.5 🔵 Typecheck lulus, 0 komentar, 0 error konsol; uji browser: tahap karies 3 + belah 36, periodontal tahap 2 di gigi 41, skor bersih naik saat digosok; reduced-motion dihormati (sway intro, kurva, overlay). FPS absolut belum terukur (rAF pane berhenti saat jendela tak terlihat) → Fase 6

- [x] **Fase 5: Quiz, References & Governance (FR-013..016)** — sesi utama 🔵 Sonnet
  - [x] 5.1 🔵 `QuizPanel` + `lib/quizStore.ts`: progress bar `scaleX`, radio native (keyboard), goyang saat salah, pembahasan + sumber, skor & ringkasan jawaban; tab Kuis (amber)
  - [x] 5.2 🔵 `Dialog` (native `<dialog>`), `ReferencesDialog` (12 SRC, fokus & scroll ke sumber yang diklik), `GovernanceDialog` (disclaimer, status konten + filter & ubah status, AST, GAP); `LibraryMenu` di TopBar
  - [x] 5.3 🟢 `StatusBadge` di kartu AN, DIS, ST, PRE, Q, AST; override status via `lib/governanceStore.ts` (zustand persist, localStorage)
  - [x] 5.4 🔵 Integrasi sudah di `components/Experience.tsx` (Scene `dynamic` `ssr:false`, panel per mode, dialog global); semua sumber kini membuka dialog referensi

- [x] **Fase 6: Verification & Hardening** — sesi utama 🟢 Haiku, eskalasi 🟣 Opus bila ada bug
  - [x] 6.1 🟢 Grep komentar & dead code: 0 temuan; `tsc --noUnusedLocals` bersih; `next.config.mjs` dibersihkan dari JSDoc
  - [x] 6.2 🟢 `typecheck` + `build` lulus 100%; peringatan multi-lockfile diatasi via `outputFileTracingRoot`
  - [x] 6.3 🟣 Tidak ada error build/runtime; bug UI ditemukan di 6.4 (TopBar 375px) dan diperbaiki
  - [x] 6.4 🔵 Uji 375/768/1440 tanpa overflow & 0 error konsol; Lighthouse a11y 100, SEO 100, BP 96, perf 60 mobile/83 desktop (WebGL perangkat lunak); code-review high: 6 temuan, 2 diperbaiki (TopBar 360px, id dialog ganda), 3 ditunda (sway intro vs reset, reduced-motion statis, loop applyTool)
  - [x] 6.5 🟢 `rangkuman.md` v0.8.0 & `TASK.md` disinkronkan (21st.dev tidak dipakai: komponen bespoke)
