"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import heroLogo from "@/assets/main-herosection-logo.png";
import brandMark from "@/assets/favicon.png";
import { LanguageSlider } from "@/components/ui/language-slider";
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
  const [note, setNote] = useState("");
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
    const trimmedNote = note.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedNote) {
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
          note: trimmedNote,
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

        <LanguageSlider
          locale={locale}
          onChange={setLocale}
          ariaLabel="Language switch"
        />
      </header>

      {/* Centered Minimal Front Stage */}
      <section className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-center px-5 pb-12 text-center sm:px-8">
        <Image
          src={heroLogo}
          alt="TriboRoots Hostel"
          preload
          className="mb-6 h-auto w-[min(70vw,260px)] object-contain drop-shadow-[0_6px_14px_rgba(44,29,20,0.1)] sm:w-[min(48vw,340px)]"
        />

        {/* Subtle hand-drawn trail dash */}
        <svg
          aria-hidden
          viewBox="0 0 180 18"
          className="mb-5 h-4 w-36 text-[#d86a34]/75 sm:w-44"
        >
          <path
            d="M4,10 Q45,2 90,10 T174,8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="5 6"
          />
          <circle cx="174" cy="8" r="3" fill="currentColor" />
        </svg>

        <h1 className="max-w-xl font-display text-2xl leading-[1.15] font-bold tracking-tight text-[#2c1d14] sm:text-4xl">
          {t.headline}
        </h1>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="font-display mt-8 inline-flex cursor-pointer items-center gap-2.5 rounded-full border-2 border-[#2c1d14] bg-[#2c1d14] px-8 py-4 text-base font-bold tracking-wide text-[#f0e9d7] shadow-[0_5px_0_#d86a34] transition-all hover:-translate-y-0.5 hover:border-[#b85222] hover:bg-[#b85222] hover:shadow-[0_7px_0_#2c1d14] active:translate-y-1 active:shadow-[0_1px_0_#d86a34] sm:text-lg"
        >
          <span>{t.ctaButton}</span>
        </button>

        <p className="mt-5 font-hand text-lg font-semibold text-[#b85222]/90">
          {t.handNote}
        </p>
      </section>

      {/* Floating Editorial Guestbook Modal over Live Water-Ripple Background */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="peek-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c1d14]/35 p-4 backdrop-blur-xs sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[28px] border border-[#f0e9d7]/80 bg-[#f0e9d7]/86 p-6 text-[#2c1d14] shadow-[0_32px_70px_-14px_rgba(44,29,20,0.42)] ring-1 ring-[#2c1d14]/15 backdrop-blur-xl sm:p-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label={t.closeModal}
              className="absolute top-5 right-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#2c1d14]/15 bg-[#e6ddc7]/80 text-[#2c1d14] transition hover:bg-[#d86a34] hover:text-[#f0e9d7] active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pr-10">
              <h2
                id="peek-modal-title"
                className="font-display text-2xl font-bold tracking-tight text-[#2c1d14] sm:text-[28px]"
              >
                {t.modalTitle}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#2c1d14]/75">
                {t.modalSubtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="peek-name"
                  className="block text-xs font-semibold text-[#2c1d14]/70"
                >
                  {t.nameLabel}
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
                  className="mt-1 w-full border-b-2 border-[#2c1d14]/20 bg-transparent px-0.5 py-2 text-base text-[#2c1d14] placeholder:text-[#2c1d14]/35 focus:border-[#d86a34] focus:outline-none select-text"
                />
              </div>

              <div>
                <label
                  htmlFor="peek-email"
                  className="block text-xs font-semibold text-[#2c1d14]/70"
                >
                  {t.emailLabel}
                </label>
                <input
                  id="peek-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="mt-1 w-full border-b-2 border-[#2c1d14]/20 bg-transparent px-0.5 py-2 text-base text-[#2c1d14] placeholder:text-[#2c1d14]/35 focus:border-[#d86a34] focus:outline-none select-text"
                />
              </div>

              <div>
                <label
                  htmlFor="peek-phone"
                  className="block text-xs font-semibold text-[#2c1d14]/70"
                >
                  {t.phoneLabel}
                </label>
                <input
                  id="peek-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="mt-1 w-full border-b-2 border-[#2c1d14]/20 bg-transparent px-0.5 py-2 text-base text-[#2c1d14] placeholder:text-[#2c1d14]/35 focus:border-[#d86a34] focus:outline-none select-text"
                />
              </div>

              <div>
                <label
                  htmlFor="peek-note"
                  className="block text-xs font-semibold text-[#2c1d14]/70"
                >
                  {t.noteLabel}
                </label>
                <input
                  id="peek-note"
                  type="text"
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t.notePlaceholder}
                  className="mt-1 w-full border-b-2 border-[#2c1d14]/20 bg-transparent px-0.5 py-2 text-base text-[#2c1d14] placeholder:text-[#2c1d14]/35 focus:border-[#d86a34] focus:outline-none select-text"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-[#b85222]/35 bg-[#d86a34]/12 px-3.5 py-2 text-xs font-semibold text-[#b85222]"
                >
                  {error}
                </p>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-display flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#2c1d14] bg-[#2c1d14] px-6 py-3.5 text-base font-bold tracking-wide text-[#f0e9d7] shadow-[0_4px_0_#d86a34] transition-all hover:-translate-y-0.5 hover:border-[#b85222] hover:bg-[#b85222] hover:shadow-[0_6px_0_#2c1d14] active:translate-y-0.5 active:shadow-[0_1px_0_#d86a34] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t.submitting}</span>
                    </>
                  ) : (
                    <span>{t.submit}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
