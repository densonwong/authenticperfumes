"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import type { Dictionary } from "@/lib/i18n";
import { stockNotificationSchema } from "@/lib/validation";

const failureMessage = "Submission failed. Please try again or contact us via WhatsApp.";

type StockNotificationValues = z.infer<typeof stockNotificationSchema>;

type NotifyMeFormProps = {
  productId: string;
  productSlug: string;
  variantId?: string;
  dictionary: Dictionary["forms"];
};

export function NotifyMeForm({ productId, productSlug, variantId, dictionary }: NotifyMeFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<StockNotificationValues>({
    resolver: zodResolver(stockNotificationSchema),
    defaultValues: {
      productId,
      productSlug,
      variantId,
      customerName: "",
      contact: ""
    }
  });

  async function onSubmit(values: StockNotificationValues) {
    setMessage(null);

    try {
      const response = await fetch("/api/stock-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setMessageType("success");
      setMessage(dictionary.notifySuccess);
      reset({ productId, productSlug, variantId, customerName: "", contact: "" });
    } catch {
      setMessageType("error");
      setMessage(dictionary.requestError ?? failureMessage);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-ink/10 bg-warm/45 p-4">
      <input type="hidden" {...register("productId")} />
      <input type="hidden" {...register("productSlug")} />
      <input type="hidden" {...register("variantId")} />
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
          {dictionary.notifyEyebrow}
        </p>
        <h2 className="mt-2 font-serif text-2xl text-ink">{dictionary.notifyTitle}</h2>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          {dictionary.name}
          <input
            {...register("customerName")}
            className="mt-2 w-full border-ink/15 bg-paper text-sm focus:border-gold focus:ring-gold"
          />
          {errors.customerName ? (
            <span className="mt-1 block text-xs font-normal text-red-700">{dictionary.nameError}</span>
          ) : null}
        </label>
        <label className="block text-sm font-semibold text-ink">
          {dictionary.contact}
          <input
            {...register("contact")}
            className="mt-2 w-full border-ink/15 bg-paper text-sm focus:border-gold focus:ring-gold"
          />
          {errors.contact ? (
            <span className="mt-1 block text-xs font-normal text-red-700">{dictionary.contactError}</span>
          ) : null}
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex w-full justify-center border border-ink bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? dictionary.submitting : dictionary.saveNotification}
      </button>

      {message ? (
        <p
          className={`mt-4 text-sm font-semibold ${
            messageType === "success" ? "text-ink" : "text-red-700"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
