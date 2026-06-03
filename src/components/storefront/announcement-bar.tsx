const ANNOUNCEMENT_TEXT =
  "100% original niche & designer fragrances - Ready Stock and Pre Order available across Indonesia";

export function AnnouncementBar() {
  return (
    <div className="border-b border-ink/10 bg-ink px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-paper sm:text-xs">
      {ANNOUNCEMENT_TEXT}
    </div>
  );
}
