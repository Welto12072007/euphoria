import { MINUTOS_ANTES, type Horario } from '../config'

export function eventoAtual(now: Date, horarios: Horario[]): Date | null {
  for (const [h, m] of horarios) {
    const evento = new Date(now)
    evento.setHours(h, m, 0, 0)
    if (evento < now) evento.setDate(evento.getDate() + 1)
    const inicio = new Date(evento)
    inicio.setMinutes(inicio.getMinutes() - MINUTOS_ANTES)
    if (now >= inicio && now <= evento) return evento
  }
  return null
}

export function proximoEvento(now: Date, horarios: Horario[]): Date {
  for (const [h, m] of horarios) {
    const evento = new Date(now)
    evento.setHours(h, m, 0, 0)
    if (evento > now) return evento
  }
  const amanha = new Date(now)
  amanha.setDate(amanha.getDate() + 1)
  const [h, m] = horarios[0]
  amanha.setHours(h, m, 0, 0)
  return amanha
}

export function formatarHora(d: Date): string {
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}
