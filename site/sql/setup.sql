-- ============================================================
--  ألعاب أبو جنان — تتبّع زوار الموقع (Supabase)
--  انسخ هذا الملف كاملاً والصقه في:
--  لوحة Supabase ← SQL Editor ← New query ← Run
--  يُنفَّذ مرة واحدة فقط، وتكراره آمن.
-- ============================================================

-- 1) جدول الزيارات (لا يُخزَّن أي عنوان IP ولا أي بيانات شخصية)
create table if not exists public.site_visits (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  country_code text,
  country_name text,
  city         text,
  region       text,
  referrer     text,
  device       text,
  lang         text,
  path         text
);

create index if not exists site_visits_created_idx on public.site_visits (created_at desc);
create index if not exists site_visits_country_idx on public.site_visits (country_code);

-- 2) تأمين الجدول: الزائر يستطيع التسجيل فقط — لا قراءة ولا تعديل ولا حذف
alter table public.site_visits enable row level security;

drop policy if exists "visits insert" on public.site_visits;
create policy "visits insert" on public.site_visits
  for insert to anon, authenticated with check (true);

grant insert on public.site_visits to anon, authenticated;
grant usage, select on sequence public.site_visits_id_seq to anon, authenticated;

-- 3) إحصاءات مجمّعة فقط (تُقرأ علناً — بلا أي صفوف فردية)
create or replace view public.site_stats_totals as
  select
    count(*)::bigint                                                              as total,
    count(*) filter (where created_at > now() - interval '24 hours')::bigint      as last_24h,
    count(*) filter (where created_at > now() - interval '7 days')::bigint        as last_7d,
    count(*) filter (where created_at > now() - interval '30 days')::bigint       as last_30d,
    count(distinct country_code)::bigint                                          as countries,
    min(created_at)                                                               as since
  from public.site_visits;

create or replace view public.site_stats_countries as
  select
    coalesce(nullif(country_code,''),'??')        as country_code,
    coalesce(nullif(country_name,''),'غير معروف') as country_name,
    count(*)::bigint                              as visits,
    max(created_at)                               as last_visit
  from public.site_visits
  group by 1,2
  order by visits desc;

create or replace view public.site_stats_cities as
  select
    coalesce(nullif(city,''),'غير معروفة')        as city,
    coalesce(nullif(country_name,''),'—')         as country_name,
    coalesce(nullif(country_code,''),'??')        as country_code,
    count(*)::bigint                              as visits
  from public.site_visits
  group by 1,2,3
  order by visits desc
  limit 40;

create or replace view public.site_stats_daily as
  select (created_at at time zone 'UTC')::date as day, count(*)::bigint as visits
  from public.site_visits
  where created_at > now() - interval '60 days'
  group by 1
  order by day;

create or replace view public.site_stats_devices as
  select coalesce(nullif(device,''),'غير معروف') as device, count(*)::bigint as visits
  from public.site_visits
  group by 1
  order by visits desc;

create or replace view public.site_stats_referrers as
  select coalesce(nullif(referrer,''),'زيارة مباشرة') as referrer, count(*)::bigint as visits
  from public.site_visits
  group by 1
  order by visits desc
  limit 20;

grant select on
  public.site_stats_totals,
  public.site_stats_countries,
  public.site_stats_cities,
  public.site_stats_daily,
  public.site_stats_devices,
  public.site_stats_referrers
to anon, authenticated;
