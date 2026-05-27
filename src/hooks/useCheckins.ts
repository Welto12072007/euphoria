import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabase'
import type { CanalKey } from '../config'

export type Checkin = {
  id: number
  player: string
  canal: CanalKey
  created_at: string
}

export function useCheckins() {
  const [checkins, setCheckins] = useState<Checkin[]>([])

  const carregar = useCallback(async () => {
    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .gte('evento', new Date().toISOString())   // só eventos ainda não ocorridos
      .order('created_at', { ascending: true })
    if (error) {
      console.error('Erro ao carregar checkins:', error)
      return
    }
    if (data) setCheckins(data as Checkin[])
  }, [])

  useEffect(() => {
    carregar()

    // recarrega a cada minuto para limpar grupos cujo evento já passou
    const tickId = setInterval(carregar, 60_000)

    const channel = supabase
      .channel('checkins-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'checkins' },
        () => carregar()
      )
      .subscribe()

    return () => {
      clearInterval(tickId)
      supabase.removeChannel(channel)
    }
  }, [carregar])

  return { checkins, recarregar: carregar }
}
