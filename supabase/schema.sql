create extension if not exists "pgcrypto";

create type public.profile_role as enum ('admin', 'customer');
create type public.product_status as enum ('ready_stock', 'pre_order', 'limited_stock', 'out_of_stock');
create type public.gender as enum ('men', 'women', 'unisex');
create type public.banner_position as enum ('primary', 'secondary', 'tertiary');
create type public.request_status as enum ('new', 'in_review', 'sourced', 'closed');
create type public.notification_status as enum ('pending', 'notified', 'closed');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role public.profile_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text not null,
  country text not null,
  founded_year integer,
  description text not null,
  product_count integer not null default 0,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete restrict,
  slug text not null unique,
  name text not null,
  image_url text not null,
  gallery_urls text[] not null default '{}',
  gender public.gender not null,
  concentration text not null,
  notes text[] not null default '{}',
  country_of_origin text not null,
  description text not null,
  status public.product_status not null default 'ready_stock',
  best_seller boolean not null default false,
  new_arrival boolean not null default false,
  ready_stock boolean not null default false,
  pre_order boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  retail_price integer not null check (retail_price >= 0),
  authentic_price integer not null check (authentic_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  status public.product_status not null default 'ready_stock',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null,
  image_url text not null,
  href text not null,
  position public.banner_position not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  quote text not null,
  product_name text not null,
  image_url text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fragrance_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text,
  phone text not null,
  requested_fragrance text not null,
  notes text,
  status public.request_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stock_notifications (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_slug text not null,
  email text,
  phone text,
  status public.notification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stock_notifications_contact_check check (email is not null or phone is not null)
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  table_name text not null,
  record_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index brands_slug_idx on public.brands(slug);
create index products_slug_idx on public.products(slug);
create index products_brand_id_idx on public.products(brand_id);
create index products_status_idx on public.products(status);
create index products_best_seller_idx on public.products(best_seller);
create index products_new_arrival_idx on public.products(new_arrival);
create index products_ready_stock_idx on public.products(ready_stock);
create index products_pre_order_idx on public.products(pre_order);
create index fragrance_requests_status_idx on public.fragrance_requests(status);
create index stock_notifications_status_idx on public.stock_notifications(status);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger brands_set_updated_at
before update on public.brands
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger product_variants_set_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

create trigger banners_set_updated_at
before update on public.banners
for each row execute function public.set_updated_at();

create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

create trigger fragrance_requests_set_updated_at
before update on public.fragrance_requests
for each row execute function public.set_updated_at();

create trigger stock_notifications_set_updated_at
before update on public.stock_notifications
for each row execute function public.set_updated_at();

create trigger admin_audit_logs_set_updated_at
before update on public.admin_audit_logs
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.banners enable row level security;
alter table public.testimonials enable row level security;
alter table public.fragrance_requests enable row level security;
alter table public.stock_notifications enable row level security;
alter table public.admin_audit_logs enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create policy "Profiles can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published brands"
on public.brands for select
to anon, authenticated
using (published);

create policy "Public can read published products"
on public.products for select
to anon, authenticated
using (published);

create policy "Public can read variants for published products"
on public.product_variants for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_variants.product_id
      and products.published
  )
);

create policy "Public can read published banners"
on public.banners for select
to anon, authenticated
using (published);

create policy "Public can read published testimonials"
on public.testimonials for select
to anon, authenticated
using (published);

create policy "Admins can manage brands"
on public.brands for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage products"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage product variants"
on public.product_variants for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage banners"
on public.banners for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage testimonials"
on public.testimonials for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage fragrance requests"
on public.fragrance_requests for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage stock notifications"
on public.stock_notifications for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can read audit logs"
on public.admin_audit_logs for select
to authenticated
using (public.is_admin());

create policy "Admins can create audit logs"
on public.admin_audit_logs for insert
to authenticated
with check (public.is_admin());
