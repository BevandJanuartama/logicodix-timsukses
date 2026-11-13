'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main role="alert" className="flex min-h-dvh items-center justify-center bg-app px-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <h1 className="font-display text-title font-semibold text-fg">Ada yang tidak beres</h1>
        <p className="text-body text-fg-secondary">Halaman gagal dimuat. Coba muat ulang.</p>
        <button
          type="button"
          onClick={() => reset()}
          className="min-h-11 rounded-[var(--radius-control)] bg-accent-fill px-5 font-semibold text-on-accent"
        >
          Muat ulang
        </button>
      </div>
    </main>
  )
}
