-- =========================================================================
-- Euphoria Blood Castle / Ilusion Temple — schema Supabase
-- Rodar no SQL Editor do seu projeto Supabase (uma única vez).
-- =========================================================================

-- 1) Tabela de check-ins ---------------------------------------------------
create table if not exists public.checkins (
  id          bigserial primary key,
  player      text        not null,
  canal       text        not null,
  evento      timestamptz not null,
  created_at  timestamptz not null default now()
);

create index if not exists checkins_evento_canal_idx
  on public.checkins (evento, canal, created_at);

-- Garante 1 inscrição por (jogador, canal, evento)
create unique index if not exists checkins_unico_idx
  on public.checkins (lower(player), canal, evento);

-- 2) RPC fazer_checkin -----------------------------------------------------
create or replace function public.fazer_checkin(
  p_player text,
  p_canal  text,
  p_evento timestamptz
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_canais_validos text[] := array[
    'bc1','bc2','bc3','bc4','bc5','bc6','bc7',
    'ilusion','vipilusion'
  ];
  v_total int;
begin
  if p_player is null or length(trim(p_player)) = 0 then
    return jsonb_build_object('ok', false, 'message', 'Nome inválido');
  end if;

  if not (p_canal = any(v_canais_validos)) then
    return jsonb_build_object('ok', false, 'message', 'Canal inválido');
  end if;

  -- limite de 10 por canal/evento
  select count(*) into v_total
  from public.checkins
  where canal = p_canal and evento = p_evento;

  if v_total >= 10 then
    return jsonb_build_object('ok', false, 'message', upper(p_canal) || ' já está cheio (10/10)');
  end if;

  begin
    insert into public.checkins (player, canal, evento)
    values (trim(p_player), p_canal, p_evento);
  exception when unique_violation then
    return jsonb_build_object('ok', false, 'message', 'Você já está inscrito neste canal');
  end;

  return jsonb_build_object(
    'ok', true,
    'message', 'Check-in confirmado em ' || upper(p_canal)
  );
end;
$$;

revoke all on function public.fazer_checkin(text,text,timestamptz) from public;
grant execute on function public.fazer_checkin(text,text,timestamptz)
  to anon, authenticated;

-- 3) RLS — leitura pública, escrita só via RPC -----------------------------
alter table public.checkins enable row level security;

drop policy if exists "checkins_read_all" on public.checkins;
create policy "checkins_read_all"
  on public.checkins for select
  using (true);

-- (sem policy de INSERT/UPDATE/DELETE → bloqueado direto;
--  só a RPC SECURITY DEFINER consegue gravar)

-- 4) Realtime --------------------------------------------------------------
alter publication supabase_realtime add table public.checkins;

-- 5) Limpeza opcional: apagar checkins antigos -----------------------------
-- (rode periodicamente via cron, se quiser)
-- delete from public.checkins where evento < now() - interval '1 day';
