import { notFound, permanentRedirect } from "next/navigation";
import { getProductBySlug } from "@/lib/repositories/catalog";

type Params = Promise<{ slug: string }>;

export default async function ShortProductRedirectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  permanentRedirect(`/products/${product.slug}`);
}
