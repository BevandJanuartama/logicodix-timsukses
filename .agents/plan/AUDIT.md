# Audit Dental Explorer 3D

Tanggal: 12 November 2026. Kondisi yang diaudit: commit terakhir `2c638a9` (Fase 12) ditambah perubahan Fase 13–15 yang belum di-commit (78 entri di `git status`).

**Cara audit.** Grafik impor dihitung dengan skrip (149 file `.ts/.tsx`), `tsc --noUnusedLocals --noUnusedParameters`, analisis chunk dari build produksi pada salinan terisolasi, dan pemeriksaan langsung di browser pada 1440×900 dan 390×844 untuk kelima mode dan kedua dialog. Tidak ada kode aplikasi yang diubah oleh audit ini.

**Lima temuan terpenting**

1. Inti three.js (±100 kB gzip) ikut dimuat di awal, padahal scene 3D sudah di-*lazy load*. Penyebabnya satu impor dari UI ke `lib/three/layout.ts`.
2. Tidak ada kode mati: 0 file tak terjangkau, 0 dependensi menganggur, `public/` kosong. Yang berlebih justru pemecahan file: 50 dari 149 file di bawah 40 baris.
3. Lapisan "bahasa awam" berbasis regex menghasilkan teks salah. Kartu Radang gusi menampilkan "penumpukan plak plak".
4. Tidak ada jaring pengaman: tanpa error boundary/fallback WebGL, tanpa ESLint, tanpa tes, dan build bergantung pada unduhan Google Fonts.
5. Di mobile, isi utama mode Kuis dan Simulasi tersembunyi di balik sheet posisi intip; di desktop, kolom kiri mode Kuis kosong dan kartu masih menampilkan `Q-001 · Draf`.

---

## 1. 🏗️ Usage Audit & Code Review

### 1.1 Angka dasar

| Ukuran | Nilai |
|---|---|
| File sumber (`app`, `components`, `lib`) | 149 file, 10.291 baris |
| File > 250 baris | 0 (terbesar `lib/three/layout.ts`, 227) |
| File < 40 baris | 50 |
| File tak terjangkau dari `app/` | 0 |
| Dependensi yang tidak diimpor | 0 dari 10 |
| Aset di `public/` | 0 (tidak ada aset tak terpakai) |
| Variabel/parameter tak terpakai (`tsc`) | 0 |
| Komentar kode | 0 (sesuai Hukum 3) |
| Tes otomatis, ESLint, CI | tidak ada (skrip hanya `dev`, `build`, `start`, `typecheck`) |
| First Load JS route `/` | 290 kB (build Fase 14) |

### 1.2 Usage audit

- **Ekspor mati:** hanya `SheetPosition` di `components/ui/shell/useSheetSnap.ts`. Sekitar 40 ekspor lain hanya dipakai di file sendiri (misal `LayerUniforms`, `RootPlan`, `HabitScenario`); kata `export`-nya bisa dihapus agar permukaan modul jujur.
- **Field data yang tidak pernah ditampilkan:** `audience`, `implementationNote` (PreventionTopic), `relatedConditions` (AnatomyStructure), `visualChange` (DiseaseStage). Ini cerminan lembar xlsx, jadi boleh tetap ada, tetapi `visualChange` dan `relatedConditions` adalah konten siap pakai (lihat §3).
- **Dokumen rencana tertinggal dari kode:** `TASK.md`/`PLAN.md` masih menyebut file yang tidak ada (`DentalScene.tsx`, `SceneInspector.tsx`, `teeth.ts`) dan perintah taste-skill yang gagal (`draw.mjs --kind studio`).

### 1.3 Temuan arsitektur, urut dampak

**A. Inti three.js masuk bundle awal (dampak tinggi, usaha kecil).**
`components/ui/explore/ExplorePanel.tsx` dan `components/ui/shell/ModeRail.tsx` mengimpor `getLayouts`/`toothLabel` dari `lib/three/layout.ts`, yang mengimpor `three`. Akibatnya chunk inti three (379 kB mentah, ±100 kB gzip) masuk daftar chunk awal halaman, sementara renderer-nya (335 kB) benar ter-*lazy load*. UI hanya butuh nama, jenis, dan kuadran gigi, bukan vektor.

Perbaikan: pisahkan identitas gigi ke modul tanpa three.

