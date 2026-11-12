"use client";

import React, { useEffect, useRef, useState } from "react";
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
import PlateMenu from "@/components/PlateMenu";
import { WaterRippleImage } from "@/components/ui/water-ripple-image";
import {
  HERO_COPY,
  type Locale,
  type MenuItemCopy,
  type MenuSectionId,
} from "@/lib/i18n";

// Curated hostel & lifestyle imagery for the tile backsides
const TILE_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80", // hostel dorm
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", // bar & social
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80", // pool / chill
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", // cozy lounge
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80", // drinks & friends
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80", // bunk beds
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80", // cocktail bar
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80", // rooftop evening
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80", // boutique room
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80", // courtyard
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80", // travelers hanging out
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // scenic river
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
          // Autoplay blocked until first user interaction
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

  // Toggle flip on click (especially useful for touch/mobile devices)
  const toggleTile = (index: number) => {
    setActiveFlipped((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#f0e9d7] select-none font-sans">
      <audio
        ref={audioRef}
        src="/audio/ambient.mp3"
        loop
        preload="auto"
        onPlay={() => setIsMuted(false)}
        onPause={() => setIsMuted(true)}
      />
      <audio ref={chaloAudioRef} src="/audio/chalo.mp3" preload="auto" />
      {/* 1. TOP HEADER / APP BAR */}
      <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-5 sm:px-7 py-4 pointer-events-none">
        {/* Prominent Backpack Brand Mark */}
        <div className="pointer-events-auto relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-2xl bg-[#d86a34] ring-2 ring-[#f0e9d7]/85 shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:scale-105">
          <Image
            src={brandMark}
            alt="TriboRoots backpack logo"
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3">
          {/* Bilingual Switch: English / Hindi */}
          <div
            role="group"
            aria-label={t.switchLanguageLabel}
            className="flex h-9 items-center rounded-full bg-[#f0e9d7]/90 backdrop-blur-sm border border-[#d86a34]/40 p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              aria-pressed={locale === "en"}
              className={`font-display h-full px-3 rounded-full text-xs font-semibold tracking-wider transition cursor-pointer ${
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
              className={`font-display h-full px-3 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer ${
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0e9d7]/90 backdrop-blur-sm border border-[#d86a34]/40 text-[#2c1d14] hover:bg-[#d86a34] hover:text-[#f0e9d7] hover:border-[#d86a34] transition cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            className="font-display flex h-9 px-5 items-center justify-center rounded-full bg-[#2c1d14] border border-[#2c1d14] text-sm font-semibold text-[#f0e9d7] tracking-wide hover:bg-[#d86a34] hover:border-[#d86a34] hover:text-[#f0e9d7] transition cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          >
            {t.menu}
          </button>
        </div>
      </header>

      {/* 2. INTERACTIVE FLIPPING GRID (4 Columns x 3 Rows) */}
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-6 md:grid-rows-3 h-full w-full">
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
              onMouseEnter={() => setHoveredTile(index)}
              onMouseLeave={() =>
                setHoveredTile((prev) => (prev === index ? null : prev))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleTile(index);
                }
              }}
              className={`group relative h-full w-full border-[0.5px] border-[#d86a34]/25 [perspective:1000px] cursor-pointer focus:outline-none ${
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
                <div className="absolute inset-0 bg-[#f0e9d7]/95 [backface-visibility:hidden] overflow-hidden shadow-[inset_0_1px_0_rgba(248,243,230,0.8),inset_0_-1px_0_rgba(216,106,52,0.1)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f7f2e4]/65 via-transparent to-[#d86a34]/[0.06]" />
                  <WaterRippleImage
                    src="/textures/tile-cream.png"
                    blueish={0.08}
                    scale={6}
                    illumination={0.28}
                    surfaceDistortion={0.055}
                    waterDistortion={0.03}
                    fullBleed
                    active={isHovered && !isFlipped}
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isHovered && !isFlipped ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#f0e9d7]/60" />
                </div>

                {/* Back Side (Revealed Photo on click + Hover Water Ripple + Glass Glaze) */}
                <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden shadow-[inset_0_1px_1px_rgba(240,233,215,0.45),inset_0_-1px_1px_rgba(44,29,20,0.22)]">
                  <Image
                    src={imgUrl}
                    alt={t.photoAlt(index + 1)}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <WaterRippleImage
                    src={imgUrl}
                    blueish={0.18}
                    scale={6}
                    illumination={0.14}
                    surfaceDistortion={0.04}
                    waterDistortion={0.025}
                    fullBleed
                    active={isFlipped}
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isFlipped ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {/* Warm terracotta-espresso mood tint */}
                  <div className="pointer-events-none absolute inset-0 bg-[#d86a34]/15 mix-blend-multiply" />
                  <div className="pointer-events-none absolute inset-0 bg-[#2c1d14]/12" />
                  {/* Subtle glass specular sheen & inner beveled border */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#f0e9d7]/25 via-[#f0e9d7]/[0.04] to-[#2c1d14]/18 backdrop-blur-[0.5px]" />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#f0e9d7]/35" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. CENTER BRAND LOGO (Pointer events none so tiles underneath receive cursor) */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6">
        <div className="relative flex items-center justify-center">
          <Image
            src={heroLogo}
            alt={t.logoAlt}
            preload={true}
            sizes="(max-width: 640px) 280px, (max-width: 768px) 380px, 540px"
            className="w-[270px] sm:w-[390px] md:w-[500px] lg:w-[560px] h-auto object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
          />
        </div>
      </div>

      {/* 4. FLOATING / SLIDING BOOKING NAVBAR */}
      <aside
        className={`fixed bottom-6 right-0 z-50 flex items-center transition-transform duration-500 ease-in-out ${
          isNavOpen ? "translate-x-0 pr-4 sm:pr-6" : "translate-x-[calc(100%-48px)]"
        }`}
        onMouseEnter={() => setIsNavOpen(true)}
      >
        {/* Slide Handle / Toggle Arrow */}
        <button
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label={isNavOpen ? t.hideBooking : t.showBooking}
          className="flex h-12 w-12 items-center justify-center bg-[#d86a34] text-[#f0e9d7] rounded-l-md shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:bg-[#b85222] transition active:scale-95 cursor-pointer"
        >
          {isNavOpen ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>

        {/* Main Booking Bar Content */}
        <div className="flex flex-wrap md:flex-nowrap items-stretch shadow-[0_8px_22px_rgba(0,0,0,0.12)] overflow-hidden rounded-r-md border border-[#d86a34]/25">
          {/* Quick Book Tag */}
          <div className="font-hand hidden sm:flex items-center gap-2 bg-[#d86a34] px-4 text-base font-bold tracking-wide text-[#f0e9d7] border-r border-[#f0e9d7]/25 whitespace-nowrap">
            <span>{t.book}</span>
            <div className="w-5 h-5 rounded-full border border-[#f0e9d7]/80 flex items-center justify-center">
              <ArrowRight size={11} className="stroke-[2.5]" />
            </div>
          </div>

          {/* Dates Input Trigger */}
          <button
            type="button"
            className="flex items-center gap-2.5 sm:gap-3 bg-[#f0e9d7] px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wide text-[#2c1d14] hover:bg-[#e6ddc7] transition border-r border-dashed border-[#d86a34]/35 cursor-pointer whitespace-nowrap"
          >
            <span>{t.checkIn}</span>
            <ArrowRight size={14} className="stroke-[2.5] text-[#d86a34]" />
            <span>{t.checkOut}</span>
          </button>

          {/* Guests Selector */}
          <button
            type="button"
            className="bg-[#f0e9d7] px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wide text-[#2c1d14] hover:bg-[#e6ddc7] transition cursor-pointer whitespace-nowrap"
          >
            {t.guests}
          </button>

          {/* Submit "Go!" Button */}
          <button
            type="button"
            onClick={handleGoClick}
            className="font-display bg-[#2c1d14] px-5 sm:px-6 py-3.5 text-base sm:text-lg font-bold tracking-wide text-[#f0e9d7] hover:bg-[#b85222] hover:text-[#f0e9d7] active:scale-95 transition cursor-pointer whitespace-nowrap"
          >
            {t.go}
          </button>
        </div>
      </aside>

      {/* 5. FALLING PLATE MENU OVERLAY */}
      {isMenuOpen && (
        <PlateMenu
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
