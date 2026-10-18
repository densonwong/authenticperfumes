import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { runInContext, type Context } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";
import { landingContent } from "../src/app/(campaign)/konsultasi-parfum/landing-content";

const require = createRequire(import.meta.url);
// The runtime dependency has no project-local @types/jsdom dependency.
const { JSDOM } = require("jsdom") as {
  JSDOM: new (html: string, options: Record<string, unknown>) => {
    window: Window & typeof globalThis;
    getInternalVMContext(): Context;
  };
};
const source = readFileSync(
  path.join(process.cwd(), "public/landing/konsultasi-parfum/consultation.js"),
  "utf8",
);
const expectedCtas = [
  ["hero_consultation", "hero", "rekomendasi"],
  ["hero_catalog", "hero", "katalog"],
  ["solution_recommendation", "solusi", "rekomendasi"],
  ["solution_rare", "solusi", "rare"],
  ["solution_installments", "solusi", "cicilan"],
  ["testimonial_availability", "testimoni", "incaran"],
  ["faq_catalog", "faq", "katalog"],
  ["closing_availability", "penutup", "incaran"],
  ["footer_catalog", "footer", "katalog"],
  ["footer_whatsapp", "footer", "konsultasi"],
  ["floating_whatsapp", "floating", "konsultasi"],
] as const;
const openedWindows: Array<Window & typeof globalThis> = [];

function harness(trackerMode: "working" | "missing" | "throwing" = "working") {
  // outside-only executes the checked-in script explicitly; no resource loader
  // is enabled, so Meta scripts, image beacons and WhatsApp are never fetched.
  const dom = new JSDOM(landingContent, {
    url: "https://www.authenticperfumes8.com/konsultasi-parfum?fbclid=PRIVATE_CLICK_ID&email=private%40example.test",
    runScripts: "outside-only",
  });
  const { window } = dom;
  openedWindows.push(window);
  const tracker = vi.fn((..._args: unknown[]) => {
    if (trackerMode === "throwing") throw new Error("Tracker unavailable");
  });
  const open = vi.fn();
  const matchMedia = vi.fn(() => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const observer = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  };
  Object.assign(window, { open, matchMedia, IntersectionObserver: observer });
  if (trackerMode !== "missing") Object.assign(window, { fbq: tracker });
  const evaluate = () => runInContext(source, dom.getInternalVMContext());
  evaluate();

  // Suppress JSDOM navigation only after all document tracking handlers ran.
  // Capture whether the application itself prevented a normal link activation.
  const preventedBeforeNavigationGuard: boolean[] = [];
  for (const eventName of ["click", "auxclick"]) {
    window.addEventListener(eventName, (event) => {
      preventedBeforeNavigationGuard.push(event.defaultPrevented);
      event.preventDefault();
    });
  }
  const document = window.document;
  const form = document.querySelector<HTMLFormElement>("#consult-form")!;
  const link = (cta: string) => document.querySelector<HTMLAnchorElement>(`a[data-wa-cta="${cta}"]`)!;
  function click(target: Element, options: MouseEventInit = {}, type = "click", prevented = false) {
    const event = new window.MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      button: 0,
      ...options,
    });
    if (prevented) event.preventDefault();
    target.dispatchEvent(event);
  }
  function setIntent(intent: string) {
    form.querySelector<HTMLInputElement>(`input[name="intent"][value="${intent}"]`)!.checked = true;
  }
  function submit() {
    form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  }
  return { dom, window, document, form, tracker, open, evaluate, link, click, setIntent, submit, preventedBeforeNavigationGuard };
}

function expectedEvent(name: string, ctaId: string, placement: string, intent: string, method = "link") {
  return ["trackCustom", name, {
    page: "konsultasi-parfum",
    cta_id: ctaId,
    placement,
    intent,
    method,
  }];
}

afterEach(() => {
  openedWindows.splice(0).forEach((window) => window.close());
});

