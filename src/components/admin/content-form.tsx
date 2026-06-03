"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CloudinaryUpload, type CloudinaryUploadValue } from "@/components/admin/cloudinary-upload";
import type { Banner, Testimonial } from "@/lib/types";

type ContentFormProps =
  | { type: "banner"; item?: Banner | null }
  | { type: "testimonial"; item?: Testimonial | null };

export function ContentForm(props: ContentFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (props.type === "banner") {
    return (
      <BannerForm
        item={props.item}
        message={message}
        setMessage={setMessage}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        refresh={() => router.refresh()}
      />
    );
  }

  return (
    <TestimonialForm
      item={props.item}
      message={message}
      setMessage={setMessage}
      isSaving={isSaving}
      setIsSaving={setIsSaving}
      refresh={() => router.refresh()}
    />
  );
}

function Message({ value }: { value: string }) {
  return value ? <div className="border border-stone/30 bg-warm p-3 text-sm">{value}</div> : null;
}

function SaveButton({ isSaving }: { isSaving: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSaving}
      className="inline-flex h-10 items-center gap-2 border border-ink bg-ink px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Save className="h-4 w-4" />
      {isSaving ? "Saving" : "Save"}
    </button>
  );
}

function DeleteButton({ isSaving, onDelete }: { isSaving: boolean; onDelete: () => void }) {
  return (
    <button
      type="button"
      disabled={isSaving}
      onClick={onDelete}
      className="inline-flex h-10 items-center gap-2 border border-red-300 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </button>
  );
}

function BannerForm({
  item,
  message,
  setMessage,
  isSaving,
  setIsSaving,
  refresh
}: {
  item?: Banner | null;
  message: string;
  setMessage: (message: string) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  refresh: () => void;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [subtitle, setSubtitle] = useState(item?.subtitle ?? "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [href, setHref] = useState(item?.href ?? "/shop");
  const [position, setPosition] = useState<Banner["position"]>(item?.position ?? "primary");

  async function saveBanner() {
    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(item ? `/api/banners/${item.id}` : "/api/banners", {
        method: item ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, imageUrl, href, position })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error ?? "Banner save failed.");
      }

      setMessage(`Saved banner: ${title || "Untitled"}.`);
      refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Banner save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteBanner() {
    if (!item) return;
    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/banners/${item.id}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error ?? "Banner delete failed.");
      }

      setMessage(`Deleted banner: ${title || "Untitled"}.`);
      refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Banner delete failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void saveBanner();
      }}
    >
      <Message value={message} />
      <section className="grid gap-3 border border-stone/30 bg-white p-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="border-stone/40 text-sm" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Position</span>
          <select
            value={position}
            onChange={(event) => setPosition(event.target.value as Banner["position"])}
            className="border-stone/40 text-sm"
          >
            <option value="primary">primary</option>
            <option value="secondary">secondary</option>
            <option value="tertiary">tertiary</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Subtitle</span>
          <textarea value={subtitle} onChange={(event) => setSubtitle(event.target.value)} rows={3} className="border-stone/40 text-sm" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Link</span>
          <input value={href} onChange={(event) => setHref(event.target.value)} className="border-stone/40 text-sm" />
        </label>
        <div className="md:col-span-2">
          <CloudinaryUpload
            label="Banner image"
            helperText="Drop a homepage banner image here. It uploads to Cloudinary automatically."
            folder="banners"
            value={imageUrl ? { secure_url: imageUrl, public_id: "", resource_type: "image", width: 0, height: 0 } : null}
            onUploaded={(upload: CloudinaryUploadValue) => setImageUrl(upload.secure_url)}
          />
        </div>
      </section>
      <div className="flex flex-wrap gap-3">
        <SaveButton isSaving={isSaving} />
        {item ? <DeleteButton isSaving={isSaving} onDelete={() => void deleteBanner()} /> : null}
      </div>
    </form>
  );
}

function TestimonialForm({
  item,
  message,
  setMessage,
  isSaving,
  setIsSaving,
  refresh
}: {
  item?: Testimonial | null;
  message: string;
  setMessage: (message: string) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  refresh: () => void;
}) {
  const [customerName, setCustomerName] = useState(item?.customerName ?? "");
  const [quote, setQuote] = useState(item?.quote ?? "");
  const [productName, setProductName] = useState(item?.productName ?? "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");

  async function saveTestimonial() {
    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(item ? `/api/testimonials/${item.id}` : "/api/testimonials", {
        method: item ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, quote, productName, imageUrl })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error ?? "Testimonial save failed.");
      }

      setMessage(`Saved testimonial: ${customerName || "Customer"}.`);
      refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Testimonial save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteTestimonial() {
    if (!item) return;
    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/testimonials/${item.id}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error ?? "Testimonial delete failed.");
      }

      setMessage(`Deleted testimonial: ${customerName || "Customer"}.`);
      refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Testimonial delete failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void saveTestimonial();
      }}
    >
      <Message value={message} />
      <section className="grid gap-3 border border-stone/30 bg-white p-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Customer</span>
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="border-stone/40 text-sm" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Product</span>
          <input value={productName} onChange={(event) => setProductName(event.target.value)} className="border-stone/40 text-sm" />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Quote</span>
          <textarea value={quote} onChange={(event) => setQuote(event.target.value)} rows={4} className="border-stone/40 text-sm" />
        </label>
        <div className="md:col-span-2">
          <CloudinaryUpload
            label="Customer image"
            helperText="Drop a testimonial or chat screenshot here. It uploads to Cloudinary automatically."
            value={imageUrl ? { secure_url: imageUrl, public_id: "", resource_type: "image", width: 0, height: 0 } : null}
            onUploaded={(upload) => setImageUrl(upload.secure_url)}
          />
        </div>
      </section>
      <div className="flex flex-wrap gap-3">
        <SaveButton isSaving={isSaving} />
        {item ? (
          <DeleteButton isSaving={isSaving} onDelete={() => void deleteTestimonial()} />
        ) : null}
      </div>
    </form>
  );
}
