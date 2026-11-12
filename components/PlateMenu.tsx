"use client";

import React, { useEffect, useState } from "react";
import {
  BedDouble,
  Compass,
  Images,
  Mail,
  Sparkles,
  X,
} from "lucide-react";
import type { HeroCopy, MenuItemCopy, MenuSectionId } from "@/lib/i18n";
import { playMenuDropSequence, playPlateTapSound } from "@/lib/soundFx";

const STAGGER_MS = 140;
const IMPACT_OFFSET_MS = 340;
const ITEM_TILTS = ["-2deg", "1.8deg", "-1.4deg", "2.2deg", "-0.8deg"];

const SECTION_ICONS: Record<MenuSectionId, React.ComponentType<{ size?: number; className?: string }>> = {
  gallery: Images,
  rooms: BedDouble,
  offer: Sparkles,
  activities: Compass,
  contact: Mail,
};

interface PlateMenuProps {
  isOpen: boolean;
  soundEnabled: boolean;
  copy: HeroCopy;
  selectedId: MenuSectionId | null;
  onSelect: (item: MenuItemCopy) => void;
  onClose: () => void;
}

export default function PlateMenu({
  isOpen,
  soundEnabled,
  copy,
  selectedId,
  onSelect,
  onClose,
}: PlateMenuProps) {
  const [plateJoltCount, setPlateJoltCount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    const joltTimers: number[] = [];
    for (let i = 0; i < copy.menuItems.length; i++) {
      const id = window.setTimeout(() => {
        setPlateJoltCount((c) => c + 1);
      }, i * STAGGER_MS + IMPACT_OFFSET_MS);
      joltTimers.push(id);
    }

    const cancelAudio = soundEnabled
      ? playMenuDropSequence(copy.menuItems.length, STAGGER_MS, IMPACT_OFFSET_MS)
      : () => {};

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      joltTimers.forEach((id) => window.clearTimeout(id));
      cancelAudio();
    };
  }, [isOpen, soundEnabled, copy.menuItems.length, onClose]);

  if (!isOpen) return null;

  const selectedItem = copy.menuItems.find((m) => m.id === selectedId) ?? null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.menuEyebrow}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2c1d14]/45 backdrop-blur-md px-4 py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Bar inside Overlay */}
      <div className="absolute top-4 right-5 sm:right-7 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) playPlateTapSound();
            onClose();
          }}
          aria-label={copy.closeMenu}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e9d7] border border-[#d86a34]/40 text-[#2c1d14] hover:bg-[#d86a34] hover:text-[#f0e9d7] transition shadow-[0_4px_14px_rgba(0,0,0,0.14)] cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Menu Header */}
      <div className="mb-5 text-center pointer-events-none">
        <p className="font-hand text-lg sm:text-xl text-[#f0e9d7] tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
          {copy.menuEyebrow}
        </p>
        <p className="text-xs sm:text-sm text-[#f0e9d7]/85 mt-0.5">
          {copy.menuHint}
        </p>
      </div>

      {/* Ceramic Plate Container */}
      <div
        key={plateJoltCount}
        className={`relative w-full max-w-[600px] rounded-[3.25rem] sm:rounded-[4.5rem] bg-[#f0e9d7] p-4 sm:p-7 border-2 border-[#d86a34]/40 shadow-[0_18px_42px_rgba(0,0,0,0.22),inset_0_2px_0_rgba(248,243,230,0.9)] ${
          plateJoltCount > 0 ? "animate-plate-jolt" : ""
        }`}
      >
        {/* Inner Recessed Ceramic Dish */}
        <div className="rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#e8dfc9] p-4 sm:p-6 border border-[#d86a34]/25 shadow-[inset_0_6px_18px_rgba(44,29,20,0.1),inset_0_-2px_6px_rgba(248,243,230,0.75)]">
          <nav
            aria-label={copy.menuEyebrow}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-3.5"
          >
            {copy.menuItems.map((item, idx) => {
              const Icon = SECTION_ICONS[item.id];
              const isSelected = selectedId === item.id;
              const tilt = ITEM_TILTS[idx % ITEM_TILTS.length];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPlateTapSound();
                    onSelect(item);
                  }}
                  style={
                    {
                      animationDelay: `${idx * STAGGER_MS}ms`,
                      "--drop-tilt": tilt,
                    } as React.CSSProperties
                  }
                  className={`animate-plate-item-drop group flex items-center gap-3 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 border transition-all duration-200 cursor-pointer shadow-[0_6px_14px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:scale-[1.03] active:scale-95 ${
                    isSelected
                      ? "bg-[#d86a34] border-[#b85222] text-[#f0e9d7]"
                      : "bg-[#f0e9d7] border-[#d86a34]/35 text-[#2c1d14] hover:bg-[#d86a34] hover:border-[#d86a34] hover:text-[#f0e9d7]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                      isSelected
                        ? "bg-[#f0e9d7]/20 text-[#f0e9d7]"
                        : "bg-[#d86a34]/12 text-[#d86a34] group-hover:bg-[#f0e9d7]/20 group-hover:text-[#f0e9d7]"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="text-left">
                    <span className="font-display block text-base sm:text-lg font-bold leading-tight">
                      {item.label}
                    </span>
                    <span
                      className={`block text-[11px] font-medium leading-tight mt-0.5 ${
                        isSelected
                          ? "text-[#f0e9d7]/90"
                          : "text-[#2c1d14]/65 group-hover:text-[#f0e9d7]/90"
                      }`}
                    >
                      {item.sublabel}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Subtle Ceramic Rim Monogram */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-display uppercase tracking-[0.22em] text-[#d86a34]/65 select-none">
            <span className="h-px w-8 bg-[#d86a34]/30" />
            <span>{copy.brandName}</span>
            <span className="h-px w-8 bg-[#d86a34]/30" />
          </div>
        </div>
      </div>

      {/* Selected Section Confirmation Pill */}
      {selectedItem && (
        <div className="mt-5 rounded-full bg-[#2c1d14] px-5 py-2 text-xs sm:text-sm font-semibold text-[#f0e9d7] border border-[#d86a34]/40 shadow-[0_6px_16px_rgba(0,0,0,0.2)]">
          {copy.menuSelectedNote(selectedItem.label)}
        </div>
      )}
    </div>
  );
}

