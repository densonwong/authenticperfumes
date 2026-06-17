"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type CustomSelectOption<TValue extends string = string> = {
  value: TValue;
  label: string;
};

type CustomSelectProps<TValue extends string = string> = {
  value: TValue;
  options: Array<CustomSelectOption<TValue>>;
  onChange: (value: TValue) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
};

export function CustomSelect<TValue extends string = string>({
  value,
  options,
  onChange,
  placeholder = "Select",
  disabled = false,
  ariaLabel,
  className = "",
  searchable = false,
  searchPlaceholder = "Search"
}: CustomSelectProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => {
          setIsOpen((current) => !current);
          setQuery("");
        }}
        className="flex h-10 w-full min-w-0 items-center justify-between gap-3 border border-ink/15 bg-paper px-3 text-left font-caps text-sm font-semibold tracking-[0.02em] text-ink transition hover:border-gold/70 hover:bg-warm focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15 disabled:cursor-not-allowed disabled:border-stone/40 disabled:bg-warm disabled:text-ink/40"
      >
        <span className="min-w-0 flex-1 truncate">
          {selectedOption?.label ?? placeholder}
        </span>
        <span className="flex h-6 w-7 shrink-0 items-center justify-center border-l border-ink/10 text-gold">
          <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
        </span>
      </button>

      {isOpen ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto border border-ink/20 bg-ink p-1 text-paper shadow-[0_18px_45px_rgba(17,17,17,0.22)]"
        >
          {searchable ? (
            <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-paper/10 bg-ink p-2">
              <Search className="h-4 w-4 shrink-0 text-gold" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-9 min-w-0 flex-1 border border-paper/15 bg-paper/10 px-2 font-caps text-sm font-semibold text-paper placeholder:text-paper/45 focus:border-gold focus:outline-none focus:ring-0"
                placeholder={searchPlaceholder}
                autoFocus
              />
            </div>
          ) : null}
          {filteredOptions.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex min-h-9 w-full items-center gap-2 px-3 py-2 text-left font-caps text-sm font-semibold transition ${
                  selected
                    ? "bg-paper/20 text-white"
                    : "text-paper/86 hover:bg-paper/12 hover:text-white"
                }`}
              >
                <Check className={`h-4 w-4 shrink-0 text-gold ${selected ? "opacity-100" : "opacity-0"}`} />
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
              </button>
            );
          })}
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-3 font-caps text-sm font-semibold text-paper/55">
              No results
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
