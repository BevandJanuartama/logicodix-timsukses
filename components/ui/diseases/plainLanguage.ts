const REPLACEMENTS: [RegExp, string][] = [
  [/multifaktorial/gi, 'dipengaruhi banyak hal'],
  [/biofilm disbiotik dan respons pejamu/gi, 'plak dengan bakteri yang tidak seimbang dan respons tubuh'],
  [/biofilm plak/gi, 'plak'],
  [/biofilm\/plak/gi, 'plak'],
  [/biofilm/gi, 'plak'],
  [/akumulasi/gi, 'penumpukan'],
  [/gingiva/gi, 'gusi'],
  [/inflamasi/gi, 'radang'],
  [/peradangan/gi, 'radang'],
  [/resesi/gi, 'gusi turun'],
  [/lesi/gi, 'bercak'],
  [/periodontal ligament/gi, 'ligamen pengikat gigi'],
  [/alveolar bone/gi, 'tulang penyangga gigi'],
  [/cementum/gi, 'sementum'],
  [/\bpulp\b/gi, 'pulpa'],
]

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export function plainSentence(text: string) {
  return capitalize(REPLACEMENTS.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text).trim())
}
