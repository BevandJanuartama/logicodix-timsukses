# Fase 12+ — Arah Desain "Ruang Praktik Hangat"

Sumber: screenshot 1.png (Bersihkan), 2.png (Anatomi), referensi 3.jpg (Anatomy Atelier); skill emil-design-eng, impeccable (mode Operate, redesign = ganti dunia visual), ui-ux-pro-max (search.py), taste-skill (house rules). Web: awwwards.com/websites/3d dan 21st.dev hanya memberi daftar nama/kategori lewat WebFetch, tanpa pola yang bisa dipakai; arah di bawah bertumpu pada 3.jpg dan skill.
Catatan konflik: ui-ux-pro-max menyarankan indigo + Fredoka (claymorphism), taste-skill melarang "krem + terakota". Brief pengguna menang (aturan impeccable): krem hangat + coral, tapi coral dijaga ke oranye-salem (bukan terakota/karat) dan krem dijaga ke putih (bukan kuning).

## 1. Diagnosis (kenapa sekarang terasa slop dan sulit untuk awam)
1. **Label mono kapital kecil di mana-mana.** `shell/PanelParts.tsx` `SectionTitle` (11px, `telemetry uppercase`: ALAT, SUDUT PANDANG, ZOOM, JENIS GIGI, ANGKA KUNCI), `shell/LodIndicator.tsx` (MAKRO/MESO/MIKRO), `quiz/QuestionCard.tsx`, `quiz/QuizPanel.tsx`, `quiz/QuizResult.tsx`, `diseases/DiseaseDetail.tsx` (dt), eyebrow di `shell/Hero.tsx`. Ada 25× `text-[11px]`, 24× `12px`, 41× `13px`: hampir semua teks isi di bawah 15px.
2. **Kode internal bocor ke awam.** `explore/ToothTypeTable.tsx` menampilkan `TT-001…`, `SourceLinks` menampilkan `SRC-002`, `KeyFigures` "WHO · SRC-002"; istilah Makro/Meso/Mikro, "Sulung" tanpa penjelasan.
3. **Satu panel kanan memuat semuanya.** `shell/Panel.tsx` (fixed 400px) + `explore/ExplorePanel.tsx` menumpuk chip pintasan, zoom, jenis gigi, tabel, angka kunci; `clean/CleanPanel.tsx` menumpuk skor, alat, sudut pandang, dan 5 akordeon pilar. Tidak ada satu hal yang jelas harus dilakukan.
4. **Kanvas hitam + kaca navy = HUD klinis generik.** `globals.css` `--surface-base:#000`, panel blur 16px + rim-light, biru `#2563eb`. Model melayang tanpa alas/bayangan, terasa dingin dan mengintimidasi.
5. **Model 3D tidak membimbing.** Tidak ada hotspot di model (drei `Html` tidak dipakai); pengguna disuruh membaca "Klik bagian mana pun" lalu memakai chip yang menduplikasi model. `Hero.tsx` hanya kartu kecil dengan 3 ikon gestur.
6. **Angka yang membingungkan atau menakutkan.** `clean/useCleaningTimer.ts` + `ScoreSummary.tsx`: "35:52 / 2:00" (waktu terus jalan melewati target), skor 49% berwarna merah bahaya, 3 bar tipis Gigi/Sela/Lidah; `explore/KeyFigures.tsx` menyelipkan "<10% energi gula bebas" di mode anatomi.
7. **Kontrol tersebar dan dobel.** `shell/ViewControls.tsx` (ikon tanpa label, kiri bawah, tertimpa indikator dev Next), `LodIndicator` terpisah, dan tombol Depan/Atas/Bawah/Kiri/Kanan lagi di `CleanPanel`.
8. **Tipografi: 3 keluarga + heading padat.** `app/layout.tsx` memuat Archivo, Instrument Sans, JetBrains Mono (melanggar maks 2 font); Archivo bold rapat + abu-abu kecil di atas hitam sulit dibaca.

