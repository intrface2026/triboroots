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
import BookingCalendarPopover, {
  formatShortDate,
  type DateFieldMode,
} from "@/components/BookingCalendarPopover";
import { LanguageSlider } from "@/components/ui/language-slider";
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
  const [activeDateField, setActiveDateField] = useState<DateFieldMode | null>(
    null
  );
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState("");
  const [isGuestsHovered, setIsGuestsHovered] = useState(false);
  const [isGuestsFocused, setIsGuestsFocused] = useState(false);
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
  const bookingNavRef = useRef<HTMLElement>(null);
  const userPausedRef = useRef(false);

  const t = HERO_COPY[locale];
  const showGuestInput = isGuestsHovered || isGuestsFocused;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (!activeDateField) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (
        bookingNavRef.current &&
        event.target instanceof Node &&
        !bookingNavRef.current.contains(event.target)
      ) {
        setActiveDateField(null);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [activeDateField]);

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
    setActiveDateField(null);

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

  const toggleDateField = (field: DateFieldMode) => {
    setIsNavOpen(true);
    setActiveDateField((prev) => (prev === field ? null : field));
  };

  const handleGuestsKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const allowedNavKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];
    if (allowedNavKeys.includes(event.key)) return;
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleGuestsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 2);
    setGuests(digitsOnly);
  };

  const handleGuestsBlur = () => {
    setIsGuestsFocused(false);
    if (!guests) return;
    const parsed = Number.parseInt(guests, 10);
    setGuests(Number.isFinite(parsed) && parsed > 0 ? String(parsed) : "");
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
          <LanguageSlider
            locale={locale}
            onChange={setLocale}
            ariaLabel={t.switchLanguageLabel}
          />

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
            className="font-display flex h-8 w-[68px] cursor-pointer items-center justify-center rounded-full border border-[#2c1d14] bg-[#2c1d14] text-xs font-semibold tracking-wide leading-none text-[#f0e9d7] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition hover:border-[#d86a34] hover:bg-[#d86a34] hover:text-[#f0e9d7] sm:h-9 sm:w-[88px] sm:text-sm"
          >
            <span className="truncate">{t.menu}</span>
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
        ref={bookingNavRef}
        className={`fixed right-0 bottom-3 z-40 flex max-w-[calc(100vw-0.5rem)] items-center transition-transform duration-500 ease-in-out sm:bottom-5 md:bottom-6 ${
          isNavOpen
            ? "translate-x-0 pr-2 sm:pr-5 md:pr-6"
            : "translate-x-[calc(100%-40px)] sm:translate-x-[calc(100%-48px)]"
        }`}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setIsNavOpen(true);
        }}
      >
        {/* Check-in / Check-out Calendar Popover */}
        {isNavOpen && activeDateField && (
          <BookingCalendarPopover
            copy={t}
            activeField={activeDateField}
            onActiveFieldChange={setActiveDateField}
            checkIn={checkInDate}
            checkOut={checkOutDate}
            onChangeDates={(nextIn, nextOut) => {
              setCheckInDate(nextIn);
              setCheckOutDate(nextOut);
            }}
            onClose={() => setActiveDateField(null)}
          />
        )}

        <button
          type="button"
          onClick={() =>
            setIsNavOpen((prev) => {
              if (prev) setActiveDateField(null);
              return !prev;
            })
          }
          aria-label={isNavOpen ? t.hideBooking : t.showBooking}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-l-md bg-[#d86a34] text-[#f0e9d7] shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition hover:bg-[#b85222] active:scale-95 sm:h-12 sm:w-12"
        >
          {isNavOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className="flex h-10 items-stretch overflow-hidden rounded-r-md border border-[#d86a34]/25 bg-[#f0e9d7] shadow-[0_8px_22px_rgba(0,0,0,0.12)] sm:h-12">
          {/* Quick Book Tag (Desktop & Tablet — fixed width across languages) */}
          <div className="font-hand hidden h-full shrink-0 items-center justify-center gap-1.5 border-r border-[#f0e9d7]/25 bg-[#d86a34] px-2 text-base font-bold tracking-wide leading-none text-[#f0e9d7] md:flex md:w-[118px] lg:w-[126px]">
            <span className="truncate">{t.book}</span>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#f0e9d7]/80">
              <ArrowRight size={11} className="stroke-[2.5]" />
            </div>
          </div>

          {/* Check-In Calendar Field (fixed size across languages & selected dates) */}
          <button
            type="button"
            onClick={() => toggleDateField("checkIn")}
            aria-expanded={activeDateField === "checkIn"}
            className={`flex h-full w-[68px] min-[375px]:w-[82px] min-[420px]:w-[92px] sm:w-[116px] md:w-[126px] lg:w-[134px] shrink-0 cursor-pointer items-center justify-center px-1.5 text-[10px] min-[375px]:text-[11px] font-bold tracking-wide leading-none text-[#2c1d14] transition sm:px-2.5 sm:text-sm ${
              activeDateField === "checkIn"
                ? "bg-[#e6ddc7] shadow-[inset_0_-2.5px_0_#d86a34]"
                : "bg-[#f0e9d7] hover:bg-[#e6ddc7]"
            }`}
          >
            <span
              className={`truncate tabular-nums ${
                checkInDate ? "text-[#b85222]" : ""
              }`}
            >
              {checkInDate
                ? formatShortDate(checkInDate, t.monthsShort)
                : t.checkIn}
            </span>
          </button>

          {/* Range Arrow Connector */}
          <div className="flex h-full w-3.5 shrink-0 items-center justify-center bg-[#f0e9d7] text-[#d86a34] sm:w-5 md:w-6">
            <ArrowRight size={12} className="stroke-[2.5]" />
          </div>

          {/* Check-Out Calendar Field (fixed size across languages & selected dates) */}
          <button
            type="button"
            onClick={() => toggleDateField("checkOut")}
            aria-expanded={activeDateField === "checkOut"}
            className={`flex h-full w-[68px] min-[375px]:w-[82px] min-[420px]:w-[92px] sm:w-[116px] md:w-[126px] lg:w-[134px] shrink-0 cursor-pointer items-center justify-center border-r border-dashed border-[#d86a34]/35 px-1.5 text-[10px] min-[375px]:text-[11px] font-bold tracking-wide leading-none text-[#2c1d14] transition sm:px-2.5 sm:text-sm ${
              activeDateField === "checkOut"
                ? "bg-[#e6ddc7] shadow-[inset_0_-2.5px_0_#d86a34]"
                : "bg-[#f0e9d7] hover:bg-[#e6ddc7]"
            }`}
          >
            <span
              className={`truncate tabular-nums ${
                checkOutDate ? "text-[#b85222]" : ""
              }`}
            >
              {checkOutDate
                ? formatShortDate(checkOutDate, t.monthsShort)
                : t.checkOut}
            </span>
          </button>

          {/* Guests Slot: transforms on hover / focus into a numbers-only input without resizing */}
          <div
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setIsGuestsHovered(true);
            }}
            onPointerLeave={() => setIsGuestsHovered(false)}
            className="relative h-full w-[62px] min-[375px]:w-[70px] min-[420px]:w-[78px] sm:w-[104px] md:w-[114px] lg:w-[122px] shrink-0 bg-[#f0e9d7]"
          >
            {/* Idle Label */}
            <div
              aria-hidden={showGuestInput}
              className={`pointer-events-none absolute inset-0 flex items-center justify-center px-1.5 text-[10px] min-[375px]:text-[11px] font-bold tracking-wide leading-none transition-opacity duration-150 sm:px-2.5 sm:text-sm ${
                showGuestInput ? "opacity-0" : "opacity-100"
              } ${guests ? "text-[#b85222]" : "text-[#2c1d14]"}`}
            >
              <span className="truncate tabular-nums">
                {guests ? `${guests} ${t.guests}` : t.guests}
              </span>
            </div>

            {/* Numbers-Only Input Box (revealed on hover, focus, or tap) */}
            <div
              className={`absolute inset-0 flex items-center justify-center p-1 transition-opacity duration-150 sm:p-1.5 ${
                showGuestInput
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={2}
                autoComplete="off"
                aria-label={t.guestsInputLabel}
                placeholder="0"
                value={guests}
                onFocus={() => {
                  setIsGuestsFocused(true);
                  setActiveDateField(null);
                }}
                onBlur={handleGuestsBlur}
                onKeyDown={handleGuestsKeyDown}
                onChange={handleGuestsChange}
                className="h-full w-full rounded border border-[#d86a34]/75 bg-[#fcf9f1] px-1 text-center font-mono text-xs font-bold tabular-nums leading-none text-[#2c1d14] placeholder-[#2c1d14]/40 shadow-inner outline-none focus:border-[#d86a34] focus:ring-1 focus:ring-[#d86a34] sm:text-sm"
              />
            </div>
          </div>

          {/* Submit "Go!" Button (fixed width across languages) */}
          <button
            type="button"
            onClick={handleGoClick}
            className="font-display flex h-full w-[46px] min-[375px]:w-[52px] min-[420px]:w-[58px] sm:w-[76px] md:w-[84px] lg:w-[88px] shrink-0 cursor-pointer items-center justify-center bg-[#2c1d14] text-sm font-bold tracking-wide leading-none text-[#f0e9d7] transition hover:bg-[#b85222] hover:text-[#f0e9d7] active:scale-95 sm:text-lg"
          >
            <span className="truncate">{t.go}</span>
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
