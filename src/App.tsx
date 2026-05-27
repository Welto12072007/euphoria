import { useState } from 'react'
import { useHorarioBrasilia } from './hooks/useHorarioBrasilia'
import { useCheckins } from './hooks/useCheckins'
import { StatusBar } from './components/StatusBar'
import { CheckinForm } from './components/CheckinForm'
import { Ranking } from './components/Ranking'
import { ModoTabs } from './components/ModoTabs'
import { AUTOR, VERSAO, type ModoKey } from './config'

export default function App() {
  const agora = useHorarioBrasilia()
  const { checkins } = useCheckins()
  const [modo, setModo] = useState<ModoKey>('bc')

  return (
    <>
      <div className="container">
        <h1>{modo === 'ilusion' ? '✨ Ilusion Temple Check-in' : '🩸 Blood Castle Check-in'}</h1>

        <StatusBar agora={agora} modo={modo} />

        <ModoTabs modo={modo} onChange={setModo} />

        <CheckinForm agora={agora} modo={modo} />

        <h2>Grupos</h2>
        <Ranking checkins={checkins} modo={modo} />
      </div>

      <div className="instrucoes">
        <h3>📜 Instruções</h3>
        <ul>
          <li>Digite o nome do personagem;</li>
          <li>Selecione a sala (BC ou Ilusion);</li>
          <li>
            Clique em <b>Fazer Check-in</b> quando o evento abrir;
          </li>
          <li>O check-in ficará disponível 25min antes do evento;</li>
          <li>Os grupos são atualizados automaticamente;</li>
          <li>
            IMPORTANTE: Só faça a inscrição caso possua o nível necessário e
            convite.
          </li>
        </ul>
      </div>

      <footer id="rodape">
        Desenvolvido por {AUTOR} - Versão {VERSAO}
      </footer>
    </>
  )
}
