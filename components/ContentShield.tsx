"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

const DEVTOOLS_SHIFT_KEYS = new Set(["i", "j", "c", "k"]);
const MAC_ALT_DEVTOOLS_KEYS = new Set(["i", "j", "c", "u", "k"]);
const BLOCKED_MOD_KEYS = new Set(["u", "s", "p"]);
const CLIPBOARD_MOD_KEYS = new Set(["c", "x", "a"]);

/** Allow standard typing, selection, and copy/paste inside interactive form fields. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/**
 * Deterrence layer blocking context menus, image dragging, text selection/copying,
 * and common DevTools/View-Source shortcuts outside editable form inputs.
 */
export default function ContentShield() {
  const [noticeVisible, setNoticeVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const triggerNotice = () => {
      setNoticeVisible(true);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setNoticeVisible(false);
      }, 1800);
    };

    console.info(
      "%cTriboRoots Hostel",
      "color:#d86a34;font-size:18px;font-weight:700;",
      "Protected design & frontend code — reach out at teams@intrface.in."
    );

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      triggerNotice();
    };

    const handleDragStart = (event: DragEvent) => {
      event.preventDefault();
    };

    const handleSelectStart = (event: Event) => {
      if (!isEditableTarget(event.target)) {
        event.preventDefault();
      }
    };

    const handleClipboard = (event: ClipboardEvent) => {
      if (!isEditableTarget(event.target)) {
        event.preventDefault();
        triggerNotice();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const hasPrimaryMod = event.ctrlKey || event.metaKey;

      const isF12 = event.key === "F12";
      const isCtrlShiftDevTools =
        event.ctrlKey && event.shiftKey && DEVTOOLS_SHIFT_KEYS.has(key);
      const isMacAltDevTools =
        event.metaKey && event.altKey && MAC_ALT_DEVTOOLS_KEYS.has(key);
      const isSourceOrSaveOrPrint = hasPrimaryMod && BLOCKED_MOD_KEYS.has(key);
      const isNonInputCopy =
        hasPrimaryMod &&
        CLIPBOARD_MOD_KEYS.has(key) &&
        !isEditableTarget(event.target);

      if (
        isF12 ||
        isCtrlShiftDevTools ||
        isMacAltDevTools ||
        isSourceOrSaveOrPrint ||
        isNonInputCopy
      ) {
        event.preventDefault();
        event.stopPropagation();
        triggerNotice();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("copy", handleClipboard);
    document.addEventListener("cut", handleClipboard);
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("copy", handleClipboard);
      document.removeEventListener("cut", handleClipboard);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed bottom-4 left-4 z-[60] flex items-center gap-2 rounded-full border border-[#d86a34]/40 bg-[#2c1d14]/92 px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#f0e9d7] shadow-lg backdrop-blur-md transition-all duration-200 ${
        noticeVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-2 opacity-0"
      }`}
    >
      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#d86a34]" />
      <span>Protected · © TriboRoots</span>
    </div>
  );
}
