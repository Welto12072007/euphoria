# Euphoria Blood Castle / Ilusion Temple

App de check-in (React + TypeScript + Vite + Supabase).
Suporta **Blood Castle** (BC1–BC7) e **Ilusion Temple** (Ilusion / Vip Ilusion) com cronogramas separados.

## Stack

- Frontend: **React 18 + Vite + TypeScript**
- Backend: **Supabase** (Postgres + RPC + Realtime + RLS)
- Hosting: **Vercel**

---

## 1. Setup local

```bash
npm install
cp .env.example .env   # preencha com URL/anon key do seu projeto Supabase
npm run dev
```

---

## 2. Banco de dados (Supabase)

1. Crie um projeto novo em [supabase.com](https://supabase.com).
2. Em **Project Settings → API** copie:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`
3. Vá em **SQL Editor → New query**, cole o conteúdo de [supabase/schema.sql](supabase/schema.sql) e rode.
4. Pronto: tabela `checkins`, RPC `fazer_checkin`, RLS e Realtime configurados.

### O que o schema faz
- `checkins(player, canal, evento, created_at)` com índice único por (player, canal, evento).
- RPC `fazer_checkin(p_player, p_canal, p_evento)` valida canal, limita a **10 por sala** e retorna `{ ok, message }`.
- RLS: leitura pública, escrita **só pela RPC**.
- Realtime habilitado na tabela (a UI atualiza sozinha).

---

## 3. Deploy no Vercel

### Via dashboard
1. Suba o projeto pro GitHub.
2. Em [vercel.com](https://vercel.com) → **Add New → Project** → importe o repo.
3. Framework Preset: **Vite** (auto-detectado).
4. **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. **Deploy**.

### Via CLI
```bash
npm i -g vercel
vercel            # primeira vez: vincula o projeto
vercel --prod     # deploy de produção
```

O arquivo [vercel.json](vercel.json) já configura o rewrite SPA.

---

## 4. Estrutura

```
src/
  App.tsx                     # layout + state do modo (BC / Ilusion)
  config.ts                   # horários, canais, labels, versão
  supabase.ts                 # client Supabase
  components/
    ModoTabs.tsx              # alterna Blood Castle / Ilusion Temple
    StatusBar.tsx             # relógio + status + contador
    CheckinForm.tsx           # formulário (chama RPC)
    Ranking.tsx               # cards dos canais do modo ativo
  hooks/
    useHorarioBrasilia.ts     # sincroniza com timeapi.io
    useCheckins.ts            # SELECT + assinatura Realtime
  lib/eventos.ts              # cálculo evento atual / próximo
supabase/
  schema.sql                  # migration única
vercel.json                   # rewrites SPA
```

---

## 5. Personalização rápida

- **Horários**: edite `HORARIOS_BC` / `HORARIOS_ILUSION` em [src/config.ts](src/config.ts).
- **Canais**: edite `MODOS` em [src/config.ts](src/config.ts) e ajuste `v_canais_validos` em [supabase/schema.sql](supabase/schema.sql).
- **Janela de check-in**: `MINUTOS_ANTES` em [src/config.ts](src/config.ts).
- **Versão / autor**: `VERSAO` / `AUTOR` em [src/config.ts](src/config.ts).
