import type { Banner, Brand, DiscoverPost, Product, Testimonial, TrustMedia } from "./types";

const image = (id: string, width = 1200, height = 1500) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;

export const seedBrands: Brand[] = [
  {
    id: "brand-xerjoff",
    name: "Xerjoff",
    slug: "xerjoff",
    logoUrl: image("photo-1595425970377-c9703cf48b6d", 600, 600),
    country: "Italy",
    foundedYear: 2007,
    description: "Italian niche perfumery known for opulent compositions and jewel-box presentation.",
    productCount: 1,
    featured: true
  },
  {
    id: "brand-maison-francis-kurkdjian",
    name: "Maison Francis Kurkdjian",
    slug: "maison-francis-kurkdjian",
    logoUrl: image("photo-1581467655410-0c2bf55d9d6c", 600, 600),
    country: "France",
    foundedYear: 2009,
    description: "Parisian maison blending luminous musks, ambers, and refined modern signatures.",
    productCount: 1,
    featured: true
  },
  {
    id: "brand-creed",
    name: "Creed",
    slug: "creed",
    logoUrl: image("photo-1594035910387-fea47794261f", 600, 600),
    country: "France",
    foundedYear: 1760,
    description: "Heritage fragrance house with tailored fresh, woody, and citrus-led compositions.",
    productCount: 1,
    featured: true
  },
  {
    id: "brand-byredo",
    name: "Byredo",
    slug: "byredo",
    logoUrl: image("photo-1615634260167-c8cdede054de", 600, 600),
    country: "Sweden",
    foundedYear: 2006,
    description: "Minimal Stockholm fragrance house with clean storytelling and wearable textures.",
    productCount: 1,
    featured: false
  },
  {
    id: "brand-diptyque",
    name: "Diptyque",
    slug: "diptyque",
    logoUrl: image("photo-1592945403244-b3fbafd7f539", 600, 600),
    country: "France",
    foundedYear: 1961,
    description: "Saint-Germain icon loved for botanical, aromatic, and quietly elegant perfumes.",
    productCount: 1,
    featured: false
  },
  {
    id: "brand-le-labo",
    name: "Le Labo",
    slug: "le-labo",
    logoUrl: image("photo-1587017539504-67cfbddac569", 600, 600),
    country: "United States",
    foundedYear: 2006,
    description: "Cult perfume lab focused on raw materials, labels, and urban signatures.",
    productCount: 1,
    featured: true
  },
  {
    id: "brand-kilian-paris",
    name: "Kilian Paris",
    slug: "kilian-paris",
    logoUrl: image("photo-1608528577891-eb055944f2e7", 600, 600),
    country: "France",
    foundedYear: 2007,
    description: "Luxury fragrance house exploring nightlife, gourmand, and dark floral themes.",
    productCount: 1,
    featured: false
  },
  {
    id: "brand-amouage",
    name: "Amouage",
    slug: "amouage",
    logoUrl: image("photo-1600612253971-422e7f7faeb6", 600, 600),
    country: "Oman",
    foundedYear: 1983,
    description: "Omani high perfumery with incense, resin, and richly layered accords.",
    productCount: 1,
    featured: true
  },
  {
    id: "brand-parfums-de-marly",
    name: "Parfums de Marly",
    slug: "parfums-de-marly",
    logoUrl: image("photo-1601295452898-78a8dd904a18", 600, 600),
    country: "France",
    foundedYear: 2009,
    description: "French niche house inspired by royal court perfumery and modern projection.",
    productCount: 1,
    featured: true
  },
  {
    id: "brand-initio",
    name: "Initio Parfums Prives",
    slug: "initio-parfums-prives",
    logoUrl: image("photo-1590736704728-f4730bb30770", 600, 600),
    country: "France",
    foundedYear: 2015,
    description: "Sensual niche fragrances built around amber, woods, musks, and high impact trails.",
    productCount: 1,
    featured: false
  },
  {
    id: "brand-frederic-malle",
    name: "Frederic Malle",
    slug: "frederic-malle",
    logoUrl: image("photo-1608571423902-eed4a5ad8108", 600, 600),
    country: "France",
    foundedYear: 2000,
    description: "Publisher of perfumes giving leading perfumers room for bold signature work.",
    productCount: 1,
    featured: false
  },
  {
    id: "brand-penhaligons",
    name: "Penhaligon's",
    slug: "penhaligons",
    logoUrl: image("photo-1617897903246-719242758050", 600, 600),
    country: "United Kingdom",
    foundedYear: 1870,
    description: "British fragrance house with polished classics, portraits, and eccentric charm.",
    productCount: 1,
    featured: false
  }
];

