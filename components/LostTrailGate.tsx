"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Compass,
  Sparkles,
  ArrowRight,
  Loader2,
  Check,
  X,
} from "lucide-react";
import heroLogo from "@/assets/main-herosection-logo.png";
import brandMark from "@/assets/favicon.png";
import { WaterRippleImage } from "@/components/ui/water-ripple-image";
import { GATE_COPY, type Locale } from "@/lib/i18n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LostTrailGate() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("");
  const [offersOptIn, setOffersOptIn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const t = GATE_COPY[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    const id = requestAnimationFrame(() => nameInputRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(id);
    };
  }, [isModalOpen]);

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
    <main className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-[#f0e9d7] text-[#2c1d14] font-sans select-none">
      {/* Live Subtle Water Ripple Canvas Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <WaterRippleImage
          src="/textures/tile-cream.png"
          blueish={0.06}
          scale={5}
          illumination={0.22}
          surfaceDistortion={0.045}
          waterDistortion={0.025}
          fullBleed
          active
          className="h-full w-full opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0e9d7]/35 via-transparent to-[#d86a34]/[0.07]" />
      </div>

      {/* Minimal Top Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#d86a34] ring-2 ring-[#f0e9d7]/90 shadow-md sm:h-12 sm:w-12 sm:rounded-2xl">
          <Image
            src={brandMark}
            alt="TriboRoots backpack emblem"
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        <div
          role="group"
          aria-label="Language switch"
          className="flex h-8 items-center rounded-full border border-[#d86a34]/40 bg-[#f0e9d7]/85 p-0.5 shadow-xs backdrop-blur-sm sm:h-9"
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

      {/* Centered Minimal Front Stage */}
      <section className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-center px-5 pb-12 text-center sm:px-8">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d86a34]/35 bg-[#f0e9d7]/80 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider text-[#b85222] shadow-xs backdrop-blur-sm sm:text-xs">
          <Compass className="h-3.5 w-3.5 animate-spin [animation-duration:12s]" />
          <span>{t.badge}</span>
        </div>

        <Image
          src={heroLogo}
          alt="TriboRoots Hostel"
          preload
          className="mb-5 h-auto w-[min(68vw,250px)] object-contain drop-shadow-[0_6px_14px_rgba(44,29,20,0.1)] sm:w-[min(48vw,320px)]"
        />

        <h1 className="max-w-xl font-display text-2xl leading-[1.15] font-bold tracking-tight text-[#2c1d14] sm:text-4xl">
          {t.headline}
        </h1>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="font-display mt-7 inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[#2c1d14] px-8 py-4 text-base font-bold tracking-wide text-[#f0e9d7] shadow-[0_16px_34px_-10px_rgba(44,29,20,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#d86a34] active:scale-95 sm:text-lg"
        >
          <span>{t.ctaButton}</span>
        </button>

        <p className="mt-4 font-hand text-lg font-semibold text-[#b85222]/90">
          {t.handNote}
        </p>
      </section>

      {/* Floating Glass Modal Form over Live Water-Ripple Background */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="peek-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c1d14]/35 p-3.5 backdrop-blur-xs sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#f0e9d7]/75 bg-[#f0e9d7]/85 p-5 text-[#2c1d14] shadow-[0_32px_70px_-14px_rgba(44,29,20,0.42)] ring-1 ring-[#2c1d14]/12 backdrop-blur-xl sm:p-7">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label={t.closeModal}
              className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#2c1d14]/15 bg-[#e6ddc7]/80 text-[#2c1d14] transition hover:bg-[#d86a34] hover:text-[#f0e9d7] active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pr-10">
              <div className="mb-1.5 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest uppercase text-[#b85222]">
                <Sparkles className="h-3 w-3" />
                <span>{t.perkTag}</span>
              </div>
              <h2
                id="peek-modal-title"
                className="font-display text-2xl font-bold tracking-tight text-[#2c1d14]"
              >
                {t.modalTitle}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[#2c1d14]/75 sm:text-sm">
                {t.modalSubtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="peek-name"
                  className="mb-1.5 block font-mono text-xs font-bold tracking-wider uppercase text-[#2c1d14]/75"
                >
                  {t.nameLabel} *
                </label>
                <input
                  ref={nameInputRef}
                  id="peek-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full rounded-xl border border-[#2c1d14]/20 bg-[#f7f2e4]/90 px-3.5 py-2.5 text-sm text-[#2c1d14] placeholder:text-[#2c1d14]/40 focus:border-[#d86a34] focus:ring-2 focus:ring-[#d86a34]/25 focus:outline-none select-text"
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
                    className="w-full rounded-xl border border-[#2c1d14]/20 bg-[#f7f2e4]/90 px-3.5 py-2.5 text-sm text-[#2c1d14] placeholder:text-[#2c1d14]/40 focus:border-[#d86a34] focus:ring-2 focus:ring-[#d86a34]/25 focus:outline-none select-text"
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
                    className="w-full rounded-xl border border-[#2c1d14]/20 bg-[#f7f2e4]/90 px-3.5 py-2.5 text-sm text-[#2c1d14] placeholder:text-[#2c1d14]/40 focus:border-[#d86a34] focus:ring-2 focus:ring-[#d86a34]/25 focus:outline-none select-text"
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
                            : "border-[#2c1d14]/15 bg-[#f7f2e4]/80 text-[#2c1d14]/80 hover:border-[#d86a34]/50"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-[#2c1d14]/12 bg-[#e6ddc7]/70 px-3.5 py-2.5 text-xs leading-snug text-[#2c1d14]/85">
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
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
