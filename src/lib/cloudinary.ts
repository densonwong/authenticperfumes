import crypto from "node:crypto";

export type CloudinaryFolderKey = "catalog" | "trust-media" | "banners";

const folderMap: Record<CloudinaryFolderKey, string> = {
  catalog: "authenticperfumes/catalog",
  "trust-media": "authenticperfumes/trust-media",
  banners: "authenticperfumes/banners"
};

export function cloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  };
}

export function hasCloudinaryConfig() {
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig();

  return Boolean(cloudName && apiKey && apiSecret);
}

export function resolveCloudinaryFolder(value: string | null) {
  if (value === "trust-media" || value === "banners") {
    return folderMap[value];
  }

  return folderMap.catalog;
}

export function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== "" && value !== undefined && value !== null)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}
