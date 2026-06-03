"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { CloudinaryUpload, type CloudinaryUploadValue } from "@/components/admin/cloudinary-upload";
import { slugify } from "@/lib/slugs";
import type { Brand } from "@/lib/types";

export function BrandForm({ brand }: { brand?: Brand | null }) {
  const [name, setName] = useState(brand?.name ?? "");
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl ?? "");
  const [country, setCountry] = useState(brand?.country ?? "");
  const [foundedYear, setFoundedYear] = useState(brand?.foundedYear?.toString() ?? "");
  const [description, setDescription] = useState(brand?.description ?? "");
  const [featured, setFeatured] = useState(brand?.featured ?? false);
  const [message, setMessage] = useState("");

  function handleUpload(upload: CloudinaryUploadValue) {
    setLogoUrl(upload.secure_url);
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(`Preview saved for ${name || "brand"}.`);
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
            value={logoUrl ? { secure_url: logoUrl, public_id: "", resource_type: "image", width: 0, height: 0 } : null}
            onUploaded={handleUpload}
          />
        </div>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Logo URL</span>
          <input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} className="border-stone/40 text-sm" />
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
