export function AnnouncementBar({ text }: { text: string }) {
  return (
    <div className="border-b border-ink/10 bg-ink px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-paper sm:text-xs">
      {text}
    </div>
  );
}
