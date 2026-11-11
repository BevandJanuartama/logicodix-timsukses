import type { OralRegionId, SceneTargetId } from '@/lib/types'

export interface OralRegion {
  id: OralRegionId
  clinicalName: string
  summary: string
  functions: string[]
  care: string[]
}

export const oralRegions: Record<OralRegionId, OralRegion> = {
  interdental_papilla: {
    id: 'interdental_papilla',
    clinicalName: 'Area interdental — papila interdental',
    summary:
      'Gusi berbentuk segitiga yang mengisi ruang di antara dua gigi bertetangga. Area ini sulit dijangkau bulu sikat sehingga mudah menjadi tempat plak.',
    functions: ['Menutup celah agar makanan tidak mudah terselip', 'Titik kontak antargigi menjaga susunan gigi tetap rapat'],
    care: ['Bersihkan sela gigi dengan benang gigi atau sikat interdental 1× sehari'],
  },
  palate: {
    id: 'palate',
    clinicalName: 'Palatum durum & molle',
    summary:
      'Atap rongga mulut. Bagian depan keras karena didasari tulang, bagian belakang lunak dan berotot.',
    functions: [
      'Memisahkan rongga mulut dari rongga hidung',
      'Tempat lidah menekan makanan saat mengunyah dan menelan',
      'Membantu pembentukan bunyi saat berbicara',
    ],
    care: ['Hindari makanan atau minuman yang terlalu panas', 'Periksakan luka yang tidak sembuh lebih dari 2 minggu'],
  },
  mouth_floor: {
    id: 'mouth_floor',
    clinicalName: 'Regio sublingualis',
    summary: 'Area di bawah lidah tempat bermuaranya saluran kelenjar ludah submandibula dan sublingual.',
    functions: ['Mengalirkan air ludah yang membantu membilas sisa makanan', 'Menopang pergerakan lidah'],
    care: ['Cukupi minum air putih agar produksi ludah lancar'],
  },
  tongue_tip: {
    id: 'tongue_tip',
    clinicalName: 'Apex linguae',
    summary: 'Bagian lidah paling depan dan paling lincah, kaya ujung saraf peraba.',
    functions: ['Membentuk bunyi seperti t, d, l, dan n', 'Merasakan tekstur dan suhu makanan'],
    care: ['Periksakan tepi gigi atau tambalan yang terasa tajam'],
  },
  tongue_dorsum: {
    id: 'tongue_dorsum',
    clinicalName: 'Dorsum linguae',
    summary:
      'Permukaan atas lidah yang dipenuhi papila. Teksturnya yang kasar menjadi tempat menempelnya bakteri dan sisa makanan.',
    functions: ['Mengaduk makanan dan membantu menelan', 'Papila fungiformis berisi kuncup pengecap'],
    care: ['Bersihkan lidah dari belakang ke depan setiap hari'],
  },
  tongue_lateral: {
    id: 'tongue_lateral',
    clinicalName: 'Margo lateralis linguae',
    summary: 'Sisi kiri dan kanan lidah yang bersentuhan dengan gigi premolar dan geraham.',
    functions: ['Menjaga makanan tetap di atas permukaan kunyah', 'Memiliki papila foliata dengan kuncup pengecap'],
    care: ['Periksakan sariawan atau bercak yang tidak sembuh lebih dari 2 minggu'],
  },
  tongue_base: {
    id: 'tongue_base',
    clinicalName: 'Radix linguae',
    summary: 'Bagian belakang lidah yang mengarah ke tenggorokan, ditandai deretan papila sirkumvalata berbentuk huruf V.',
    functions: ['Mendorong makanan ke kerongkongan saat menelan', 'Berisi tonsil lingual sebagai bagian sistem imun'],
    care: ['Saat membersihkan lidah, mulai dari bagian belakang secara perlahan'],
  },
}

export const isOralRegion = (targetId: SceneTargetId): targetId is OralRegionId => targetId in oralRegions
