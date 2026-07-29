create or replace function public.sync_brand_product_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.published then
      update public.brands
      set product_count = product_count + 1
      where id = new.brand_id;
    end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    if old.published then
      update public.brands
      set product_count = greatest(product_count - 1, 0)
      where id = old.brand_id;
    end if;
    return old;
  end if;

  if old.published and (not new.published or old.brand_id is distinct from new.brand_id) then
    update public.brands
    set product_count = greatest(product_count - 1, 0)
    where id = old.brand_id;
  end if;

  if new.published and (not old.published or old.brand_id is distinct from new.brand_id) then
    update public.brands
    set product_count = product_count + 1
    where id = new.brand_id;
  end if;

  return new;
end;
$$;

update public.brands as brand
set product_count = (
  select count(*)::integer
  from public.products as product
  where product.brand_id = brand.id
    and product.published
);

drop trigger if exists products_sync_brand_product_count on public.products;

create trigger products_sync_brand_product_count
after insert or delete or update of brand_id, published on public.products
for each row execute function public.sync_brand_product_count();