## 2. Arah visual: "Ruang Praktik Hangat"
Gigi diletakkan di atas alas lembut seperti benda di meja studio pagi hari: krem terang, satu aksen coral, tinta cokelat tua. Tenang, bukan klinis. Pemisah antarpermukaan = selisih nada, bukan garis/bayangan (bayangan hanya untuk yang benar-benar melayang: popover, dialog, sheet).

| Token | Hex | Pakai | Kontras (cream / paper / sunken) |
|---|---|---|---|
| `--p-cream` | #FBF5EE | latar aplikasi | — |
| `--p-paper` | #FFFCF8 | kartu info, rail | — |
| `--p-sunken` | #F3E8DC | kontrol tak aktif, area kanvas | — |
| `--p-sand` | #EADBCB | alas 3D, track slider | — |
| `--p-ink` | #2A201B | teks utama | 14.69 / 15.54 / 13.16 |
| `--p-ink-2` | #5C4A3F | teks sekunder | 7.74 / 8.19 / 6.94 |
| `--p-ink-3` | #76645A | keterangan (min 15px) | 5.19 / 5.49 / 4.65 |
| `--p-coral` | #E2643F | hotspot, cincin fokus, indikator aktif (non-teks, >= 3:1) | 3.17 / 3.35 / 2.84 (hindari di sunken) |
| `--p-coral-deep` | #A93E1F | teks/tautan aksen, tombol utama (putih di atasnya 6.18) | 5.71 / 6.05 / 5.12 |
| `--p-coral-tint` | #FCE6DC | latar item terpilih (ink di atasnya 13.24) | — |
| `--p-ok` / tint #E3F0E6 | #2E7048 | Sehat (di tint 5.07) | 5.50 / 5.82 / 4.93 |
| `--p-warn` / tint #FBEBD2 | #8F5300 | Perlu perhatian (di tint 5.26) | 5.70 / 6.03 / 5.11 |
| `--p-danger` / tint #FBE3DF | #B42318 | Serius (di tint 5.37) | 6.07 / 6.43 / 5.44 |
| `--p-info` | #2F5F8A | info netral, tautan sumber | 6.21 / 6.57 / 5.56 |

Status selalu warna + kata ("Sehat", "Perlu perhatian", "Serius"), tidak pernah warna saja. Progres memakai `--p-ok`/coral, bukan merah.
**3D (`components/three/Scene.tsx`, `StudioLights.tsx`):** canvas tetap `alpha`, latar CSS #F6ECE1 datar (tanpa gradien); alas silinder pipih #EADBCB + drei `ContactShadows` (warna #7A4E3A, opacity 0.32, blur 2.4); hemisphere langit #FFF7EE / tanah #E8CDB9 (0.6); key #FFF1E0 (2.0); fill #FFD9BD (0.8); rim dingin #bfe0ff diganti peach #FFE2CF (1.0); `toneMappingExposure` 1.05. Cek ulang warna gusi agar tidak berbenturan dengan coral (gusi tetap pink-mawar, coral tetap oranye).

## 3. Tipografi (2 font, Google Fonts)
- **Display: Newsreader** (serif opsikal, 500/600, tracking -0.02em, leading 1.05) — judul mode, nama struktur, angka besar.
- **Teks: Atkinson Hyperlegible Next** (400/600) — dirancang untuk keterbacaan; fallback Figtree bila `next/font` belum memuatnya. Angka pakai `tabular-nums`. JetBrains Mono dan Archivo dihapus.
- Skala (5 ukuran): 40/44 display hero · 28/32 judul kartu · 20/28 subjudul · 17/26 isi · 15/22 keterangan (minimum mutlak; label tab mobile 14px satu-satunya pengecualian).
- Aturan: tanpa label kapital kecil, tanpa mono, tanpa eyebrow, tanpa kode (TT-/SRC-). Judul bagian = kalimat biasa ("Alat yang dipakai"). Paragraf <= 25 kata, headline <= 2 baris. Bahasa awam: "gigi susu" (bukan sulung), "Seluruh mulut / Satu gigi / Lapisan dalam" (bukan Makro/Meso/Mikro), "Sumber: WHO 2022" (bukan SRC-002).

