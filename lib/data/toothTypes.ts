import type { ToothType } from '@/lib/types'

export const toothTypes: ToothType[] = [
  {
    id: "TT-001",
    name: "Incisor / Gigi seri",
    region: "Anterior",
    function: "Memotong makanan",
    primaryCount: 8,
    permanentCount: 8,
    notes: "Gigi susu dan permanen memiliki gigi seri; jumlah per jenis dentisi."
  },
  {
    id: "TT-002",
    name: "Canine / Gigi taring",
    region: "Anterior",
    function: "Membantu merobek makanan",
    primaryCount: 4,
    permanentCount: 4,
    notes: "Jumlah pada dentisi susu dan permanen."
  },
  {
    id: "TT-003",
    name: "Premolar / Geraham kecil",
    region: "Posterior",
    function: "Menghancurkan dan menggiling makanan",
    primaryCount: 0,
    permanentCount: 8,
    notes: "Tidak terdapat pada dentisi susu."
  },
  {
    id: "TT-004",
    name: "Molar / Geraham besar",
    region: "Posterior",
    function: "Menggiling makanan",
    primaryCount: 8,
    permanentCount: 12,
    notes: "Gigi permanen 12 bila termasuk molar ketiga/gigi bungsu."
  }
]
