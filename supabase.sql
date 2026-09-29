-- SADEE SOLUTIONS STORE
-- Run this in Supabase SQL Editor.
-- Then create your admin user in Authentication > Users and add the same email below.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text default 'Digital Product',
  price numeric not null default 0,
  price_note text default '',
  description text default '',
  features jsonb default '[]'::jsonb,
  image_url text default '',
  featured boolean default false,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  price numeric default 0,
  customer_name text default '',
  customer_phone text default '',
  created_at timestamptz default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email)=lower(coalesce(auth.jwt()->>'email',''))
  );
$$;

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "public can read active products" on public.products;
create policy "public can read active products" on public.products
for select using (active = true or public.is_admin());

drop policy if exists "admins can manage products" on public.products;
create policy "admins can manage products" on public.products
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins can read orders" on public.orders;
create policy "admins can read orders" on public.orders
for select to authenticated using (public.is_admin());

drop policy if exists "public can create orders" on public.orders;
create policy "public can create orders" on public.orders
for insert to anon, authenticated with check (true);

drop policy if exists "admins can manage orders" on public.orders;
create policy "admins can manage orders" on public.orders
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins can read admin users" on public.admin_users;
create policy "admins can read admin users" on public.admin_users
for select to authenticated using (public.is_admin());

-- Storage bucket for product photos.
insert into storage.buckets (id,name,public)
values ('product-media','product-media',true)
on conflict (id) do update set public=true;

drop policy if exists "public can view product media" on storage.objects;
create policy "public can view product media" on storage.objects
for select using (bucket_id='product-media');

drop policy if exists "admins can upload product media" on storage.objects;
create policy "admins can upload product media" on storage.objects
for insert to authenticated with check (bucket_id='product-media' and public.is_admin());

drop policy if exists "admins can update product media" on storage.objects;
create policy "admins can update product media" on storage.objects
for update to authenticated using (bucket_id='product-media' and public.is_admin()) with check (bucket_id='product-media' and public.is_admin());

drop policy if exists "admins can delete product media" on storage.objects;
create policy "admins can delete product media" on storage.objects
for delete to authenticated using (bucket_id='product-media' and public.is_admin());

-- Initial products. Replace image URLs after uploading media through admin if desired.
insert into public.products (name,category,price,price_note,description,features,featured,active)
select 'SADEE SOLUTIONS — App & Website Package','Development',1000,'Inbox for final price',
'Custom app and website development package for digital businesses.',
'["Mobile applications","Custom websites","Cloud solutions","API integration","Digital innovation"]'::jsonb,true,true
where not exists (select 1 from public.products where name='SADEE SOLUTIONS — App & Website Package');

insert into public.products (name,category,price,price_note,description,features,featured,active)
select 'SADEE SENSITIVE PRO','Gaming',1000,'Lifetime',
'Free Fire sensitivity tool for creating your own device-based sensitivity profiles.',
'["Free Fire sensitivity profiles","Device-based setup","Custom presets","Lifetime access"]'::jsonb,true,true
where not exists (select 1 from public.products where name='SADEE SENSITIVE PRO');

insert into public.products (name,category,price,price_note,description,features,featured,active)
select 'SADEE X DIMA OPTIMIZER','Gaming',500,'7 day key • 1 month Rs.1000 • Lifetime Rs.2200',
'Android / iOS optimization system with device information, RAM/storage utilities, game-center tools and activation-key access.',
'["7 day key — Rs.500","1 month — Rs.1000","Lifetime — Rs.2200","Device information","RAM / storage tools","Game optimization tools"]'::jsonb,true,true
where not exists (select 1 from public.products where name='SADEE X DIMA OPTIMIZER');
