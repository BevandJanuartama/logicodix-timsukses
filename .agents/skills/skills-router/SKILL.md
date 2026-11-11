---
name: skills-router
description: "Master quick-lookup index, router, and summary for all 26 skills in .agents/skills. Use on EVERY incoming user prompt to instantly determine which specialized skill to activate without reading full skill files, minimizing token usage and optimizing agent decisions."
---

# Skills Router & Meta-Index (Zero-Token-Waste Directory)

A centralized, token-efficient routing hub for all 26 specialized skills installed in `.agents/skills/`.

Instead of loading thousands of lines of documentation across multiple `SKILL.md` files into the context window, **always consult this router first**. It maps user intent directly to the exact skill, script command, or file reference needed.

---

## 1. Quick Intent-to-Skill Routing Matrix

| User Intent / Scenario | Recommended Skill | Primary Action / Command | Key File / Script |
|---|---|---|---|
| **Ide & Konsep Baru** (klarifikasi sebelum mulai) | `brainstorming` | Socratic interview, 2-3 focused questions | `brainstorming/SKILL.md` |
| **Menyusun Rencana & Roadmap** (sebelum koding) | `writing-plans` | Tulis spesifikasi & checklist | `.agents/plan/PLAN.md` & `TASK.md` |
| **Eksekusi Bertahap** (satu milestone per turn) | `executing-plans` | Kerjakan 1 fase, verifikasi, minta approval | `executing-plans/SKILL.md` |
| **Terjadi Error / Bug / Test Failure** | `systematic-debugging` | Root-cause 4 tahap (Reproduce -> Isolate -> Hypothesis -> Fix) | `systematic-debugging/SKILL.md` |
| **Klaim Pekerjaan Selesai / Siap Merge** | `verification-before-completion` | Jalankan build, lint, visual audit sebelum konfirmasi | `npm run build` / unit tests |
| **Cari API / Library / SDK Terkini** | `context7` | Query live documentation & real snippets | `npx ctx7 library <name>` |
| **Arah Seni Visual Anti-Slop / Layout Mewah** | `taste-skill` | Deal art direction (Awwwards) & no-slop audit | `node .agents/skills/taste-skill/scripts/draw.mjs` |
| **Palet Warna, Font, Gaya, Animasi GSAP** | `ui-ux-pro-max` | Query database 79 gaya & 192 palet | `python .agents/skills/ui-ux-pro-max/scripts/search.py` |
| **Polesan Detail UI, Spacing, Surface Mode** | `impeccable` | Craft polish & visual hierarchy review | `.agents\skills\impeccable\scripts\impeccable.cmd context` |
| **Komponen UI Modern (Tailwind + Radix)** | `ui-styling` | Buat komponen UI aksesibel dan bersih | `ui-styling/SKILL.md` |
| **Token Desain 3 Lapis (CSS Variables)** | `design-system` | Primitive -> Semantic -> Component tokens | `design-system/SKILL.md` |
| **Logo AI, Mockup CIP, Ikon SVG Kustom** | `design` | Generasi aset grafis & visual brand | `design/SKILL.md` |
| **Tone of Voice, Tagline & Pesan Brand** | `brand` | Konsistensi identitas kata & pesan | `brand/SKILL.md` |
| **Banner Iklan, Sosmed, Hero Banner** | `banner-design` | Layout visual berbagai rasio aspek | `banner-design/SKILL.md` |
| **Animasi Tunggal / Transisi / Easing** | `animate` | Urutan keputusan animasi, resep siap pakai | `animate/SKILL.md` |
| **Koordinasi Banyak Elemen Bergerak (Stagger/Sequence)** | `choreograph` | Atur urutan, overlap, dan elemen diam | `choreograph/SKILL.md` |
| **Gesture, Spring, Sheet, Glass ala Apple** | `apple-design` | Gerak fluid & interruptible | `apple-design/SKILL.md` |
| **Polish Rasa Komponen (Emil Kowalski)** | `emil-design-eng` | Detail tak kasatmata, keputusan animasi | `emil-design-eng/SKILL.md` |
| **Review UI/Aksesibilitas vs Guidelines** | `web-design-guidelines` | Audit kode UI | `web-design-guidelines/SKILL.md` |
| **Hemat Token Output Shell** | `rtk` | Hook pemampat output perintah | `rtk/SKILL.md` |
| **Memori Lintas Sesi** | `claude-mem` | Pasang/periksa memori persisten | `claude-mem/SKILL.md` |
| **Kompresi Konteks (Proxy/MCP)** | `headroom` | `headroom wrap claude` | `headroom/SKILL.md` |
| **Jawaban Ultra-Ringkas** | `caveman` | Mode output minimal | `caveman/SKILL.md` |
| **Peta Codebase (Knowledge Graph)** | `graphify` | `/graphify .` lalu query graph | `graphify/SKILL.md` |
| **Slide Presentasi Web (Chart.js)** | `slides` | HTML responsive pitch deck & presentasi | `slides/SKILL.md` |
| **Membuat / Mengedit / Mengevaluasi Skill** | `skill-creator` | Buat skill baru, eval loop & packaging | `skill-creator/SKILL.md` |

