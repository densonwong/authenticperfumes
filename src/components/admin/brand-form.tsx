"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CloudinaryUpload, type CloudinaryUploadValue } from "@/components/admin/cloudinary-upload";
import { slugify } from "@/lib/slugs";
import type { Brand } from "@/lib/types";

export function BrandForm({ brand }: { brand?: Brand | null }) {
  const router = useRouter();
  const [name, setName] = useState(brand?.name ?? "");
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl ?? "");
  const [country, setCountry] = useState(brand?.country ?? "");
  const [foundedYear, setFoundedYear] = useState(brand?.foundedYear?.toString() ?? "");
  const [description, setDescription] = useState(brand?.description ?? "");
  const [featured, setFeatured] = useState(brand?.featured ?? false);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleUpload(upload: CloudinaryUploadValue) {
    setLogoUrl(upload.secure_url);
  }

  async function saveBrand() {
    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(brand ? `/api/brands/${brand.id}` : "/api/brands", {
        method: brand ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          logoUrl,
          country,
          foundedYear: foundedYear ? Number(foundedYear) : null,
          description,
          featured
        })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error ?? "Brand save failed.");
      }

      setMessage(`Saved ${name || "brand"}.`);
      router.refresh();
      if (!brand && payload.id) {
        router.push(`/admin/brands/${payload.id}`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Brand save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteBrand() {
    if (!brand) return;

    const confirmed = window.confirm(`Delete ${brand.name}? This cannot be undone.`);
    if (!confirmed) return;

    setMessage("");
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/brands/${brand.id}`, {
        method: "DELETE"
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error ?? "Brand delete failed.");
      }

      router.push("/admin/brands");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Brand delete failed.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void saveBrand();
      }}
    >
      {message ? <div className="border border-stone/30 bg-warm p-3 text-sm">{message}</div> : null}
      <section className="grid gap-3 border border-stone/30 bg-white p-4 md:grid-cols-2">
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
          <input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} className="border-stone/40 text-sm" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Country</span>
          <input value={country} onChange={(event) => setCountry(event.target.value)} className="border-stone/40 text-sm" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Founded</span>
          <input
            type="number"
            value={foundedYear}
            onChange={(event) => setFoundedYear(event.target.value)}
            className="border-stone/40 text-sm"
          />
        </label>
        <div className="md:col-span-2">
          <CloudinaryUpload
            label="Brand logo"
            helperText="Drop the brand logo or representative image here. It uploads to Cloudinary automatically."
            value={logoUrl ? { secure_url: logoUrl, public_id: "", resource_type: "image", width: 0, height: 0 } : null}
            onUploaded={handleUpload}
          />
        </div>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="border-stone/40 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
            className="border-stone/40"
          />
          Featured brand
        </label>
      </section>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSaving || isDeleting}
          className="inline-flex h-10 items-center gap-2 border border-ink bg-ink px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving" : brand ? "Update brand" : "Save brand"}
        </button>
        {brand ? (
          <button
            type="button"
            onClick={() => void deleteBrand()}
            disabled={isSaving || isDeleting}
            className="inline-flex h-10 items-center gap-2 border border-red-300 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting" : "Delete brand"}
          </button>
        ) : null}
      </div>
    </form>
  );
}
