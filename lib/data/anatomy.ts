import type { AnatomyStructure } from '@/lib/types'

export const anatomyStructures: AnatomyStructure[] = [
  {
    id: "AN-001",
    name: "Enamel",
    tissueType: "Jaringan keras",
    description: "Lapisan terluar mahkota gigi; sangat kaya mineral dan melindungi jaringan di bawahnya.",
    location: "Mahkota gigi",
    relatedConditions: [
      "Karies awal",
      "erosi",
      "abrasi/keausan"
    ],
    objectId: "enamel",
    sourceLabel: "NCBI Histology, Tooth; ADA",
    clinicalNote: "Jangan menyebut enamel dapat tumbuh kembali; lesi awal tertentu dapat mengalami remineralisasi.",
    status: "Draft"
  },
  {
    id: "AN-002",
    name: "Dentin",
    tissueType: "Jaringan keras",
    description: "Membentuk sebagian besar gigi; berada di bawah email pada mahkota dan di bawah sementum pada akar.",
    location: "Mahkota dan akar",
    relatedConditions: [
      "Karies",
      "sensitivitas dentin",
      "keausan"
    ],
    objectId: "dentin",
    sourceLabel: "NCBI Histology, Tooth",
    clinicalNote: "Memiliki tubulus dentin; sensitivitas dipengaruhi kondisi dan paparan dentin.",
    status: "Draft"
  },
  {
    id: "AN-003",
    name: "Pulp",
    tissueType: "Jaringan lunak",
    description: "Jaringan ikat di bagian dalam gigi yang mengandung pembuluh darah dan saraf.",
    location: "Ruang pulpa dan saluran akar",
    relatedConditions: [
      "Pulpitis",
      "nekrosis pulpa"
    ],
    objectId: "pulp",
    sourceLabel: "NCBI Histology, Tooth",
    clinicalNote: "Jangan menyamakan pulp chamber dengan seluruh jaringan pulpa.",
    status: "Draft"
  },
  {
    id: "AN-004",
    name: "Cementum",
    tissueType: "Jaringan keras",
    description: "Menutupi permukaan akar dan menjadi tempat menempelnya serat pengikat gigi.",
    location: "Permukaan akar",
    relatedConditions: [
      "Karies akar",
      "resorpsi/kelainan akar tertentu"
    ],
    objectId: "cementum",
    sourceLabel: "NCBI Histology, Periodontium",
    clinicalNote: "Bedakan cementum dari enamel.",
    status: "Draft"
  },
  {
    id: "AN-005",
    name: "Gingiva",
    tissueType: "Jaringan lunak",
    description: "Jaringan gusi yang mengelilingi gigi dan menutupi sebagian tulang penyangga gigi.",
    location: "Sekitar leher gigi",
    relatedConditions: [
      "Gingivitis",
      "resesi gingiva"
    ],
    objectId: "gingiva",
    sourceLabel: "NCBI Histology, Periodontium; CDC",
    clinicalNote: "Gingivitis tidak selalu berkembang menjadi periodontitis.",
    status: "Draft"
  },
  {
    id: "AN-006",
    name: "Periodontal Ligament",
    tissueType: "Jaringan ikat",
    description: "Menghubungkan sementum akar dengan tulang penyangga gigi; membantu menopang gigi dan meredam beban kunyah.",
    location: "Antara akar dan tulang di sekitarnya",
    relatedConditions: [
      "Periodontitis",
      "trauma oklusi"
    ],
    objectId: "pd_ligament",
    sourceLabel: "NCBI Histology, Periodontium",
    clinicalNote: "Istilah disingkat PDL.",
    status: "Draft"
  },
  {
    id: "AN-007",
    name: "Alveolar Bone",
    tissueType: "Tulang",
    description: "Bagian tulang rahang yang membentuk lubang tempat akar gigi tertanam dan menopangnya.",
    location: "Rahang di sekitar akar",
    relatedConditions: [
      "Kehilangan tulang pada periodontitis"
    ],
    objectId: "alveolar_bone",
    sourceLabel: "NCBI Histology, Periodontium; CDC",
    clinicalNote: "Perubahan tulang harus digambarkan secara edukatif, bukan diagnosis.",
    status: "Draft"
  },
  {
    id: "AN-008",
    name: "Pulp Chamber",
    tissueType: "Ruang di dalam gigi",
    description: "Ruang di bagian mahkota yang berisi jaringan pulpa.",
    location: "Bagian dalam mahkota",
    relatedConditions: [
      "Karies dalam dan perawatan endodontik"
    ],
    objectId: "pulp_chamber",
    sourceLabel: "NCBI Anatomy of Teeth",
    clinicalNote: "Ini ruang, bukan jenis jaringan.",
    status: "Draft"
  },
  {
    id: "AN-009",
    name: "Root Canal",
    tissueType: "Ruang di dalam gigi",
    description: "Saluran di dalam akar yang berisi jaringan pulpa dan berlanjut menuju lubang di ujung akar.",
    location: "Akar gigi",
    relatedConditions: [
      "Pulpitis/nekrosis dan perawatan saluran akar"
    ],
    objectId: "root_canal",
    sourceLabel: "NCBI Anatomy of Teeth",
    clinicalNote: "Jumlah dan bentuk saluran bervariasi menurut jenis gigi.",
    status: "Draft"
  },
  {
    id: "AN-010",
    name: "Cementoenamel Junction (CEJ)",
    tissueType: "Garis batas",
    description: "Batas pertemuan email mahkota dengan sementum akar.",
    location: "Leher gigi",
    relatedConditions: [
      "Resesi",
      "lesi servikal"
    ],
    objectId: "cej",
    sourceLabel: "NCBI Anatomy of Teeth",
    clinicalNote: "Batas anatomi; bukan jaringan tersendiri.",
    status: "Draft"
  }
]
