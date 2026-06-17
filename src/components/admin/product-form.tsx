"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CloudinaryUpload, type CloudinaryUploadValue } from "@/components/admin/cloudinary-upload";
import { CustomSelect } from "@/components/admin/custom-select";
import { slugify } from "@/lib/slugs";
import type { Brand, Gender, Product, ProductStatus, ProductVariant } from "@/lib/types";

type ProductFormProps = {
  brands: Brand[];
  product?: Product | null;
};

const statuses: ProductStatus[] = ["ready_stock", "limited_stock", "pre_order", "out_of_stock"];
const genders: Gender[] = ["unisex", "men", "women"];
const concentrations = [
  "Extrait de Parfum",
  "Eau de Parfum",
  "Parfum",
  "Eau de Toilette",
  "Eau de Cologne",
  "Hair Mist",
  "Body Mist"
];
const variantSizes = ["100ml", "75ml", "70ml", "50ml", "35ml", "30ml", "25ml", "10ml", "5ml"];

function uniqueOptions(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

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
  const router = useRouter();
  const [brandId, setBrandId] = useState(product?.brandId ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(product?.slug));
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [galleryUrls, setGalleryUrls] = useState(product?.galleryUrls ?? []);
  const [gender, setGender] = useState<Gender>(product?.gender ?? "unisex");
  const [concentration, setConcentration] = useState(product?.concentration ?? "Eau de Parfum");
  const [concentrationOptions, setConcentrationOptions] = useState(() =>
    uniqueOptions([...concentrations, product?.concentration ?? ""])
  );
  const [newConcentrationOption, setNewConcentrationOption] = useState("");
  const [notes, setNotes] = useState(product?.notes.join(", ") ?? "");
  const [countryOfOrigin, setCountryOfOrigin] = useState(product?.countryOfOrigin ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "ready_stock");
  const [bestSeller, setBestSeller] = useState(product?.bestSeller ?? false);
  const [newArrival, setNewArrival] = useState(product?.newArrival ?? false);
  const [readyStock, setReadyStock] = useState(product?.readyStock ?? true);
  const [preOrder, setPreOrder] = useState(product?.preOrder ?? false);
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants ?? [emptyVariant()]);
  const [variantSizeOptions, setVariantSizeOptions] = useState(() =>
    uniqueOptions([...variantSizes, ...(product?.variants ?? []).map((variant) => variant.size)])
  );
  const [newVariantSizeOption, setNewVariantSizeOption] = useState("");
  const [isAddingVariantSize, setIsAddingVariantSize] = useState(false);
  const [askPriceVariantIds, setAskPriceVariantIds] = useState(
    () => new Set((product?.variants ?? []).filter((variant) => variant.authenticPrice <= 0).map((variant) => variant.id))
  );
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const selectedBrand = useMemo(
    () => brands.find((brand) => brand.id === brandId) ?? null,
    [brandId, brands]
  );
  const generatedSlug = useMemo(
    () => slugify([selectedBrand?.name, name].filter(Boolean).join(" ")),
    [name, selectedBrand?.name]
  );

  useEffect(() => {
    if (!slugEdited) {
      setSlug(generatedSlug);
    }
  }, [generatedSlug, slugEdited]);

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

  async function saveProduct() {
    setMessage("");

    if (!validateForPublish()) {
      setMessage("Fix the validation items before publishing this product.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId,
          name,
          slug,
          imageUrl,
          galleryUrls,
          gender,
          concentration,
          notes: notes
            .split(",")
            .map((note) => note.trim())
            .filter(Boolean),
          countryOfOrigin,
          description,
          status,
          bestSeller,
          newArrival,
          readyStock,
          preOrder,
          variants
        })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error ?? "Product save failed.");
      }

      setMessage(`Saved ${selectedBrand?.name ?? "selected brand"} ${name}.`);
      router.refresh();
      if (!product && payload.id) {
        router.push(`/admin/products/${payload.id}`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Product save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProduct() {
    if (!product) return;
    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error ?? "Product delete failed.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Product delete failed.");
    } finally {
      setIsSaving(false);
    }
  }

  function updateVariant(index: number, updates: Partial<ProductVariant>) {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, ...updates } : variant
      )
    );
  }

  function addConcentrationOption() {
    const nextOption = newConcentrationOption.trim();
    if (!nextOption) return;

    setConcentrationOptions((current) => uniqueOptions([...current, nextOption]));
    setConcentration(nextOption);
    setNewConcentrationOption("");
  }

  function addVariantSizeOption() {
    const nextOption = newVariantSizeOption.trim();
    if (!nextOption) return;

    setVariantSizeOptions((current) => uniqueOptions([...current, nextOption]));
    setNewVariantSizeOption("");
    setIsAddingVariantSize(false);
  }

  function setAskPrice(variant: ProductVariant, enabled: boolean) {
    setAskPriceVariantIds((current) => {
      const next = new Set(current);
      if (enabled) {
        next.add(variant.id);
      } else {
        next.delete(variant.id);
      }
      return next;
    });
    updateVariant(
      variants.findIndex((item) => item.id === variant.id),
      { authenticPrice: enabled ? 0 : variant.authenticPrice }
    );
  }

  function handleUpload(upload: CloudinaryUploadValue) {
    setImageUrl(upload.secure_url);
    setGalleryUrls((current) =>
      current.includes(upload.secure_url) ? current : [upload.secure_url, ...current]
    );
  }

  function handleGalleryUpload(upload: CloudinaryUploadValue) {
    setGalleryUrls((current) =>
      current.includes(upload.secure_url) ? current : [...current, upload.secure_url]
    );
    if (!imageUrl) {
      setImageUrl(upload.secure_url);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void saveProduct();
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
          <CustomSelect
            value={brandId}
            onChange={(nextBrandId) => {
              setBrandId(nextBrandId);
              if (!slugEdited) {
                const nextBrand = brands.find((brand) => brand.id === nextBrandId);
                setSlug(slugify([nextBrand?.name, name].filter(Boolean).join(" ")));
              }
            }}
            placeholder="Select brand"
            options={[
              { value: "", label: "Select brand" },
              ...brands.map((brand) => ({ value: brand.id, label: brand.name }))
            ]}
            ariaLabel="Product brand"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Name</span>
          <div className="flex border border-stone/40 bg-white focus-within:ring-1 focus-within:ring-ink">
            {selectedBrand ? (
              <span className="flex shrink-0 items-center border-r border-stone/30 bg-warm px-3 text-sm text-stone">
                {selectedBrand.name}
              </span>
            ) : null}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="min-w-0 flex-1 border-0 text-sm focus:ring-0"
              placeholder={selectedBrand ? "Guidance" : "Select brand first"}
            />
          </div>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Slug</span>
          <input
            value={slug}
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(slugify(event.target.value));
            }}
            className="border-stone/40 text-sm"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Status</span>
          <CustomSelect
            value={status}
            onChange={setStatus}
            options={statuses.map((item) => ({
              value: item,
              label: item.replaceAll("_", " ")
            }))}
            ariaLabel="Product status"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Gender</span>
          <CustomSelect
            value={gender}
            onChange={setGender}
            options={genders.map((item) => ({ value: item, label: item }))}
            ariaLabel="Product gender"
          />
        </label>
        <div className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Concentration</span>
          <CustomSelect
            value={concentration}
            onChange={setConcentration}
            options={concentrationOptions.map((item) => ({ value: item, label: item }))}
            ariaLabel="Product concentration"
          />
          <div className="mt-1 flex gap-2">
            <input
              value={newConcentrationOption}
              onChange={(event) => setNewConcentrationOption(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addConcentrationOption();
                }
              }}
              className="min-w-0 flex-1 border-stone/40 text-sm"
              placeholder="Add concentration"
            />
            <button
              type="button"
              onClick={addConcentrationOption}
              className="shrink-0 border border-stone/40 px-3 font-caps text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-warm"
            >
              Add
            </button>
          </div>
        </div>
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

      <section className="grid gap-4 border border-stone/30 bg-white p-4 lg:grid-cols-[360px_1fr]">
        <CloudinaryUpload
          label="Primary image"
          helperText="Drop the main product photo here. It uploads to Cloudinary automatically."
          value={imageUrl ? {
            secure_url: imageUrl,
            public_id: "",
            resource_type: "image",
            width: 0,
            height: 0
          } : null}
          onUploaded={handleUpload}
        />
        <div className="space-y-3">
          <CloudinaryUpload
            label="Gallery image"
            helperText="Drop another angle or packaging photo to add it to the gallery."
            value={null}
            onUploaded={handleGalleryUpload}
          />
          {galleryUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {galleryUrls.map((url) => (
                <div key={url} className="group relative overflow-hidden border border-stone/30 bg-warm">
                  <img src={url} alt="" className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryUrls((current) => current.filter((item) => item !== url));
                      if (imageUrl === url) {
                        setImageUrl(galleryUrls.find((item) => item !== url) ?? "");
                      }
                    }}
                    className="absolute right-2 top-2 border border-white/70 bg-ink/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-stone/30 bg-warm/60 p-4 text-sm text-stone">
              Uploaded product images will appear here as previews.
            </div>
          )}
        </div>
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
            Add variant
          </button>
        </div>
        <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_1fr_40px] gap-3 border-b border-stone/20 bg-warm/60 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone md:grid">
          <span>Size</span>
          <span>Retail price</span>
          <span>Authentic price</span>
          <span>Stock</span>
          <span>Status</span>
          <span />
        </div>
        <div className="divide-y divide-stone/20">
          {variants.map((variant, index) => (
            <div key={variant.id} className="grid gap-3 p-4 md:grid-cols-[1.15fr_1fr_1fr_1fr_1fr_40px] md:items-start">
              <label className="grid gap-1 text-sm">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone md:hidden">Size</span>
                <CustomSelect
                  value={variant.size}
                  onChange={(nextSize) => updateVariant(index, { size: nextSize })}
                  ariaLabel="Variant size"
                  options={uniqueOptions([...variantSizeOptions, variant.size]).map((size) => ({
                    value: size,
                    label: size
                  }))}
                />
                {isAddingVariantSize ? (
                  <div className="flex gap-2">
                    <input
                      value={newVariantSizeOption}
                      onChange={(event) => setNewVariantSizeOption(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addVariantSizeOption();
                        }
                      }}
                      className="h-9 min-w-0 flex-1 border-stone/40 text-sm"
                      placeholder="15ml"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={addVariantSizeOption}
                      className="h-9 shrink-0 border border-stone/40 px-3 font-caps text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-warm"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingVariantSize(true)}
                    className="h-8 w-fit font-caps text-[11px] font-semibold uppercase tracking-[0.12em] text-gold underline underline-offset-4 hover:text-ink"
                  >
                    + Add size
                  </button>
                )}
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone md:hidden">Retail price</span>
                <input
                  type="number"
                  value={variant.retailPrice}
                  onChange={(event) => updateVariant(index, { retailPrice: Number(event.target.value) })}
                  className="h-10 border-stone/40 text-sm"
                  aria-label="Retail price"
                  placeholder="4800000"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone md:hidden">Authentic price</span>
                <div className="grid gap-2">
                  <input
                    type="number"
                    value={variant.authenticPrice}
                    disabled={askPriceVariantIds.has(variant.id)}
                    onChange={(event) => updateVariant(index, { authenticPrice: Number(event.target.value) })}
                    className="h-10 border-stone/40 text-sm disabled:bg-warm disabled:text-stone"
                    aria-label="Authentic price"
                    placeholder="3950000"
                  />
                  <label className="flex h-9 items-center gap-2 text-xs text-stone">
                    <input
                      type="checkbox"
                      checked={askPriceVariantIds.has(variant.id)}
                      onChange={(event) => setAskPrice(variant, event.target.checked)}
                      className="border-stone/40"
                    />
                    Ask Price
                  </label>
                </div>
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone md:hidden">Stock</span>
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(event) => updateVariant(index, { stock: Number(event.target.value) })}
                  className="h-10 border-stone/40 text-sm"
                  aria-label="Stock"
                  placeholder="4"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone md:hidden">Status</span>
                <CustomSelect
                  value={variant.status}
                  onChange={(nextStatus) => updateVariant(index, { status: nextStatus })}
                  ariaLabel="Variant status"
                  options={statuses.map((item) => ({
                    value: item,
                    label: item.replaceAll("_", " ")
                  }))}
                />
              </label>
              <div className="flex md:pt-0">
                <button
                  type="button"
                  className="h-10 w-10 border border-stone/40 text-stone hover:bg-warm hover:text-ink"
                  onClick={() => {
                    setAskPriceVariantIds((current) => {
                      const next = new Set(current);
                      next.delete(variant.id);
                      return next;
                    });
                    setVariants((current) => current.filter((_, variantIndex) => variantIndex !== index));
                  }}
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

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-10 items-center gap-2 border border-ink bg-ink px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving" : "Save product"}
        </button>
        {product ? (
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void deleteProduct()}
            className="inline-flex h-10 items-center gap-2 border border-red-300 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            Delete product
          </button>
        ) : null}
        {product ? (
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center gap-2 border border-stone/40 px-4 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-warm"
          >
            <Plus className="h-4 w-4" />
            Add more product
          </Link>
        ) : null}
      </div>
    </form>
  );
}
