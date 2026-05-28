-- ============================================================
-- Euphoria BC / Ilusion Temple — Supabase Schema
-- Rode este arquivo inteiro no SQL Editor do Supabase
-- ============================================================

-- Tabela de check-ins
create table if not exists public.checkins (
  id         bigserial primary key,
  player     text not null,
  canal      text not null,
  evento     timestamptz not null,
  created_at timestamptz default now()
);

-- Índice único: 1 player por canal/evento
create unique index if not exists checkins_unique_player
  on public.checkins (lower(player), canal, evento);

-- RLS
alter table public.checkins enable row level security;

drop policy if exists "leitura publica" on public.checkins;
create policy "leitura publica"
  on public.checkins for select
  using (true);

drop policy if exists "escrita via rpc" on public.checkins;
create policy "escrita via rpc"
  on public.checkins for insert
  with check (false);   -- somente via SECURITY DEFINER

-- Realtime
alter publication supabase_realtime add table public.checkins;

-- ============================================================
-- RPC: fazer_checkin
-- BC = 10 vagas | Ilusion/VipIlusion = 5 vagas
-- ============================================================
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
    'ilusion'
  ];
  v_limite int;
  v_total  int;
begin
  if p_player is null or length(trim(p_player)) = 0 then
    return jsonb_build_object('ok', false, 'message', 'Nome inválido');
  end if;

  if not (p_canal = any(v_canais_validos)) then
    return jsonb_build_object('ok', false, 'message', 'Canal inválido');
  end if;

  v_limite := 10;  -- 10 vagas em todos os canais (5 Vip + 5 Principal)

  select count(*) into v_total
  from public.checkins
  where canal = p_canal and evento = p_evento;

  if v_total >= v_limite then
    return jsonb_build_object(
      'ok', false,
      'message', upper(p_canal) || ' já está cheio (' || v_limite || '/' || v_limite || ')'
    );
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
