"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { NotifyMeForm } from "@/components/storefront/notify-me-form";
import { RequestFragranceForm } from "@/components/storefront/request-fragrance-form";
import { calculateSavings, formatRupiah } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import type { Product } from "@/lib/types";
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

type ProductPurchasePanelProps = {
  canonicalUrl: string;
  dictionary: Dictionary;
  locale: Locale;
  product: Product;
};

export function ProductPurchasePanel({
  canonicalUrl,
  dictionary,
  locale,
  product
}: ProductPurchasePanelProps) {
  const searchParams = useSearchParams();
  const [variantId, setVariantId] = useState(() => searchParams.get("variant"));
  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];

  if (!variant) return null;

  const savings = calculateSavings(variant.retailPrice, variant.authenticPrice);
  const isAskPrice = variant.authenticPrice <= 0;
  const savingsPercent = variant.retailPrice > 0 && !isAskPrice
    ? Math.round((savings / variant.retailPrice) * 100)
    : 0;
  const shouldShowNotifyForm = variant.status === "out_of_stock" || variant.stock < 1;
  const whatsappUrl = buildWhatsAppUrl(
    buildProductWhatsAppMessage(`${product.brandName} ${product.name}`, canonicalUrl, variant.size)
  );

  function selectVariant(nextVariantId: string) {
    setVariantId(nextVariantId);
    window.history.replaceState(
      window.history.state,
      "",
      localizedPath(locale, `/products/${product.slug}?variant=${nextVariantId}`)
    );
  }

  return (
    <>
      <div className="mt-6 border-y border-ink/10 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
          {dictionary.product.selectedSize}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {product.variants.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectVariant(item.id)}
              className={`border px-3 py-3 text-left transition ${
                item.id === variant.id
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/10 bg-warm/45 text-ink hover:border-ink/35"
              }`}
            >
              <span className="block text-sm font-semibold">{item.size}</span>
              <span className="mt-1 block text-xs uppercase tracking-[0.12em] opacity-70">
                {dictionary.status[item.status]} / {dictionary.product.stock} {item.stock}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 border border-ink/10 bg-warm/45 p-4">
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
            {dictionary.product.retail}
          </p>
          <p className="text-sm text-ink/55 line-through">{formatRupiah(variant.retailPrice)}</p>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
            {dictionary.product.authentic}
          </p>
          <p className="text-xl font-semibold text-ink">
            {isAskPrice ? "Ask" : formatRupiah(variant.authenticPrice)}
          </p>
        </div>
        {!isAskPrice ? (
          <div className="flex items-center justify-between gap-4 pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
              {dictionary.product.savings}
            </p>
            <p className="text-sm font-semibold text-gold">
              {formatRupiah(savings)} ({savingsPercent}%)
            </p>
          </div>
        ) : null}
        <p className="mt-4 border-t border-ink/10 pt-3 text-sm leading-6 text-ink/68">
          {dictionary.product.installment}
        </p>
      </div>

      <div className="mt-5 rounded-none border border-ink/10 bg-warm/45 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink">{dictionary.product.status}</p>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            {dictionary.status[variant.status]}
          </p>
        </div>
        <p className="mt-2 text-sm leading-6 text-ink/65">{dictionary.product.statusBody}</p>
      </div>

      <div className="mt-5 grid gap-2">
        <a
          href={whatsappUrl}
          className="inline-flex items-center justify-center border border-gold bg-gold px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-paper transition hover:bg-paper hover:text-ink"
        >
          {dictionary.product.buyWhatsapp}
        </a>
      </div>

      <div className="mt-5 grid gap-4">
        {shouldShowNotifyForm ? (
          <NotifyMeForm
            key={variant.id}
            productId={product.id}
            productSlug={product.slug}
            variantId={variant.id}
            dictionary={dictionary.forms}
          />
        ) : null}
        <RequestFragranceForm
          key={variant.id}
          defaultValues={{
            brandName: product.brandName,
            productName: product.name,
            size: variant.size
          }}
          dictionary={dictionary.forms}
        />
      </div>
    </>
  );
}
