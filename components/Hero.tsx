"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import heroLogo from "@/assets/main-herosection-logo.png";
import brandMark from "@/assets/favicon.png";
import { WaterRippleImage } from "@/components/ui/water-ripple-image";
import {
  HERO_COPY,
  type Locale,
  type MenuItemCopy,
  type MenuSectionId,
} from "@/lib/i18n";

const BackpackRailMenu = dynamic(
  () => import("@/components/BackpackRailMenu"),
  { ssr: false }
);

// Curated hostel & lifestyle imagery for the tile backsides
const TILE_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=720&q=75", // hostel dorm
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=720&q=75", // bar & social
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=720&q=75", // pool / chill
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=720&q=75", // cozy lounge
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=720&q=75", // drinks & friends
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=720&q=75", // bunk beds
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=720&q=75", // cocktail bar
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=720&q=75", // rooftop evening
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=720&q=75", // boutique room
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=720&q=75", // courtyard
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=720&q=75", // travelers hanging out
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=720&q=75", // scenic river
];

export default function Hero() {
  const [activeFlipped, setActiveFlipped] = useState<number[]>([]);
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<MenuSectionId | null>(
    null
  );
  const [isMuted, setIsMuted] = useState(false);
  const [isSfxEnabled, setIsSfxEnabled] = useState(true);
  const [locale, setLocale] = useState<Locale>("en");
  const audioRef = useRef<HTMLAudioElement>(null);
  const chaloAudioRef = useRef<HTMLAudioElement>(null);
  const muteButtonRef = useRef<HTMLButtonElement>(null);
  const userPausedRef = useRef(false);

  const t = HERO_COPY[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.6;

    const tryPlay = () => {
      if (userPausedRef.current) return;
      audio
        .play()
        .then(() => {
          setIsMuted(false);
        })
        .catch(() => {
          setIsMuted(true);
        });
    };

    tryPlay();

    const handleFirstInteraction = (e: Event) => {
      if (
        muteButtonRef.current &&
        e.target instanceof Node &&
        muteButtonRef.current.contains(e.target)
      ) {
        return;
      }
      if (!userPausedRef.current && audio.paused) {
        tryPlay();
      }
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("pointerdown", handleFirstInteraction, {
      passive: true,
    });
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      userPausedRef.current = false;
      setIsSfxEnabled(true);
      audio
        .play()
        .then(() => setIsMuted(false))
        .catch(() => setIsMuted(true));
    } else {
      userPausedRef.current = true;
      setIsSfxEnabled(false);
      audio.pause();
      setIsMuted(true);
    }
  };

  const handleMenuSelect = (item: MenuItemCopy) => {
    setSelectedSection(item.id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${item.id}`);
    }
  };

  const handleGoClick = () => {
    const ambient = audioRef.current;
    if (ambient) {
      userPausedRef.current = true;
      ambient.pause();
      setIsMuted(true);
    }

    const chalo = chaloAudioRef.current;
    if (chalo) {
      chalo.pause();
      chalo.currentTime = 0;
      void chalo.play().catch(() => {});
    }
  };

  const toggleTile = (index: number) => {
    setActiveFlipped((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const preloadMenu = () => {
    void import("@/components/BackpackRailMenu");
  };

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#f0e9d7] select-none font-sans">
      <audio
        ref={audioRef}
        src="/audio/ambient.mp3"
        loop
        preload="metadata"
        onPlay={() => setIsMuted(false)}
        onPause={() => setIsMuted(true)}
      />
      <audio ref={chaloAudioRef} src="/audio/chalo.mp3" preload="metadata" />

      {/* 1. TOP HEADER / APP BAR */}
      <header className="pointer-events-none absolute top-0 right-0 left-0 z-40 flex items-center justify-between px-3.5 py-3 sm:px-6 sm:py-4 md:px-8">
        {/* Prominent Backpack Brand Mark */}
        <div className="pointer-events-auto relative h-10 w-10 overflow-hidden rounded-xl bg-[#d86a34] ring-2 ring-[#f0e9d7]/85 shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:scale-105 sm:h-12 sm:w-12 sm:rounded-2xl md:h-14 md:w-14">
          <Image
            src={brandMark}
            alt="TriboRoots backpack logo"
            fill
            sizes="(max-width: 640px) 40px, 56px"
            className="object-cover"
          />
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 md:gap-3">
          {/* Bilingual Switch: English / Hindi */}
          <div
            role="group"
            aria-label={t.switchLanguageLabel}
            className="flex h-8 items-center rounded-full border border-[#d86a34]/40 bg-[#f0e9d7]/90 p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:h-9"
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              aria-pressed={locale === "en"}
              className={`font-display h-full cursor-pointer rounded-full px-2.5 text-[11px] font-semibold tracking-wider transition sm:px-3 sm:text-xs ${
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
              className={`font-display h-full cursor-pointer rounded-full px-2.5 text-[11px] font-semibold tracking-wide transition sm:px-3 sm:text-xs ${
                locale === "hi"
                  ? "bg-[#d86a34] text-[#f0e9d7]"
                  : "text-[#2c1d14] hover:text-[#d86a34]"
              }`}
            >
              हिं
            </button>
          </div>

          <button
            ref={muteButtonRef}
            type="button"
            onClick={toggleAudio}
            aria-label={isMuted ? t.unmuteLabel : t.muteLabel}
            aria-pressed={!isMuted}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#d86a34]/40 bg-[#f0e9d7]/90 text-[#2c1d14] shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-sm transition hover:border-[#d86a34] hover:bg-[#d86a34] hover:text-[#f0e9d7] sm:h-9 sm:w-9"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            type="button"
            onMouseEnter={preloadMenu}
            onFocus={preloadMenu}
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            className="font-display flex h-8 cursor-pointer items-center justify-center rounded-full border border-[#2c1d14] bg-[#2c1d14] px-3.5 text-xs font-semibold tracking-wide text-[#f0e9d7] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition hover:border-[#d86a34] hover:bg-[#d86a34] hover:text-[#f0e9d7] sm:h-9 sm:px-5 sm:text-sm"
          >
            {t.menu}
          </button>
        </div>
      </header>

      {/* 2. INTERACTIVE RESPONSIVE FLIPPING GRID */}
      <div className="grid h-full w-full grid-cols-2 grid-rows-6 sm:grid-cols-3 sm:grid-rows-4 md:grid-cols-4 md:grid-rows-3 max-md:landscape:grid-cols-4 max-md:landscape:grid-rows-3">
        {TILE_IMAGES.map((imgUrl, index) => {
          const isFlipped = activeFlipped.includes(index);
          const isHovered = hoveredTile === index;

          return (
            <div
              key={index}
              role="button"
              tabIndex={0}
              aria-pressed={isFlipped}
              aria-label={t.tileLabel(index + 1)}
              onClick={() => toggleTile(index)}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setHoveredTile(index);
              }}
              onPointerLeave={() =>
                setHoveredTile((prev) => (prev === index ? null : prev))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleTile(index);
                }
              }}
              className={`group relative h-full w-full cursor-pointer border-[0.5px] border-[#d86a34]/25 [perspective:1000px] focus:outline-none ${
                isFlipped ? "z-30" : "z-10"
              }`}
            >
              {/* Inner flipper container (flips only on click) */}
              <div
                className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* Front Side (Frosted Warm Cream Glass Tile #f0e9d7 + Hover Water Ripple) */}
                <div className="absolute inset-0 overflow-hidden bg-[#f0e9d7]/95 [backface-visibility:hidden] shadow-[inset_0_1px_0_rgba(248,243,230,0.8),inset_0_-1px_0_rgba(216,106,52,0.1)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f7f2e4]/65 via-transparent to-[#d86a34]/[0.06]" />
                  {isHovered && !isFlipped && (
                    <WaterRippleImage
                      src="/textures/tile-cream.png"
                      blueish={0.08}
                      scale={6}
                      illumination={0.28}
                      surfaceDistortion={0.055}
                      waterDistortion={0.03}
                      fullBleed
                      active
                      className="absolute inset-0"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#f0e9d7]/60" />
                </div>

                {/* Back Side (Revealed Photo on click + Persistent Water Ripple + Glass Glaze) */}
                <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[inset_0_1px_1px_rgba(240,233,215,0.45),inset_0_-1px_1px_rgba(44,29,20,0.22)]">
                  <Image
                    src={imgUrl}
                    alt={t.photoAlt(index + 1)}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  {isFlipped && (
                    <WaterRippleImage
                      src={imgUrl}
                      blueish={0.18}
                      scale={6}
                      illumination={0.14}
                      surfaceDistortion={0.04}
                      waterDistortion={0.025}
                      fullBleed
                      active
                      className="absolute inset-0"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-[#d86a34]/15 mix-blend-multiply" />
                  <div className="pointer-events-none absolute inset-0 bg-[#2c1d14]/12" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#f0e9d7]/25 via-[#f0e9d7]/[0.04] to-[#2c1d14]/18 backdrop-blur-[0.5px]" />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#f0e9d7]/35" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. CENTER BRAND LOGO (Pointer events none so tiles underneath receive cursor) */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
        <Image
          src={heroLogo}
          alt={t.logoAlt}
          preload={true}
          sizes="(max-width: 640px) 74vw, (max-width: 768px) 64vw, (max-width: 1024px) 56vw, 560px"
          className="h-auto max-h-[40dvh] w-[min(74vw,300px)] object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.12)] sm:w-[min(64vw,420px)] md:w-[min(56vw,520px)] lg:w-[min(46vw,560px)]"
        />
      </div>

      {/* 4. RESPONSIVE SLIDING BOOKING NAVBAR */}
      <aside
        className={`fixed right-0 bottom-3 z-40 flex max-w-[calc(100vw-0.5rem)] items-center transition-transform duration-500 ease-in-out sm:bottom-5 md:bottom-6 ${
          isNavOpen
            ? "translate-x-0 pr-2 sm:pr-5 md:pr-6"
            : "translate-x-[calc(100%-40px)] sm:translate-x-[calc(100%-48px)]"
        }`}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setIsNavOpen(true);
        }}
      >
        <button
          type="button"
          onClick={() => setIsNavOpen((prev) => !prev)}
          aria-label={isNavOpen ? t.hideBooking : t.showBooking}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-l-md bg-[#d86a34] text-[#f0e9d7] shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition hover:bg-[#b85222] active:scale-95 sm:h-12 sm:w-12"
        >
          {isNavOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className="flex items-stretch overflow-hidden rounded-r-md border border-[#d86a34]/25 shadow-[0_8px_22px_rgba(0,0,0,0.12)]">
          {/* Quick Book Tag (Desktop & Tablet) */}
          <div className="font-hand hidden items-center gap-2 whitespace-nowrap border-r border-[#f0e9d7]/25 bg-[#d86a34] px-3.5 text-base font-bold tracking-wide text-[#f0e9d7] md:flex lg:px-4">
            <span>{t.book}</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#f0e9d7]/80">
              <ArrowRight size={11} className="stroke-[2.5]" />
            </div>
          </div>

          {/* Dates Input Trigger */}
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap border-r border-dashed border-[#d86a34]/35 bg-[#f0e9d7] px-2.5 py-2.5 text-[11px] font-bold tracking-wide text-[#2c1d14] transition hover:bg-[#e6ddc7] sm:gap-2.5 sm:px-5 sm:py-3.5 sm:text-sm"
          >
            <span>{t.checkIn}</span>
            <ArrowRight size={13} className="stroke-[2.5] text-[#d86a34]" />
            <span>{t.checkOut}</span>
          </button>

          {/* Guests Selector */}
          <button
            type="button"
            className="cursor-pointer whitespace-nowrap bg-[#f0e9d7] px-2.5 py-2.5 text-[11px] font-bold tracking-wide text-[#2c1d14] transition hover:bg-[#e6ddc7] sm:px-5 sm:py-3.5 sm:text-sm"
          >
            {t.guests}
          </button>

          {/* Submit "Go!" Button */}
          <button
            type="button"
            onClick={handleGoClick}
            className="font-display cursor-pointer whitespace-nowrap bg-[#2c1d14] px-3.5 py-2.5 text-sm font-bold tracking-wide text-[#f0e9d7] transition hover:bg-[#b85222] hover:text-[#f0e9d7] active:scale-95 sm:px-6 sm:py-3.5 sm:text-lg"
          >
            {t.go}
          </button>
        </div>
      </aside>

      {/* 5. BACKPACK RAIL MENU OVERLAY */}
      {isMenuOpen && (
        <BackpackRailMenu
          isOpen={isMenuOpen}
          soundEnabled={isSfxEnabled}
          copy={t}
          selectedId={selectedSection}
          onSelect={handleMenuSelect}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
    </main>
  );
}
