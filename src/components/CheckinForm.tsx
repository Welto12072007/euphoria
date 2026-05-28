import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { MODOS, LABELS, type CanalKey, type ModoKey } from '../config'
import { eventoAtual } from '../lib/eventos'
type Props = {
  agora: Date | null
  modo: ModoKey
}

export function CheckinForm({ agora, modo }: Props) {
  const canais = MODOS[modo].canais
  const [nome, setNome] = useState('')
  const [canal, setCanal] = useState<CanalKey>(canais[0])
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    setCanal(canais[0])
  }, [modo])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) {
      alert('Digite o nome do personagem')
      return
    }
    if (!agora) {
      alert('Aguarde a sincronização do horário')
      return
    }
    const evento = eventoAtual(agora, MODOS[modo].horarios)
    if (!evento) {
      alert('Check-in disponível apenas 25 minutos antes do evento.')
      return
    }

    setEnviando(true)
    const { data, error } = await supabase.rpc('fazer_checkin', {
      p_player: nome.trim(),
      p_canal: canal,
      p_evento: evento.toISOString(),
    })
    setEnviando(false)

    if (error) {
      alert('Erro ao registrar')
      console.error(error)
      return
    }
    alert(data?.message ?? 'Check-in realizado!')
    setNome('')
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do personagem"
      />
      {canais.length > 1 && (
        <select
          value={canal}
          onChange={(e) => setCanal(e.target.value as CanalKey)}
        >
          {canais.map((c) => (
            <option key={c} value={c}>
              {LABELS[c]}
            </option>
          ))}
        </select>
      )}
      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Fazer Check-in'}
      </button>
    </form>
  )
}
