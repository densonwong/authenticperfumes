"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { CloudinaryUpload, type CloudinaryUploadValue } from "@/components/admin/cloudinary-upload";
import type { Banner, Testimonial } from "@/lib/types";

type ContentFormProps =
  | { type: "banner"; item?: Banner | null }
  | { type: "testimonial"; item?: Testimonial | null };

export function ContentForm(props: ContentFormProps) {
  const [message, setMessage] = useState("");

  if (props.type === "banner") {
    return <BannerForm item={props.item} message={message} setMessage={setMessage} />;
  }

  return <TestimonialForm item={props.item} message={message} setMessage={setMessage} />;
}

function Message({ value }: { value: string }) {
  return value ? <div className="border border-stone/30 bg-warm p-3 text-sm">{value}</div> : null;
}

function SaveButton() {
  return (
    <button
      type="submit"
      className="inline-flex h-10 items-center gap-2 border border-ink bg-ink px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-ink"
    >
      <Save className="h-4 w-4" />
      Save preview
    </button>
  );
}

function BannerForm({
  item,
  message,
  setMessage
}: {
  item?: Banner | null;
  message: string;
  setMessage: (message: string) => void;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [subtitle, setSubtitle] = useState(item?.subtitle ?? "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [href, setHref] = useState(item?.href ?? "/shop");
  const [position, setPosition] = useState<Banner["position"]>(item?.position ?? "primary");

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(`Preview saved for banner: ${title || "Untitled"}.`);
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
      <SaveButton />
    </form>
  );
}

function TestimonialForm({
  item,
  message,
  setMessage
}: {
  item?: Testimonial | null;
  message: string;
  setMessage: (message: string) => void;
}) {
  const [customerName, setCustomerName] = useState(item?.customerName ?? "");
  const [quote, setQuote] = useState(item?.quote ?? "");
  const [productName, setProductName] = useState(item?.productName ?? "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(`Preview saved for testimonial: ${customerName || "Customer"}.`);
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
      <SaveButton />
    </form>
  );
}
