import type { CameraPreset } from '@/lib/types'
import type { HabitId } from '@/lib/simulatorStore'

export interface HabitStage {
  startsAt: number
  title: string
  description: string
}

export interface HabitScenario {
  id: HabitId
  title: string
  timeline: [string, string]
  stages: HabitStage[]
  impacts: string[]
  prevention: string[]
  inspectToothId?: string
}

export const habitCamera: Record<HabitId, { preset: CameraPreset; distance: number }> = {
  ice: { preset: 'front', distance: 5.6 },
  bruxism: { preset: 'right', distance: 6.4 },
  boba: { preset: 'top', distance: 7 },
  neglect: { preset: 'front', distance: 6.4 },
}

export const habitScenarios: HabitScenario[] = [
  {
    id: 'ice',
    title: 'Makan Es Batu & Makanan Keras',
    timeline: ['Hari ini', '± 3 tahun'],
    stages: [
      {
        startsAt: 0,
        title: 'Gigi sehat',
        description: 'Email utuh dan halus. Email memang sangat keras, tetapi juga getas — tidak lentur saat menerima beban mendadak.',
      },
      {
        startsAt: 0.2,
        title: 'Stres termal & mekanis',
        description: 'Es membuat email mendingin dan menyusut, lalu memuai lagi saat hangat. Ditambah tekanan gigitan pada benda sangat keras, timbul tegangan di dalam email.',
      },
      {
        startsAt: 0.4,
        title: 'Retak rambut (craze lines)',
        description: 'Muncul garis retak halus vertikal di email. Umumnya belum terasa sakit, tetapi menjadi titik lemah.',
      },
      {
        startsAt: 0.65,
        title: 'Retakan menjalar & gigi gompal',
        description: 'Retakan memanjang dan tepi gigi seri bisa patah (gompal), terutama bila email sudah menipis atau ada tambalan.',
      },
      {
        startsAt: 0.85,
        title: 'Cracked tooth',
        description: 'Retak dapat mencapai dentin: ngilu saat menggigit atau minum dingin. Retak dalam bisa berujung perawatan saluran akar atau pencabutan.',
      },
    ],
    impacts: ['Retak rambut pada email', 'Gigi gompal / patah', 'Tambalan retak atau lepas', 'Ngilu saat menggigit'],
    prevention: [
      'Biarkan es mencair di mulut, atau minum tanpa es batu',
      'Hindari menggigit benda keras (es, tulang, pulpen, tutup botol)',
      'Gunakan pelindung mulut saat olahraga kontak',
    ],
  },
  {
    id: 'bruxism',
    title: 'Bruxism (Menggertakkan Gigi)',
    timeline: ['Bulan 1', '± 10 tahun'],
    stages: [
      {
        startsAt: 0,
        title: 'Permukaan kunyah utuh',
        description: 'Tonjol (cusp) gigi geraham masih tinggi dan tajam sehingga efektif menggiling makanan.',
      },
      {
        startsAt: 0.2,
        title: 'Gesekan berulang',
        description: 'Saat tidur atau stres, rahang menggertak dan menggesek gigi tanpa makanan di antaranya — sering tanpa disadari.',
      },
      {
        startsAt: 0.45,
        title: 'Atrisi (aus)',
        description: 'Ujung tonjol mulai mendatar dan tampak mengilap. Ujung taring ikut tumpul.',
      },
      {
        startsAt: 0.7,
        title: 'Dentin terbuka',
        description: 'Email terkikis habis di beberapa titik sehingga dentin kuning terlihat. Gigi mulai ngilu.',
      },
      {
        startsAt: 0.88,
        title: 'Gigi memendek',
        description: 'Gigi tampak lebih pendek, bisa disertai nyeri sendi rahang, sakit kepala di pagi hari, dan otot rahang tegang.',
      },
    ],
    impacts: [
      'Permukaan kunyah datar & aus',
      'Dentin terbuka → ngilu',
      'Nyeri sendi rahang (TMJ) & sakit kepala',
      'Risiko gigi retak dan tambalan patah',
    ],
    prevention: [
      'Konsultasi ke dokter gigi untuk night guard (pelindung gigi malam)',
      'Kelola stres dan perbaiki kualitas tidur',
      'Kurangi kafein & alkohol menjelang tidur',
      'Posisi rahang istirahat: bibir rapat, gigi atas-bawah tidak bersentuhan',
    ],
  },
  {
    id: 'boba',
    title: 'Minuman Manis & Boba',
    timeline: ['Minggu 1', '± 2 tahun'],
    inspectToothId: '36',
    stages: [
      {
        startsAt: 0,
        title: 'Gula masuk',
        description: 'Bakteri plak (misalnya Streptococcus mutans) memfermentasi gula dari minuman manis dan menghasilkan asam.',
      },
      {
        startsAt: 0.15,
        title: 'Demineralisasi — bercak putih',
        description: 'pH plak turun di bawah ±5,5 dan mineral email mulai larut. Muncul bercak putih kapur — tahap ini masih bisa pulih dengan fluoride.',
      },
      {
        startsAt: 0.38,
        title: 'Karies email',
        description: 'Serangan asam berulang meruntuhkan permukaan menjadi lubang kecoklatan, sering berawal di fisura geraham dan sela gigi.',
      },
      {
        startsAt: 0.6,
        title: 'Karies dentin',
        description: 'Lubang menembus dentin yang lebih lunak sehingga menyebar lebih cepat. Mulai ngilu saat makan manis atau dingin.',
      },
      {
        startsAt: 0.82,
        title: 'Pulpitis',
        description: 'Bakteri mendekati pulpa: peradangan menimbulkan nyeri berdenyut. Tanpa perawatan, pulpa dapat mati dan terbentuk abses.',
      },
    ],
    impacts: [
      'Bercak putih → lubang coklat-hitam',
      'Ngilu dan nyeri berdenyut',
      'Infeksi pulpa & abses',
      'Perlu tambal, perawatan saluran akar, atau cabut',
    ],
    prevention: [
      'Frekuensi lebih berbahaya daripada jumlah: hindari menyeruput minuman manis sedikit-sedikit sepanjang hari',
      'Pilih gula lebih sedikit dan kumur air putih setelahnya',
      'Sikat gigi dengan pasta berfluoride 2× sehari',
      'Periksa gigi tiap 6 bulan; tanyakan sealant fisura',
    ],
  },
  {
    id: 'neglect',
    title: 'Malas Sikat Gigi & Merokok',
    timeline: ['Hari 1', '± 5 tahun'],
    stages: [
      {
        startsAt: 0,
        title: 'Plak menumpuk',
        description: 'Tanpa disikat, lapisan bakteri yang lengket (plak) menumpuk di garis gusi dan sela gigi.',
      },
      {
        startsAt: 0.2,
        title: 'Karang gigi (kalkulus)',
        description: 'Dalam hitungan hari, plak yang tidak dibersihkan mulai mengeras oleh mineral ludah. Karang gigi tidak bisa hilang dengan sikat gigi — harus di-scaling.',
      },
      {
        startsAt: 0.4,
        title: 'Noda & gingivitis',
        description: 'Tar dan nikotin menodai gigi menjadi kuning-coklat. Gusi merah, bengkak, mudah berdarah — meski pada perokok perdarahan bisa tersamarkan.',
      },
      {
        startsAt: 0.65,
        title: 'Periodontitis',
        description: 'Peradangan merusak perlekatan gusi dan tulang. Gusi turun (resesi) sehingga akar mulai terlihat.',
      },
      {
        startsAt: 0.85,
        title: 'Gigi goyang',
        description: 'Tulang penyangga terus berkurang sehingga gigi bisa goyang bahkan tanggal. Merokok juga memperlambat penyembuhan.',
      },
    ],
    impacts: [
      'Karang gigi & bau mulut',
      'Noda kuning-coklat',
      'Gusi meradang, turun, akar terbuka',
      'Kehilangan tulang & gigi goyang',
    ],
    prevention: [
      'Sikat gigi 2× sehari selama 2 menit + benang gigi',
      'Scaling di dokter gigi tiap 6 bulan',
      'Berhenti merokok — gusi mulai membaik dalam beberapa minggu',
      'Kenali tanda awal: gusi berdarah saat sikat gigi',
    ],
  },
]

export const findHabitScenario = (id: HabitId) => habitScenarios.find((scenario) => scenario.id === id)

export function habitStageIndex(scenario: HabitScenario, progress: number) {
  return scenario.stages.reduce((current, stage, index) => (progress >= stage.startsAt ? index : current), 0)
}
