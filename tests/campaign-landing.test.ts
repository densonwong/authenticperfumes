import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { landingContent } from "../src/app/(campaign)/konsultasi-parfum/landing-content";

const root = process.cwd();
function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(dir, entry.name);
    return entry.isDirectory() ? files(item) : [item];
  });
}

describe("isolated Meta Ads landing page", () => {
  it("is not linked from existing storefront pages or sitemap", () => {
    const existing = [
      ...files(path.join(root, "src/app/(localized)")),
      ...files(path.join(root, "src/components/storefront")),
      path.join(root, "src/app/sitemap.ts"),
    ];
    for (const file of existing) {
      expect(readFileSync(file, "utf8"), file).not.toContain("/konsultasi-parfum");
    }
  });

  it("keeps WA requests, optional fields and all five original stories", () => {
    document.body.innerHTML = landingContent;
    expect(document.querySelectorAll(".solution-card")).toHaveLength(4);
    expect(document.querySelectorAll(".testimonial-card")).toHaveLength(5);
    expect(document.querySelector(".optional-form")?.hasAttribute("open")).toBe(false);
    expect(document.querySelectorAll(".field input, .field textarea")).toHaveLength(3);
    expect(document.querySelector("[name=budget]")).toBeNull();
    const urls = [...document.querySelectorAll<HTMLAnchorElement>("a")].map((a) => a.getAttribute("href")!);
    expect(urls.filter((url) => url.includes("authenticperfumes8.com"))).toHaveLength(0);
    expect(urls.filter((url) => url.startsWith("https://wa.me/"))).not.toHaveLength(0);
    for (const asset of document.querySelectorAll<HTMLImageElement>("img")) {
      expect(readFileSync(path.join(root, "public", asset.getAttribute("src")!))).toBeTruthy();
    }
  });
});
