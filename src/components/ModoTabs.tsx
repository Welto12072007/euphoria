import { MODOS, type ModoKey } from '../config'

type Props = {
  modo: ModoKey
  onChange: (m: ModoKey) => void
}

export function ModoTabs({ modo, onChange }: Props) {
  return (
    <div className="modo-tabs">
      {(Object.keys(MODOS) as ModoKey[]).map((m) => (
        <button
          key={m}
          type="button"
          className={`modo-tab${m === modo ? ' ativo' : ''}`}
          onClick={() => onChange(m)}
        >
          {MODOS[m].label}
        </button>
      ))}
    </div>
  )
}
