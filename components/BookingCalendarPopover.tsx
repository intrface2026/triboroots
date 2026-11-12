"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroCopy } from "@/lib/i18n";

export type DateFieldMode = "checkIn" | "checkOut";

interface BookingCalendarPopoverProps {
  copy: HeroCopy;
  activeField: DateFieldMode;
  onActiveFieldChange: (field: DateFieldMode) => void;
  checkIn: Date | null;
  checkOut: Date | null;
  onChangeDates: (nextCheckIn: Date | null, nextCheckOut: Date | null) => void;
  onClose: () => void;
}

const CALENDAR_CELLS = 42;

/** Normalize a Date to local midnight. */
function toStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Format a date concisely as "14 Nov" / "14 नव॰" for compact fixed slots. */
export function formatShortDate(date: Date, monthsShort: string[]): string {
  const day = date.getDate();
  const month = monthsShort[date.getMonth()] ?? "";
  return `${day} ${month}`;
}

/** Check if two nullable dates refer to the same calendar day. */
function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Compute whole calendar nights between two dates using UTC noon to avoid DST drift. */
function diffNights(start: Date, end: Date): number {
  const utcStart = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.max(0, Math.round((utcEnd - utcStart) / 86_400_000));
}

/** Build a fixed 42-slot (6x7) month grid so every month has the exact same height. */
function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = new Array(CALENDAR_CELLS).fill(null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells[firstWeekday + day - 1] = new Date(year, month, day);
  }
  return cells;
}