export const seedProducts: Product[] = [
  {
    id: "product-xerjoff-naxos-100ml",
    brandId: "brand-xerjoff",
    brandName: "Xerjoff",
    slug: "xerjoff-naxos-100ml",
    name: "Naxos",
    imageUrl: image("photo-1595425970377-c9703cf48b6d"),
    galleryUrls: [image("photo-1595425970377-c9703cf48b6d"), image("photo-1615634260167-c8cdede054de")],
    gender: "unisex",
    concentration: "Eau de Parfum",
    notes: ["Honey", "Tobacco", "Lavender", "Cinnamon"],
    countryOfOrigin: "Italy",
    description: "A warm honeyed tobacco signature with citrus brightness and polished aromatic depth.",
    status: "ready_stock",
    bestSeller: true,
    newArrival: false,
    readyStock: true,
    preOrder: false,
    variants: [
      {
        id: "variant-xerjoff-naxos-100ml",
        size: "100ml",
        retailPrice: 4800000,
        authenticPrice: 3950000,
        stock: 4,
        status: "ready_stock"
      }
    ]
  },
  {
    id: "product-mfk-baccarat-rouge-540-70ml",
    brandId: "brand-maison-francis-kurkdjian",
    brandName: "Maison Francis Kurkdjian",
    slug: "maison-francis-kurkdjian-baccarat-rouge-540-70ml",
    name: "Baccarat Rouge 540",
    imageUrl: image("photo-1581467655410-0c2bf55d9d6c"),
    galleryUrls: [image("photo-1581467655410-0c2bf55d9d6c"), image("photo-1608528577891-eb055944f2e7")],
    gender: "unisex",
    concentration: "Eau de Parfum",
    notes: ["Saffron", "Amberwood", "Jasmine", "Cedar"],
    countryOfOrigin: "France",
    description: "An airy amber floral with crystalline sweetness and a recognizable mineral glow.",
    status: "limited_stock",
    bestSeller: true,
    newArrival: false,
    readyStock: true,
    preOrder: false,
    variants: [
      {
        id: "variant-mfk-baccarat-rouge-540-70ml",
        size: "70ml",
        retailPrice: 5200000,
        authenticPrice: 4550000,
        stock: 2,
        status: "limited_stock"
      }
    ]
  },
  {
    id: "product-creed-aventus-100ml",
    brandId: "brand-creed",
    brandName: "Creed",
    slug: "creed-aventus-100ml",
    name: "Aventus",
    imageUrl: image("photo-1594035910387-fea47794261f"),
    galleryUrls: [image("photo-1594035910387-fea47794261f"), image("photo-1592945403244-b3fbafd7f539")],
    gender: "men",
    concentration: "Eau de Parfum",
    notes: ["Pineapple", "Birch", "Musk", "Oakmoss"],
    countryOfOrigin: "France",
    description: "A confident fruity chypre with smoky woods, crisp pineapple, and tailored musk.",
    status: "ready_stock",
    bestSeller: true,
    newArrival: false,
    readyStock: true,
    preOrder: false,
    variants: [
      {
        id: "variant-creed-aventus-100ml",
        size: "100ml",
        retailPrice: 6500000,
        authenticPrice: 5650000,
        stock: 3,
        status: "ready_stock"
      }
    ]
  },
  {
    id: "product-byredo-bal-dafrique-100ml",
    brandId: "brand-byredo",
    brandName: "Byredo",
    slug: "byredo-bal-dafrique-100ml",
    name: "Bal d'Afrique",
    imageUrl: image("photo-1615634260167-c8cdede054de"),
    galleryUrls: [image("photo-1615634260167-c8cdede054de"), image("photo-1587017539504-67cfbddac569")],
    gender: "unisex",
    concentration: "Eau de Parfum",
    notes: ["Bergamot", "Violet", "Vetiver", "Amber"],
    countryOfOrigin: "Sweden",
    description: "A bright vetiver fragrance with citrus lift, soft florals, and creamy warmth.",
    status: "pre_order",
    bestSeller: false,
    newArrival: true,
    readyStock: false,
    preOrder: true,
    variants: [
      {
        id: "variant-byredo-bal-dafrique-100ml",
        size: "100ml",
        retailPrice: 3950000,
        authenticPrice: 3450000,
        stock: 0,
        status: "pre_order"
      }
    ]
  },
  {
    id: "product-diptyque-philosykos-75ml",
    brandId: "brand-diptyque",
    brandName: "Diptyque",
    slug: "diptyque-philosykos-75ml",
    name: "Philosykos",
    imageUrl: image("photo-1592945403244-b3fbafd7f539"),
    galleryUrls: [image("photo-1592945403244-b3fbafd7f539"), image("photo-1590736704728-f4730bb30770")],
    gender: "unisex",
    concentration: "Eau de Parfum",
    notes: ["Fig Leaf", "Fig", "Coconut", "Cedar"],
    countryOfOrigin: "France",
    description: "A green fig scent with milky fruit, leafy shade, and dry cedar warmth.",
    status: "ready_stock",
    bestSeller: false,
    newArrival: false,
    readyStock: true,
    preOrder: false,
    variants: [
      {
        id: "variant-diptyque-philosykos-75ml",
        size: "75ml",
        retailPrice: 3400000,
        authenticPrice: 2925000,
        stock: 5,
        status: "ready_stock"
      }
    ]
  },
  {
    id: "product-le-labo-santal-33-100ml",
    brandId: "brand-le-labo",
    brandName: "Le Labo",
    slug: "le-labo-santal-33-100ml",
    name: "Santal 33",
    imageUrl: image("photo-1587017539504-67cfbddac569"),
    galleryUrls: [image("photo-1587017539504-67cfbddac569"), image("photo-1600612253971-422e7f7faeb6")],
    gender: "unisex",
    concentration: "Eau de Parfum",
    notes: ["Sandalwood", "Cardamom", "Leather", "Iris"],
    countryOfOrigin: "United States",
    description: "A dry sandalwood icon with cardamom spice, soft leather, and urban musk.",
    status: "limited_stock",
    bestSeller: true,
    newArrival: false,
    readyStock: true,
    preOrder: false,
    variants: [
      {
        id: "variant-le-labo-santal-33-100ml",
        size: "100ml",
        retailPrice: 4900000,
        authenticPrice: 4250000,
        stock: 1,
        status: "limited_stock"
      }
    ]
  },
  {
    id: "product-kilian-angels-share-50ml",
    brandId: "brand-kilian-paris",
    brandName: "Kilian Paris",
    slug: "kilian-paris-angels-share-50ml",
    name: "Angels' Share",
    imageUrl: image("photo-1608528577891-eb055944f2e7"),
    galleryUrls: [image("photo-1608528577891-eb055944f2e7"), image("photo-1601295452898-78a8dd904a18")],
    gender: "unisex",
    concentration: "Eau de Parfum",
    notes: ["Cognac", "Cinnamon", "Tonka Bean", "Oak"],
    countryOfOrigin: "France",
    description: "A boozy gourmand with cognac warmth, cinnamon spice, and polished wood.",
    status: "ready_stock",
    bestSeller: false,
    newArrival: true,
    readyStock: true,
    preOrder: false,
    variants: [
      {
        id: "variant-kilian-angels-share-50ml",
        size: "50ml",
        retailPrice: 4300000,
        authenticPrice: 3775000,
        stock: 3,
        status: "ready_stock"
      }
    ]
  },
  {
    id: "product-amouage-reflection-man-100ml",
    brandId: "brand-amouage",
    brandName: "Amouage",
    slug: "amouage-reflection-man-100ml",
    name: "Reflection Man",
    imageUrl: image("photo-1600612253971-422e7f7faeb6"),
    galleryUrls: [image("photo-1600612253971-422e7f7faeb6"), image("photo-1608571423902-eed4a5ad8108")],
    gender: "men",
    concentration: "Eau de Parfum",
    notes: ["Neroli", "Jasmine", "Sandalwood", "Cedar"],
    countryOfOrigin: "Oman",
    description: "A polished white floral woody scent with clean neroli and creamy sandalwood.",
    status: "pre_order",
    bestSeller: false,
    newArrival: false,
    readyStock: false,
    preOrder: true,
    variants: [
      {
        id: "variant-amouage-reflection-man-100ml",
        size: "100ml",
        retailPrice: 5700000,
        authenticPrice: 4925000,
        stock: 0,
        status: "pre_order"
      }
    ]
  },
  {
    id: "product-parfums-de-marly-delina-75ml",
    brandId: "brand-parfums-de-marly",
    brandName: "Parfums de Marly",
    slug: "parfums-de-marly-delina-75ml",
    name: "Delina",
    imageUrl: image("photo-1601295452898-78a8dd904a18"),
    galleryUrls: [image("photo-1601295452898-78a8dd904a18"), image("photo-1617897903246-719242758050")],
    gender: "women",
    concentration: "Eau de Parfum",
    notes: ["Rose", "Lychee", "Rhubarb", "Vanilla"],
    countryOfOrigin: "France",
    description: "A modern rose perfume with tart fruit, soft vanilla, and elegant projection.",
    status: "ready_stock",
    bestSeller: true,
    newArrival: false,
    readyStock: true,
    preOrder: false,
    variants: [
      {
        id: "variant-parfums-de-marly-delina-75ml",
        size: "75ml",
        retailPrice: 5300000,
        authenticPrice: 4625000,
        stock: 2,
        status: "ready_stock"
      }
    ]
  },
  {
    id: "product-initio-side-effect-90ml",
    brandId: "brand-initio",
    brandName: "Initio Parfums Prives",
    slug: "initio-parfums-prives-side-effect-90ml",
    name: "Side Effect",
    imageUrl: image("photo-1590736704728-f4730bb30770"),
    galleryUrls: [image("photo-1590736704728-f4730bb30770"), image("photo-1581467655410-0c2bf55d9d6c")],
    gender: "unisex",
    concentration: "Eau de Parfum",
    notes: ["Rum", "Tobacco", "Vanilla", "Cinnamon"],
    countryOfOrigin: "France",
    description: "A rich amber tobacco scent with rum, spice, and a long vanilla trail.",
    status: "out_of_stock",
    bestSeller: false,
    newArrival: false,
    readyStock: false,
    preOrder: false,
    variants: [
      {
        id: "variant-initio-side-effect-90ml",
        size: "90ml",
        retailPrice: 5100000,
        authenticPrice: 4450000,
        stock: 0,
        status: "out_of_stock"
      }
    ]
  },
  {
    id: "product-frederic-malle-portrait-of-a-lady-100ml",
    brandId: "brand-frederic-malle",
    brandName: "Frederic Malle",
    slug: "frederic-malle-portrait-of-a-lady-100ml",
    name: "Portrait of a Lady",
    imageUrl: image("photo-1608571423902-eed4a5ad8108"),
    galleryUrls: [image("photo-1608571423902-eed4a5ad8108"), image("photo-1594035910387-fea47794261f")],
    gender: "women",
    concentration: "Eau de Parfum",
    notes: ["Rose", "Patchouli", "Incense", "Blackcurrant"],
    countryOfOrigin: "France",
    description: "A grand rose patchouli composition with incense, dark fruit, and velvet texture.",
    status: "pre_order",
    bestSeller: false,
    newArrival: true,
    readyStock: false,
    preOrder: true,
    variants: [
      {
        id: "variant-frederic-malle-portrait-of-a-lady-100ml",
        size: "100ml",
        retailPrice: 6700000,
        authenticPrice: 5850000,
        stock: 0,
        status: "pre_order"
      }
    ]
  },
  {
    id: "product-penhaligons-halfeti-100ml",
    brandId: "brand-penhaligons",
    brandName: "Penhaligon's",
    slug: "penhaligons-halfeti-100ml",
    name: "Halfeti",
    imageUrl: image("photo-1617897903246-719242758050"),
    galleryUrls: [image("photo-1617897903246-719242758050"), image("photo-1595425970377-c9703cf48b6d")],
    gender: "unisex",
    concentration: "Eau de Parfum",
    notes: ["Grapefruit", "Rose", "Oud", "Leather"],
    countryOfOrigin: "United Kingdom",
    description: "A dark rose oud with bright citrus, spice, and refined leather depth.",
    status: "ready_stock",
    bestSeller: false,
    newArrival: false,
    readyStock: true,
    preOrder: false,
    variants: [
      {
        id: "variant-penhaligons-halfeti-100ml",
        size: "100ml",
        retailPrice: 4400000,
        authenticPrice: 3825000,
        stock: 4,
        status: "ready_stock"
      }
    ]
  }
];

