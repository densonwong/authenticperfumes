"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomSelect } from "@/components/admin/custom-select";

type StatusSelectProps<TStatus extends string> = {
  id: string;
  endpoint: string;
  value: TStatus;
  options: TStatus[];
};

export function StatusSelect<TStatus extends string>({
  id,
  endpoint,
  value,
  options
}: StatusSelectProps<TStatus>) {
  const router = useRouter();
  const [status, setStatus] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  async function updateStatus(nextStatus: TStatus) {
    setStatus(nextStatus);
    setIsSaving(true);

    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Status update failed.");
      }

      router.refresh();
    } catch {
      setStatus(value);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <CustomSelect
      value={status}
      disabled={isSaving}
      onChange={(nextStatus) => void updateStatus(nextStatus)}
      options={options.map((item) => ({
        value: item,
        label: item.replaceAll("_", " ")
      }))}
      ariaLabel="Update status"
      className="min-w-36"
    />
  );
}
