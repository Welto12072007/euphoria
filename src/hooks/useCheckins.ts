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
      .order('created_at', { ascending: true })
    if (error) {
      console.error('Erro ao carregar checkins:', error)
      return
    }
    if (data) setCheckins(data as Checkin[])
  }, [])

  useEffect(() => {
    carregar()
    const channel = supabase
      .channel('checkins-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'checkins' },
        () => carregar()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [carregar])

  return { checkins, recarregar: carregar }
}
