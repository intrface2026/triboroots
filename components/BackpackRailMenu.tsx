"use client";

import React, { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import {
  ClothingRailHero,
  type RailGarment,
} from "@/components/ui/product-rail-gallery";
import type { HeroCopy, MenuItemCopy, MenuSectionId } from "@/lib/i18n";
import { playPackSwitchSound, playPlateTapSound } from "@/lib/soundFx";

interface BackpackRailMenuProps {
  isOpen: boolean;
  soundEnabled: boolean;
  copy: HeroCopy;
  selectedId: MenuSectionId | null;
  onSelect: (item: MenuItemCopy) => void;
  onClose: () => void;
}

const PACK_COLORS: Record<MenuSectionId, { color: string; trim: string }> = {
  gallery: { color: "#d86a34", trim: "#f0e9d7" },
  rooms: { color: "#b85222", trim: "#f0e9d7" },
  offer: { color: "#2c1d14", trim: "#f0e9d7" },
  activities: { color: "#c87a4b", trim: "#f0e9d7" },
  contact: { color: "#5b483a", trim: "#f0e9d7" },
};

export default function BackpackRailMenu({
  isOpen,
  soundEnabled,
  copy,
  selectedId,
  onSelect,
  onClose,
}: BackpackRailMenuProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const railItems: RailGarment[] = useMemo(
    () =>
      copy.menuItems.map((item, idx) => {
        const palette = PACK_COLORS[item.id];
        return {
          id: item.id,
          name: item.label,
          description: item.sublabel,
          kind: "backpack",
          color: palette.color,
          trim: palette.trim,
          tag: `0${idx + 1}`,
          details: item.details,
        };
      }),
    [copy.menuItems],
  );

  if (!isOpen) return null;

  const selectedItem =
    copy.menuItems.find((item) => item.id === selectedId) ?? null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.railHeading}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-[#f0e9d7]/95 px-3 py-10 backdrop-blur-xl sm:px-6 sm:py-12"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        data-cursor="pointer"
        aria-label={copy.closeMenu}
        onClick={onClose}
        className="fixed top-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#2c1d14]/15 bg-[#e6ddc7] text-[#2c1d14] shadow-md transition-all hover:scale-105 hover:bg-[#d86a34] hover:text-[#f0e9d7] active:scale-95 sm:top-6 sm:right-6 sm:h-11 sm:w-11 md:top-8 md:right-10"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <ClothingRailHero
          items={railItems}
          eyebrow={copy.brandName}
          heading={copy.railHeading}
          caption={copy.railCaption}
          hanger="matte"
          autoplay
          interval={3200}
          labels={{
            front: copy.railFront,
            back: copy.railBack,
            close: copy.closeMenu,
            show: copy.railShow,
            select: copy.railExplore,
            prev: copy.railPrev,
            next: copy.railNext,
          }}
          onFocusChange={(index) => {
            if (index !== null && soundEnabled) {
              playPackSwitchSound();
            }
          }}
          onOpenChange={(index) => {
            if (index !== null && soundEnabled) {
              playPlateTapSound();
            }
          }}
          onSelectItem={(_, index) => {
            const target = copy.menuItems[index];
            if (!target) return;
            if (soundEnabled) playPlateTapSound();
            onSelect(target);
          }}
          action={
            selectedItem ? (
              <p className="mt-1 rounded-full border border-[#d86a34]/35 bg-[#e6ddc7] px-4 py-1 text-xs font-semibold text-[#b85222] shadow-xs sm:px-5 sm:py-1.5">
                {copy.menuSelectedNote(selectedItem.label)}
              </p>
            ) : undefined
          }
        />
      </div>
    </div>
  );
}