```ts
// lib/data/dentition.ts
export type ToothKind = 'incisor' | 'canine' | 'premolar' | 'molar'
export type Jaw = 'upper' | 'lower'

export interface ToothIdentity {
  id: string
  fdi: number
  quadrant: 1 | 2 | 3 | 4
  jaw: Jaw
  index: number
  kind: ToothKind
  name: string
}

const KINDS: ToothKind[] = ['incisor', 'incisor', 'canine', 'premolar', 'premolar', 'molar', 'molar', 'molar']
const NAMES = [
  'Gigi Seri Sentral', 'Gigi Seri Lateral', 'Gigi Taring', 'Premolar Pertama',
  'Premolar Kedua', 'Molar Pertama', 'Molar Kedua', 'Molar Ketiga (Bungsu)',
]
const QUADRANT_NAMES = { 1: 'kanan atas', 2: 'kiri atas', 3: 'kiri bawah', 4: 'kanan bawah' } as const

export const toothIdentities: ToothIdentity[] = ([1, 2, 3, 4] as const).flatMap((quadrant) =>
  NAMES.map((name, i) => ({
    id: String(quadrant * 10 + i + 1),
    fdi: quadrant * 10 + i + 1,
    quadrant,
    jaw: quadrant <= 2 ? ('upper' as const) : ('lower' as const),
    index: i + 1,
    kind: KINDS[i],
    name,
  })),
)

export const toothById = new Map(toothIdentities.map((tooth) => [tooth.id, tooth]))
export const toothLabel = (tooth: ToothIdentity) => `${tooth.name} ${QUADRANT_NAMES[tooth.quadrant]}`
```

Lalu `ExplorePanel`, `ModeRail`, dan `ToothSummary` mengimpor dari `lib/data/dentition` (`tooth.kind` menggantikan `tooth.params.kind`), dan `lib/three/layout.ts` memakai `NAMES`/`KINDS` dari modul itu. Perkiraan hasil: First Load 290 → ±190 kB. Total unduhan tidak berkurang (scene tetap butuh three), tetapi UI tampil dan interaktif lebih cepat. Konfirmasi dengan `npm run build`.

**B. Bahasa awam ditulis ulang dengan regex saat runtime (dampak tinggi untuk mutu konten).**
Ada tiga lapisan terpisah di folder komponen: `explore/plainLabels.ts`, `diseases/plainLanguage.ts` (14 regex), `simulator/plainStages.ts`. Uji pada 40 field penyakit: 13 ditulis ulang, dan definisi Radang gusi menjadi "radang gusi, sering berkaitan dengan penumpukan **plak plak**" (dari "biofilm plak"). Regex juga tidak bisa ditinjau klinisi.

Perbaikan cepat: tambahkan `[/biofilm plak/gi, 'plak']` sebelum aturan `/biofilm/`. Perbaikan benar: jadikan salinan awam sebagai data.

```ts
// lib/types.ts
export interface PlainCopy {
  summary: string
  signs: string[]
  prevention: string[]
}

export interface Disease {
  // ...field yang ada
  plain?: PlainCopy
}
```

```ts
// lib/data/diseases.ts (DIS-002)
plain: {
  summary: 'Gusi meradang, biasanya karena plak yang menumpuk.',
  signs: ['Gusi merah', 'Gusi bengkak', 'Mudah berdarah saat menyikat'],
  prevention: ['Sikat gigi 2× sehari', 'Bersihkan sela gigi', 'Periksa rutin ke dokter gigi'],
},
```

`DiseaseDetail` membaca `disease.plain`, dan `plainLanguage.ts` dihapus. Salinan awam ikut terdaftar di `contentRegistry` sehingga status tinjauannya terlacak.

**C. Tidak ada fallback saat 3D gagal (dampak tinggi di perangkat lemah).**
Tidak ada error boundary, `app/error.tsx`, atau penanganan `webglcontextlost`. Di perangkat tanpa WebGL, pengguna melihat kanvas krem kosong tanpa penjelasan.

```tsx
// components/ui/shell/CanvasErrorBoundary.tsx
'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  fallback: ReactNode
  children: ReactNode
}

export class CanvasErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
```

Pakai di `CanvasStage` membungkus `<Scene />`, dengan fallback berisi kalimat "Model 3D tidak bisa tampil di perangkat ini. Semua penjelasan tetap bisa dibaca di panel." Tambahkan juga `app/error.tsx`.

