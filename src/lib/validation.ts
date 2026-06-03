import { z } from "zod";

export const fragranceRequestSchema = z.object({
  productName: z.string().min(2),
  brandName: z.string().min(2),
  size: z.string().min(1),
  customerName: z.string().min(2),
  contact: z.string().min(6)
});

export const stockNotificationSchema = z.object({
  productId: z.string().min(1),
  productSlug: z.string().optional(),
  variantId: z.string().optional(),
  customerName: z.string().min(2),
  contact: z.string().min(6)
});