export const seedBanners: Banner[] = [
  {
    id: "banner-niche-arrivals",
    title: "Niche arrivals, verified authentic",
    subtitle: "Curated bottles from Europe and the US with concierge sourcing for rare requests.",
    imageUrl: image("photo-1541643600914-78b084683601", 1800, 900),
    href: "/products?filter=new-arrivals",
    position: "primary"
  },
  {
    id: "banner-ready-stock",
    title: "Ready stock favorites",
    subtitle: "Fast dispatch for Jakarta and nationwide delivery with careful packaging proof.",
    imageUrl: image("photo-1592945403244-b3fbafd7f539", 1400, 800),
    href: "/products?availability=ready-stock",
    position: "secondary"
  },
  {
    id: "banner-consultation",
    title: "Find your next signature",
    subtitle: "Tell us your taste profile and occasion, then get a short-list via WhatsApp.",
    imageUrl: image("photo-1608528577891-eb055944f2e7", 1400, 800),
    href: "/discover/fragrance-consultation",
    position: "tertiary"
  }
];

export const seedTestimonials: Testimonial[] = [
  {
    id: "testimonial-rania",
    customerName: "Rania A.",
    quote: "Naxos arrived sealed, carefully wrapped, and the batch details matched. The scent lasts beautifully.",
    productName: "Xerjoff Naxos",
    imageUrl: image("photo-1494790108377-be9c29b29330", 600, 600)
  },
  {
    id: "testimonial-kevin",
    customerName: "Kevin T.",
    quote: "They helped compare Aventus and Santal 33 without pushing. Checkout through WhatsApp was quick.",
    productName: "Creed Aventus",
    imageUrl: image("photo-1500648767791-00dcc994a43e", 600, 600)
  },
  {
    id: "testimonial-maya",
    customerName: "Maya P.",
    quote: "My Delina pre-order was updated at each step, from invoice to arrival photos and delivery.",
    productName: "Parfums de Marly Delina",
    imageUrl: image("photo-1438761681033-6461ffad8d80", 600, 600)
  },
  {
    id: "testimonial-dimas",
    customerName: "Dimas R.",
    quote: "The recommendation was accurate. Halfeti feels formal, warm, and exactly right for evening wear.",
    productName: "Penhaligon's Halfeti",
    imageUrl: image("photo-1506794778202-cad84cf45f1d", 600, 600)
  }
];