**D. Kanvas kosong saat model dibangun (dampak sedang).**
`SceneLoader` hanya tampil selama chunk diunduh. Setelah itu geometri 32 gigi dibangun sinkron dan kanvas kosong tanpa indikator (teramati ±8–15 detik di mode dev; di produksi lebih singkat, belum diukur).

```tsx
// di dalam <Canvas>, components/three/Scene.tsx
function ReadySignal() {
  const signalled = useRef(false)
  useFrame(() => {
    if (signalled.current) return
    signalled.current = true
    useAppStore.getState().markSceneReady()
  })
  return null
}
```

`CanvasStage` menahan lapisan "Memuat model" sampai `sceneReady` bernilai true, lalu memudarkannya (opacity 220 ms).

**E. Build bergantung pada jaringan.**
`next/font/google` mengunduh font saat build; build Fase 14 gagal sekali karena unduhan Atkinson Hyperlegible Next habis percobaan ulang. Selain itu setiap build mencetak `Failed to find font override values`.

```ts
// app/layout.tsx
const bodyFont = Atkinson_Hyperlegible_Next({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
})
```

Ini menghapus pesan error-nya. Untuk build yang tidak bergantung jaringan, simpan file woff2 di repo dan pakai `next/font/local` (kedua font berlisensi OFL).

**F. Tanpa lint dan tes.**
Aturan proyek (nol komentar, hook dibersihkan, tanpa `setState` per frame) hanya dijaga lewat prompt. Tambahkan ESLint (`eslint-config-next`, `react-hooks`) dan tes unit untuk logika murni: skor di `lib/three/cleaning.ts`, `stageTarget` di `lib/simulatorStore.ts`, dan salinan awam. Tiga file tes kecil sudah menangkap bug seperti "plak plak".

**G. Batas lapisan bocor.**
- `components/three/hotspotAnchors.ts` mengimpor `components/ui/diseases/diseaseSeverity` (lapisan 3D bergantung pada folder UI).
- `explore/StructureDetail.tsx` mengimpor `diseases/chooseDisease`.
- `ExploreChip` dan `ExploreDisclosure` dipakai lima fitur tetapi tinggal di `explore/`.
- Aksi lintas-store tersebar: `lib/sceneFocus.ts`, `lib/simulatorActions.ts`, `components/ui/diseases/chooseDisease.ts`.
- Data editorial tersebar: `diseaseSeverity.ts` dan `plainStages.ts` di folder komponen, `quizFocus.ts` di `lib/data`.

**H. Pekerjaan belum di-commit.** Fase 13–15 (78 entri) hanya ada di working tree. Satu `git clean` atau `git checkout .` menghapusnya.

### 1.4 State, data, dan rendering

- **State:** lima store Zustand, semuanya dibaca lewat selector (0 langganan seluruh store). Nilai per frame (`simulationClock`) disimpan di luar React. Ini sudah benar. Catatan kecil: `thumbnails` (enam dataURL ±20 kB) lebih cocok di store kecil sendiri; reset khusus mode `clean` ditulis inline di `setMode`.
- **Data:** tidak ada *fetching*; semua konten adalah modul TS statis (`lib/data`, 1.287 baris) yang ikut bundle. Pada ukuran sekarang ini tepat. Jika konten tumbuh (§3), muat per mode dengan `import()` dinamis agar chunk halaman (39,6 kB gzip) tidak membengkak.
- **Rendering:** 13 titik `useFrame`; 32 instance `Tooth` masing-masing punya `useFrame` (sudah diberi *early exit* di Fase 15). DPR adaptif lewat `PerformanceMonitor`, bayangan alas di-*bake* sekali. **FPS belum pernah terukur** di sesi mana pun; pasang `<Stats />` dari drei pada mode dev dan ukur di ponsel nyata.
- **Panel mode:** kelima panel diimpor statis di `Experience.tsx`. `next/dynamic` per panel bisa menghemat beberapa kB; prioritas rendah.

### 1.5 Struktur folder yang disarankan

```
components/
  three/            scene, kamera, hotspot (tidak mengimpor dari ui/)
  ui/
    primitives/     Chip, Disclosure, Badge, Dialog, ToolbarButton, FactList
    layout/         Experience, CanvasStage, Panel, InfoCard, BottomSheet, LibraryRail, TopBar, ModeTabs
    onboarding/     Hero, TipNote
    explore/ diseases/ simulator/ clean/ quiz/ library/
lib/
  actions/          focusScene, chooseDisease, openSimulatorTrack
  data/             konten + dentition, severity, salinan awam
  three/            geometri dan shader
```

