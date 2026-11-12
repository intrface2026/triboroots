"use client";

import type { Locale } from "@/lib/i18n";

interface LanguageSliderProps {
  locale: Locale;
  onChange: (nextLocale: Locale) => void;
  ariaLabel?: string;
}

/**
 * Smooth GPU-composited sliding EN / हिं toggle capsule with fixed dimensions.
 */
export function LanguageSlider({
  locale,
  onChange,
  ariaLabel = "Switch language",
}: LanguageSliderProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="relative inline-flex h-8 w-[78px] shrink-0 items-center overflow-hidden rounded-full border border-[#d86a34]/40 bg-[#f0e9d7]/90 p-[3px] shadow-[0_2px_10px_rgba(44,29,20,0.08)] backdrop-blur-sm select-none sm:h-9 sm:w-[88px]"
    >
      <div className="relative grid h-full w-full grid-cols-2 items-center">
        {/* Sliding Terracotta Pill Thumb */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 bottom-0 left-0 w-1/2 rounded-full bg-[#d86a34] shadow-[0_2px_7px_rgba(184,82,34,0.36),inset_0_1px_0_rgba(248,243,230,0.28)] transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1.18,0.36,1)] will-change-transform motion-reduce:transition-none ${
            locale === "hi" ? "translate-x-full" : "translate-x-0"
          }`}
        />

        <button
          type="button"
          onClick={() => onChange("en")}
          aria-pressed={locale === "en"}
          className={`font-display relative z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-full text-[11px] font-semibold tracking-wider leading-none transition-[color,transform] duration-300 ease-out active:scale-95 sm:text-xs ${
            locale === "en"
              ? "scale-100 text-[#f0e9d7]"
              : "scale-[0.95] text-[#2c1d14]/80 hover:text-[#d86a34]"
          }`}
        >
          EN
        </button>

        <button
          type="button"
          onClick={() => onChange("hi")}
          aria-pressed={locale === "hi"}
          className={`font-display relative z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-full text-[11px] font-semibold tracking-wide leading-none transition-[color,transform] duration-300 ease-out active:scale-95 sm:text-xs ${
            locale === "hi"
              ? "scale-100 text-[#f0e9d7]"
              : "scale-[0.95] text-[#2c1d14]/80 hover:text-[#d86a34]"
          }`}
        >
          हिं
        </button>
      </div>
    </div>
  );
}
