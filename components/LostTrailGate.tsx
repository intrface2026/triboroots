"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Compass, Sparkles, ArrowRight, Loader2, Check } from "lucide-react";
import heroLogo from "@/assets/main-herosection-logo.png";
import brandMark from "@/assets/favicon.png";
import { GATE_COPY, type Locale } from "@/lib/i18n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LostTrailGate() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("");
  const [offersOptIn, setOffersOptIn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = GATE_COPY[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      setError(t.requiredError);
      return;
    }

    if (!EMAIL_RE.test(trimmedEmail)) {
      setError(t.emailError);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/peek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          plan: plan || t.planOptions[0],
          offersOptIn,
          locale,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setError(data.error || t.serverError);
        setIsSubmitting(false);
        return;
      }

      router.refresh();
    } catch {
      setError(t.serverError);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden bg-[#f0e9d7] text-[#2c1d14] font-sans select-none">
      {/* Subtle lightweight trail contour & warm glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-[#d86a34]/12 blur-3xl sm:h-[420px] sm:w-[420px]" />
        <div className="absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-[#b85222]/10 blur-3xl sm:h-[420px] sm:w-[420px]" />
        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full opacity-25"
        >
          <path
            d="M-60,640 C160,520 340,680 560,540 C780,400 940,560 1260,340"
            fill="none"
            stroke="#d86a34"
            strokeWidth="2.2"
            strokeDasharray="8 10"
            strokeLinecap="round"
          />
          <path
            d="M-80,220 C180,310 380,140 620,250 C860,360 1020,170 1280,210"
            fill="none"
            stroke="#2c1d14"
            strokeWidth="1.2"
            strokeDasharray="4 8"
            opacity="0.35"
          />
          <circle
            cx="560"
            cy="540"
            r="6"
            fill="#d86a34"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Top Navigation Strip */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#d86a34] ring-2 ring-[#f0e9d7] shadow-md sm:h-12 sm:w-12 sm:rounded-2xl">
            <Image
              src={brandMark}
              alt="TriboRoots backpack emblem"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <Image
            src={heroLogo}
            alt="TriboRoots Hostel"
            preload
            className="h-8 w-auto object-contain sm:h-10"
          />
        </div>

        {/* EN / HI Switch */}
        <div
          role="group"
          aria-label="Language switch"
          className="flex h-8 items-center rounded-full border border-[#d86a34]/40 bg-[#f0e9d7]/90 p-0.5 shadow-xs backdrop-blur-sm sm:h-9"
        >
          <button
            type="button"
            onClick={() => setLocale("en")}
            aria-pressed={locale === "en"}
            className={`font-display h-full cursor-pointer rounded-full px-3 text-xs font-semibold transition ${
              locale === "en"
                ? "bg-[#d86a34] text-[#f0e9d7]"
                : "text-[#2c1d14] hover:text-[#d86a34]"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLocale("hi")}
            aria-pressed={locale === "hi"}
            className={`font-display h-full cursor-pointer rounded-full px-3 text-xs font-semibold transition ${
              locale === "hi"
                ? "bg-[#d86a34] text-[#f0e9d7]"
                : "text-[#2c1d14] hover:text-[#d86a34]"
            }`}
          >
            हिं
          </button>
        </div>
      </header>

      {/* Main Split Content */}
      <section className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 pt-2 pb-12 sm:px-6 md:grid-cols-12 md:gap-10 md:py-10 lg:py-14">
        {/* Left: Story & Lost Trail Vibe */}
        <div className="flex flex-col items-start gap-4 md:col-span-6 lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d86a34]/35 bg-[#e6ddc7]/80 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider text-[#b85222] shadow-xs sm:text-xs">
            <Compass className="h-3.5 w-3.5 animate-spin [animation-duration:10s]" />
            <span>{t.badge}</span>
          </div>

          <h1 className="font-display text-3xl leading-[1.12] font-bold tracking-tight text-[#2c1d14] sm:text-4xl lg:text-5xl">
            {t.headline}
          </h1>

          <p className="font-hand text-xl font-bold text-[#d86a34] sm:text-2xl">
            {t.handNote}
          </p>

          <p className="max-w-xl text-sm leading-relaxed text-[#2c1d14]/80 sm:text-base">
            {t.description}
          </p>

          <div className="mt-1 inline-flex items-center gap-2.5 rounded-2xl border border-[#2c1d14]/12 bg-[#e6ddc7]/70 px-4 py-2.5 text-xs font-semibold text-[#2c1d14] sm:text-sm">
            <Sparkles className="h-4 w-4 shrink-0 text-[#d86a34]" />
            <span>{t.perkTag}</span>
          </div>
        </div>

        {/* Right: Sneak-Peek Access Pass Form */}
        <div className="md:col-span-6 lg:col-span-6">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative rounded-3xl border border-[#2c1d14]/15 bg-[#f7f2e4]/90 p-5 shadow-[0_24px_60px_-15px_rgba(44,29,20,0.22)] backdrop-blur-md sm:p-7"
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="peek-name"
                  className="mb-1.5 block font-mono text-xs font-bold tracking-wider uppercase text-[#2c1d14]/75"
                >
                  {t.nameLabel} *
                </label>
                <input
                  id="peek-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full rounded-xl border border-[#2c1d14]/20 bg-[#f0e9d7] px-3.5 py-2.5 text-sm text-[#2c1d14] placeholder:text-[#2c1d14]/40 focus:border-[#d86a34] focus:ring-2 focus:ring-[#d86a34]/25 focus:outline-none select-text"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="peek-email"
                    className="mb-1.5 block font-mono text-xs font-bold tracking-wider uppercase text-[#2c1d14]/75"
                  >
                    {t.emailLabel} *
                  </label>
                  <input
                    id="peek-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full rounded-xl border border-[#2c1d14]/20 bg-[#f0e9d7] px-3.5 py-2.5 text-sm text-[#2c1d14] placeholder:text-[#2c1d14]/40 focus:border-[#d86a34] focus:ring-2 focus:ring-[#d86a34]/25 focus:outline-none select-text"
                  />
                </div>

                <div>
                  <label
                    htmlFor="peek-phone"
                    className="mb-1.5 block font-mono text-xs font-bold tracking-wider uppercase text-[#2c1d14]/75"
                  >
                    {t.phoneLabel} *
                  </label>
                  <input
                    id="peek-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className="w-full rounded-xl border border-[#2c1d14]/20 bg-[#f0e9d7] px-3.5 py-2.5 text-sm text-[#2c1d14] placeholder:text-[#2c1d14]/40 focus:border-[#d86a34] focus:ring-2 focus:ring-[#d86a34]/25 focus:outline-none select-text"
                  />
                </div>
              </div>

              <div>
                <span className="mb-2 block font-mono text-xs font-bold tracking-wider uppercase text-[#2c1d14]/75">
                  {t.planLabel}
                </span>
                <div className="flex flex-wrap gap-2">
                  {t.planOptions.map((option) => {
                    const active = (plan || t.planOptions[0]) === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setPlan(option)}
                        aria-pressed={active}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          active
                            ? "border-[#d86a34] bg-[#d86a34] text-[#f0e9d7] shadow-xs"
                            : "border-[#2c1d14]/15 bg-[#f0e9d7] text-[#2c1d14]/80 hover:border-[#d86a34]/50"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-[#2c1d14]/10 bg-[#e6ddc7]/60 px-3.5 py-2.5 text-xs leading-snug text-[#2c1d14]/85">
                <input
                  type="checkbox"
                  checked={offersOptIn}
                  onChange={(e) => setOffersOptIn(e.target.checked)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                    offersOptIn
                      ? "border-[#d86a34] bg-[#d86a34] text-[#f0e9d7]"
                      : "border-[#2c1d14]/35 bg-[#f0e9d7]"
                  }`}
                >
                  {offersOptIn && <Check className="h-3 w-3 stroke-[3]" />}
                </span>
                <span>{t.offersOptIn}</span>
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-[#b85222]/40 bg-[#d86a34]/12 px-3.5 py-2 text-xs font-semibold text-[#b85222]"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="font-display flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2c1d14] px-6 py-3.5 text-sm font-bold tracking-wide text-[#f0e9d7] shadow-md transition hover:bg-[#d86a34] active:scale-[0.99] disabled:opacity-60 sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t.submitting}</span>
                  </>
                ) : (
                  <>
                    <span>{t.submit}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-[#2c1d14]/60">
                {t.privacyNote}
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