Gabungkan file sangat kecil yang selalu dipakai berpasangan (misal `SeverityBadge.tsx` 14 baris dengan `diseaseSeverity.ts`), supaya mendekati aturan proyek sendiri 100–250 baris.

---

## 2. 🎨 UI/UX Enhancement & Design Recommendations

### 2.1 Arah gaya

Arah sekarang ("Ruang Praktik Hangat": krem, serif Newsreader, satu aksen coral) sudah berada di keluarga *minimalist editorial*. Saya tidak menyarankan *clean brutalism*: target pengguna adalah orang awam, dan keputusan Anda di Fase 12 adalah tampilan lembut. Aplikasi ini juga satu layar tetap (`fixed inset-0`, tanpa scroll halaman), jadi **GSAP ScrollTrigger dan Lenis tidak punya tempat**; framer-motion sudah ada di bundle dan cukup.

### 2.2 Visual dan layout

| Lokasi | Masalah (teramati) | Rekomendasi |
|---|---|---|
| Intro, ≥ 1280px | Kolom kanan 380px kosong, kanvas kosong sampai model selesai dibangun: kesan pertama adalah dua bidang krem | Isi kolom kanan dengan "Yang bisa kamu pelajari" (5 baris menuju mode) atau angka bersumber (§3); tahan loader sampai scene siap |
| Kuis, ≥ 1280px | Kolom kiri 280px kosong; kartu menampilkan `Anatomi · Q-001 · Draf` | Lipat grid jadi 2 kolom, kartu soal 640px; hapus kode dan lencana Draf (Fase 16.1) |
| Catatan Tips | Tips umum ("Ketuk bagian gigi…") tetap tampil di Simulasi dan Kuis; di mobile menutup ±¼ kanvas | Tampilkan hanya di Anatomi; hilang otomatis setelah interaksi pertama atau 8 detik |
| Bersihkan | Rincian tampil dua kali (baris "Gigi 0% · Sela 0% · Lidah 0%" dan tiga batang berlabel sama); tombol utama coral adalah "Kumur", padahal tugas utamanya menyikat | Sisakan batang saja; jadikan "Kumur" tombol sekunder sampai skor ≥ target |
| Angka di font isi | Nol tampil bercoret, sehingga "0%" dan "0:00" terbaca seperti dicoret | Tampilkan angka skor dan timer dengan `font-display tabular-nums` |
| Dialog Tata kelola | Pengguna akhir melihat "44 Draf · 0 Ditinjau · 0 Disetujui" dan kode `FR-015` | Pindahkan ke halaman/flag internal; untuk publik cukup satu kalimat status tinjauan |
| Dialog Referensi | Kode `SRC-001…` dan garis pemisah tipis | Nama institusi + judul saja; pemisah dengan selisih nada (Fase 16.2) |
| Rail Anatomi | Subjudul terpotong ("Gigi Seri Sentral kanan …") | `line-clamp-2`, atau subjudul lebih pendek ("Kanan atas") |
| Preset Sudut "Atas" | Hanya menampakkan gusi rahang atas dari dekat | Ganti dengan sudut yang menampakkan permukaan kunyah rahang bawah |

### 2.3 Interaktivitas dan animasi

Gerak yang layak ditambah, semuanya `transform`/`opacity` dan mati pada *reduced motion*:

1. **Model "mendarat" saat siap:** naik 12px + pudar masuk 400 ms, bersamaan dengan hilangnya loader. Ini momen pertama yang berkesan.
2. **Skor Bersihkan menghitung naik** saat plak hilang (angka serif besar), dan batang hijau mengisi dengan `scaleX`.
3. **Umpan balik kuis:** jawaban benar menyorot gigi terkait dan kamera meluncur (jalur `focusScene` sudah ada lewat `quizFocus.ts`); jawaban salah cukup guncang 4px sekali.
4. **Hover rail:** thumbnail membesar ke 1,04 dan item bergeser 2px; di Penyakit, hover memunculkan titik lokasi di model sebelum diklik.
5. **Pergantian mode:** kartu sudah pudar-geser; tambahkan kamera kembali ke bingkai awal agar tiap mode mulai dari komposisi yang sama.
6. **Sorotan gigi terpilih:** kilau coral masih samar; pertimbangkan garis tepi (outline) tipis, karena *rim* Fresnel hampir tak terlihat pada enamel putih di latar krem.