## 4. Tata letak per mode
**Kerangka desktop (>= 1280):** bar atas polos di atas krem (wordmark serif kiri, 5 tab teks tengah, "Sumber" kanan; bukan pil kaca). Rail kiri 280px (pustaka mode: daftar dengan thumbnail 56px hasil render model sendiri). Kanvas tengah dengan alas; toolbar vertikal di tepi kiri kanvas berlabel teks di bawah ikon (Putar, Perbesar, Perkecil, Ulang, Sudut, Belah). Kartu info kanan 380px: judul serif, satu kalimat, "Fakta singkat" (dl 2 kolom, label kalimat biasa), satu tombol utama. Baris bawah bukan kartu fitur, tapi satu kalimat "Langkah berikutnya →" yang menautkan ke mode lain (alur cerita: kenali → masalah → jika dibiarkan → latihan → uji diri).
- **Anatomi ("Kenali gigi")**: 6 hotspot coral di model (gigi seri, taring, geraham kecil, geraham, gusi, lidah). Rail = daftar yang sama dengan thumbnail. Toggle "Gigi susu / Gigi dewasa" di atas kanvas. Tingkat detail jadi 3 tombol di toolbar. Lapisan (email, dentin, pulpa) dilipat dalam "Lihat bagian dalam" di kartu. Angka kunci tinggal satu: "32 gigi dewasa, 20 gigi susu". Chip pintasan, tabel TT-, dan angka gula dibuang.
- **Penyakit ("Masalah gigi")**: rail mengelompokkan 10 penyakit per status (titik + kata). Memilih → hotspot di lokasi terdampak berdenyut warna status, kamera meluncur ke sana. Kartu: apa itu (<= 25 kata), 3 tanda, cara mencegah, tombol "Lihat jika dibiarkan" → Simulasi dengan track terpilih.
- **Simulasi ("Jika dibiarkan")**: rail = daftar track (penyakit/kebiasaan). Penggeser waktu besar di bawah kanvas ("Hari ini → 6 bulan"), tahap ditulis kata. Kartu menjelaskan tahap aktif. Kurva Stephan dilipat ke "Kenapa gula berbahaya?".
- **Bersihkan ("Latihan sikat")**: rail = 3 alat besar bergambar (Sikat, Benang, Pembersih lidah). Skor satu angka serif warna tinta + "Gigi 63% · Sela 50% · Lidah 16%" dengan bar tebal hijau. Timer "1:23 dari 2:00" berhenti di target. Tip teknik jadi sticky-note di kanvas. Tombol sudut pandang dibuang (sudah di toolbar). 5 pilar pindah ke ringkasan setelah selesai.
- **Kuis ("Uji diri")**: rail disembunyikan; kartu soal 640px di tengah, model mengecil ke kanan dan menyorot gigi terkait soal. Pilihan = baris 56px dengan huruf A–D (sans). "Soal 3 dari 10" dalam kata. Hasil: skor serif besar + daftar ulasan.
- **Mobile (< 768)**: kanvas 55vh atas; tab mode di bawah (ikon + label 14px); `BottomSheet` 3 posisi (intip 120px: judul + 1 kalimat; setengah; penuh). Rail jadi strip thumbnail geser horizontal di dalam sheet. Toolbar menyusut ke Ulang + Sudut (pinch untuk zoom). Hotspot area sentuh 44px.
- **Onboarding awam**: kunjungan pertama = model berputar pelan di alas + kartu kiri "Kenali gigimu, dari luar sampai akar." + satu kalimat + "Mulai menjelajah". Lalu sticky-note di kanvas (3 baris: Seret untuk memutar · Gulir untuk memperbesar · Ketuk titik oranye), bisa ditutup, diingat via localStorage (try/catch). Hotspot pertama berdenyut sekali.

