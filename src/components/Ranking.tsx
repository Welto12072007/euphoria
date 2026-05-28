import {
  MODOS,
  LABELS,
  type CanalKey,
  type ModoKey,
} from '../config'
import type { Checkin } from '../hooks/useCheckins'

type Props = {
  checkins: Checkin[]
  modo: ModoKey
}

const NUMS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

export function Ranking({ checkins, modo }: Props) {
  const { canais, maxJogadores, maxTitulares } = MODOS[modo]
  const buckets = Object.fromEntries(
    canais.map((c) => [c, [] as string[]])
  ) as Record<CanalKey, string[]>

  for (const c of checkins) {
    if (buckets[c.canal as CanalKey]) {
      buckets[c.canal as CanalKey].push(c.player)
    }
  }

  return (
    <div className="ranking-grid">
      {canais.map((canal) => {
        const lista = buckets[canal]
        const titulares = lista.slice(0, maxTitulares)
        const reservas = lista.slice(maxTitulares)
        const total = lista.length
        const full = total >= maxJogadores
        const classes = ['bc-card']
        if (full) classes.push('bc-full')
        if (canal === 'ilusion') classes.push('ilusion')

        return (
          <div key={canal} className={classes.join(' ')}>
            <h3>
              {LABELS[canal]} ({full ? 'FULL' : `${total}/${maxJogadores}`})
            </h3>

            {total === 0 && <div>Nenhum jogador ainda</div>}

            {titulares.length > 0 && (
              <>
                {maxJogadores > maxTitulares && (
                  <div className="titulo-titulares">⚔️ PT 1 -&gt; Vip</div>
                )}
                {titulares.map((p, i) => (
                  <div key={`t-${i}`}>
                    {NUMS[i]} {p}
                  </div>
                ))}
              </>
            )}

            {reservas.length > 0 && (
              <>
                <div className="titulo-reservas" style={{ marginTop: 8 }}>
                  🪑 PT 2 -&gt; Principal
                </div>
                {reservas.map((p, i) => (
                  <div key={`r-${i}`}>
                    {NUMS[i + maxTitulares]} {p}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
