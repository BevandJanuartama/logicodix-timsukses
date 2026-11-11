import type { ModelAsset } from '@/lib/types'

export const modelAssets: ModelAsset[] = [
  {
    id: "AST-001",
    name: "Healthy molar",
    modelType: "Base anatomy",
    path: "/models/teeth/healthy_molar.glb",
    meshIds: [
      "enamel",
      "dentin",
      "pulp",
      "cementum",
      "gingiva",
      "pd_ligament",
      "alveolar_bone"
    ],
    license: "To be verified",
    creator: null,
    version: "1.0",
    reviewer: null,
    status: "Draft",
    notes: "Primary MVP asset"
  },
  {
    id: "AST-002",
    name: "Caries initial",
    modelType: "Disease state",
    path: "/models/diseases/caries_initial.glb",
    meshIds: [
      "enamel"
    ],
    license: "To be verified",
    creator: null,
    version: "1.0",
    reviewer: null,
    status: "Draft",
    notes: "Illustrative only"
  },
  {
    id: "AST-003",
    name: "Caries dentin",
    modelType: "Disease state",
    path: "/models/diseases/caries_dentin.glb",
    meshIds: [
      "enamel",
      "dentin"
    ],
    license: "To be verified",
    creator: null,
    version: "1.0",
    reviewer: null,
    status: "Draft",
    notes: "Illustrative only"
  },
  {
    id: "AST-004",
    name: "Periodontitis",
    modelType: "Disease state",
    path: "/models/diseases/periodontitis.glb",
    meshIds: [
      "gingiva",
      "pd_ligament",
      "alveolar_bone"
    ],
    license: "To be verified",
    creator: null,
    version: "1.0",
    reviewer: null,
    status: "Draft",
    notes: "Clinical review required"
  }
]
