import { Marquee } from "@/components/motion/marquee";

// Repeated so the track is always wider than the viewport on desktop; the
// readable copy is exposed once via sr-only and the strip itself is decorative.
const REPEATS = 3;

export function AnnouncementBar({ items, text }: { items: string[]; text: string }) {
  const messages = items.length > 0 ? items : [text];

  return (
    <div className="border-b border-ink/10 bg-ink text-[11px] font-medium uppercase tracking-[0.18em] text-paper sm:text-xs">
      <span className="sr-only">{messages.join(" - ")}</span>
      <Marquee speed="slow" className="py-2" aria-hidden>
        {Array.from({ length: REPEATS }).map((_, repeat) =>
          messages.map((message) => (
            <span key={`${repeat}-${message}`} className="flex items-center whitespace-nowrap">
              <span className="px-5">{message}</span>
              <span className="text-gold">&#9670;</span>
            </span>
          ))
        )}
      </Marquee>
    </div>
  );
}
