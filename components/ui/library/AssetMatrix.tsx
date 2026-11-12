import { modelAssets } from '@/lib/knowledgeBase'
import { StatusBadge } from '@/components/ui/shell/StatusBadge'
import { LibraryRow } from './LibraryRow'

export function AssetMatrix() {
  return (
    <>
      <p className="mb-2 text-[13px] text-fg-muted">Model prosedural dibangkitkan kode; berkas .glb belum dimuat.</p>
      <ul>
        {modelAssets.map((asset) => (
          <LibraryRow
            key={asset.id}
            summary={
              <div className="flex items-center gap-2">
                <span className="telemetry text-[12px] font-semibold text-accent">{asset.id}</span>
                <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-fg">{asset.name}</span>
                <StatusBadge contentId={asset.id} baseStatus={asset.status} />
              </div>
            }
          >
            <p>{asset.modelType} · v{asset.version} · Lisensi: {asset.license}</p>
            <p className="telemetry text-[12px]">{asset.meshIds.join(' · ')}</p>
            <p className="text-fg">{asset.notes}</p>
          </LibraryRow>
        ))}
      </ul>
    </>
  )
}
