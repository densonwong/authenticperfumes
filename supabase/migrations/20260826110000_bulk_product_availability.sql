create or replace function public.bulk_update_product_availability(
  product_ids uuid[],
  target_status text
)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  updated_count integer;
  normalized_status public.product_status;
begin
  if target_status not in ('ready_stock', 'pre_order') then
    raise exception 'Unsupported availability target';
  end if;

  normalized_status := target_status::public.product_status;

  update public.products
  set
    status = normalized_status,
    ready_stock = target_status = 'ready_stock',
    pre_order = target_status = 'pre_order'
  where id = any(product_ids);

  get diagnostics updated_count = row_count;

  update public.product_variants
  set status = normalized_status
  where product_id = any(product_ids);

  return updated_count;
end;
$$;

revoke all on function public.bulk_update_product_availability(uuid[], text)
from public, anon, authenticated;

grant execute on function public.bulk_update_product_availability(uuid[], text)
to service_role;
