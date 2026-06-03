# Authentic Perfumes Website Design

Date: 2026-06-03

## Goal

Build a premium Next.js website for Authentic Perfumes, an Indonesian reseller of original niche and designer fragrances. The site must raise brand authority before it sells products: it should communicate authenticity, sourcing expertise, fragrance consultation, transparent pre-order service, and real customer trust proof.

The first release includes the public website, catalog, brand directory, product detail pages, request and notify flows, WhatsApp actions, and an admin panel backed by Supabase and Cloudinary.

## Design Direction

The UI direction is inspired by Luckyscent: a boutique niche-fragrance storefront with strong navigation, curated collection modules, product discovery, editorial fragrance content, and brand depth. Authentic Perfumes should feel established and useful, not like a cinematic landing page or a generic product showcase.

The homepage should be browseable from the first screen. Brand authority comes from breadth, curation, clear service policies, fragrance education, and trust proof. The structure is:

1. Compact announcement bar
2. Centered brand masthead
3. Wide category navigation with dropdown groups
4. Featured collection banners
5. New and Noteworthy product grid
6. Consultation, trust proof, and pre-order service modules
7. Discovery sets, samples, or split-size offerings
8. Featured brands
9. About/service footer with trust copy, WhatsApp, shipping, and policy links

Visual tone:

- Premium, niche-boutique, refined, warm, and easy to browse
- Soft neutral palette based on `#F2F2F0`, `#EEEAE3`, `#DDD6CE`, `#B0A99F`
- Black for typography and structure
- Restrained gold accent for authenticity, proof, and high-value actions
- Comfortable whitespace with dense product and brand surfaces where browsing requires it
- Typography with a distinctive serif display face and a precise sans-serif body face
- No generic gradient-orb backgrounds, oversized SaaS cards, purple palettes, cinematic empty hero sections, or templated landing-page layouts

Important reference traits from Luckyscent to adapt, not copy:

- A top announcement message
- Logo/masthead as a clear central brand anchor
- Main navigation organized by shopping intent: Brands, New, Fragrances, Sampling, Discover, Pre Order, Best Sellers, Contact
- Featured collection tiles near the top
- Product sections with many visible items, small product imagery, brand, product name, concentration, and price range
- Editorial/support content such as video reviews, fragrance guides, glossary, or consultation content
- Featured brand tiles
- Footer copy that explains the brand's authority and service model

## Motion Direction

Use motion to make browsing feel polished, not theatrical.

Implementation will use Framer Motion in Next.js for:

- Subtle page entrance and route transitions
- Light staggered reveals for collection tiles and product rows
- Smooth dropdown and mobile navigation transitions
- Small hover transitions for products, brand tiles, and featured collections
- Product and brand hover states
- Cart drawer, filter drawer, admin modals, and media previews

Use Transitions.dev-style product motion patterns for UI interactions:

- Menu dropdown: origin-aware open and close
- Panel reveal: filters, mobile navigation, admin side panels
- Modal open/close: request fragrance, notify me, media upload preview
- Icon swap: wishlist, menu, filters, stock status
- Text state swap: status labels, price/saving states
- Success check: submitted request, saved product, uploaded media
- Error shake: invalid admin forms

All motion must respect `prefers-reduced-motion`. The site should never feel like a demo of animation; motion supports navigation, feedback, and polish.

## Architecture

Framework:

- Next.js App Router
- TypeScript
- Tailwind CSS for styling
- Framer Motion for motion
- Supabase for auth, database, and row-level access rules
- Cloudinary for image and video storage
- REST API routes under `/api/*`

Public routes:

- `/`
- `/shop`
- `/brands`
- `/brands/[slug]`
- `/products/[slug]`
- `/new-arrivals`
- `/best-sellers`
- `/sampling`
- `/pre-order`
- `/testimonials`
- `/discover`
- `/discover/[slug]`
- `/about`
- `/contact`

Product detail pages will canonicalize to `/products/[slug]`. The app can also support short marketing redirects such as `/xerjoff-naxos-100ml` to preserve the simple SEO examples from the brief without colliding with fixed routes like `/shop` and `/brands`.

Admin routes:

- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/brands`
- `/admin/brands/new`
- `/admin/brands/[id]`
- `/admin/banners`
- `/admin/testimonials`
- `/admin/discover`
- `/admin/trust-media`
- `/admin/requests`
- `/admin/stock-notifications`

API route groups:

- `/api/products`
- `/api/brands`
- `/api/banners`
- `/api/testimonials`
- `/api/discover`
- `/api/trust-media`
- `/api/fragrance-requests`
- `/api/stock-notifications`
- `/api/cloudinary/signature`

## Data Model

Supabase tables:

- `profiles`: admin user profile data
- `brands`: brand name, slug, logo, country, founded year, description, product count
- `products`: brand reference, name, slug, images, gallery, gender, concentration, notes, origin, description, status, flags
- `product_variants`: product reference, size, retail price, authentic price, stock, status
- `banners`: homepage hero and promo banners
- `testimonials`: customer reviews and chat review metadata
- `discover_posts`: fragrance guides, video review entries, glossary posts, consultation content, and brand authority articles
- `trust_media`: packing videos, shipping proof, unboxing, story reposts, repeat customer proof
- `fragrance_requests`: requested brand, product name, size, customer contact, status
- `stock_notifications`: product variant reference, customer contact, status
- `admin_audit_logs`: admin actions for product, brand, stock, price, and media changes

Cloudinary stores all product images, gallery images, brand logos, banners, trust images, and trust videos. Supabase stores Cloudinary URLs, public IDs, dimensions, media type, and alt text.

## Public Experience

### Homepage

The homepage follows a Luckyscent-like boutique storefront rhythm. It should expose categories, collections, products, content, and brands quickly.

Header and navigation:

- Top announcement bar for promo, free sample offer, PO update, or shipping message
- Centered Authentic Perfumes masthead
- Primary navigation: `Brands`, `New`, `Fragrances`, `Sampling`, `Pre Order`, `Best Sellers`, `Trust Center`, `Discover`, `Contact`
- Dropdown groups for high-volume categories
- Search, wishlist, cart/intent, and WhatsApp access

Top content:

- Featured collection tiles for promo, brand highlight, new arrivals, best sellers, PO, or discovery sets
- A compact trust strip: authentic guarantee, Indonesia shipping, split payment, fragrance consultation

Product/content modules:

- New and Noteworthy
- Best Sellers
- Ready Stock
- Pre Order Picks
- Discovery Sets / Samples / Decants
- Fragrance consultation or finder entry
- Video reviews, guides, or fragrance education
- Trust Center preview
- Brand universe preview
- Request a fragrance

### Sampling / Discovery

The site includes a sampling-oriented route because niche fragrance buyers often want low-risk discovery before committing to a full bottle.

This route can show:

- Sample packs
- Discovery sets
- Decants or split sizes where available
- Essential note families
- Staff picks
- Fragrance finder results

### Shop

The shop is a practical catalog surface with:

- Product search
- Filters for brand, gender, notes, price, size, ready stock, pre-order, best seller, and new arrival
- Product status labels
- Wishlist control
- Add to cart and WhatsApp controls

### Brands A-Z

The brand directory must scale to 300+ brands:

- Alphabet filter
- Search
- Brand logo
- Product count
- Brand country
- Link to brand detail page

### Product Detail

Product pages include:

- Brand name
- Product name
- HD primary image
- Gallery
- Size variants
- Gender
- Concentration
- Notes
- Country of origin
- Description
- Retail price, Authentic price, and saving
- Product status
- Add to cart
- Buy via WhatsApp
- Wishlist
- Notify me when unavailable
- Request similar fragrance when unavailable

Product URLs use SEO-friendly slugs such as `/products/xerjoff-naxos-100ml`, with optional short redirects such as `/xerjoff-naxos-100ml`.

### Trust Center

Trust Center is a first-class authority page, not a small testimonial section.

It includes:

- Customer reviews
- Packing videos
- Shipping proof
- Customer chat reviews
- Instagram story reposts
- Customer unboxing
- Repeat customer gallery

## Admin Experience

Admin authentication uses Supabase Auth.

Admin users can:

- Add, edit, delete products
- Manage product variants, prices, stock, and status
- Upload product images and gallery images to Cloudinary
- Add, edit, delete brands
- Upload brand logos
- Manage homepage banners
- Manage testimonials
- Manage discovery/editorial posts
- Upload packing videos, shipping proof, unboxing media, and chat review screenshots
- Review and update fragrance requests
- Review stock notification requests

Admin UI should be functional, dense, and calm. It does not need the same editorial drama as the public site. It should prioritize speed, clear validation, and reliable upload status.

## WhatsApp Integration

WhatsApp buttons appear globally and on product pages.

Default product message:

`Halo Authentic Perfumes, saya tertarik dengan produk ini. Mohon informasi stok dan harga terbaru.`

Product pages append product name, size, and URL when available.

## SEO

Each product and brand page has unique metadata.

SEO requirements:

- Product title includes brand and perfume name
- Product description includes original status, size availability, and Indonesia shipping
- Open Graph image from Cloudinary
- Canonical URL
- JSON-LD product schema where data is available
- Clean product and brand slugs

## Error Handling

Public forms:

- Validate required fields before submit
- Show clear success state after fragrance request or notify request
- Show retry state on network error

Admin:

- Protect all admin pages
- Validate image upload file type and size
- Show Cloudinary upload progress
- Prevent product publish without brand, name, slug, at least one image, and one variant
- Log admin mutations where practical

## Testing And Verification

Initial verification:

- TypeScript check
- Lint
- Build
- Manual browser verification for desktop and mobile homepage
- Manual browser verification for shop filters, brand search, product page, request form, notify form, admin login, and Cloudinary upload flow where credentials are available

If Supabase or Cloudinary credentials are not available locally, mock-safe UI paths will be verified and credential-dependent checks will be documented.

## Scope Boundaries

Included in first release:

- Website frontend
- Admin panel
- Supabase schema/migrations or SQL setup file
- REST API routes
- Cloudinary signed upload support
- Seed/demo data for local visual verification
- Responsive design
- Motion system

Not included in first release:

- Payment gateway integration
- Automated WhatsApp sending
- Customer account system
- Full cart checkout with payment capture
- Email/SMS notification delivery
- External shipping API integration

The first release will still include cart-like intent controls and WhatsApp purchase flows.