Yang jangan ditambah: animasi scroll, parallax, partikel dekoratif, *bounce*.

### 2.4 Responsivitas dan aksesibilitas

| Temuan | Bukti | Perbaikan |
|---|---|---|
| Isi utama tersembunyi di mobile | Di 390×844, Kuis hanya menampakkan "Soal 1/8 · Q-001 · Draf"; soal dan jawaban di bawah lipatan. Simulasi hanya menampakkan judul | Buka sheet di posisi setengah untuk Kuis dan Simulasi (snippet di bawah) |
| Teks tidak bisa diseleksi | `select-none` pada `<main>` di `Experience.tsx:53` | Pindahkan `select-none` ke `<section>` kanvas di `CanvasStage.tsx` |
| Semantik tab tidak lengkap | `role="tab"` di `ModeTabs` tanpa `aria-controls`; panel tanpa `role="tabpanel"` | Beri `id` dan `role="tabpanel"` + `aria-labelledby` pada `InfoCard`/`BottomSheet`, atau ganti ke `nav` + `aria-current` |
| Ponsel mendatar belum diuji | Breakpoint `md` (768px) membuat layar 844×390 memakai tata letak desktop dengan tinggi 390px | Uji; kemungkinan perlu syarat tinggi minimum (`min-height: 560px`) untuk tata letak desktop |
| Warna di luar token | `#FFF1C9` ditulis langsung di `TipNote.tsx` | Jadikan token `--p-note` di `globals.css` |
| Catatan tip Bersihkan muncul lagi | Menutup tip lalu ganti alat memunculkannya kembali (`setCleanDismissed(false)` pada perubahan alat) | Ingat penutupan per sesi |
| Kanvas tanpa alternatif saat gagal | Lihat §1.3 C | Error boundary + kalimat fallback |

```tsx
// components/ui/shell/Panel.tsx
const HALF_OPEN_MODES = new Set(['quiz', 'destroy'])

<BottomSheet key={contentKey} label={label} initialPosition={HALF_OPEN_MODES.has(contentKey) ? 'half' : 'peek'}>
```

```ts
// components/ui/shell/useSheetSnap.ts
export function useSheetSnap(sheet: RefObject<HTMLElement | null>, initialPosition: SheetPosition = 'peek') {
  const [index, setIndex] = useState(SHEET_POSITIONS.indexOf(initialPosition))
```

Yang sudah baik: target sentuh ≥ 40px, fokus terlihat (cincin coral global), hotspot berupa `button` berlabel, status selalu warna + kata, kontras token ≥ 4,5:1, *reduced motion* ditangani di 19 file, dialog memakai `<dialog>` native.

---

## 3. 📊 Strategi Penambahan Data Tambahan

### 3.1 Prinsip

Contoh di prompt ("Projects Portfolio", "Testimonials") tidak cocok untuk aplikasi edukasi satu layar. Konten baru sebaiknya menjawab pertanyaan orang awam, masuk ke permukaan yang sudah ada (kartu, rail, kolom intro yang kosong, menu Sumber), dan mengikuti aturan proyek: **bersumber, berstatus tinjauan, tanpa angka rekaan**.

### 3.2 Konten yang layak ditambah dan lokasinya