---

## 2. CLI Fast Router Tool (`route.py`)

Gunakan script CLI pendamping untuk mencocokkan query pengguna secara instan tanpa membaca file apapun:

```bash
# 1. Menampilkan seluruh daftar skill secara ringkas
python .agents/skills/skills-router/scripts/route.py --list

# 2. Mencari skill yang cocok dengan prompt pengguna (skor relevansi & aksi langsung)
python .agents/skills/skills-router/scripts/route.py "bantu saya buat plan dan roadmap arsitektur"
python .agents/skills/skills-router/scripts/route.py "perbaiki bug kartu tidak muncul"
python .agents/skills/skills-router/scripts/route.py "rekomendasikan palet warna poker casino mewah"

# 3. Melihat detail ringkas 1 skill spesifik
python .agents/skills/skills-router/scripts/route.py --skill taste-skill
```

---

## 3. The 26 Skills Catalog Reference

### 1. `brainstorming`
- **Tujuan:** Wajib sebelum pekerjaan kreatif, pembuatan fitur baru, atau modifikasi arsitektur besar.
- **Kapan Digunakan:** User mengajukan ide umum, butuh klarifikasi kebutuhan, atau eksplorasi alternatif sebelum coding.
- **Output:** Catatan trade-off dan 2-3 pertanyaan konfirmasi yang tajam.

### 2. `writing-plans`
- **Tujuan:** Menyusun rencana bertahap menyeluruh sebelum menyentuh kode.
- **Kapan Digunakan:** Ada spesifikasi atau fitur multi-langkah yang perlu dirancang.
- **Output:** Dokumen `.agents/plan/PLAN.md` dan checklist `.agents/plan/TASK.md`.

### 3. `executing-plans`
- **Tujuan:** Pengerjaan bertahap satu milestone/fase per giliran (*anti-rushing*).
- **Kapan Digunakan:** Saat mengeksekusi rencana dari `PLAN.md` & `TASK.md`.
- **Output:** Kode modular, status task terupdate `[x]`, dan konfirmasi user untuk lanjut.

### 4. `systematic-debugging`
- **Tujuan:** Menyelidiki akar masalah bug secara deterministik tanpa tebak-tebakan (*zero guessing*).
- **Kapan Digunakan:** Setiap kali ada error console, test failure, atau perilaku tak terduga.
- **Protokol:** 4 Fase: Reproduce -> Isolate Root Cause -> Formulate Hypothesis -> Implement & Verify.

### 5. `verification-before-completion`
- **Tujuan:** Gerbang verifikasi wajib sebelum menyatakan pekerjaan selesai.
- **Kapan Digunakan:** Sebelum menyatakan tugas selesai, siap commit, atau siap diserahkan.
- **Aksi:** Jalankan `npm run build`, `npm run lint`, unit tests, dan bukti visual.

### 6. `context7`
- **Tujuan:** Mengambil dokumentasi resmi terkini untuk SDK, framework, atau API pihak ketiga.
- **Kapan Digunakan:** Menggunakan library eksternal (Supabase, Tailwind, React 19, Vite, Gemini API).
- **Perintah:**
  ```bash
  npx ctx7 library <name> "[query]"
  npx ctx7 docs <libraryId> "<query>"
  ```

### 7. `taste-skill` (Art Direction & Anti-Slop)
- **Tujuan:** Standar estetika Awwwards/One Page Love untuk mencegah tampilan generik AI.
- **Kapan Digunakan:** Pemilihan tema visual, arsitektur hero section, layout bespoke, dan audit visual.
- **Perintah:**
  ```bash
  node .agents/skills/taste-skill/scripts/draw.mjs --sector <sector> --brief "<brief>"
  node .agents/skills/taste-skill/scripts/inspect.mjs <url-or-file>
  ```