describe("consultation action tracking", () => {
  it("assigns unique static IDs to all 11 active WhatsApp anchors", () => {
    const { document } = harness();
    const activeWaLinks = [...document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]')]
      .filter((link) => !link.closest("noscript"));
    expect(activeWaLinks).toHaveLength(11);
    expect(activeWaLinks.map((link) => link.dataset.waCta).sort())
      .toEqual(expectedCtas.map(([id]) => id).sort());
  });

  it.each(expectedCtas)("tracks %s once with its fixed placement and intent", (id, placement, intent) => {
    const { click, link, tracker, preventedBeforeNavigationGuard } = harness();
    click(link(id));
    expect(tracker.mock.calls).toEqual([expectedEvent("WhatsAppClick", id, placement, intent)]);
    expect(preventedBeforeNavigationGuard).toEqual([false]);
  });

  it("handles nested SVG targets, keyboard activation, Ctrl-click and middle-click once each", () => {
    const { window, click, link, tracker } = harness();
    const anchor = link("hero_consultation");
    const svgPath = anchor.querySelector("svg path")!;
    expect(svgPath).not.toBeNull();
    click(svgPath, { detail: 1 });
    click(anchor, { detail: 0 });
    click(anchor, { ctrlKey: true, detail: 1 });
    click(anchor, { metaKey: true, detail: 1 });
    click(anchor, { button: 1 }, "auxclick");
    expect(tracker.mock.calls).toHaveLength(5);
    for (const call of tracker.mock.calls) {
      expect(call).toEqual(expectedEvent("WhatsAppClick", "hero_consultation", "hero", "rekomendasi"));
    }
    expect(window.document.querySelector("#consult-form")).not.toBeNull();
  });

  it("ignores right-clicks, nonprimary click events and activations already prevented", () => {
    const { click, link, tracker } = harness();
    const anchor = link("hero_consultation");
    click(anchor, { button: 2 }, "auxclick");
    click(anchor, { button: 2 });
    click(anchor, { button: 1 });
    click(anchor, {}, "click", true);
    click(anchor, { button: 1 }, "auxclick", true);
    expect(tracker).not.toHaveBeenCalled();
  });

  it("ignores unknown IDs and links no longer targeting the configured WhatsApp destination", () => {
    const { document, click, link, tracker } = harness();
    const anchor = link("hero_consultation");
    anchor.dataset.waCta = "untrusted_dynamic_value";
    click(anchor);
    anchor.dataset.waCta = "hero_consultation";
    for (const href of ["https://wa.me/123456", "https://example.test/6282310001899", "javascript:void(0)"]) {
      anchor.href = href;
      click(anchor);
    }
    click(document.querySelector('a[href^="https://www.instagram.com/"]') ?? document.body);
    expect(tracker).not.toHaveBeenCalled();
  });

  it.each([
    ["rekomendasi", "Halo AuthenticPerfumes8, saya ingin dibantu memilih parfum."],
    ["incaran", "Halo AuthenticPerfumes8, saya ingin cek harga dan ketersediaan parfum."],
    ["rare", "Halo AuthenticPerfumes8, saya ingin menanyakan ketersediaan atau pengadaan parfum rare."],
  ])("keeps the encoded WhatsApp message and sends one start/submit/click for %s", (intent, opening) => {
    const h = harness();
    h.setIntent(intent);
    const values = {
      preference: "Private perfume / + &? 香水",
      occasion: "50 ml & extrait",
      notes: "private@example.test\nNomor 08123456789 <private>",
    };
    for (const [id, value] of Object.entries(values)) {
      const input = h.document.getElementById(id) as HTMLInputElement;
      input.value = `  ${value}  `;
      input.dispatchEvent(new h.window.Event("input", { bubbles: true }));
      input.dispatchEvent(new h.window.Event("change", { bubbles: true }));
    }
    h.submit();
    expect(h.open).toHaveBeenCalledExactlyOnceWith(
      "https://wa.me/6282310001899?text=" + encodeURIComponent([
        opening,
        `Nama parfum: ${values.preference}`,
        `Ukuran/varian: ${values.occasion}`,
        `Catatan: ${values.notes}`,
        "(LG)",
      ].join("\n")),
      "_blank",
      "noopener,noreferrer",
    );
    expect(h.tracker.mock.calls).toEqual([
      expectedEvent("ConsultationFormStart", "consultation_form", "form", intent, "form"),
      expectedEvent("ConsultationFormSubmit", "consultation_form", "form", intent, "form"),
      expectedEvent("WhatsAppClick", "consultation_form", "form", intent, "form"),
    ]);
    const payloads = JSON.stringify(h.tracker.mock.calls);
    for (const privateValue of [...Object.values(values), "PRIVATE_CLICK_ID", "private@example.test", "wa.me", "08123456789"]) {
      expect(payloads).not.toContain(privateValue);
    }
    expect(payloads).not.toContain('"Lead"');
    expect(payloads).not.toContain('"Purchase"');
  });

  it("tracks form start once even when an untouched optional form is submitted directly", () => {
    const h = harness();
    h.submit();
    h.submit();
    expect(h.tracker.mock.calls.map((call) => call[1])).toEqual([
      "ConsultationFormStart", "ConsultationFormSubmit", "WhatsAppClick",
      "ConsultationFormSubmit", "WhatsAppClick",
    ]);
    expect(h.open).toHaveBeenCalledTimes(2);
  });

  it("does not open WhatsApp or emit submission events for an invalid form", () => {
    const h = harness();
    h.document.querySelector<HTMLInputElement>("#preference")!.required = true;
    h.submit();
    expect(h.open).not.toHaveBeenCalled();
    expect(h.tracker).not.toHaveBeenCalled();
  });

  it("does not duplicate link or form handlers when the script executes twice", () => {
    const h = harness();
    h.evaluate();
    h.click(h.link("hero_catalog"));
    h.submit();
    expect(h.tracker.mock.calls).toEqual([
      expectedEvent("WhatsAppClick", "hero_catalog", "hero", "katalog"),
      expectedEvent("ConsultationFormStart", "consultation_form", "form", "rekomendasi", "form"),
      expectedEvent("ConsultationFormSubmit", "consultation_form", "form", "rekomendasi", "form"),
      expectedEvent("WhatsAppClick", "consultation_form", "form", "rekomendasi", "form"),
    ]);
    expect(h.open).toHaveBeenCalledTimes(1);
  });

  it("initializes a fresh form after client navigation while keeping delegated link tracking singular", () => {
    const h = harness();
    h.click(h.link("hero_catalog"));
    h.document.body.innerHTML = landingContent;
    const runtime = h.window as unknown as { initializeFragranceConsultation(): void };
    runtime.initializeFragranceConsultation();
    runtime.initializeFragranceConsultation();
    const freshForm = h.document.querySelector<HTMLFormElement>("#consult-form")!;
    freshForm.querySelector<HTMLInputElement>('input[value="rare"]')!.checked = true;
    freshForm.dispatchEvent(new h.window.Event("submit", { bubbles: true, cancelable: true }));
    h.click(h.link("hero_catalog"));
    expect(h.open).toHaveBeenCalledTimes(1);
    expect(h.tracker.mock.calls).toEqual([
      expectedEvent("WhatsAppClick", "hero_catalog", "hero", "katalog"),
      expectedEvent("ConsultationFormStart", "consultation_form", "form", "rare", "form"),
      expectedEvent("ConsultationFormSubmit", "consultation_form", "form", "rare", "form"),
      expectedEvent("WhatsAppClick", "consultation_form", "form", "rare", "form"),
      expectedEvent("WhatsAppClick", "hero_catalog", "hero", "katalog"),
    ]);
  });

  it("flushes pre-Pixel actions once on readiness without stopping WhatsApp", () => {
    const h = harness("missing");
    h.click(h.link("hero_catalog"));
    h.submit();
    expect(h.open).toHaveBeenCalledTimes(1);
    expect(h.preventedBeforeNavigationGuard).toEqual([false]);
    expect(h.tracker).not.toHaveBeenCalled();
    Object.assign(h.window, { fbq: h.tracker });
    h.window.dispatchEvent(new h.window.Event("consultation-pixel-ready"));
    expect(h.tracker.mock.calls.map((call) => call[1])).toEqual([
      "WhatsAppClick", "ConsultationFormStart", "ConsultationFormSubmit", "WhatsAppClick",
    ]);
    h.window.dispatchEvent(new h.window.Event("consultation-pixel-ready"));
    expect(h.tracker).toHaveBeenCalledTimes(4);
  });

  it("bounds the delayed event queue at 20 and does not replay flushed entries", () => {
    const h = harness("missing");
    for (let index = 0; index < 25; index += 1) h.click(h.link("hero_catalog"));
    Object.assign(h.window, { fbq: h.tracker });
    h.window.dispatchEvent(new h.window.Event("consultation-pixel-ready"));
    expect(h.tracker).toHaveBeenCalledTimes(20);
    h.window.dispatchEvent(new h.window.Event("consultation-pixel-ready"));
    h.click(h.link("footer_catalog"));
    expect(h.tracker).toHaveBeenCalledTimes(21);
  });

  it("preserves normal links and form handoff when fbq throws", () => {
    const h = harness("throwing");
    h.click(h.link("hero_consultation"));
    expect(h.preventedBeforeNavigationGuard).toEqual([false]);
    h.submit();
    expect(h.open).toHaveBeenCalledTimes(1);
    expect(h.open.mock.calls[0][0]).toMatch(/^https:\/\/wa\.me\/6282310001899\?text=/);
    expect(h.tracker).toHaveBeenCalledTimes(4);
  });

  it("uses only allowlisted aggregate parameters and never claims a Lead or Purchase", () => {
    const h = harness();
    for (const [id] of expectedCtas) h.click(h.link(id));
    h.submit();
    for (const [command, name, parameters] of h.tracker.mock.calls) {
      expect(command).toBe("trackCustom");
      expect(["WhatsAppClick", "ConsultationFormStart", "ConsultationFormSubmit"]).toContain(name);
      expect(Object.keys(parameters as object).sort()).toEqual(["cta_id", "intent", "method", "page", "placement"]);
    }
    expect(JSON.stringify(h.tracker.mock.calls)).not.toMatch(/PRIVATE_CLICK_ID|private@|wa\.me|fbclid|"Lead"|"Purchase"/);
  });
});
