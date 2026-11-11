# TASK TRACKER: [NAMA_PROYEK]

**Project:** [Nama Proyek]  
**Master Directives:** `AGENTS.md` (Clean Code, Anti-Rushing, Anti-Slop, Skills Guide)  
**Master Plan:** `.agents/plan/PLAN.md`  
**Current Active Phase:** [Fase Aktif, misal: Fase 1]

---

## Task Progress Checklist

- [ ] **Fase 1: Foundation & Design Tokens Setup**
  - [ ] Implementasikan CSS variables/tokens dari `PLAN.md`
  - [ ] Validasi setup font pairing terpilih
  - [ ] Konfigurasi motion library / GSAP ScrollTrigger
  - [ ] Setup struktur modular file di `src/components/` dan `src/data/`

- [ ] **Fase 2: Visual Anchor / Hero Section**
  - [ ] Susun struktur headline (maksimal 2 baris)
  - [ ] Terapkan pencahayaan fisik dan surface depth
  - [ ] Verifikasi render 60 FPS dan audit responsif (mobile 390px, desktop 1280px+)

- [ ] **Fase 3: Core Feature / Story Section**
  - [ ] Terapkan arsitektur layout non-kartu generik
  - [ ] Integrasikan aset autentik proyek
  - [ ] Verifikasi transisi scene masuk & keluar

- [ ] **Fase 4: "One Live Thing" Interactive Experience**
  - [ ] Bangun komponen interaktif utama
  - [ ] Pastikan responsif pada interaksi sentuh dan kursor

- [ ] **Fase 5: Secondary Content & Showcase Flow**
  - [ ] Implementasikan section pendukung & penutup
  - [ ] Jaga ritme spasial dan konsistensi token

- [ ] **Fase 6: Final Verification & Performance Hardening**
  - [ ] Verifikasi zero dead code & zero comments di seluruh kode
  - [ ] Audit anti-slop (cek checklist di `DESIGN_ANTI_SLOP.md`)
  - [ ] Verifikasi lifecycle cleanup (prevent memory leaks)
  - [ ] Lakukan browser testing menyeluruh lintas ukuran layar
