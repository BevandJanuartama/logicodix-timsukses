const REPLACEMENTS: [RegExp, string][] = [
  [/mengalami mineralisasi dan mengeras/gi, 'mengeras'],
  [/multifaktorial/gi, 'dipengaruhi banyak hal'],
  [/biofilm plak/gi, 'plak'],
  [/biofilm\/plak/gi, 'plak'],
  [/biofilm/gi, 'plak'],
  [/akumulasi/gi, 'penumpukan'],
  [/gingiva/gi, 'gusi'],
  [/inflamasi/gi, 'radang'],
  [/peradangan/gi, 'radang'],
  [/perdarahan gusi/gi, 'gusi berdarah'],
  [/poket periodontal/gi, 'kantong di sela gusi'],
  [/mobilitas gigi/gi, 'gigi goyang'],
  [/resesi/gi, 'gusi turun'],
  [/kavitas/gi, 'lubang pada gigi'],
  [/lesi/gi, 'bercak'],
]

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export function plain(text: string) {
  return REPLACEMENTS.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text)
}

export function plainSentence(text: string) {
  return capitalize(plain(text).trim())
}

export function plainPoints(text: string, limit: number) {
  return plain(text)
    .split(/[;,]/)
    .map((part) => capitalize(part.trim().replace(/\.$/, '')))
    .filter(Boolean)
    .slice(0, limit)
}