### 8. `ui-ux-pro-max` (Design Intelligence)
- **Tujuan:** Searchable database lokal berisi ribuan data desain industri.
- **Kapan Digunakan:** Penentuan palet warna hex, font pairing, gaya 3D/tabletop, preset animasi GSAP.
- **Perintah:**
  ```bash
  python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "<Project>"
  ```

### 9. `impeccable` (Craft Polish)
- **Tujuan:** Evaluasi kualitas frontend mikro: tipografi, hierarki, spacing, dan surface modes.
- **Kapan Digunakan:** Polishing halaman web, audit accessibility, dan merapikan komponen.
- **Perintah:**
  ```bash
  .agents\skills\impeccable\scripts\impeccable.cmd context
  ```

### 10. `ui-styling`
- **Tujuan:** Styling komponen UI modern menggunakan Tailwind CSS utility dan prinsip shadcn/ui.
- **Kapan Digunakan:** Membangun antarmuka, dialog, modal, tombol, form, dan kartu interaktif.

### 11. `design-system`
- **Tujuan:** Arsitektur token sistematis 3 lapis (*primitive -> semantic -> component*).
- **Kapan Digunakan:** Menetapkan CSS variables di `:root` dan skala tipografi/spasi.

### 12. `design`
- **Tujuan:** Pembuatan logo AI (55 gaya), CIP mockups (50 deliverables), dan ikon SVG kustom (15 gaya).
- **Kapan Digunakan:** Kebutuhan aset visual branding, monogram, atau paket identitas visual.

### 13. `brand`
- **Tujuan:** Penetapan karakter suara brand, kerangka pesan, panduan tone of voice, dan konsistensi pesan.
- **Kapan Digunakan:** Menulis copy pemasaran, landing page headlines, dan panduan brand.

### 14. `banner-design`
- **Tujuan:** Panduan desain banner iklan display, media sosial (Instagram, X, LinkedIn), dan website hero.
- **Kapan Digunakan:** Mendesain banner kreatif dengan proporsi rasio aspek yang tepat.

### 15. `slides`
- **Tujuan:** Presentasi interaktif HTML responsif bertenaga Chart.js dan copywriting berstruktur.
- **Kapan Digunakan:** Membuat slide pitch deck, laporan interaktif, atau materi edukasi.

### 16. `skill-creator`
- **Tujuan:** Merancang, mengevaluasi, mengoptimalkan pemicu, dan memaketkan skill baru.
- **Kapan Digunakan:** Membuat skill baru dari nol atau menyempurnakan skill yang sudah ada.

### 17. `animate`
- **Tujuan:** Membuat satu animasi dengan urutan keputusan yang benar (perlu/tidak, tujuan, tool, properti, kurva, durasi, interupsi, exit).
### 18. `choreograph`
- **Tujuan:** Mengoordinasi beberapa elemen yang bergerak bersama menjadi satu gerak yang disengaja.
### 19. `apple-design`
- **Tujuan:** Gerak fluid ala Apple: gesture, spring, sheet, transisi interruptible, material translusen.
### 20. `emil-design-eng`
- **Tujuan:** Polish UI dan keputusan animasi berdasarkan filosofi Emil Kowalski.
### 21. `web-design-guidelines`
- **Tujuan:** Review kode UI terhadap Web Interface Guidelines (aksesibilitas, UX).

### 22-26. Token Saving: `rtk`, `claude-mem`, `headroom`, `caveman`, `graphify`
- **Tujuan:** Menekan konsumsi token (output shell, memori sesi, konteks, gaya jawaban, navigasi codebase). Detail pasang & pakai ada di SKILL.md masing-masing.

---

## 4. Standard Operational Pipelines

```
A. New Project / Major Feature Pipeline:
   brainstorming  ──>  writing-plans  ──>  taste-skill / ui-ux-pro-max  ──>  executing-plans  ──>  verification-before-completion

B. External API Integration Pipeline:
   context7 (verify syntax)  ──>  executing-plans (code)  ──>  verification-before-completion

C. Bug Fix & Troubleshooting Pipeline:
   systematic-debugging (investigate)  ──>  executing-plans (patch)  ──>  verification-before-completion

D. Visual Polish Pipeline:
   ui-ux-pro-max (tokens)  ──>  ui-styling (components)  ──>  impeccable (craft polish)

E. Motion Pipeline:
   animate (single)  ──>  choreograph (group)  ──>  emil-design-eng / apple-design (feel)  ──>  web-design-guidelines (review)
```

