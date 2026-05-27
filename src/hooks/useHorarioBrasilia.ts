import { useEffect, useRef, useState } from 'react'

/**
 * Sincroniza com timeapi.io a cada 60s e mantém um Date "agora" atualizado
 * 1x por segundo, derivado do horário do servidor + delta local.
 */
export function useHorarioBrasilia() {
  const horarioServidor = useRef<Date | null>(null)
  const inicioSync = useRef<number>(Date.now())
  const [agora, setAgora] = useState<Date | null>(null)

  useEffect(() => {
    async function sincronizar() {
      try {
        const res = await fetch(
          'https://timeapi.io/api/Time/current/zone?timeZone=America/Sao_Paulo'
        )
        if (!res.ok) throw new Error('API não respondeu')
        const data = await res.json()
        horarioServidor.current = new Date(
          data.year,
          data.month - 1,
          data.day,
          data.hour,
          data.minute,
          data.seconds
        )
        inicioSync.current = Date.now()
      } catch (err) {
        console.log('Erro ao sincronizar horário:', err)
      }
    }

    sincronizar()
    const syncId = setInterval(sincronizar, 60_000)
    const tickId = setInterval(() => {
      if (!horarioServidor.current) {
        setAgora(null)
        return
      }
      const segundosPassados = Math.floor(
        (Date.now() - inicioSync.current) / 1000
      )
      const novo = new Date(horarioServidor.current)
      novo.setSeconds(novo.getSeconds() + segundosPassados)
      setAgora(novo)
    }, 1000)

    return () => {
      clearInterval(syncId)
      clearInterval(tickId)
    }
  }, [])

  return agora
}
