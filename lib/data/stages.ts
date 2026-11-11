import type { DiseaseStage } from '@/lib/types'

export const diseaseStages: DiseaseStage[] = [
  {
    id: "ST-CAR-0",
    diseaseId: "DIS-001",
    stageNumber: 0,
    title: "Healthy",
    description: "Tidak ada lesi karies yang divisualisasikan.",
    visualChange: "Tidak ada area karies yang ditandai.",
    modelPath: "healthy_tooth.glb",
    limitation: "Model edukatif; bukan pemeriksaan.",
    status: "Draft"
  },
  {
    id: "ST-CAR-1",
    diseaseId: "DIS-001",
    stageNumber: 1,
    title: "Initial enamel change",
    description: "Perubahan awal mineral pada enamel; dapat tampak sebagai white spot lesion pada kondisi tertentu.",
    visualChange: "Area enamel diberi penanda perubahan mineral.",
    modelPath: "caries_initial.glb",
    limitation: "Gunakan konsep deteksi lesi seperti ICDAS; hindari klaim diagnosis.",
    status: "Draft"
  },
  {
    id: "ST-CAR-2",
    diseaseId: "DIS-001",
    stageNumber: 2,
    title: "Dentin involvement",
    description: "Lesi melibatkan dentin.",
    visualChange: "Area enamel dan dentin ditampilkan terdampak.",
    modelPath: "caries_dentin.glb",
    limitation: "Kedalaman lesi tidak selalu menunjukkan gejala.",
    status: "Draft"
  },
  {
    id: "ST-CAR-3",
    diseaseId: "DIS-001",
    stageNumber: 3,
    title: "Deep lesion / possible pulp proximity",
    description: "Lesi dalam dapat mendekati atau melibatkan pulpa.",
    visualChange: "Model menunjukkan lesi dalam; pulpa diberi konteks anatomi.",
    modelPath: "caries_deep.glb",
    limitation: "Tidak semua kasus mengikuti lintasan yang sama.",
    status: "Draft"
  },
  {
    id: "ST-PER-0",
    diseaseId: "DIS-003",
    stageNumber: 0,
    title: "Healthy periodontium",
    description: "Jaringan periodontal sehat sebagai pembanding.",
    visualChange: "Gingiva dan tulang alveolar ditampilkan normal.",
    modelPath: "periodontium_healthy.glb",
    limitation: "Pembanding edukatif.",
    status: "Draft"
  },
  {
    id: "ST-PER-1",
    diseaseId: "DIS-003",
    stageNumber: 1,
    title: "Periodontal inflammation",
    description: "Peradangan gingiva dapat muncul; gingivitis tidak identik dengan periodontitis.",
    visualChange: "Gingiva ditampilkan meradang tanpa mengklaim kehilangan tulang.",
    modelPath: "gingivitis.glb",
    limitation: "Jangan gambarkan sebagai tahap periodontitis yang pasti.",
    status: "Draft"
  },
  {
    id: "ST-PER-2",
    diseaseId: "DIS-003",
    stageNumber: 2,
    title: "Periodontal attachment/bone loss",
    description: "Periodontitis melibatkan kehilangan perlekatan dan tulang dengan tingkat bervariasi.",
    visualChange: "Poket dan perubahan tulang disimulasikan secara konseptual.",
    modelPath: "periodontitis.glb",
    limitation: "Klasifikasi klinis memerlukan probing/radiografi.",
    status: "Draft"
  }
]