export default function BookingCalendarPopover({
  copy,
  activeField,
  onActiveFieldChange,
  checkIn,
  checkOut,
  onChangeDates,
  onClose,
}: BookingCalendarPopoverProps) {
  const [today] = useState<Date>(() => toStartOfDay(new Date()));
  const [viewDate, setViewDate] = useState<Date>(() => {
    const anchor =
      activeField === "checkOut" && checkOut
        ? checkOut
        : checkIn ?? toStartOfDay(new Date());
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const monthCells = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const previewEnd =
    checkOut ??
    (activeField === "checkOut" &&
    checkIn &&
    hoveredDate &&
    hoveredDate > checkIn
      ? hoveredDate
      : null);

  const nights = checkIn && checkOut ? diffNights(checkIn, checkOut) : 0;

  const handleSelectDay = (day: Date) => {
    if (day < today) return;

    if (activeField === "checkIn") {
      const nextOut = checkOut && day < checkOut ? checkOut : null;
      onChangeDates(day, nextOut);
      onActiveFieldChange("checkOut");
      return;
    }

    // Active field is checkOut
    if (checkIn) {
      if (day <= checkIn) {
        // Selecting a day on or before check-in restarts the range cleanly
        onChangeDates(day, null);
        return;
      }
      onChangeDates(checkIn, day);
      return;
    }

    onChangeDates(null, day);
    onActiveFieldChange("checkIn");
  };

  return (
    <div
      role="dialog"
      aria-label={`${copy.checkIn} / ${copy.checkOut}`}
      className="absolute right-2 bottom-[calc(100%+10px)] z-50 w-[min(calc(100vw-1rem),336px)] max-h-[calc(100dvh-4.75rem)] overflow-y-auto rounded-xl border border-[#d86a34]/40 bg-[#f0e9d7] text-[#2c1d14] shadow-[0_18px_42px_rgba(44,29,20,0.22)] sm:right-5 sm:w-[356px] md:right-6"
    >
      {/* Check-in / Check-out Fixed Equal Tabs */}
      <div className="grid grid-cols-2 border-b border-dashed border-[#d86a34]/35">
        <button
          type="button"
          onClick={() => onActiveFieldChange("checkIn")}
          className={`flex h-[50px] cursor-pointer flex-col items-start justify-center border-r border-dashed border-[#d86a34]/30 px-3.5 text-left transition ${
            activeField === "checkIn"
              ? "bg-[#d86a34] text-[#f0e9d7]"
              : "bg-[#e6ddc7]/55 text-[#2c1d14] hover:bg-[#e6ddc7]"
          }`}
        >
          <span className="flex w-full items-center gap-1 truncate text-[10px] font-bold tracking-wider uppercase leading-none opacity-85">
            <CalendarDays size={11} className="shrink-0" />
            <span className="truncate">{copy.checkIn}</span>
          </span>
          <span className="mt-1 w-full truncate font-mono text-xs font-semibold tabular-nums leading-none sm:text-sm">
            {checkIn ? formatShortDate(checkIn, copy.monthsShort) : "— —"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onActiveFieldChange("checkOut")}
          className={`flex h-[50px] cursor-pointer flex-col items-start justify-center px-3.5 text-left transition ${
            activeField === "checkOut"
              ? "bg-[#d86a34] text-[#f0e9d7]"
              : "bg-[#e6ddc7]/55 text-[#2c1d14] hover:bg-[#e6ddc7]"
          }`}
        >
          <span className="flex w-full items-center gap-1 truncate text-[10px] font-bold tracking-wider uppercase leading-none opacity-85">
            <CalendarDays size={11} className="shrink-0" />
            <span className="truncate">{copy.checkOut}</span>
          </span>
          <span className="mt-1 w-full truncate font-mono text-xs font-semibold tabular-nums leading-none sm:text-sm">
            {checkOut ? formatShortDate(checkOut, copy.monthsShort) : "— —"}
          </span>
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex h-11 items-center justify-between px-3">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
          aria-label={copy.prevMonth}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#d86a34]/25 transition ${
            canGoPrev
              ? "cursor-pointer bg-[#fcf9f1] text-[#2c1d14] hover:border-[#d86a34] hover:bg-[#d86a34] hover:text-[#f0e9d7]"
              : "cursor-not-allowed opacity-30"
          }`}
        >
          <ChevronLeft size={16} />
        </button>

        <span className="font-display min-w-0 truncate px-2 text-center text-sm font-semibold tracking-wide text-[#2c1d14] sm:text-base">
          {copy.months[viewMonth]} {viewYear}
        </span>

        <button
          type="button"
          onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
          aria-label={copy.nextMonth}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#d86a34]/25 bg-[#fcf9f1] text-[#2c1d14] transition hover:border-[#d86a34] hover:bg-[#d86a34] hover:text-[#f0e9d7]"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 px-3 pb-1">
        {copy.weekdaysShort.map((dayName, idx) => (
          <div
            key={idx}
            className="flex h-6 items-center justify-center text-[11px] font-bold tracking-wide text-[#2c1d14]/60"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Fixed 6x7 Day Matrix (Height never shifts between months or languages) */}
      <div
        className="grid grid-cols-7 gap-y-0.5 px-3 pb-2.5"
        onPointerLeave={() => setHoveredDate(null)}
      >
        {monthCells.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="h-8 sm:h-9" />;
          }

          const isPast = day < today;
          const isToday = isSameDay(day, today);
          const isStart = isSameDay(day, checkIn);
          const isEnd = isSameDay(day, checkOut);
          const isPreviewEnd = !checkOut && isSameDay(day, previewEnd);
          const isInRange = Boolean(
            checkIn && previewEnd && day > checkIn && day < previewEnd
          );
          const hasTrailingBand =
            isStart && Boolean(previewEnd && previewEnd > day);
          const hasLeadingBand =
            (isEnd || isPreviewEnd) && Boolean(checkIn && day > checkIn);

          return (
            <div
              key={day.toISOString()}
              className="relative flex h-8 items-center justify-center sm:h-9"
            >
              {/* Soft terracotta range ribbon behind endpoints & intermediate days */}
              {isInRange && (
                <div className="pointer-events-none absolute inset-y-0.5 inset-x-0 bg-[#d86a34]/18" />
              )}
              {hasTrailingBand && (
                <div className="pointer-events-none absolute inset-y-0.5 right-0 left-1/2 bg-[#d86a34]/18" />
              )}
              {hasLeadingBand && (
                <div className="pointer-events-none absolute inset-y-0.5 right-1/2 left-0 bg-[#d86a34]/18" />
              )}

              <button
                type="button"
                disabled={isPast}
                onClick={() => handleSelectDay(day)}
                onPointerEnter={() => {
                  if (!isPast) setHoveredDate(day);
                }}
                aria-pressed={isStart || isEnd}
                aria-label={`${day.getDate()} ${copy.months[viewMonth]} ${viewYear}`}
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-semibold tabular-nums transition sm:h-9 sm:w-9 sm:text-[13px] ${
                  isPast
                    ? "cursor-not-allowed text-[#2c1d14]/25"
                    : isStart || isEnd
                    ? "cursor-pointer bg-[#d86a34] font-bold text-[#f0e9d7] shadow-[0_2px_6px_rgba(216,106,52,0.35)]"
                    : isPreviewEnd
                    ? "cursor-pointer border border-dashed border-[#d86a34] bg-[#d86a34]/25 text-[#2c1d14]"
                    : isToday
                    ? "cursor-pointer border border-[#d86a34] text-[#d86a34] hover:bg-[#d86a34]/15"
                    : "cursor-pointer text-[#2c1d14] hover:bg-[#d86a34]/18"
                }`}
              >
                {day.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Summary & Fixed-Width Actions */}
      <div className="flex h-11 items-center justify-between gap-2 border-t border-dashed border-[#d86a34]/35 bg-[#e6ddc7]/45 px-3">
        <span className="font-hand min-w-0 truncate text-sm font-bold text-[#2c1d14]">
          {nights > 0 ? copy.nightsLabel(nights) : copy.selectDatesHint}
        </span>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              onChangeDates(null, null);
              onActiveFieldChange("checkIn");
            }}
            className="flex h-7 w-[60px] cursor-pointer items-center justify-center rounded border border-[#d86a34]/35 bg-[#f0e9d7] text-xs font-bold leading-none text-[#2c1d14] transition hover:border-[#d86a34] hover:bg-[#e6ddc7] sm:w-[68px]"
          >
            {copy.clearDates}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="font-display flex h-7 w-[64px] cursor-pointer items-center justify-center rounded bg-[#2c1d14] text-xs font-semibold leading-none text-[#f0e9d7] transition hover:bg-[#d86a34] sm:w-[72px]"
          >
            {copy.doneDates}
          </button>
        </div>
      </div>
    </div>
  );
}

