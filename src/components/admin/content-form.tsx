"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { CloudinaryUpload, type CloudinaryUploadValue } from "@/components/admin/cloudinary-upload";
import { slugify } from "@/lib/slugs";
import type { Banner, DiscoverPost, Testimonial, TrustMedia } from "@/lib/types";

type ContentFormProps =
  | { type: "banner"; item?: Banner | null }
  | { type: "testimonial"; item?: Testimonial | null }
  | { type: "discover"; item?: DiscoverPost | null }
  | { type: "trust-media"; item?: TrustMedia | null };

const trustCategories: TrustMedia["category"][] = [
  "packing_video",
  "shipping_proof",
  "chat_review",
  "story_repost",
  "unboxing",
  "repeat_customer"
];

const discoverCategories: DiscoverPost["category"][] = ["guide", "review", "glossary", "consultation"];

export function ContentForm(props: ContentFormProps) {
  const [message, setMessage] = useState("");

  if (props.type === "banner") {
    return <BannerForm item={props.item} message={message} setMessage={setMessage} />;
  }

  if (props.type === "testimonial") {
    return <TestimonialForm item={props.item} message={message} setMessage={setMessage} />;
  }

  if (props.type === "discover") {
    return <DiscoverForm item={props.item} message={message} setMessage={setMessage} />;
  }

  return <TrustMediaForm item={props.item} message={message} setMessage={setMessage} />;
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
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Image URL</span>
          <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="border-stone/40 text-sm" />
        </label>
        <div className="md:col-span-2">
          <CloudinaryUpload
            label="Banner image"
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
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Image URL</span>
          <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="border-stone/40 text-sm" />
        </label>
        <div className="md:col-span-2">
          <CloudinaryUpload
            label="Customer image"
            value={imageUrl ? { secure_url: imageUrl, public_id: "", resource_type: "image", width: 0, height: 0 } : null}
            onUploaded={(upload) => setImageUrl(upload.secure_url)}
          />
        </div>
      </section>
      <SaveButton />
    </form>
  );
}

function DiscoverForm({
  item,
  message,
  setMessage
}: {
  item?: DiscoverPost | null;
  message: string;
  setMessage: (message: string) => void;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [excerpt, setExcerpt] = useState(item?.excerpt ?? "");
  const [category, setCategory] = useState<DiscoverPost["category"]>(item?.category ?? "guide");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [body, setBody] = useState(item?.body ?? "");
  const [publishedAt, setPublishedAt] = useState(item?.publishedAt.slice(0, 10) ?? new Date().toISOString().slice(0, 10));

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(`Preview saved for article: ${title || "Untitled"}.`);
      }}
    >
      <Message value={message} />
      <section className="grid gap-3 border border-stone/30 bg-white p-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Title</span>
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
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
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as DiscoverPost["category"])} className="border-stone/40 text-sm">
            {discoverCategories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Published</span>
          <input type="date" value={publishedAt} onChange={(event) => setPublishedAt(event.target.value)} className="border-stone/40 text-sm" />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Excerpt</span>
          <textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} className="border-stone/40 text-sm" />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Body</span>
          <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={8} className="border-stone/40 text-sm" />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Image URL</span>
          <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="border-stone/40 text-sm" />
        </label>
        <div className="md:col-span-2">
          <CloudinaryUpload
            label="Article image"
            value={imageUrl ? { secure_url: imageUrl, public_id: "", resource_type: "image", width: 0, height: 0 } : null}
            onUploaded={(upload) => setImageUrl(upload.secure_url)}
          />
        </div>
      </section>
      <SaveButton />
    </form>
  );
}

function TrustMediaForm({
  item,
  message,
  setMessage
}: {
  item?: TrustMedia | null;
  message: string;
  setMessage: (message: string) => void;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [category, setCategory] = useState<TrustMedia["category"]>(item?.category ?? "packing_video");
  const [mediaType, setMediaType] = useState<TrustMedia["mediaType"]>(item?.mediaType ?? "image");
  const [mediaUrl, setMediaUrl] = useState(item?.mediaUrl ?? "");

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(`Preview saved for trust media: ${title || "Untitled"}.`);
      }}
    >
      <Message value={message} />
      <section className="grid gap-3 border border-stone/30 bg-white p-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="border-stone/40 text-sm" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as TrustMedia["category"])} className="border-stone/40 text-sm">
            {trustCategories.map((item) => (
              <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Media type</span>
          <select value={mediaType} onChange={(event) => setMediaType(event.target.value as TrustMedia["mediaType"])} className="border-stone/40 text-sm">
            <option value="image">image</option>
            <option value="video">video</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Media URL</span>
          <input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} className="border-stone/40 text-sm" />
        </label>
        <div className="md:col-span-2">
          <CloudinaryUpload
            label="Trust media"
            folder="trust-media"
            accept="image-video"
            value={mediaUrl ? { secure_url: mediaUrl, public_id: "", resource_type: mediaType, width: 0, height: 0 } : null}
            onUploaded={(upload) => {
              setMediaUrl(upload.secure_url);
              setMediaType(upload.resource_type);
            }}
          />
        </div>
      </section>
      <SaveButton />
    </form>
  );
}
