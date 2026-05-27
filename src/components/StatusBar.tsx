import { MODOS, type ModoKey } from '../config'
import { eventoAtual, proximoEvento, formatarHora } from '../lib/eventos'

type Props = {
  agora: Date | null
  modo: ModoKey
}

export function StatusBar({ agora, modo }: Props) {
  const horarios = MODOS[modo].horarios
  const sigla = MODOS[modo].siglaProximo

  if (!agora) {
    return (
      <>
        <div className="info">Horário de Brasília: Sincronizando horário...</div>
        <div className="status">Status: </div>
        <div className="contador"></div>
      </>
    )
  }

  const evento = eventoAtual(agora, horarios)
  const proximo = proximoEvento(agora, horarios)

  let statusTxt: string
  let contadorTxt: string

  if (evento) {
    const diff = evento.getTime() - agora.getTime()
    const min = Math.floor(diff / 60000)
    const seg = Math.floor((diff % 60000) / 1000)
    statusTxt = '🟢 CHECK-IN ABERTO'
    contadorTxt = `Evento começa em: ${min}m ${seg}s`
  } else {
    const diff = proximo.getTime() - agora.getTime()
    const horas = Math.floor(diff / 3600000)
    const min = Math.floor((diff % 3600000) / 60000)
    statusTxt = '🔴 CHECK-IN FECHADO'
    contadorTxt = `Próximo ${sigla}: ${formatarHora(proximo)} (abre em ${horas}h ${min}m)`
  }

  return (
    <>
      <div className="info">
        Horário de Brasília: {agora.toLocaleTimeString('pt-BR')}
      </div>
      <div className="status">
        Status: <span>{statusTxt}</span>
      </div>
      <div className="contador">{contadorTxt}</div>
    </>
  )
}
