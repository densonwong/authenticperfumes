"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Upload, Video } from "lucide-react";

export type CloudinaryUploadValue = {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video";
  width: number;
  height: number;
};

type CloudinaryUploadProps = {
  label?: string;
  folder?: "catalog" | "trust-media" | "banners";
  accept?: "image" | "video" | "image-video";
  value?: CloudinaryUploadValue | null;
  onUploaded: (value: CloudinaryUploadValue) => void;
};

type SignatureResponse =
  | {
      timestamp: number;
      signature: string;
      apiKey: string;
      cloudName: string;
      folder: string;
    }
  | {
      error: string;
      configured: false;
    };

function isAllowedFile(file: File, accept: CloudinaryUploadProps["accept"]) {
  if (accept === "image") {
    return file.type.startsWith("image/");
  }

  if (accept === "video") {
    return file.type.startsWith("video/");
  }

  return file.type.startsWith("image/") || file.type.startsWith("video/");
}

export function CloudinaryUpload({
  label = "Upload media",
  folder = "catalog",
  accept = "image",
  value,
  onUploaded
}: CloudinaryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  async function upload(file: File) {
    setError("");
    setStatus("");
    setProgress(0);

    if (!isAllowedFile(file, accept)) {
      setError("Choose an image or video file that matches this field.");
      return;
    }

    setIsUploading(true);
    setStatus("Requesting upload signature");

    try {
      const signatureResponse = await fetch(`/api/cloudinary/signature?folder=${folder}`);
      const signature = (await signatureResponse.json()) as SignatureResponse;

      if (!signatureResponse.ok || "configured" in signature) {
        setError("Cloudinary credentials are not configured. Add env vars before uploading media.");
        setIsUploading(false);
        return;
      }

      const resourceType = file.type.startsWith("video/") ? "video" : "image";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signature.apiKey);
      formData.append("timestamp", String(signature.timestamp));
      formData.append("signature", signature.signature);
      formData.append("folder", signature.folder);

      await new Promise<void>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${signature.cloudName}/${resourceType}/upload`
        );

        request.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        request.onload = () => {
          if (request.status < 200 || request.status >= 300) {
            reject(new Error("Cloudinary upload failed."));
            return;
          }

          const response = JSON.parse(request.responseText) as CloudinaryUploadValue;
          onUploaded({
            secure_url: response.secure_url,
            public_id: response.public_id,
            resource_type: response.resource_type,
            width: response.width,
            height: response.height
          });
          setProgress(100);
          setStatus("Upload ready");
          resolve();
        };

        request.onerror = () => reject(new Error("Cloudinary upload failed."));
        request.send(formData);
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  const Icon = accept === "video" ? Video : ImagePlus;

  return (
    <div className="border border-stone/30 bg-white p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">{label}</p>
          <p className="mt-1 truncate text-sm text-ink">
            {value?.secure_url ?? "No Cloudinary media selected"}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2 border border-ink px-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Select
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept === "image" ? "image/*" : accept === "video" ? "video/*" : "image/*,video/*"}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void upload(file);
          }
          event.currentTarget.value = "";
        }}
      />
      {isUploading ? (
        <div className="mt-3 h-1.5 bg-warm">
          <div className="h-full bg-ink" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      {status ? <p className="mt-2 text-xs text-stone">{status}</p> : null}
      {error ? (
        <div className="mt-3 flex gap-2 border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}
    </div>
  );
}
