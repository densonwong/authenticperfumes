import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Marquee } from "@/components/motion/marquee";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { BrandMarquee } from "@/components/storefront/brand-marquee";
import imageLoader from "@/lib/image-loader";
import { dictionaries } from "@/lib/i18n";
import type { Brand } from "@/lib/types";

function logoWallBrand(name: string, slug: string, aspect = 2) {
  const source = brand(name, slug);

  return { brand: source, logoUrl: source.logoUrl, aspect, vector: false };
}

function brand(name: string, slug: string): Brand {
  return {
    id: slug,
    name,
    slug,
    logoUrl: `https://res.cloudinary.com/demo/image/upload/${slug}.png`,
    country: "France",
    foundedYear: null,
    description: "",
    productCount: 3,
    featured: true
  };
}

describe("Marquee", () => {
  it("duplicates its children so the loop is seamless", () => {
    const { container } = render(
      <Marquee>
        <span>Amouage</span>
      </Marquee>
    );

    expect(container.querySelectorAll("span")).toHaveLength(2);
  });

  it("hides the duplicated copy from assistive tech and keyboard focus", () => {
    const { container } = render(
      <Marquee>
        <span>Amouage</span>
      </Marquee>
    );

    const copies = container.querySelectorAll(".marquee-track > div");
    expect(copies).toHaveLength(2);
    expect(copies[0].hasAttribute("aria-hidden")).toBe(false);
    expect(copies[1].getAttribute("aria-hidden")).toBe("true");
    expect(copies[1].hasAttribute("inert")).toBe(true);
  });

  it("applies direction and pause-on-hover hooks used by the CSS animation", () => {
    const { container } = render(
      <Marquee direction="right" pauseOnHover={false}>
        <span>Xerjoff</span>
      </Marquee>
    );

    expect(container.querySelector(".marquee")?.getAttribute("data-pause-on-hover")).toBe("false");
    expect(container.querySelector(".marquee-track")?.getAttribute("data-direction")).toBe("right");
  });
});

describe("AnnouncementBar", () => {
  it("exposes the promo copy once for screen readers", () => {
    const { container } = render(
      <AnnouncementBar items={dictionaries.id.announcementItems} text={dictionaries.id.announcement} />
    );

    expect(container.querySelector(".sr-only")?.textContent).toBe(
      dictionaries.id.announcementItems.join(" - ")
    );
    expect(container.querySelector(".marquee")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("falls back to the single announcement string when no items are given", () => {
    const { container } = render(<AnnouncementBar items={[]} text="100% ORIGINAL" />);

    expect(container.querySelector(".sr-only")?.textContent).toBe("100% ORIGINAL");
  });
});

describe("BrandMarquee", () => {
  it("links each brand logo using the localized path", () => {
    render(
      <BrandMarquee brands={[logoWallBrand("Amouage", "amouage")]} label="Featured houses" locale="id" />
    );

    const link = screen.getAllByRole("link", { name: "Amouage" })[0];
    expect(link.getAttribute("href")).toBe("/id/brands/amouage");
  });

  it("renders each brand as a logo image named after the brand", () => {
    const { container } = render(
      <BrandMarquee brands={[logoWallBrand("Amouage", "amouage")]} label="Featured houses" locale="id" />
    );

    const logo = container.querySelector("img");
    expect(logo?.getAttribute("alt")).toBe("Amouage");
    expect(logo?.className).toContain("grayscale");
  });

  it("repeats a short brand list so the track stays wider than the viewport", () => {
    const { container } = render(
      <BrandMarquee brands={[logoWallBrand("Amouage", "amouage")]} label="Featured houses" locale="en" />
    );

    // 14 filled items, rendered twice by the marquee.
    expect(container.querySelectorAll("a")).toHaveLength(28);
  });

  it("keeps only the first pass of brands focusable", () => {
    const { container } = render(
      <BrandMarquee brands={[logoWallBrand("Amouage", "amouage")]} label="Featured houses" locale="en" />
    );

    const focusable = Array.from(container.querySelectorAll("a")).filter(
      (link) => link.getAttribute("tabindex") !== "-1"
    );
    expect(focusable).toHaveLength(2);
  });

  it("renders nothing without brands", () => {
    const { container } = render(<BrandMarquee brands={[]} label="Featured houses" locale="id" />);

    expect(container.firstChild).toBeNull();
  });
});

describe("cloudinary image loader", () => {
  it("keeps e_trim ahead of the resize so trimmed logos are not upscaled", () => {
    const url = imageLoader({
      src: "https://res.cloudinary.com/demo/image/upload/e_trim/v1/logo.webp",
      width: 400
    });

    expect(url).toBe(
      "https://res.cloudinary.com/demo/image/upload/e_trim/f_auto,q_auto,w_400/v1/logo.webp"
    );
  });

  it("leaves plain catalogue images untouched", () => {
    const url = imageLoader({
      src: "https://res.cloudinary.com/demo/image/upload/v1/bottle.webp",
      width: 256
    });

    expect(url).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_256/v1/bottle.webp"
    );
  });
});
