import type { ClinicalTrackId } from '@/lib/simulatorStore'

export interface PlainStageCopy {
  shortLabel: string
  title: string
  whatHappens: string
  howToStop: string
}

export const CLINICAL_TIMELINES: Record<ClinicalTrackId, [string, string]> = {
  'DIS-001': ['Hari ini', '± 6–12 bulan'],
  'DIS-003': ['Hari ini', '± 1–2 tahun'],
}

export const CLINICAL_SUBTITLES: Record<ClinicalTrackId, string> = {
  'DIS-001': 'Hari ini → 6–12 bulan',
  'DIS-003': 'Hari ini → 1–2 tahun',
}

const PLAIN_STAGES: Record<string, PlainStageCopy> = {
  'ST-CAR-0': {
    shortLabel: 'Sehat',
    title: 'Email gigi masih utuh',
    whatHappens: 'Permukaan luar gigi keras, halus, dan terlindungi air liur. Belum ada mineral yang larut.',
    howToStop: 'Sikat gigi 2× sehari dengan pasta berfluoride dan batasi ngemil manis di sela jam makan.',
  },
  'ST-CAR-1': {
    shortLabel: 'Bercak putih',
    title: 'Muncul bercak putih kapur',
    whatHappens: 'Asam dari plak mulai melarutkan mineral di permukaan email, tetapi belum terbentuk lubang.',
    howToStop: 'Masih bisa pulih tanpa tambalan: rutin sikat berfluoride dan kurangi frekuensi minuman manis.',
  },
  'ST-CAR-2': {
    shortLabel: 'Lapisan tengah',
    title: 'Lubang menembus lapisan tengah',
    whatHappens: 'Permukaan email runtuh dan kerusakan masuk ke dentin yang lebih lunak. Gigi mulai ngilu saat dingin atau manis.',
    howToStop: 'Perlu ditambal oleh dokter gigi agar lubang tidak makin dalam mendekati ruang saraf.',
  },
  'ST-CAR-3': {
    shortLabel: 'Dekat saraf',
    title: 'Lubang dalam mendekati saraf',
    whatHappens: 'Kerusakan sudah sangat dekat dengan pulpa yang berisi saraf dan pembuluh darah. Nyeri bisa berdenyut spontan.',
    howToStop: 'Segera ke dokter gigi untuk perawatan saluran akar atau perlindungan saraf.',
  },
  'ST-PER-0': {
    shortLabel: 'Gusi sehat',
    title: 'Gusi kencang dan tulang utuh',
    whatHappens: 'Gusi memeluk leher gigi dengan rapat, tidak berdarah saat disikat, dan tulang rahang menopang akar penuh.',
    howToStop: 'Bersihkan tepi gusi dengan lembut saat menyikat dan gunakan benang gigi setiap hari.',
  },
  'ST-PER-1': {
    shortLabel: 'Gusi meradang',
    title: 'Gusi bengkak dan mudah berdarah',
    whatHappens: 'Plak yang menumpuk di tepi gusi memicu radang. Gusi tampak kemerahan dan mudah berdarah saat menyikat.',
    howToStop: 'Masih bisa kembali sehat: bersihkan plak di garis gusi dan lakukan pembersihan karang gigi.',
  },
  'ST-PER-2': {
    shortLabel: 'Tulang menyusut',
    title: 'Kantong gusi dalam dan tulang menyusut',
    whatHappens: 'Infeksi merusak jaringan pengikat dan tulang penyangga akar. Gusi turun dan gigi bisa terasa goyang.',
    howToStop: 'Perlu perawatan gusi mendalam oleh dokter gigi agar sisa tulang penyangga tetap terjaga.',
  },
}

export function getPlainStage(stageId: string): PlainStageCopy | undefined {
  return PLAIN_STAGES[stageId]
}

