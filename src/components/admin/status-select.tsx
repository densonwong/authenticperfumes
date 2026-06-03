"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <select
      value={status}
      disabled={isSaving}
      onChange={(event) => void updateStatus(event.target.value as TStatus)}
      className="min-w-36 border-stone/40 text-sm disabled:cursor-not-allowed disabled:opacity-60"
    >
      {options.map((item) => (
        <option key={item} value={item}>
          {item.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  );
}
