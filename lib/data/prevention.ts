import type { PreventionTopic } from '@/lib/types'

export const preventionTopics: PreventionTopic[] = [
  {
    id: "PRE-001",
    topic: "Menyikat gigi",
    message: "Menyikat gigi dua kali sehari dengan pasta gigi berfluoride sesuai anjuran usia.",
    audience: "Semua pengguna; panduan anak perlu sesuai usia",
    sourceLabel: "WHO; ADA",
    implementationNote: "Tampilkan teknik umum dan catatan konsultasi dokter gigi.",
    status: "Draft"
  },
  {
    id: "PRE-002",
    topic: "Membersihkan sela gigi",
    message: "Membersihkan sela gigi secara teratur dengan alat yang sesuai, seperti floss atau interdental brush.",
    audience: "Remaja dan dewasa; alat sesuai kondisi",
    sourceLabel: "ADA",
    implementationNote: "Hindari klaim satu alat cocok untuk semua.",
    status: "Draft"
  },
  {
    id: "PRE-003",
    topic: "Mengurangi gula bebas",
    message: "Batasi jumlah dan frekuensi konsumsi makanan/minuman tinggi gula bebas.",
    audience: "Semua pengguna",
    sourceLabel: "WHO",
    implementationNote: "WHO: kurang dari 10% energi harian, idealnya di bawah 5%.",
    status: "Draft"
  },
  {
    id: "PRE-004",
    topic: "Pemeriksaan gigi",
    message: "Lakukan pemeriksaan berdasarkan kebutuhan dan rekomendasi tenaga kesehatan gigi.",
    audience: "Semua pengguna",
    sourceLabel: "Kemenkes; ADA",
    implementationNote: "Interval pemeriksaan disesuaikan risiko dan kondisi individu.",
    status: "Draft"
  },
  {
    id: "PRE-005",
    topic: "Menghindari tembakau",
    message: "Hindari penggunaan tembakau karena berkaitan dengan risiko penyakit periodontal dan masalah kesehatan mulut.",
    audience: "Semua pengguna",
    sourceLabel: "CDC; WHO",
    implementationNote: "Materi edukasi non-judgmental.",
    status: "Draft"
  }
]
