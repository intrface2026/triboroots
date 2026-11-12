"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const POINTER_SELECTOR =
  'a, button, input, select, textarea, summary, [data-cursor="pointer"]';

export default function FluffyKittenCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateEnabled = () => {
      setIsEnabled(finePointer.matches && !reducedMotion.matches);
    };

    updateEnabled();
    finePointer.addEventListener("change", updateEnabled);
    reducedMotion.addEventListener("change", updateEnabled);

    return () => {
      finePointer.removeEventListener("change", updateEnabled);
      reducedMotion.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      setIsVisible(true);

      const target = e.target as Element | null;
      const hoveringInteractive = Boolean(target?.closest(POINTER_SELECTOR));
      setIsPointer((prev) =>
        prev === hoveringInteractive ? prev : hoveringInteractive
      );
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 z-[9999] w-16 h-16 pointer-events-none select-none will-change-transform transition-opacity duration-150 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Default Animated Fluffy Kitten Waddle Cursor (hotspot 1,1) */}
      <Image
        src="/cursors/fluffy-waddle.png"
        alt=""
        width={64}
        height={64}
        unoptimized
        draggable={false}
        className={`absolute inset-0 w-16 h-16 -translate-x-[1px] -translate-y-[1px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.14)] transition-opacity duration-75 ${
          isPointer ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* Interactive Pointer Fluffy Kitten Cursor (hotspot 1,1) */}
      <Image
        src="/cursors/fluffy-pointer.png"
        alt=""
        width={64}
        height={64}
        unoptimized
        draggable={false}
        className={`absolute inset-0 w-16 h-16 -translate-x-[1px] -translate-y-[1px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.14)] transition-opacity duration-75 ${
          isPointer ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

