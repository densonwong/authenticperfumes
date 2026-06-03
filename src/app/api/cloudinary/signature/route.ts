import { NextResponse } from "next/server";
import {
  cloudinaryConfig,
  hasCloudinaryConfig,
  resolveCloudinaryFolder,
  signCloudinaryParams
} from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await requireAdmin();

  if (!hasCloudinaryConfig()) {
    return NextResponse.json(
      { error: "Cloudinary credentials are not configured.", configured: false },
      { status: 503 }
    );
  }

  const { cloudName, apiKey, apiSecret } = cloudinaryConfig();
  const { searchParams } = new URL(request.url);
  const folder = resolveCloudinaryFolder(searchParams.get("folder"));
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signCloudinaryParams({ folder, timestamp }, apiSecret as string);

  return NextResponse.json({
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder
  });
}
