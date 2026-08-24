import type { CSSProperties, ReactNode } from "react";

const durations = {
  slow: "60s",
  normal: "45s",
  fast: "30s"
} as const;

type MarqueeProps = {
  children: ReactNode;
  speed?: keyof typeof durations;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  /** Marks the whole strip decorative when the readable copy lives elsewhere. */
  "aria-hidden"?: boolean;
};

/**
 * Pure CSS marquee. Content is rendered twice so the track can loop seamlessly
 * at -50%; the second copy is hidden from assistive tech and keyboard focus.
 * Animation is disabled under prefers-reduced-motion (see globals.css), where
 * the track falls back to a horizontally scrollable strip.
 */
export function Marquee({
  children,
  speed = "normal",
  direction = "left",
  pauseOnHover = true,
  className,
  "aria-hidden": ariaHidden
}: MarqueeProps) {
  return (
    <div
      className={`marquee ${className ?? ""}`}
      aria-hidden={ariaHidden}
      data-pause-on-hover={pauseOnHover ? "true" : "false"}
      style={{ "--marquee-duration": durations[speed] } as CSSProperties}
    >
      <div className="marquee-track" data-direction={direction}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
