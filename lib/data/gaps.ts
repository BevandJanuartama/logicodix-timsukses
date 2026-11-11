import type { ResearchGap } from '@/lib/types'

export const researchGaps: ResearchGap[] = [
  {
    id: "GAP-001",
    area: "Dental anatomy",
    dataNeeded: "Exact anatomical dimensions and morphology by tooth type",
    reason: "For accurate model proportions",
    suggestedSource: "Dental anatomy textbooks; peer-reviewed anatomy sources",
    owner: null,
    status: "Open"
  },
  {
    id: "GAP-002",
    area: "Caries classification",
    dataNeeded: "ICDAS code definitions and visual criteria",
    reason: "For defensible educational stages",
    suggestedSource: "ICDAS/ICCMS official guide",
    owner: null,
    status: "Open"
  },
  {
    id: "GAP-003",
    area: "Periodontitis",
    dataNeeded: "Validated staging/grading summaries for non-clinical education",
    reason: "Avoid inaccurate progression model",
    suggestedSource: "2017 World Workshop consensus papers",
    owner: null,
    status: "Open"
  },
  {
    id: "GAP-004",
    area: "Indonesia statistics",
    dataNeeded: "Exact SKI 2023 table, age group, denominator, page and indicator definitions",
    reason: "For accurate local statistics",
    suggestedSource: "Official Kemenkes/BKPK SKI report",
    owner: null,
    status: "Verify"
  },
  {
    id: "GAP-005",
    area: "3D assets",
    dataNeeded: "Asset provenance and commercial/educational license",
    reason: "Legal and attribution compliance",
    suggestedSource: "Blender/asset provider license terms",
    owner: null,
    status: "Open"
  },
  {
    id: "GAP-006",
    area: "Usability",
    dataNeeded: "Test with students, general users and dental reviewer",
    reason: "Validate comprehensibility and interaction",
    suggestedSource: "User research",
    owner: null,
    status: "Open"
  }
]
