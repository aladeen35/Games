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

-- ============================================================
-- 4) عدّاد التحميلات (ضغطات أزرار التحميل)
-- ============================================================
create table if not exists public.site_downloads (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  kind         text not null check (kind in ('windows','android')),
  country_code text,
  country_name text,
  city         text,
  device       text
);

create index if not exists site_downloads_kind_idx    on public.site_downloads (kind);
create index if not exists site_downloads_created_idx on public.site_downloads (created_at desc);

alter table public.site_downloads enable row level security;

drop policy if exists "downloads insert" on public.site_downloads;
create policy "downloads insert" on public.site_downloads
  for insert to anon, authenticated with check (true);

grant insert on public.site_downloads to anon, authenticated;
grant usage, select on sequence public.site_downloads_id_seq to anon, authenticated;

create or replace view public.site_stats_downloads as
  select
    kind,
    count(*)::bigint                                                         as total,
    count(*) filter (where created_at > now() - interval '24 hours')::bigint as last_24h,
    count(*) filter (where created_at > now() - interval '7 days')::bigint   as last_7d,
    max(created_at)                                                          as last_at
  from public.site_downloads
  group by kind;

create or replace view public.site_stats_downloads_countries as
  select
    kind,
    coalesce(nullif(country_code,''),'??')        as country_code,
    coalesce(nullif(country_name,''),'غير معروف') as country_name,
    count(*)::bigint                              as downloads
  from public.site_downloads
  group by 1,2,3
  order by downloads desc;

grant select on public.site_stats_downloads, public.site_stats_downloads_countries to anon, authenticated;

-- ============================================================
-- 5) رسائل التواصل
--    تُكتب فقط ولا تُقرأ علناً — اقرأها من لوحة Supabase:
--    Table Editor ← site_messages
-- ============================================================
create table if not exists public.site_messages (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  name         text not null check (char_length(name)  between 1 and 80),
  email        text          check (char_length(email) <= 120),
  body         text not null check (char_length(body)  between 2 and 4000),
  country_code text,
  country_name text,
  device       text
);

alter table public.site_messages enable row level security;

drop policy if exists "messages insert" on public.site_messages;
create policy "messages insert" on public.site_messages
  for insert to anon, authenticated with check (true);

grant insert on public.site_messages to anon, authenticated;
grant usage, select on sequence public.site_messages_id_seq to anon, authenticated;

-- لا سياسة قراءة ولا grant select على الجدول: لا أحد يقرأ الرسائل بالمفتاح العام.
-- المعلن فقط عددها:
create or replace view public.site_stats_messages as
  select
    count(*)::bigint                                                       as total,
    count(*) filter (where created_at > now() - interval '7 days')::bigint as last_7d,
    max(created_at)                                                        as last_at
  from public.site_messages;

grant select on public.site_stats_messages to anon, authenticated;