## 5. Motion (Emil Kowalski)
- Easing: `--ease-out: cubic-bezier(0.23,1,0.32,1)` (default UI), `--ease-in-out: cubic-bezier(0.77,0,0.175,1)` (pergerakan di layar), `--ease-drawer: cubic-bezier(0.32,0.72,0,1)` (sheet). Tidak pernah `ease-in`.
- Durasi: tekan 140ms (`scale .97`), hover 160ms, tooltip/popover 180ms dari `scale .96 + opacity`, origin dari pemicu; isi kartu ganti 220ms (y 8px + opacity); sheet mobile spring `{duration:0.45,bounce:0.12}`, bisa diseret dan diinterupsi; stagger daftar 30ms maks 6 item. Mode sering dipakai → tanpa hiasan, < 250ms.
- `layoutId`: indikator tab mode (`mode-pill`), sorotan item rail (`rail-active`), segmented control gigi susu/dewasa. Jangan layoutId menembus batas Canvas (drei `Html` merender root terpisah): hotspot→kartu dikoordinasikan lewat waktu, bukan shared layout.
- Hanya `transform`/`opacity` (dan `setLookAt` kamera). Semua listener/animasi dibersihkan saat unmount.
- Reduced motion: transform diganti opacity saja, kamera berpindah instan, denyut hotspot mati, rotasi idle mati.
- **One Live Thing — "Ketuk titik, gigi menoleh padamu":** hotspot coral bernapas (cincin scale/opacity 2.4s, berhenti setelah interaksi pertama). Ketuk → kamera meluncur 700ms `ease-in-out` ke gigi itu, gigi mendapat rim coral lembut (`useToothHighlight`), bayangan alas ikut bergeser, kartu kanan masuk dengan nama serif. Berlaku di Anatomi dan Penyakit; penggeser waktu Simulasi jadi momen hidup kedua.