| Konten | Lokasi di UI | Sumber data | Pola UI |
|---|---|---|---|
| **Kamus istilah** (email, dentin, plak, karang gigi…) | Istilah bergaris titik di teks → popover; daftar lengkap di menu Sumber | Baru; menggantikan regex §1.3 B | Popover + daftar definisi |
| **Kapan harus ke dokter gigi** per penyakit | Kartu Penyakit, tepat di bawah lencana tingkat | `safetyNote` yang ada + field baru | Kotak peringatan satu kalimat |
| **Yang terlihat** per tahap | Kartu Simulasi | `visualChange` (sudah ada, belum dipakai) | Satu baris di bawah judul tahap |
| **Masalah terkait** per struktur | Kartu Anatomi | `relatedConditions` (sudah ada, belum dipakai) | Tautan ke mode Penyakit |
| **Angka kunci Indonesia & dunia** | Kolom kanan intro (kosong di ≥ 1280px); kepala daftar Penyakit | SKI 2023 (GAP-004 masih "Verify"), WHO | Angka serif besar + sumber kecil; maksimal 3 |
| **Garis waktu tumbuh gigi** (gigi susu → dewasa menurut usia) | Mode Anatomi, memperluas toggle "Gigi susu / Gigi dewasa" | Baru; butuh sumber (terkait GAP-001) | Penggeser usia, memakai ulang `StageScrubber` |
| **Mitos vs fakta** | Ringkasan selesai di Bersihkan; menu Sumber | Baru | Accordion (`Disclosure`) |
| **Bank soal kuis** dengan tingkat kesulitan | Mode Kuis | Perluasan `quiz.ts` (kini 8 soal) | Pilihan topik sebelum mulai |
| **Riwayat belajar** (skor kuis, skor sikat terbaik) | Intro untuk pengunjung yang kembali | `localStorage` | 2–3 angka kecil, tanpa akun |

Jangan dipakai: grid kartu 3 kolom dan carousel (dilarang AGENTS.md Hukum 4; carousel juga buruk untuk keyboard).

### 3.3 Struktur data

Semua konten baru memakai amplop yang sama, agar tata kelola dan sumbernya seragam:

```ts
// lib/types.ts
export interface ContentMeta {
  id: string
  status: ReviewStatus
  sourceIds: string[]
}

export interface GlossaryTerm extends ContentMeta {
  term: string
  aliases: string[]
  plain: string
  objectId?: AnatomyObjectId
}

export interface KeyStat extends ContentMeta {
  label: string
  value: number | null
  unit: string
  scope: 'indonesia' | 'global'
  year: number | null
  note?: string
}

export interface EruptionMilestone extends ContentMeta {
  dentition: 'primary' | 'permanent'
  toothIds: string[]
  ageFromMonths: number
  ageToMonths: number
  plain: string
}

export interface MythFact extends ContentMeta {
  myth: string
  fact: string
  relatedDiseaseIds: string[]
}
```

Contoh isi (format JSON; nilai statistik sengaja `null` sampai tabel resminya diverifikasi):

```json
{
  "glossary": [
    {
      "id": "GLO-001",
      "term": "Plak",
      "aliases": ["biofilm", "biofilm plak"],
      "plain": "Lapisan lengket berisi bakteri yang menempel di gigi.",
      "sourceIds": ["SRC-006"],
      "status": "Draft"
    }
  ],
  "keyStats": [
    {
      "id": "STAT-001",
      "label": "Penduduk Indonesia dengan masalah gigi dan mulut",
      "value": null,
      "unit": "%",
      "scope": "indonesia",
      "year": 2023,
      "note": "Isi dari tabel SKI 2023 setelah GAP-004 selesai",
      "sourceIds": ["SRC-010"],
      "status": "Draft"
    }
  ],
  "eruption": [
    {
      "id": "ERU-001",
      "dentition": "primary",
      "toothIds": ["71", "81"],
      "ageFromMonths": 6,
      "ageToMonths": 10,
      "plain": "Dua gigi seri bawah biasanya tumbuh paling dulu.",
      "sourceIds": [],
      "status": "Draft"
    }
  ],
  "myths": [
    {
      "id": "MYTH-001",
      "myth": "Gusi berdarah berarti harus berhenti menyikat.",
      "fact": "Gusi berdarah sering menjadi tanda radang gusi; tetap bersihkan dengan lembut dan periksakan.",
      "relatedDiseaseIds": ["DIS-002"],
      "sourceIds": ["SRC-009"],
      "status": "Draft"
    }
  ]
}
```

Catatan: rentang usia pada contoh `ERU-001` adalah contoh bentuk data; verifikasi dengan bagan erupsi resmi (misal ADA) sebelum tayang. Model 3D sekarang hanya memuat gigi permanen (ID 11–48), jadi garis waktu gigi susu butuh pemetaan ID gigi susu atau model kedua.

Aturan pemeliharaan:
- Satu file per jenis di `lib/data/` (`glossary.ts`, `keyStats.ts`, …), diekspor lewat `lib/knowledgeBase.ts`, dan didaftarkan di `contentRegistry.ts` supaya muncul di tata kelola.
- UI hanya menampilkan item dengan `value !== null`; item `Draft` boleh tampil dengan label "belum ditinjau" seperti tingkat keparahan sekarang.
- Field `plain` wajib ≤ 25 kata; jaga dengan tes unit, bukan dengan tinjauan manual.
- Muat konten panjang per mode: `const { glossary } = await import('@/lib/data/glossary')`.