export const seedTrustMedia: TrustMedia[] = [
  {
    id: "trust-packing-video",
    title: "Same-day packing video",
    category: "packing_video",
    mediaType: "video",
    mediaUrl: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=1200&h=1200&q=80"
  },
  {
    id: "trust-shipping-proof",
    title: "Tracked shipping receipt",
    category: "shipping_proof",
    mediaType: "image",
    mediaUrl: image("photo-1589556264800-08ae9e129a2a", 1200, 1200)
  },
  {
    id: "trust-chat-review",
    title: "Consultation chat review",
    category: "chat_review",
    mediaType: "image",
    mediaUrl: image("photo-1516321318423-f06f85e504b3", 1200, 1200)
  },
  {
    id: "trust-story-repost",
    title: "Customer story repost",
    category: "story_repost",
    mediaType: "image",
    mediaUrl: image("photo-1515886657613-9f3515b0c78f", 1200, 1200)
  },
  {
    id: "trust-unboxing",
    title: "Bottle unboxing proof",
    category: "unboxing",
    mediaType: "video",
    mediaUrl: "https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?auto=format&fit=crop&w=1200&h=1200&q=80"
  },
  {
    id: "trust-repeat-customer",
    title: "Repeat customer haul",
    category: "repeat_customer",
    mediaType: "image",
    mediaUrl: image("photo-1608571423902-eed4a5ad8108", 1200, 1200)
  }
];

