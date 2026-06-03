"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { CloudinaryUpload, type CloudinaryUploadValue } from "@/components/admin/cloudinary-upload";
import { slugify } from "@/lib/slugs";
import type { Brand, Gender, Product, ProductStatus, ProductVariant } from "@/lib/types";

type ProductFormProps = {
  brands: Brand[];
  product?: Product | null;
};

const statuses: ProductStatus[] = ["ready_stock", "limited_stock", "pre_order", "out_of_stock"];
const genders: Gender[] = ["unisex", "men", "women"];

function emptyVariant(): ProductVariant {
  return {
    id: `variant-${Date.now()}`,
    size: "100ml",
    retailPrice: 0,
    authenticPrice: 0,
    stock: 0,
    status: "ready_stock"
  };
}

export function ProductForm({ brands, product }: ProductFormProps) {
  const [brandId, setBrandId] = useState(product?.brandId ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [galleryUrls, setGalleryUrls] = useState(product?.galleryUrls ?? []);
  const [gender, setGender] = useState<Gender>(product?.gender ?? "unisex");
  const [concentration, setConcentration] = useState(product?.concentration ?? "Eau de Parfum");
  const [notes, setNotes] = useState(product?.notes.join(", ") ?? "");
  const [countryOfOrigin, setCountryOfOrigin] = useState(product?.countryOfOrigin ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "ready_stock");
  const [bestSeller, setBestSeller] = useState(product?.bestSeller ?? false);
  const [newArrival, setNewArrival] = useState(product?.newArrival ?? false);
  const [readyStock, setReadyStock] = useState(product?.readyStock ?? true);
  const [preOrder, setPreOrder] = useState(product?.preOrder ?? false);
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants ?? [emptyVariant()]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const selectedBrand = useMemo(
    () => brands.find((brand) => brand.id === brandId) ?? null,
    [brandId, brands]
  );

  function validateForPublish() {
    const nextErrors: string[] = [];

    if (!brandId) nextErrors.push("Brand is required.");
    if (!name.trim()) nextErrors.push("Name is required.");
    if (!slug.trim()) nextErrors.push("Slug is required.");
    if (!imageUrl.trim()) nextErrors.push("At least one image is required.");
    if (variants.length === 0) nextErrors.push("Add one or more variants.");

    setErrors(nextErrors);
    return nextErrors.length === 0;
  }

  function savePreview() {
    setMessage("");

    if (!validateForPublish()) {
      setMessage("Fix the validation items before publishing this product.");
      return;
    }

    setMessage(
      `Preview saved for ${selectedBrand?.name ?? "selected brand"} ${name}. API persistence can be wired when the data store is enabled.`
    );
  }

  function updateVariant(index: number, updates: Partial<ProductVariant>) {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, ...updates } : variant
      )
    );
  }

  function handleUpload(upload: CloudinaryUploadValue) {
    setImageUrl(upload.secure_url);
    setGalleryUrls((current) =>
      current.includes(upload.secure_url) ? current : [upload.secure_url, ...current]
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        savePreview();
      }}
    >
      {errors.length > 0 ? (
        <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}
      {message ? <div className="border border-stone/30 bg-warm p-3 text-sm text-ink">{message}</div> : null}

      <section className="grid gap-3 border border-stone/30 bg-white p-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Brand</span>
          <select
            value={brandId}
            onChange={(event) => setBrandId(event.target.value)}
            className="border-stone/40 text-sm"
          >
            <option value="">Select brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Name</span>
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (!slug) setSlug(slugify(event.target.value));
            }}
            className="border-stone/40 text-sm"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Slug</span>
          <input
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
            className="border-stone/40 text-sm"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ProductStatus)}
            className="border-stone/40 text-sm"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Gender</span>
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value as Gender)}
            className="border-stone/40 text-sm"
          >
            {genders.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Concentration</span>
          <input
            value={concentration}
            onChange={(event) => setConcentration(event.target.value)}
            className="border-stone/40 text-sm"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Country</span>
          <input
            value={countryOfOrigin}
            onChange={(event) => setCountryOfOrigin(event.target.value)}
            className="border-stone/40 text-sm"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Notes</span>
          <input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Honey, Tobacco, Lavender"
            className="border-stone/40 text-sm"
          />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="border-stone/40 text-sm"
          />
        </label>
      </section>

      <section className="grid gap-3 border border-stone/30 bg-white p-4 md:grid-cols-[1fr_1fr]">
        <CloudinaryUpload label="Primary image" value={imageUrl ? {
          secure_url: imageUrl,
          public_id: "",
          resource_type: "image",
          width: 0,
          height: 0
        } : null} onUploaded={handleUpload} />
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Image URL</span>
          <input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            className="border-stone/40 text-sm"
          />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Gallery URLs</span>
          <textarea
            value={galleryUrls.join("\n")}
            onChange={(event) => setGalleryUrls(event.target.value.split("\n").filter(Boolean))}
            rows={3}
            className="border-stone/40 text-sm"
          />
        </label>
      </section>

      <section className="border border-stone/30 bg-white">
        <div className="flex items-center justify-between border-b border-stone/30 px-4 py-3">
          <h2 className="text-sm font-semibold">Variants</h2>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-2 border border-stone/40 px-3 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-warm"
            onClick={() => setVariants((current) => [...current, emptyVariant()])}
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
        <div className="divide-y divide-stone/20">
          {variants.map((variant, index) => (
            <div key={variant.id} className="grid gap-3 p-4 md:grid-cols-5">
              <input
                value={variant.size}
                onChange={(event) => updateVariant(index, { size: event.target.value })}
                className="border-stone/40 text-sm"
                aria-label="Variant size"
              />
              <input
                type="number"
                value={variant.retailPrice}
                onChange={(event) => updateVariant(index, { retailPrice: Number(event.target.value) })}
                className="border-stone/40 text-sm"
                aria-label="Retail price"
              />
              <input
                type="number"
                value={variant.authenticPrice}
                onChange={(event) => updateVariant(index, { authenticPrice: Number(event.target.value) })}
                className="border-stone/40 text-sm"
                aria-label="Authentic price"
              />
              <input
                type="number"
                value={variant.stock}
                onChange={(event) => updateVariant(index, { stock: Number(event.target.value) })}
                className="border-stone/40 text-sm"
                aria-label="Stock"
              />
              <div className="flex gap-2">
                <select
                  value={variant.status}
                  onChange={(event) => updateVariant(index, { status: event.target.value as ProductStatus })}
                  className="min-w-0 flex-1 border-stone/40 text-sm"
                  aria-label="Variant status"
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="h-10 w-10 border border-stone/40 text-stone hover:bg-warm hover:text-ink"
                  onClick={() => setVariants((current) => current.filter((_, variantIndex) => variantIndex !== index))}
                  aria-label="Remove variant"
                >
                  <Trash2 className="mx-auto h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 border border-stone/30 bg-white p-4 sm:grid-cols-4">
        {[
          ["Best seller", bestSeller, setBestSeller],
          ["New arrival", newArrival, setNewArrival],
          ["Ready stock", readyStock, setReadyStock],
          ["Pre-order", preOrder, setPreOrder]
        ].map(([label, checked, setter]) => (
          <label key={label as string} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={checked as boolean}
              onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)}
              className="border-stone/40"
            />
            {label as string}
          </label>
        ))}
      </section>

      <button
        type="submit"
        className="inline-flex h-10 items-center gap-2 border border-ink bg-ink px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-ink"
      >
        <Save className="h-4 w-4" />
        Save preview
      </button>
    </form>
  );
}
