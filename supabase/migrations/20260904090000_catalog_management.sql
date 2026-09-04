-- Only published products with at least one size belong in public brand counts.
create or replace function public.sync_brand_product_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare brand_ids uuid[];
begin
  if tg_table_name = 'product_variants' then
    select array_agg(distinct brand_id) into brand_ids from public.products
    where id in (
      case when tg_op <> 'INSERT' then old.product_id end,
      case when tg_op <> 'DELETE' then new.product_id end
    );
  else
    brand_ids := array[
      case when tg_op <> 'INSERT' then old.brand_id end,
      case when tg_op <> 'DELETE' then new.brand_id end
    ];
  end if;
  perform 1 from public.brands where id = any(brand_ids) order by id for update;
  update public.brands b set product_count = (
    select count(*) from public.products p where p.brand_id = b.id and p.published
    and exists(select 1 from public.product_variants v where v.product_id = p.id)
  ) where b.id = any(brand_ids);
  return null;
end;
$$;

create trigger variants_sync_brand_product_count
after insert or delete or update of product_id on public.product_variants
for each row execute function public.sync_brand_product_count();

update public.brands b set product_count = (
  select count(*) from public.products p where p.brand_id = b.id and p.published
  and exists(select 1 from public.product_variants v where v.product_id = p.id)
);

create or replace function public.manage_catalog_selection(
  action text, target_ids uuid[], preview boolean default false,
  confirmed_empty_products uuid[] default '{}'
)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare
  ids uuid[];
  product_ids uuid[];
  empty_ids uuid[] := '{}';
  confirmed_ids uuid[];
  result jsonb;
  matched integer;
begin
  if action not in ('delete_products', 'set_best_seller', 'set_new_product', 'delete_variants')
    or action is null or target_ids is null or cardinality(target_ids) < 1
    or cardinality(target_ids) > 2000 or array_position(target_ids, null) is not null
    or confirmed_empty_products is null or cardinality(confirmed_empty_products) > 2000
    or array_position(confirmed_empty_products, null) is not null or preview is null then
    raise exception 'Invalid catalog action' using errcode = '22023';
  end if;
  select array_agg(distinct x order by x) into ids from unnest(target_ids) x;
  select coalesce(array_agg(distinct x order by x), '{}') into confirmed_ids from unnest(confirmed_empty_products) x;

  if action = 'delete_variants' then
    select array_agg(distinct product_id order by product_id) into product_ids
    from public.product_variants where id = any(ids);
  else
    product_ids := ids;
  end if;
  -- Serialize with product editors, variant inserts (FK locks), and other bulk actions.
  perform 1 from public.products where id = any(product_ids) order by id for update;
  if action = 'delete_variants' then
    perform 1 from public.product_variants where product_id = any(product_ids) order by id for update;
    select count(*) into matched from public.product_variants where id = any(ids) and product_id = any(product_ids);
  else
    select count(*) into matched from public.products where id = any(ids);
  end if;
  if matched <> cardinality(ids) then
    raise exception 'Selection changed. Refresh the list and select again.' using errcode = 'P0002';
  end if;

  if action = 'delete_variants' then
    select coalesce(array_agg(p.id order by p.id), '{}') into empty_ids
    from public.products p where p.id = any(product_ids) and not exists (
      select 1 from public.product_variants v where v.product_id = p.id and not (v.id = any(ids))
    );
    if not preview and empty_ids <> confirmed_ids then
      raise exception 'Last-size selection changed. Review and confirm deletion again.' using errcode = 'P0001';
    end if;
  end if;

  select jsonb_build_object(
    'ids', to_jsonb(ids), 'updatedCount', cardinality(ids),
    'slugs', coalesce(jsonb_agg(distinct p.slug), '[]'),
    'brandSlugs', coalesce(jsonb_agg(distinct b.slug), '[]'),
    'emptyProducts', coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'name', p.name))
       filter(where p.id = any(empty_ids)), '[]')
  ) into result from public.products p join public.brands b on b.id = p.brand_id where p.id = any(product_ids);
  if preview then return result; end if;

  perform 1 from public.brands where id in (select brand_id from public.products where id = any(product_ids))
    order by id for update;
  case action
    when 'delete_products' then delete from public.products where id = any(ids);
    when 'set_best_seller' then update public.products set best_seller = true where id = any(ids);
    when 'set_new_product' then update public.products set new_arrival = true where id = any(ids);
    when 'delete_variants' then delete from public.product_variants where id = any(ids);
  end case;
  return result;
end;
$$;
revoke all on function public.manage_catalog_selection(text, uuid[], boolean, uuid[]) from public, anon, authenticated;
grant execute on function public.manage_catalog_selection(text, uuid[], boolean, uuid[]) to service_role;
