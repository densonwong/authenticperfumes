import { StrictMode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { render } from "@testing-library/react";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";
import FragranceConsultationPage from "../src/app/(campaign)/konsultasi-parfum/page";

describe("consultation Meta Pixel", () => {
  it("initializes the supplied Pixel once and queues one PageView across remounts", () => {
    const markup = new DOMParser().parseFromString(
      renderToStaticMarkup(<FragranceConsultationPage />),
      "text/html",
    );
    const beacon = markup.querySelector<HTMLImageElement>(
      'noscript img[src^="https://www.facebook.com/tr"]',
    );
    expect(beacon).not.toBeNull();
    const beaconUrl = new URL(beacon!.getAttribute("src")!);
    expect(beaconUrl.searchParams.get("id")).toBe("28899681473026029");
    expect(beaconUrl.searchParams.get("ev")).toBe("PageView");
    expect(beaconUrl.searchParams.get("noscript")).toBe("1");

    const first = render(
      <StrictMode>
        <FragranceConsultationPage />
      </StrictMode>,
    );
    const pixelScript = document.querySelector<HTMLScriptElement>(
      "script#consultation-meta-pixel",
    );
    expect(pixelScript).not.toBeNull();
    expect(pixelScript!.getAttribute("data-nscript")).toBe("afterInteractive");

    // A detached document verifies the bootstrap without fetching Meta scripts.
    const pixelDocument = document.implementation.createHTMLDocument();
    pixelDocument.body.appendChild(pixelDocument.createElement("script"));
    const ready = vi.fn(() => true);
    const sandbox: {
      document: Document;
      Event: typeof Event;
      dispatchEvent: typeof ready;
      window?: unknown;
      fbq?: { queue: ArrayLike<unknown>[] };
    } = { document: pixelDocument, Event, dispatchEvent: ready };
    sandbox.window = sandbox;
    runInNewContext(pixelScript!.textContent!, sandbox);

    expect(pixelDocument.querySelectorAll(
      'script[src="https://connect.facebook.net/en_US/fbevents.js"]',
    )).toHaveLength(1);
    expect(sandbox.fbq!.queue.map((args) => Array.from(args))).toEqual([
      ["init", "28899681473026029"],
      ["track", "PageView"],
    ]);
    expect(ready).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ type: "consultation-pixel-ready" }),
    );

    first.unmount();
    const second = render(<FragranceConsultationPage />);
    expect(document.querySelectorAll("script#consultation-meta-pixel")).toHaveLength(1);
    expect(sandbox.fbq!.queue).toHaveLength(2);
    second.unmount();
  });
});
