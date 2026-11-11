import { toothTypes } from '@/lib/knowledgeBase'

export function ToothTypeTable({ activeId }: { activeId?: string }) {
  const totals = toothTypes.reduce(
    (sum, type) => ({ primary: sum.primary + type.primaryCount, permanent: sum.permanent + type.permanentCount }),
    { primary: 0, permanent: 0 },
  )
  return (
    <table className="w-full overflow-hidden rounded-2xl text-left text-[13px] ring-1 ring-ink/8">
      <caption className="sr-only">Jumlah gigi per jenis pada dentisi sulung dan permanen</caption>
      <thead className="bg-ink/[0.04] text-[11px] font-bold tracking-wide text-ink/55 uppercase">
        <tr>
          <th scope="col" className="px-3 py-2">Jenis</th>
          <th scope="col" className="px-2 py-2 text-right">Sulung</th>
          <th scope="col" className="px-3 py-2 text-right">Permanen</th>
        </tr>
      </thead>
      <tbody className="tabular-nums">
        {toothTypes.map((type) => (
          <tr
            key={type.id}
            aria-current={type.id === activeId ? 'true' : undefined}
            className="border-t border-ink/5 bg-white/50 aria-[current=true]:bg-brand-50"
          >
            <th scope="row" className="px-3 py-2 font-semibold">
              {type.name}
              <span className="block text-[11.5px] font-medium text-ink/55">{type.function}</span>
            </th>
            <td className="px-2 py-2 text-right font-bold">{type.primaryCount}</td>
            <td className="px-3 py-2 text-right font-bold">{type.permanentCount}</td>
          </tr>
        ))}
      </tbody>
      <tfoot className="tabular-nums">
        <tr className="border-t border-ink/10 text-[12px] font-bold text-ink/70">
          <th scope="row" className="px-3 py-2">Total</th>
          <td className="px-2 py-2 text-right">{totals.primary}</td>
          <td className="px-3 py-2 text-right">{totals.permanent}</td>
        </tr>
      </tfoot>
    </table>
  )
}
