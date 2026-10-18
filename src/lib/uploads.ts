import { supabase } from "@/lib/supabase";

export type PortfolioBucket = "portfolio-assets" | "profile-images";

// Mirrors the bucket limits set in the Supabase migration.
const bucketRules: Record<PortfolioBucket, { maxBytes: number; types: string[] }> = {
  "portfolio-assets": { maxBytes: 10 * 1024 * 1024, types: ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"] },
  "profile-images": { maxBytes: 5 * 1024 * 1024, types: ["image/jpeg", "image/png", "image/webp"] },
};

export const acceptFor = (bucket: PortfolioBucket, kind: "image" | "pdf" = "image") =>
  bucketRules[bucket].types.filter(type => (kind === "pdf" ? type === "application/pdf" : type.startsWith("image/"))).join(",");

/** Uploads a file to the bucket root and returns its public URL. */
export async function uploadPortfolioFile(file: File, bucket: PortfolioBucket, prefix: string): Promise<string> {
  const rules = bucketRules[bucket];
  if (!rules.types.includes(file.type)) throw new Error(`This file type is not allowed. Use ${rules.types.map(t => t.split("/")[1].toUpperCase()).join(", ")}.`);
  if (file.size > rules.maxBytes) throw new Error(`File is too large. The limit is ${rules.maxBytes / 1024 / 1024} MB.`);

  const extension = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : file.type.split("/")[1];
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "file";
  const path = `${prefix}-${Date.now()}-${base}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Deletes an old file only when its URL belongs to this project's public bucket. */
export async function deletePortfolioFile(url: string, bucket: PortfolioBucket): Promise<void> {
  if (!url) return;
  const publicBase = supabase.storage.from(bucket).getPublicUrl("").data.publicUrl;
  let base: URL;
  let candidate: URL;
  try {
    base = new URL(publicBase);
    candidate = new URL(url);
  } catch {
    return;
  }
  const prefix = `${base.pathname.replace(/\/$/, "")}/`;
  if (candidate.origin !== base.origin || !candidate.pathname.startsWith(prefix)) return;

  let objectPath: string;
  try {
    objectPath = candidate.pathname.slice(prefix.length).split("/").map(decodeURIComponent).join("/");
  } catch {
    return;
  }
  if (!objectPath) return;
  const { error } = await supabase.storage.from(bucket).remove([objectPath]);
  if (error) throw new Error(error.message);
}

/** Upload a replacement and remove the previous project-owned file. */
export async function replacePortfolioFile(file: File, bucket: PortfolioBucket, prefix: string, previousUrl: string): Promise<string> {
  const nextUrl = await uploadPortfolioFile(file, bucket, prefix);
  try {
    await deletePortfolioFile(previousUrl, bucket);
    return nextUrl;
  } catch (error) {
    try {
      await deletePortfolioFile(nextUrl, bucket);
    } catch {
      // Preserve the original deletion error; the replacement URL is not committed.
    }
    throw error;
  }
}
