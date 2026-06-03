"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { fragranceRequestSchema } from "@/lib/validation";

const successMessage = "Request received. Our team will contact you via WhatsApp.";
const failureMessage = "Submission failed. Please try again or contact us via WhatsApp.";

type FragranceRequestValues = z.infer<typeof fragranceRequestSchema>;

type RequestFragranceFormProps = {
  defaultValues?: Partial<FragranceRequestValues>;
};

export function RequestFragranceForm({ defaultValues }: RequestFragranceFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<FragranceRequestValues>({
    resolver: zodResolver(fragranceRequestSchema),
    defaultValues: {
      productName: defaultValues?.productName ?? "",
      brandName: defaultValues?.brandName ?? "",
      size: defaultValues?.size ?? "",
      customerName: "",
      contact: "",
      ...defaultValues
    }
  });

  async function onSubmit(values: FragranceRequestValues) {
    setMessage(null);

    try {
      const response = await fetch("/api/fragrance-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setMessageType("success");
      setMessage(successMessage);
      reset({
        productName: defaultValues?.productName ?? "",
        brandName: defaultValues?.brandName ?? "",
        size: defaultValues?.size ?? "",
        customerName: "",
        contact: ""
      });
    } catch {
      setMessageType("error");
      setMessage(failureMessage);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-ink/10 bg-warm/45 p-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
          Fragrance request
        </p>
        <h2 className="mt-2 font-serif text-2xl text-ink">Request a perfume</h2>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          Product name
          <input
            {...register("productName")}
            className="mt-2 w-full border-ink/15 bg-paper text-sm focus:border-gold focus:ring-gold"
          />
          {errors.productName ? (
            <span className="mt-1 block text-xs font-normal text-red-700">Enter a product name.</span>
          ) : null}
        </label>
        <label className="block text-sm font-semibold text-ink">
          Brand name
          <input
            {...register("brandName")}
            className="mt-2 w-full border-ink/15 bg-paper text-sm focus:border-gold focus:ring-gold"
          />
          {errors.brandName ? (
            <span className="mt-1 block text-xs font-normal text-red-700">Enter a brand name.</span>
          ) : null}
        </label>
        <label className="block text-sm font-semibold text-ink">
          Size
          <input
            {...register("size")}
            className="mt-2 w-full border-ink/15 bg-paper text-sm focus:border-gold focus:ring-gold"
          />
          {errors.size ? (
            <span className="mt-1 block text-xs font-normal text-red-700">Enter a preferred size.</span>
          ) : null}
        </label>
        <label className="block text-sm font-semibold text-ink">
          Name
          <input
            {...register("customerName")}
            className="mt-2 w-full border-ink/15 bg-paper text-sm focus:border-gold focus:ring-gold"
          />
          {errors.customerName ? (
            <span className="mt-1 block text-xs font-normal text-red-700">Enter your name.</span>
          ) : null}
        </label>
        <label className="block text-sm font-semibold text-ink sm:col-span-2">
          WhatsApp or contact
          <input
            {...register("contact")}
            className="mt-2 w-full border-ink/15 bg-paper text-sm focus:border-gold focus:ring-gold"
          />
          {errors.contact ? (
            <span className="mt-1 block text-xs font-normal text-red-700">Enter a valid contact.</span>
          ) : null}
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex w-full justify-center border border-ink bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Submitting" : "Send request"}
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