### 3.4 Integrasi UI

- **Kamus:** komponen `<Term id="GLO-001">plak</Term>` yang merender `button` bergaris titik dan popover (pola popover dari `ViewPresetMenu` sudah ada). Ini sekaligus menghapus kebutuhan regex.
- **Angka kunci:** pakai ulang `KeyFigures` (satu angka besar serif + sumber), maksimal tiga, di kolom intro yang kosong.
- **Garis waktu:** pakai ulang `StageScrubber` (sudah mendukung keyboard) dengan label usia; gigi yang "sudah tumbuh" tampil, sisanya transparan lewat uniform visibilitas yang ada.
- **Mitos vs fakta dan "Kapan ke dokter gigi":** `Disclosure` dan kotak peringatan di dalam kartu; tidak ada permukaan baru.

---

## 4. 🚀 Action Plan & Prioritas

| # | Langkah | Dampak | Usaha |
|---|---|---|---|
| 1 | Commit Fase 13–15 yang masih di working tree ✅ selesai | Mengamankan ±3 fase kerja | 5 menit |
| 2 | Perbaiki "plak plak" (aturan regex) ✅ selesai | Menghapus teks salah yang tampil | 5 menit |
| 3 | `adjustFontFallback: false` di `app/layout.tsx` ✅ selesai | Build bersih dari pesan error font | 5 menit |
| 4 | Pindahkan `select-none` dari `<main>` ke kanvas ✅ selesai | Teks bisa diseleksi | 5 menit |
| 5 | Pisahkan `lib/data/dentition.ts` dari three ✅ selesai | First Load ±290 → ±190 kB | 1 jam |
| 6 | Sheet setengah terbuka di Kuis & Simulasi; Tips hanya di Anatomi ✅ selesai | Isi utama terlihat di mobile | 1 jam |
| 7 | Loader sampai scene siap + animasi "mendarat" ✅ selesai | Kesan pertama | 2 jam |
| 8 | Error boundary kanvas + `app/error.tsx` ✅ selesai | Tidak ada layar kosong | 1 jam |
| 9 | Selesaikan Fase 16 (Kuis 2 kolom, hapus `Q-001 · Draf`, dialog, audit bahasa) ✅ selesai | Menutup redesign | ½–1 hari |
| 10 | Ukur FPS di ponsel nyata (`<Stats />` mode dev) | Membuktikan target 60 FPS | 1 jam |
| 11 | ESLint + 3 file tes unit | Mencegah regresi | ½ hari |
| 12 | Salinan awam ke data (`plain`) + kamus istilah; hapus tiga lapisan `plain*` ✅ sebagian selesai (`Disease.plain` untuk 10 penyakit) | Mutu konten, bisa ditinjau | 1–2 hari |
| 13 | Konten baru: "Kapan ke dokter gigi", `visualChange`, mitos/fakta, angka kunci bersumber | Nilai edukasi | 2–3 hari |
| 14 | Rapikan folder (`primitives/`, `layout/`, `lib/actions/`), gabung file kecil | Pemeliharaan | 1 hari |
| 15 | Font lokal (`next/font/local`) | Build tanpa jaringan | 1 jam + unduh font |
| 16 | Tinjauan klinisi 44 item Draf + tingkat keparahan, skenario Stephan, fokus kuis | Kepercayaan konten | bergantung peninjau |
| 17 | Garis waktu tumbuh gigi (butuh data dan model gigi susu) | Fitur baru | 3–5 hari |

Langkah 1–4 bisa selesai dalam satu sesi singkat. Langkah 5–8 memberi dampak terbesar per jam kerja.

## Batas audit ini

- Angka chunk berasal dari build pada salinan terisolasi; kompilasi klien selesai tetapi langkah entri gagal karena junction `node_modules`. Daftar chunk awal halaman valid, namun konfirmasi ukuran akhir dengan `npm run build` biasa.
- FPS, perilaku sentuh nyata, dan ponsel mendatar tidak diuji.
- Durasi kanvas kosong diukur di mode dev, bukan produksi.
- Kebenaran klinis konten tidak dinilai; itu wewenang peninjau klinis.
