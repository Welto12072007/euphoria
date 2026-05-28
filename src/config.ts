// Horários dos eventos (horário de Brasília). Pode ser [hora] ou [hora, minuto].
export type Horario = [number, number]

export const HORARIOS_BC: Horario[] = [
  [0, 0],
  [4, 0],
  [8, 0],
  [12, 0],
  [16, 0],
  [20, 0],
]

export const HORARIOS_ILUSION: Horario[] = [
  [10, 30],
  [16, 30],
  [23, 30],
]

// Mantido por compatibilidade (BC só com hora cheia)
export const EVENTOS = HORARIOS_BC.map(([h]) => h)

// Quantos minutos antes do evento o check-in abre
export const MINUTOS_ANTES = 25

// Quantos jogadores cabem em cada PT
export const MAX_TITULARES = 5
export const MAX_POR_BC = 10

// Canais agrupados por modo (Blood Castle / Ilusion Temple)
export const MODOS = {
  bc: {
    label: 'Blood Castle',
    canais: ['bc1', 'bc2', 'bc3', 'bc4', 'bc5', 'bc6', 'bc7'] as const,
    horarios: HORARIOS_BC,
    titulo: '🩸 Blood Castle Check-in',
    siglaProximo: 'BC',
    maxJogadores: 10,  // 5 Vip + 5 Principal
    maxTitulares: 5,
  },
  ilusion: {
    label: 'Ilusion Temple',
    canais: ['ilusion', 'vipilusion'] as const,
    horarios: HORARIOS_ILUSION,
    titulo: '✨ Ilusion Temple Check-in',
    siglaProximo: 'Ilusion',
    maxJogadores: 5,   // apenas 1 grupo
    maxTitulares: 5,
  },
} as const

export type ModoKey = keyof typeof MODOS
export type CanalKey =
  | (typeof MODOS)['bc']['canais'][number]
  | (typeof MODOS)['ilusion']['canais'][number]

// Mantido por compatibilidade
export const BCS = MODOS.bc.canais
export type BCKey = CanalKey

export const LABELS: Record<CanalKey, string> = {
  bc1: 'BC1',
  bc2: 'BC2',
  bc3: 'BC3',
  bc4: 'BC4',
  bc5: 'BC5',
  bc6: 'BC6',
  bc7: 'BC7',
  ilusion: 'Ilusion',
  vipilusion: 'Vip Ilusion',
}

export const VERSAO = '2.1.0'
export const AUTOR = 'Well'
