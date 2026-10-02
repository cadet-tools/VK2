-- Vējiņu kauss 2026 — kontrolpunktu tiešsaistes statuss
-- Ielīmē Supabase -> SQL Editor un palaid vienu reizi.

create table if not exists public.control_status (
  event_id text not null,
  control_id text not null,
  is_placed boolean not null default false,
  placed_by text,
  updated_at timestamptz not null default now(),
  primary key (event_id, control_id),
  constraint vk2026_control_id_check
    check (
      event_id <> 'vejinu-kauss-2026'
      or control_id in ('21','23','31','32','33','35','41','42','43','44','46','47','48','49','50','51','52','53','54','55','56','57','61','62','63','81','82','83','91','92')
    )
);

create or replace function public.set_control_status_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_control_status_updated_at on public.control_status;
create trigger trg_control_status_updated_at
before update on public.control_status
for each row execute function public.set_control_status_updated_at();

alter table public.control_status enable row level security;

-- Least privilege: pārlūkam drīkst tikai lasīt, ievietot un atjaunināt.
revoke all on table public.control_status from anon, authenticated;
grant select, insert, update on table public.control_status to anon, authenticated;

drop policy if exists "vk2026 read status" on public.control_status;
create policy "vk2026 read status"
on public.control_status
for select
to anon, authenticated
using (event_id = 'vejinu-kauss-2026');

drop policy if exists "vk2026 insert status" on public.control_status;
create policy "vk2026 insert status"
on public.control_status
for insert
to anon, authenticated
with check (
  event_id = 'vejinu-kauss-2026'
  and control_id in ('21','23','31','32','33','35','41','42','43','44','46','47','48','49','50','51','52','53','54','55','56','57','61','62','63','81','82','83','91','92')
);

drop policy if exists "vk2026 update status" on public.control_status;
create policy "vk2026 update status"
on public.control_status
for update
to anon, authenticated
using (
  event_id = 'vejinu-kauss-2026'
  and control_id in ('21','23','31','32','33','35','41','42','43','44','46','47','48','49','50','51','52','53','54','55','56','57','61','62','63','81','82','83','91','92')
)
with check (
  event_id = 'vejinu-kauss-2026'
  and control_id in ('21','23','31','32','33','35','41','42','43','44','46','47','48','49','50','51','52','53','54','55','56','57','61','62','63','81','82','83','91','92')
);

-- Realtime: pievieno tabulu publikācijai tikai tad, ja tā vēl nav pievienota.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'control_status'
  ) then
    alter publication supabase_realtime add table public.control_status;
  end if;
end $$;