## 6. Rencana fase (satu fase per giliran, tanpa commit — pengguna commit manual)
**Fase 12 — Fondasi token, font, dan panggung 3D krem**
- 🔵 Sonnet: palet §2 sebagai primitive → semantic → component, hapus tema gelap/`telemetry`, easing & durasi §5 — `app/globals.css`
- 🟢 Haiku: ganti font ke Newsreader + Atkinson Hyperlegible Next, `colorScheme:'light'`, `themeColor:#FBF5EE` — `app/layout.tsx`
- 🔵 Sonnet: latar CSS kanvas, alas + ContactShadows, lampu hangat — `components/three/Scene.tsx`, `StudioLights.tsx`, (baru) `components/three/Pedestal.tsx`
- 🟢 Haiku: hapus kelas `telemetry`/`uppercase`/`text-[11–13px]` di seluruh `components/ui/**` ke skala baru
- 🟢 Haiku: verifikasi — `npm run lint`, `npm run build`, skrip kontras ulang, screenshot 1440/390; perbarui `rangkuman.md` + `TASK.md`; tanpa commit
**Fase 13 — Shell, navigasi, onboarding**
- 🔵 Sonnet: bar atas polos + tab teks dengan `layoutId` — `shell/TopBar.tsx`, `shell/ModeTabs.tsx`
- 🟣 Opus: kerangka 3 kolom + rail kiri generik + kartu kanan — `components/Experience.tsx`, `shell/Panel.tsx`, (baru) `shell/LibraryRail.tsx`, `shell/InfoCard.tsx`
- 🔵 Sonnet: toolbar vertikal berlabel menggantikan ViewControls + LodIndicator — `shell/ViewControls.tsx`, `shell/LodIndicator.tsx`, `shell/ViewPresetMenu.tsx`
- 🔵 Sonnet: onboarding hero + sticky-note tip — `shell/Hero.tsx`, (baru) `shell/TipNote.tsx`
- 🔵 Sonnet: sheet mobile 3 posisi + tab bawah — `shell/BottomSheet.tsx`
- 🟢 Haiku: verifikasi (lint, build, keyboard/fokus, 1440/768/390, reduced motion); `rangkuman.md`; tanpa commit
**Fase 14 — Anatomi & Penyakit + hotspot 3D (One Live Thing)**
- 🟣 Opus: komponen hotspot drei `Html` (occlude, maks 8, area 44px) + luncuran kamera — (baru) `components/three/Hotspots.tsx`, `CameraRig.tsx`, `useToothHighlight.ts`
- 🔵 Sonnet: rampingkan Anatomi, buang TT-/chip/angka gula, lapisan dilipat — `explore/ExplorePanel.tsx`, `ToothTypeTable.tsx`, `KeyFigures.tsx`, `LayerToggles.tsx`, `StructureDetail.tsx`, `ExploreIntro.tsx`
- 🔵 Sonnet: rail penyakit per status + kartu + CTA ke Simulasi — `diseases/*`, `shell/PanelParts.tsx` (`SourceLinks` tanpa kode)
- 🟢 Haiku: thumbnail statis dari render model sendiri — `public/thumbs/*` (catat atribusi di `rangkuman.md`)
- 🟢 Haiku: verifikasi (FPS 60 dengan hotspot, occlusion, mobile tap); `rangkuman.md`; tanpa commit
**Fase 15 — Simulasi & Latihan sikat**
- 🔵 Sonnet: penggeser waktu besar + tahap berkata, Stephan dilipat — `simulator/StageScrubber.tsx`, `TimelinePlayer.tsx`, `SimulatorPanel.tsx`, `StephanCurve.tsx`, `TrackPicker.tsx`
- 🔵 Sonnet: skor tinta, bar tebal, timer berhenti di target, alat di rail, pilar ke ringkasan — `clean/CleanPanel.tsx`, `ScoreSummary.tsx`, `useCleaningTimer.ts`, `ToolPicker.tsx`, `PreventionPillars.tsx`, `CleanFeedback.tsx`
- 🟢 Haiku: verifikasi (alur sikat 2 menit, scrubber keyboard); `rangkuman.md`; tanpa commit
**Fase 16 — Kuis, pustaka, bahasa awam, audit akhir**
- 🔵 Sonnet: layout kuis tengah + model menyorot gigi terkait — `quiz/*`
- 🟢 Haiku: dialog sumber/tata kelola ke palet & skala baru — `library/*`, `shell/Dialog.tsx`
- 🟣 Opus: audit copy awam di seluruh UI (<= 25 kata, tanpa jargon) + audit anti-slop & motion (`impeccable critique/polish`, `taste-skill inspect.mjs` bila jalan)
- 🟢 Haiku: verifikasi akhir (lint, build, kontras, FPS, 3 lebar layar); `rangkuman.md` + `TASK.md`; tanpa commit

## 7. Keputusan terbuka untuk pengguna
1. **Nama tab diganti ke bahasa awam** ("Kenali gigi, Masalah gigi, Jika dibiarkan, Latihan sikat, Uji diri") atau tetap (Anatomi, Penyakit, ...)? Rekomendasi: ganti; judul lama boleh jadi teks kecil di kartu.
2. **Tema gelap dihapus total** atau dipertahankan sebagai toggle? Rekomendasi: hapus dulu (satu tema terang), fokus kualitas; dark bisa jadi fase opsional.
3. **Thumbnail rail**: render statis dari model 3D sendiri (jujur, seragam) atau ilustrasi garis sederhana? Rekomendasi: render statis dari model sendiri.

## 8. Keputusan pengguna (12/11/2026)
1. Nama tab **tetap**: Anatomi, Penyakit, Simulasi, Bersihkan, Kuis. Bahasa awam dipakai di judul kartu dan isi, bukan di tab.
2. Tema gelap **dihapus**; satu tema krem terang.
3. Thumbnail rail: **render statis dari model 3D sendiri**.
