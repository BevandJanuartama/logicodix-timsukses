export function FactList({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <section>
      <h3 className="mb-2 text-subtitle font-semibold text-fg">Fakta singkat</h3>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-[var(--radius-control)] bg-surface-sunken p-3 text-caption">
        {facts.map((fact) => (
          <div key={fact.label} className="col-span-2 grid grid-cols-subgrid">
            <dt className="text-fg-secondary">{fact.label}</dt>
            <dd className="font-semibold tabular-nums text-fg">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
