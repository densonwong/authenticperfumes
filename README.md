# Authentic Perfumes

Next.js storefront and admin MVP for Authentic Perfumes, an Indonesian reseller of original niche and designer fragrances.

The public site follows a Luckyscent-like boutique catalog direction: compact masthead, wide category navigation, featured collection tiles, dense product rows, sampling/discovery, trust center, and brand directory. The admin panel supports local preview data and is prepared for Supabase Auth/database plus Cloudinary media uploads.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase Auth and database
- Cloudinary signed uploads
- React Hook Form and Zod
- Vitest

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The app can run without Supabase or Cloudinary credentials. In that state, storefront pages use seed data, admin opens in local preview mode, and Cloudinary upload fields show a configuration message instead of crashing.

## Environment Variables

Create `.env.local` when live services are available:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`NEXT_PUBLIC_WHATSAPP_NUMBER` should use international format without `+`.

## Supabase Setup

Run the SQL in [supabase/schema.sql](/Users/tsth/Coding/denson/supabase/schema.sql) inside the Supabase SQL editor or migration flow.

The schema includes:

- `profiles`
- `brands`
- `products`
- `product_variants`
- `banners`
- `testimonials`
- `discover_posts`
- `trust_media`
- `fragrance_requests`
- `stock_notifications`
- `admin_audit_logs`

RLS is enabled for all tables. Public read policies are defined for published catalog/content tables, and authenticated admin mutation policies are defined for admin-managed tables.

## Brand Import

The brand workbook can be imported after the Supabase schema exists.

1. Run [supabase/schema.sql](/Users/tsth/Coding/denson/supabase/schema.sql) in Supabase.
2. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`.
3. Run:

```bash
npm run import:brands -- "/Users/tsth/Downloads/Brand parfum a-z final.xlsx"
```

To verify parsing without writing to Supabase:

```bash
npm run import:brands -- "/Users/tsth/Downloads/Brand parfum a-z final.xlsx" --dry-run
```

The importer reads the first sheet, removes A-Z divider rows, slugifies names, and upserts brands by slug. Product count defaults to `0`, country defaults to `Unknown`, and logo uses a placeholder image until real brand logos are uploaded from admin.

## Cloudinary Setup

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

The upload signature route is:

```text
/api/cloudinary/signature
```

Supported folder query values:

- default: `authenticperfumes/catalog`
- `?folder=banners`: `authenticperfumes/banners`
- `?folder=trust-media`: `authenticperfumes/trust-media`

## Verification

```bash
npm test
npm run typecheck
npm run build
```

Useful manual routes:

- `/`
- `/shop`
- `/brands`
- `/products/xerjoff-naxos-100ml`
- `/sampling`
- `/pre-order`
- `/testimonials`
- `/discover`
- `/contact`
- `/admin/login`
- `/admin/products`

## Notes

- Payment gateway integration is not included in this MVP.
- Customer accounts are not included in this MVP.
- WhatsApp purchase actions generate customer intent links; the app does not send automated WhatsApp messages.
- Cloudinary and Supabase live persistence can be expanded after credentials and production rules are confirmed.