export const seedDiscoverPosts: DiscoverPost[] = [
  {
    id: "discover-niche-perfume-guide",
    slug: "how-to-start-with-niche-perfumes",
    title: "How to start with niche perfumes",
    excerpt: "A simple way to move from designer favorites into niche fragrance without blind-buy regret.",
    category: "guide",
    imageUrl: image("photo-1547887537-6158d64c35b3", 1400, 900),
    body: "Start with the notes you already enjoy, then test one fresh, one amber, and one woody option before committing to a full bottle.",
    publishedAt: "2026-05-06T09:00:00.000Z"
  },
  {
    id: "discover-naxos-review",
    slug: "xerjoff-naxos-review",
    title: "Xerjoff Naxos review",
    excerpt: "Why Naxos remains one of the easiest niche honey tobacco fragrances to recommend.",
    category: "review",
    imageUrl: image("photo-1595425970377-c9703cf48b6d", 1400, 900),
    body: "Naxos balances citrus, lavender, honey, and tobacco in a way that feels luxurious without becoming heavy too early.",
    publishedAt: "2026-05-13T09:00:00.000Z"
  },
  {
    id: "discover-concentration-glossary",
    slug: "extrait-vs-edp-vs-edt",
    title: "Extrait vs EDP vs EDT",
    excerpt: "A practical glossary for concentration labels, longevity expectations, and projection.",
    category: "glossary",
    imageUrl: image("photo-1600612253971-422e7f7faeb6", 1400, 900),
    body: "Concentration names are useful, but material quality, composition, skin, and weather matter just as much as the label.",
    publishedAt: "2026-05-20T09:00:00.000Z"
  },
  {
    id: "discover-signature-consultation",
    slug: "signature-scent-consultation",
    title: "Signature scent consultation",
    excerpt: "What to share with us so we can shortlist fragrances that fit your lifestyle and budget.",
    category: "consultation",
    imageUrl: image("photo-1608528577891-eb055944f2e7", 1400, 900),
    body: "Tell us your usual scents, climate, budget, occasions, and whether you prefer compliments or a closer personal aura.",
    publishedAt: "2026-05-27T09:00:00.000Z"
  }
];
