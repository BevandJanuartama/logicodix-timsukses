import type { Disease } from '@/lib/types'
import { dentalConditions } from './dentalConditions'

export const diseases: Disease[] = [
  {
    id: "DIS-001",
    name: "Dental caries",
    displayName: "Karies",
    category: "Penyakit jaringan keras",
    group: "penyakit",
    definition: "Proses dinamis multifaktorial yang menyebabkan kehilangan mineral jaringan keras gigi.",
    riskFactors: "Biofilm/plak, paparan gula bebas yang sering, faktor saliva, fluoride, perilaku dan faktor sosial.",
    symptoms: "Lesi putih/berubah warna, kavitas; nyeri dapat muncul bila lebih dalam.",
    affectedStructures: "Enamel; dentin; dapat mencapai pulpa; lesi akar dapat melibatkan cementum/dentin akar.",
    prevention: "Pengendalian biofilm, fluoride sesuai panduan, mengurangi frekuensi gula bebas, pemeriksaan dan perawatan profesional.",
    plain: {
      summary: "Proses yang terus berubah dan dipengaruhi banyak hal, membuat bagian keras gigi kehilangan mineral.",
      signs: ["Bercak putih atau warna gigi berubah", "Gigi berlubang", "Nyeri bisa muncul bila kerusakan lebih dalam"],
      prevention: [
        "Kendalikan plak di gigi",
        "Pakai fluoride sesuai anjuran",
        "Kurangi seringnya mengonsumsi gula",
        "Periksa dan rawat gigi di dokter gigi",
      ],
    },
    sourceIds: [
      "SRC-006",
      "SRC-001",
      "SRC-002",
      "SRC-008"
    ],
    safetyNote: "Konten umum; gejala tidak cukup untuk diagnosis.",
    status: "Draft"
  },
  {
    id: "DIS-002",
    name: "Gingivitis",
    displayName: "Radang gusi",
    category: "Periodontal",
    group: "penyakit",
    definition: "Peradangan gingiva, sering berkaitan dengan akumulasi biofilm plak.",
    riskFactors: "Plak, kebersihan mulut, faktor sistemik dan lokal.",
    symptoms: "Gusi kemerahan, bengkak, mudah berdarah; dapat tanpa nyeri.",
    affectedStructures: "Gingiva.",
    prevention: "Kebersihan mulut efektif, pembersihan profesional bila diperlukan, kontrol faktor risiko.",
    plain: {
      summary: "Radang pada gusi, sering berkaitan dengan plak yang menumpuk.",
      signs: ["Gusi kemerahan", "Gusi bengkak", "Gusi mudah berdarah", "Bisa tanpa rasa nyeri"],
      prevention: [
        "Jaga kebersihan mulut dengan cara yang benar",
        "Pembersihan oleh dokter gigi bila perlu",
        "Kendalikan hal yang memperbesar risiko",
      ],
    },
    sourceIds: [
      "SRC-009",
      "SRC-005"
    ],
    safetyNote: "Gingivitis dapat pulih dan tidak selalu berkembang menjadi periodontitis.",
    status: "Draft"
  },
  {
    id: "DIS-003",
    name: "Periodontitis",
    displayName: "Penyakit periodontal",
    category: "Periodontal",
    group: "penyakit",
    definition: "Penyakit inflamasi yang merusak jaringan pendukung gigi dan dapat menyebabkan kehilangan perlekatan serta tulang.",
    riskFactors: "Biofilm disbiotik dan respons pejamu; merokok dan diabetes merupakan faktor risiko penting.",
    symptoms: "Perdarahan gusi, resesi, poket periodontal, mobilitas gigi; dapat berkembang tanpa nyeri jelas.",
    affectedStructures: "Gingiva, periodontal ligament, cementum/permukaan akar, alveolar bone.",
    prevention: "Pemeriksaan dan perawatan periodontal profesional; kontrol plak dan faktor risiko.",
    plain: {
      summary: "Radang yang merusak jaringan penyangga gigi. Ikatan gigi dan tulang penyangganya dapat berkurang.",
      signs: [
        "Gusi berdarah",
        "Gusi turun",
        "Muncul celah dalam antara gusi dan gigi",
        "Gigi goyang",
        "Bisa memburuk tanpa nyeri yang jelas",
      ],
      prevention: [
        "Periksa dan rawat gusi di dokter gigi",
        "Kendalikan plak",
        "Kendalikan hal yang memperbesar risiko",
      ],
    },
    sourceIds: [
      "SRC-007",
      "SRC-009",
      "SRC-005"
    ],
    safetyNote: "Staging/grading klinis memerlukan pemeriksaan profesional; jangan menyederhanakan menjadi urutan pasti dari gingivitis.",
    status: "Draft"
  },
  {
    id: "DIS-004",
    name: "Pulpitis",
    displayName: "Peradangan pulpa",
    category: "Pulpal",
    group: "penyakit",
    definition: "Peradangan jaringan pulpa yang dapat berkaitan dengan karies dalam, trauma atau prosedur restoratif.",
    riskFactors: "Karies dalam, trauma, restorasi/prosedur tertentu.",
    symptoms: "Nyeri spontan atau dipicu rangsangan; pola gejala bervariasi.",
    affectedStructures: "Pulp.",
    prevention: "Evaluasi dokter gigi; perawatan bergantung diagnosis pulpa dan kondisi gigi.",
    plain: {
      summary: "Radang pada pulpa, bagian paling dalam gigi. Bisa berkaitan dengan lubang yang dalam, benturan, atau tindakan perbaikan gigi.",
      signs: ["Nyeri yang datang sendiri", "Nyeri yang dipicu rangsangan", "Gejalanya berbeda-beda"],
      prevention: [
        "Periksakan ke dokter gigi",
        "Perawatannya bergantung pada hasil pemeriksaan dan kondisi gigi",
      ],
    },
    sourceIds: [
      "SRC-003",
      "SRC-004",
      "NCBI Bookshelf"
    ],
    safetyNote: "Tidak mengklasifikasikan reversible/irreversible hanya dari gejala pada website umum.",
    status: "Draft"
  },
  {
    id: "DIS-005",
    name: "Enamel erosion",
    displayName: "Erosi enamel",
    category: "Jaringan keras",
    group: "penyakit",
    definition: "Kehilangan jaringan keras akibat proses kimia non-bakterial, sering terkait paparan asam.",
    riskFactors: "Minuman/makanan asam, refluks atau muntah berulang, faktor perilaku dan medis.",
    symptoms: "Permukaan tampak berubah, gigi sensitif, perubahan bentuk pada kondisi lanjut.",
    affectedStructures: "Enamel; dapat berlanjut ke dentin.",
    prevention: "Mengurangi paparan asam, evaluasi penyebab, konsultasi dokter gigi.",
    plain: {
      summary: "Bagian keras gigi terkikis oleh proses kimia, bukan oleh bakteri. Sering terkait paparan asam.",
      signs: ["Permukaan gigi tampak berubah", "Gigi ngilu", "Bentuk gigi berubah bila sudah lanjut"],
      prevention: ["Kurangi paparan asam", "Cari tahu penyebabnya", "Konsultasi ke dokter gigi"],
    },
    sourceIds: [
      "SRC-011",
      "NCBI Bookshelf"
    ],
    safetyNote: "Bedakan erosi dari karies yang melibatkan biofilm dan metabolisme gula.",
    status: "Draft"
  },
  {
    id: "DIS-006",
    name: "Dental calculus",
    displayName: "Karang gigi",
    category: "Deposit",
    group: "penyakit",
    definition: "Plak yang mengalami mineralisasi dan mengeras pada permukaan gigi.",
    riskFactors: "Akumulasi plak dan mineralisasi saliva/cairan gingiva.",
    symptoms: "Deposit keras; dapat disertai peradangan gusi.",
    affectedStructures: "Permukaan gigi, sering dekat garis gingiva.",
    prevention: "Pembersihan profesional; kontrol plak harian.",
    plain: {
      summary: "Plak yang mengeras di permukaan gigi.",
      signs: ["Endapan keras di gigi", "Bisa disertai radang gusi"],
      prevention: ["Pembersihan oleh dokter gigi", "Bersihkan plak setiap hari"],
    },
    sourceIds: [
      "SRC-009",
      "SRC-011"
    ],
    safetyNote: "Kalkulus tidak dapat dihilangkan hanya dengan menyikat gigi setelah mengeras.",
    status: "Draft"
  },
  {
    id: "DIS-007",
    name: "Tooth fracture",
    displayName: "Fraktur gigi",
    category: "Struktural",
    group: "kebiasaan",
    definition: "Retak atau patahnya bagian gigi dengan tingkat keparahan bervariasi.",
    riskFactors: "Trauma, menggigit benda keras, restorasi besar, faktor struktural.",
    symptoms: "Nyeri saat menggigit, tepi tajam, sensitivitas; dapat tanpa gejala.",
    affectedStructures: "Enamel, dentin, dan kadang pulpa.",
    prevention: "Evaluasi dokter gigi; penanganan tergantung lokasi dan luas fraktur.",
    plain: {
      summary: "Bagian gigi retak atau patah. Tingkat parahnya bisa berbeda-beda.",
      signs: ["Nyeri saat menggigit", "Tepi gigi terasa tajam", "Gigi ngilu", "Bisa juga tanpa gejala"],
      prevention: ["Periksakan ke dokter gigi", "Penanganannya bergantung pada letak dan luas retakan"],
    },
    sourceIds: [
      "NCBI Bookshelf",
      "ADA"
    ],
    safetyNote: "Visualisasi perlu membedakan retak email, fraktur mahkota dan akar.",
    status: "Draft"
  },
  {
    id: "DIS-008",
    name: "Dental abscess",
    displayName: "Abses dental",
    category: "Infeksi",
    group: "penyakit",
    definition: "Kumpulan nanah akibat infeksi pada jaringan sekitar gigi atau periodontal.",
    riskFactors: "Infeksi pulpa/periapikal atau periodontal.",
    symptoms: "Nyeri, bengkak, rasa tidak enak; dapat disertai demam atau kondisi sistemik.",
    affectedStructures: "Periapikal atau periodontal, tergantung jenis.",
    prevention: "Perlu evaluasi dokter gigi segera; tanda sistemik atau gangguan menelan/napas memerlukan layanan darurat.",
    plain: {
      summary: "Kumpulan nanah karena infeksi di jaringan sekitar gigi atau jaringan penyangganya.",
      signs: ["Nyeri", "Bengkak", "Rasa tidak enak", "Bisa disertai demam atau keluhan di seluruh tubuh"],
      prevention: [
        "Segera periksakan ke dokter gigi",
        "Keluhan di seluruh tubuh, sulit menelan, atau sulit bernapas: segera ke layanan darurat",
      ],
    },
    sourceIds: [
      "NCBI Bookshelf",
      "ADA"
    ],
    safetyNote: "Jangan memberi diagnosis atau instruksi pengobatan mandiri.",
    status: "Draft"
  },
  {
    id: "DIS-009",
    name: "Bruxism",
    displayName: "Bruksisme",
    category: "Kebiasaan/fungsi",
    group: "kebiasaan",
    definition: "Aktivitas otot rahang berupa mengatupkan atau menggemeretakkan gigi saat tidur atau terjaga.",
    riskFactors: "Faktor multifaktorial; stres, tidur, obat dan kondisi lain dapat berperan.",
    symptoms: "Keausan gigi, ketegangan rahang atau nyeri pada sebagian orang.",
    affectedStructures: "Gigi, otot pengunyahan dan sendi terkait.",
    prevention: "Evaluasi profesional bila ada nyeri, kerusakan atau gangguan tidur.",
    plain: {
      summary: "Gerakan otot rahang yang mengatupkan atau menggemeretakkan gigi, saat tidur maupun terjaga.",
      signs: ["Gigi aus", "Rahang terasa tegang", "Nyeri, pada sebagian orang"],
      prevention: ["Periksakan ke tenaga kesehatan bila ada nyeri, gigi rusak, atau tidur terganggu"],
    },
    sourceIds: [
      "ADA",
      "sumber klinis terkait"
    ],
    safetyNote: "Bukan penyakit infeksi; klasifikasikan sebagai kondisi/kebiasaan.",
    status: "Draft"
  },
  {
    id: "DIS-010",
    name: "Malocclusion",
    displayName: "Maloklusi",
    category: "Perkembangan/oklusi",
    group: "gigitan",
    definition: "Hubungan susunan atau kontak gigi dan rahang yang tidak ideal.",
    riskFactors: "Faktor pertumbuhan, genetik, kebiasaan dan kehilangan gigi.",
    symptoms: "Susunan/gigitan tidak sejajar; dampak bervariasi.",
    affectedStructures: "Gigi dan hubungan rahang.",
    prevention: "Penilaian dokter gigi/ortodontis sesuai kebutuhan.",
    plain: {
      summary: "Susunan gigi, atau cara gigi dan rahang bertemu, yang tidak ideal.",
      signs: ["Susunan gigi atau gigitan tidak sejajar", "Dampaknya berbeda pada tiap orang"],
      prevention: ["Periksakan ke dokter gigi atau ortodontis bila perlu"],
    },
    sourceIds: [
      "NCBI Bookshelf",
      "sumber ortodonti"
    ],
    safetyNote: "Tidak semua maloklusi memerlukan perawatan.",
    status: "Draft"
  },
  ...dentalConditions,
]
