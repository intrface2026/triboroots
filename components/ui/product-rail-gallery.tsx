"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export type GarmentKind = "backpack";

export interface RailGarment {
  id: string;
  /** Accessible name, printed label on backpack, and detail title. */
  name: string;
  description?: string;
  kind?: GarmentKind;
  /** Fabric colour of the backpack (any CSS colour). */
  color?: string;
  /** Trim colour for outlines, straps, and stitch lines. */
  trim?: string;
  /** Optional photo override (front). */
  image?: string;
  /** Optional photo override (back). */
  backImage?: string;
  /** Optional photo override (side). */
  sideImage?: string;
  /** Short luggage-tag index or code, e.g. "01". */
  tag?: string;
  /** Short facts listed in the detail view. */
  details?: string[];
}

export interface ClothingRailHeroLabels {
  front: string;
  back: string;
  close: string;
  show: string;
  select?: string;
  prev?: string;
  next?: string;
}

export interface ClothingRailHeroProps extends React.ComponentProps<"section"> {
  items: RailGarment[];
  eyebrow?: string;
  heading?: string;
  /** Shown under the rail when nothing is hovered/focused. */
  caption?: string;
  /** Optional subtle hint shown under the caption. */
  action?: React.ReactNode;
  /** Turns the pieces to the front one by one until the visitor interacts. */
  autoplay?: boolean;
  /** Milliseconds each piece faces the front during autoplay. */
  interval?: number;
  hanger?: "wood" | "matte" | "none";
  labels?: ClothingRailHeroLabels;
  onOpenChange?: (index: number | null) => void;
  onFocusChange?: (index: number | null) => void;
  onSelectItem?: (item: RailGarment, index: number) => void;
}

const VB_W = 260;
const VB_H = 295;
const ASPECT = VB_W / VB_H;
const HOOK_TOP = 4;
const RAIL_R = 4.5;
const REST = -64;
const PERSPECTIVE = 1100;

const DEFAULT_LABELS: ClothingRailHeroLabels = {
  front: "Front",
  back: "Back",
  close: "Close",
  show: "Show",
  select: "Open",
  prev: "Previous pack",
  next: "Next pack",
};

function mixHex(hex: string, amount: number): string {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  const to = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  const r = Math.round(((n >> 16) & 255) * (1 - p) + to * p);
  const g = Math.round(((n >> 8) & 255) * (1 - p) + to * p);
  const b = Math.round((n & 255) * (1 - p) + to * p);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function luma(hex: string): number {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 0.5;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  return (
    (0.299 * ((n >> 16) & 255) +
      0.587 * ((n >> 8) & 255) +
      0.114 * (n & 255)) /
    255
  );
}

/** Splits short label strings into 1 or 2 crisp lines inside the backpack badge. */
function splitPatchLines(text: string): string[] {
  const words = text.trim().split(/\s+/);
  if (words.length <= 1 || text.length <= 10) return [text];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

/* Wide TriboRoots hiking backpack matching assets/favicon.png */
const PACK_BODY =
  "M40,76 C40,58 56,54 84,54 L176,54 C204,54 220,58 220,76 L222,162 C238,164 246,174 246,190 L246,216 C246,230 236,238 222,239 L222,244 C222,257 206,264 186,264 L74,264 C54,264 38,257 38,244 L38,239 C24,238 14,230 14,216 L14,190 C14,174 22,164 38,162 Z";

const BEDROLL_BODY =
  "M54,36 L206,36 C214,36 220,42 220,50 C220,58 214,64 206,64 L54,64 C46,64 40,58 40,50 C40,42 46,36 54,36 Z";

const LEFT_SIDE_POCKET =
  "M38,162 C22,164 14,174 14,190 L14,216 C14,230 24,238 38,239 Z";

const RIGHT_SIDE_POCKET =
  "M222,162 C238,164 246,174 246,190 L246,216 C246,230 236,238 222,239 Z";

const ARCH_POCKET =
  "M80,196 C80,173 98,166 130,166 C162,166 180,173 180,196 L180,246 C180,254 171,258 160,258 L100,258 C89,258 80,254 80,246 Z";

const HOOK_PATH = `M126.5,${HOOK_TOP + 10} C126,${HOOK_TOP + 2} 135,${HOOK_TOP - 1} 135.5,${HOOK_TOP + 6} C136,${HOOK_TOP + 12} 130,${HOOK_TOP + 15} 130,${HOOK_TOP + 22}`;

function CarabinerHook({
  tone,
  uid,
}: {
  tone: "wood" | "matte";
  uid: string;
}) {
  const g = `h-${uid}`;
  const wire =
    tone === "wood"
      ? { a: "#d4d0c7", b: "#9c968b" }
      : { a: "#786255", b: "#2c1d14" };
  return (
    <g>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={wire.a} />
          <stop offset="100%" stopColor={wire.b} />
        </linearGradient>
      </defs>
      <path
        d={HOOK_PATH}
        fill="none"
        stroke={`url(#${g})`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="126.5"
        y={HOOK_TOP + 19}
        width="7"
        height="9"
        rx="3"
        fill={wire.b}
      />
    </g>
  );
}

function SideCarabiner({ tone }: { tone: "wood" | "matte" }) {
  const wire = tone === "wood" ? "#b5afa5" : "#4a382d";
  return (
    <g>
      <path
        d={HOOK_PATH}
        fill="none"
        stroke={wire}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <rect
        x="126.5"
        y={HOOK_TOP + 19}
        width="7"
        height="9"
        rx="3"
        fill={wire}
      />
    </g>
  );
}

function BackpackFront({ item, uid }: { item: RailGarment; uid: string }) {
  const base = item.color ?? "#d86a34";
  const trim = item.trim ?? "#f0e9d7";
  const dark = luma(base) < 0.28;
  const volId = `vf-${uid}`;
  const lines = splitPatchLines(item.name);

  return (
    <g>
      <defs>
        <linearGradient id={volId} x1="0" y1="0" x2="1" y2="0">
          <stop
            offset="0%"
            stopColor="#2c1d14"
            stopOpacity={dark ? 0.34 : 0.16}
          />
          <stop offset="28%" stopColor="#2c1d14" stopOpacity="0" />
          <stop
            offset="50%"
            stopColor="#f0e9d7"
            stopOpacity={dark ? 0.08 : 0.14}
          />
          <stop offset="72%" stopColor="#2c1d14" stopOpacity="0" />
          <stop
            offset="100%"
            stopColor="#2c1d14"
            stopOpacity={dark ? 0.36 : 0.18}
          />
        </linearGradient>
      </defs>

      {/* Top haul loop */}
      <path
        d="M119,36 C119,24 141,24 141,36 L136,36 C136,29 124,29 124,36 Z"
        fill={mixHex(base, -0.18)}
      />

      {/* Rolled sleeping mat / bedroll */}
      <path d={BEDROLL_BODY} fill={mixHex(base, -0.1)} />
      <path
        d="M55,38 L205,38 C209,38 212,41 212,45 L48,45 C48,41 51,38 55,38 Z"
        fill={mixHex(base, 0.12)}
      />

      {/* Side pockets */}
      <path d={LEFT_SIDE_POCKET} fill={mixHex(base, -0.07)} />
      <path d={RIGHT_SIDE_POCKET} fill={mixHex(base, -0.07)} />

      {/* Main pack body & volume shading */}
      <path d={PACK_BODY} fill={base} />
      <path d={PACK_BODY} fill={`url(#${volId})`} />

      {/* Top curved lid flap */}
      <path
        d="M40,76 C40,58 56,56 84,56 L176,56 C204,56 220,58 220,76 L220,124 C220,138 196,144 130,144 C64,144 40,138 40,124 Z"
        fill={mixHex(base, 0.05)}
      />
      <path
        d="M40,122 C66,139 194,139 220,122 L220,131 C194,147 66,147 40,131 Z"
        fill={mixHex(base, -0.24)}
        opacity="0.7"
      />

      {/* Twin front flap buckle straps & bedroll straps */}
      <path d="M72,35 L82,35 L82,65 L72,65 Z" fill={mixHex(base, -0.2)} />
      <path d="M178,35 L188,35 L188,65 L178,65 Z" fill={mixHex(base, -0.2)} />
      <path
        d="M68,92 L80,92 L80,160 C80,165 68,165 68,160 Z"
        fill={mixHex(base, -0.2)}
      />
      <path
        d="M180,92 L192,92 L192,160 C192,165 180,165 180,160 Z"
        fill={mixHex(base, -0.2)}
      />

      {/* Front centered arched zip pocket */}
      <path d={ARCH_POCKET} fill={mixHex(base, 0.08)} />

      {/* Woven Cream Luggage Tag hanging off right strap loop */}
      <g transform="translate(190 144) rotate(-7)">
        <line
          x1="0"
          y1="0"
          x2="9"
          y2="14"
          stroke={trim}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <rect
          x="3"
          y="14"
          width="26"
          height="34"
          rx="4"
          fill="#f0e9d7"
          stroke="#2c1d14"
          strokeWidth="1.2"
        />
        <circle cx="16" cy="20" r="2.2" fill={base} />
        <text
          x="16"
          y="38"
          textAnchor="middle"
          fill="#2c1d14"
          fontSize="11"
          fontWeight="800"
          fontFamily="monospace"
        >
          {item.tag ?? "01"}
        </text>
      </g>

      {/* Crisp logo-matching cream white line outlines */}
      <g
        fill="none"
        stroke={trim}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      >
        <path d={PACK_BODY} />
        <path d={BEDROLL_BODY} />
        <path d="M54,36 C46,36 40,42 40,50 C40,58 46,64 54,64 C62,64 66,58 66,50 C66,42 62,36 54,36" />
        <path d="M206,36 C198,36 194,42 194,50 C194,58 198,64 206,64" />
        <path d="M72,36 L72,64 M82,36 L82,64 M178,36 L178,64 M188,36 L188,64" />
        <path d="M120,36 C120,25 140,25 140,36" />
        <path d="M40,124 C66,143 194,143 220,124" />
        <path d="M68,92 L68,160 C68,165 80,165 80,160 L80,92 Z" />
        <path d="M180,92 L180,160 C180,165 192,165 192,160 L192,92 Z" />
        <path d="M66,142 L82,142 M178,142 L194,142" />
        <path d={ARCH_POCKET} />
        <path d="M92,190 L168,190" />
        <path d={LEFT_SIDE_POCKET} />
        <path d={RIGHT_SIDE_POCKET} />
      </g>

      {/* Woven Cream Canvas Crest / Patch ON the backpack with Menu Title */}
      <g transform="translate(130 105)">
        <rect
          x="-58"
          y="-30"
          width="116"
          height="58"
          rx="12"
          fill="#f0e9d7"
          stroke="#2c1d14"
          strokeWidth="1.5"
        />
        <rect
          x="-54"
          y="-26"
          width="108"
          height="50"
          rx="9"
          fill="none"
          stroke={base}
          strokeWidth="1"
          strokeDasharray="2.5 2.2"
        />
        {item.tag && (
          <text
            x="0"
            y="-12"
            textAnchor="middle"
            fill={base}
            fontSize="9"
            fontWeight="800"
            fontFamily="monospace"
            letterSpacing="1.4"
          >
            TRAIL {item.tag}
          </text>
        )}
        {lines.length === 1 ? (
          <text
            x="0"
            y="10"
            textAnchor="middle"
            fill="#2c1d14"
            fontSize={lines[0].length > 9 ? "13.5" : "16"}
            fontWeight="800"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            {lines[0]}
          </text>
        ) : (
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#2c1d14"
            fontSize="12.5"
            fontWeight="800"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            <tspan x="0" dy="0">
              {lines[0]}
            </tspan>
            <tspan x="0" dy="14">
              {lines[1]}
            </tspan>
          </text>
        )}
      </g>

      {/* Bottom arched pocket subtitle ribbon */}
      {item.description && (
        <g transform="translate(130 222)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill={trim}
            fontSize="9"
            fontWeight="700"
            opacity="0.94"
            style={{ fontFamily: "var(--font-sans), sans-serif" }}
          >
            {item.description.length > 22
              ? `${item.description.slice(0, 21)}…`
              : item.description}
          </text>
        </g>
      )}
    </g>
  );
}

function BackpackBack({ item, uid }: { item: RailGarment; uid: string }) {
  const base = item.color ?? "#d86a34";
  const trim = item.trim ?? "#f0e9d7";
  const volId = `vb-${uid}`;

  return (
    <g>
      <defs>
        <linearGradient id={volId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2c1d14" stopOpacity="0.24" />
          <stop offset="50%" stopColor="#f0e9d7" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#2c1d14" stopOpacity="0.24" />
        </linearGradient>
      </defs>

      <path
        d="M119,36 C119,24 141,24 141,36 L136,36 C136,29 124,29 124,36 Z"
        fill={mixHex(base, -0.18)}
      />
      <path d={BEDROLL_BODY} fill={mixHex(base, -0.12)} />
      <path d={LEFT_SIDE_POCKET} fill={mixHex(base, -0.08)} />
      <path d={RIGHT_SIDE_POCKET} fill={mixHex(base, -0.08)} />
      <path d={PACK_BODY} fill={base} />
      <path d={PACK_BODY} fill={`url(#${volId})`} />

      {/* Breathable back mesh cushions */}
      <path
        d="M94,86 C94,76 108,72 130,72 C152,72 166,76 166,86 L166,132 L94,132 Z"
        fill={mixHex(base, -0.16)}
      />
      <path
        d="M84,174 L176,174 C184,174 190,182 190,200 L190,236 C190,248 176,252 130,252 C84,252 70,248 70,236 L70,200 C70,182 76,174 84,174 Z"
        fill={mixHex(base, -0.18)}
      />

      {/* Twin padded ergonomic shoulder straps + sternum buckle */}
      <path
        d="M104,68 C86,74 74,112 72,164 C70,200 66,226 64,238 L82,238 C86,218 90,188 94,156 C98,120 106,86 114,68 Z"
        fill={mixHex(base, -0.22)}
      />
      <path
        d="M156,68 C174,74 186,112 188,164 C190,200 194,226 196,238 L178,238 C174,218 170,188 166,156 C162,120 154,86 146,68 Z"
        fill={mixHex(base, -0.22)}
      />
      <path d="M90,136 L170,136 L170,146 L90,146 Z" fill={mixHex(base, -0.28)} />

      <g
        fill="none"
        stroke={trim}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.92"
      >
        <path d={PACK_BODY} />
        <path d={BEDROLL_BODY} />
        <path d="M120,36 C120,25 140,25 140,36" />
        <path d="M104,68 C86,74 74,112 72,164 C70,200 66,226 64,238 L82,238 C86,218 90,188 94,156 C98,120 106,86 114,68 Z" />
        <path d="M156,68 C174,74 186,112 188,164 C190,200 194,226 196,238 L178,238 C174,218 170,188 166,156 C162,120 154,86 146,68 Z" />
        <path d="M90,136 L170,136 L170,146 L90,146 Z" />
        <rect x="126" y="134" width="8" height="14" rx="1.5" />
        <path d="M102,102 L158,102 M92,198 L168,198 M92,220 L168,220" strokeWidth="1.3" opacity="0.65" />
      </g>
    </g>
  );
}

function BackpackSide({ item, uid }: { item: RailGarment; uid: string }) {
  const base = item.color ?? "#d86a34";
  const trim = item.trim ?? "#f0e9d7";
  const grad = `s-${uid}`;

  return (
    <g>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f0e9d7" stopOpacity="0.16" />
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#2c1d14" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      {/* Rolled top sleeping bag */}
      <path
        d="M114,36 C132,35 148,40 148,50 C148,60 132,65 114,64 C102,64 96,58 96,50 C96,42 102,36 114,36 Z"
        fill={mixHex(base, 0.1)}
        stroke={trim}
        strokeWidth="2.2"
      />
      {/* Shoulder strap profile */}
      <path
        d="M144,68 C158,92 162,158 158,238 L146,238 C150,168 148,108 136,68 Z"
        fill={mixHex(base, -0.2)}
        stroke={trim}
        strokeWidth="2"
      />
      {/* Main side hull */}
      <path
        d="M104,54 L144,54 C151,82 154,160 150,256 C136,262 110,262 98,254 C90,214 92,120 104,54 Z"
        fill={base}
        stroke={trim}
        strokeWidth="2.2"
      />
      {/* Side pocket */}
      <path
        d="M110,162 C126,162 140,170 140,188 L140,218 C140,232 128,238 110,238 C100,238 94,230 94,216 L94,188 C94,170 100,162 110,162 Z"
        fill={mixHex(base, 0.14)}
        stroke={trim}
        strokeWidth="2.2"
      />
      {/* Side hanging label badge so packs stay identifiable even while hanging at rest */}
      <g transform="translate(117 199)">
        <rect
          x="-13"
          y="-15"
          width="26"
          height="30"
          rx="5"
          fill="#f0e9d7"
          stroke="#2c1d14"
          strokeWidth="1.2"
        />
        <text
          x="0"
          y="5"
          textAnchor="middle"
          fill="#2c1d14"
          fontSize="12"
          fontWeight="800"
          fontFamily="monospace"
        >
          {item.tag ?? "01"}
        </text>
      </g>
      <path
        d="M104,54 L144,54 C151,82 154,160 150,256 C136,262 110,262 98,254 C90,214 92,120 104,54 Z"
        fill={`url(#${grad})`}
        pointerEvents="none"
      />
    </g>
  );
}

/* eslint-disable @next/next/no-img-element */
function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="pointer-events-none block h-full w-full select-none object-contain"
    />
  );
}
/* eslint-enable @next/next/no-img-element */

function PieceCard({
  item,
  turned,
  focused,
  hanger,
  label,
  style,
  onEnter,
  onClick,
  buttonRef,
}: {
  item: RailGarment;
  turned: boolean;
  focused: boolean;
  hanger: "wood" | "matte" | "none";
  label: string;
  style?: React.CSSProperties;
  onEnter?: () => void;
  onClick: () => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  const uid = React.useId().replace(/:/g, "");
  const hasPhoto = Boolean(item.image);
  const ry = turned ? 0 : REST;

  return (
    <button
      ref={buttonRef}
      type="button"
      data-cursor="pointer"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onClick}
      aria-label={label}
      style={{
        ...style,
        transform: style?.transform
          ? `${style.transform} rotateY(${ry}deg)`
          : `rotateY(${ry}deg)`,
        transformStyle: "preserve-3d",
        transformOrigin: "50% 0%",
        transition:
          "transform 560ms cubic-bezier(0.22, 1, 0.36, 1), left 560ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease",
      }}
      className="group absolute top-0 cursor-pointer touch-manipulation bg-transparent p-0 focus:outline-none"
    >
      <div
        className="relative h-full w-full"
        style={{
          backfaceVisibility: "hidden",
          transform: "translateZ(0.5px)",
        }}
      >
        {hasPhoto ? (
          <Photo src={item.image!} alt={item.name} />
        ) : (
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="pointer-events-none block h-full w-full select-none drop-shadow-[0_14px_18px_rgba(44,29,20,0.2)]"
            aria-hidden
          >
            {hanger !== "none" && <CarabinerHook tone={hanger} uid={uid} />}
            <BackpackFront item={item} uid={uid} />
          </svg>
        )}
      </div>

      <div
        className="absolute inset-0"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg) translateZ(0.5px)",
        }}
      >
        {item.sideImage ? (
          <Photo src={item.sideImage} alt="" />
        ) : (
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="pointer-events-none block h-full w-full select-none drop-shadow-[0_10px_14px_rgba(44,29,20,0.16)]"
            aria-hidden
          >
            {hanger !== "none" && <SideCarabiner tone={hanger} />}
            <BackpackSide item={item} uid={uid} />
          </svg>
        )}
      </div>

      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-x-1 -inset-y-1 rounded-2xl ring-2 ring-[#d86a34] transition-opacity ${
          focused ? "opacity-0 group-focus-visible:opacity-100" : "opacity-0 group-focus-visible:opacity-100"
        }`}
      />
    </button>
  );
}

function Detail({
  item,
  hanger,
  labels,
  onClose,
  onSelect,
}: {
  item: RailGarment;
  hanger: "wood" | "matte" | "none";
  labels: ClothingRailHeroLabels;
  onClose: () => void;
  onSelect?: () => void;
}) {
  const [back, setBack] = React.useState(false);
  const uid = React.useId().replace(/:/g, "");
  const closeRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const frontSrc = item.image;
  const backSrc = item.backImage ?? item.image;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#2c1d14]/55 p-3.5 backdrop-blur-md sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative grid max-h-[90dvh] w-full max-w-2xl grid-cols-1 items-center gap-5 overflow-y-auto rounded-3xl border border-[#2c1d14]/15 bg-[#f0e9d7] p-5 text-[#2c1d14] shadow-[0_32px_70px_-12px_rgba(44,29,20,0.45)] sm:grid-cols-2 sm:gap-8 sm:p-9">
        <button
          ref={closeRef}
          type="button"
          data-cursor="pointer"
          onClick={onClose}
          aria-label={labels.close}
          className="absolute top-3.5 right-3.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#2c1d14]/15 bg-[#e6ddc7]/80 text-[#2c1d14]/80 transition-colors hover:bg-[#d86a34] hover:text-[#f0e9d7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d86a34] sm:top-4 sm:right-4 sm:h-10 sm:w-10"
        >
          <svg
            viewBox="0 0 16 16"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M4 4L12 12M12 4L4 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-3 pt-2 sm:pt-0">
          <div className="w-44 sm:w-60" style={{ perspective: `${PERSPECTIVE}px` }}>
            <div
              className="relative w-full"
              style={{
                aspectRatio: `${VB_W} / ${VB_H}`,
                transformStyle: "preserve-3d",
                transform: `rotateY(${back ? 180 : 0}deg)`,
                transition: "transform 560ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: "hidden", transform: "translateZ(0.5px)" }}
              >
                {frontSrc ? (
                  <Photo src={frontSrc} alt={item.name} />
                ) : (
                  <svg
                    viewBox={`0 0 ${VB_W} ${VB_H}`}
                    className="h-full w-full drop-shadow-[0_14px_20px_rgba(44,29,20,0.2)]"
                    aria-hidden
                  >
                    {hanger !== "none" && <CarabinerHook tone={hanger} uid={`${uid}-df`} />}
                    <BackpackFront item={item} uid={`${uid}-df`} />
                  </svg>
                )}
              </div>
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg) translateZ(0.5px)",
                }}
              >
                {backSrc ? (
                  <Photo src={backSrc} alt={`${item.name} — ${labels.back}`} />
                ) : (
                  <svg
                    viewBox={`0 0 ${VB_W} ${VB_H}`}
                    className="h-full w-full drop-shadow-[0_14px_20px_rgba(44,29,20,0.2)]"
                    aria-hidden
                  >
                    {hanger !== "none" && <CarabinerHook tone={hanger} uid={`${uid}-db`} />}
                    <BackpackBack item={item} uid={`${uid}-db`} />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div
            role="group"
            className="inline-flex rounded-full border border-[#2c1d14]/15 bg-[#e6ddc7] p-0.5 text-xs font-medium"
          >
            <button
              type="button"
              data-cursor="pointer"
              onClick={() => setBack(false)}
              aria-pressed={!back}
              className={`cursor-pointer rounded-full px-3.5 py-1 transition-colors ${
                !back
                  ? "bg-[#2c1d14] text-[#f0e9d7] shadow-xs"
                  : "text-[#2c1d14]/70 hover:text-[#2c1d14]"
              }`}
            >
              {labels.front}
            </button>
            <button
              type="button"
              data-cursor="pointer"
              onClick={() => setBack(true)}
              aria-pressed={back}
              className={`cursor-pointer rounded-full px-3.5 py-1 transition-colors ${
                back
                  ? "bg-[#2c1d14] text-[#f0e9d7] shadow-xs"
                  : "text-[#2c1d14]/70 hover:text-[#2c1d14]"
              }`}
            >
              {labels.back}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-center sm:pr-4 sm:text-left">
          {item.tag && (
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-[#b85222]">
              TRAIL {item.tag}
            </span>
          )}
          <h3 className="font-display text-2xl font-bold tracking-tight text-[#2c1d14] sm:text-3xl">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm leading-relaxed text-[#2c1d14]/75">
              {item.description}
            </p>
          )}
          {item.details && item.details.length > 0 && (
            <dl className="mt-1 flex flex-col gap-1.5 border-t border-[#2c1d14]/15 pt-3 text-left text-xs text-[#2c1d14]/75">
              {item.details.map((line) => (
                <div key={line} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d86a34]" />
                  <span>{line}</span>
                </div>
              ))}
            </dl>
          )}

          {onSelect && (
            <div className="mt-2 pt-1">
              <button
                type="button"
                data-cursor="pointer"
                onClick={onSelect}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#d86a34] px-6 py-2.5 text-sm font-bold text-[#f0e9d7] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#b85222] active:scale-95 sm:w-auto"
              >
                <span>{labels.select ?? "Open"}</span>
                <span aria-hidden>→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function ClothingRailHero({
  items,
  eyebrow,
  heading,
  caption,
  action,
  autoplay = true,
  interval = 3400,
  hanger = "matte",
  labels: labelOverrides,
  onOpenChange,
  onFocusChange,
  onSelectItem,
  className = "",
  ...rest
}: ClothingRailHeroProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const railRef = React.useRef<HTMLDivElement>(null);
  const openerRef = React.useRef<HTMLButtonElement | null>(null);
  const swipeStartX = React.useRef<number | null>(null);

  const [viewport, setViewport] = React.useState({ w: 0, h: 800 });
  const [focused, setFocusedState] = React.useState<number | null>(() =>
    autoplay && items.length >= 2 ? 0 : null,
  );
  const [open, setOpen] = React.useState<number | null>(null);
  const [idle, setIdle] = React.useState(autoplay);
  const [paused, setPaused] = React.useState(false);

  const setFocused = React.useCallback(
    (next: number | null | ((prev: number | null) => number | null)) => {
      setFocusedState((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        if (resolved !== prev) onFocusChange?.(resolved);
        return resolved;
      });
    },
    [onFocusChange],
  );

  React.useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const sync = () => {
      setViewport({
        w: el.clientWidth,
        h: window.innerHeight || 800,
      });
    };
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  React.useEffect(() => {
    if (!idle || paused || open !== null || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setFocused((f) => ((f ?? -1) + 1) % items.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [idle, paused, open, interval, items.length, setFocused]);

  const setOpened = (next: number | null) => {
    setOpen(next);
    onOpenChange?.(next);
    if (next === null) {
      requestAnimationFrame(() => openerRef.current?.focus());
    }
  };

  const n = items.length;
  const width = viewport.w;
  const vh = viewport.h;
  const wide = width >= 640 || width === 0;

  const pieceH = wide
    ? Math.round(
        Math.max(
          195,
          Math.min(365, ((width || 960) * 0.28) / ASPECT, vh * 0.5),
        ),
      )
    : Math.round(Math.max(210, Math.min(320, vh * 0.45, width * 0.85)));
  const pieceW = pieceH * ASPECT;
  const hookY = pieceH * ((HOOK_TOP + 6) / VB_H);

  /* Mathematically symmetric layout across rail brackets */
  const padX = Math.max(20, Math.round(width * 0.04));
  let idleStep = 0;
  let extraGap = 0;
  if (wide && width > 0 && n > 1) {
    const usable = Math.max(pieceW, width - padX * 2 - pieceW);
    idleStep = usable / (n - 1);
    extraGap = Math.max(0, pieceW * 0.48 - idleStep);
  }

  const centre = Math.round((n - 1) / 2);
  const currentCarousel = focused ?? centre;
  const mobileStepX = Math.min(96, Math.max(66, (width || 360) * 0.25));

  const stepCarousel = (delta: number) => {
    setIdle(false);
    setFocused((f) => {
      const cur = f ?? centre;
      return (cur + delta + n) % n;
    });
  };

  return (
    <section
      aria-label={heading ?? "Trail Menu"}
      className={`relative w-full overflow-x-clip py-2 select-none sm:py-3 ${className}`}
      {...rest}
    >
      {(eyebrow || heading) && (
        <header className="mx-auto mb-2 max-w-xl px-4 text-center sm:mb-3">
          {eyebrow && (
            <p className="font-mono text-[11px] font-bold tracking-widest uppercase text-[#b85222] sm:text-xs">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="mt-0.5 font-display text-2xl font-bold tracking-tight text-[#2c1d14] sm:text-3xl md:text-4xl">
              {heading}
            </h2>
          )}
        </header>
      )}

      <div
        ref={railRef}
        onMouseLeave={() => {
          setPaused(false);
          if (!idle && wide) setFocused(null);
        }}
        onMouseEnter={() => setPaused(true)}
        onPointerDown={(e) => {
          if (!wide) swipeStartX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (wide || swipeStartX.current === null) return;
          const dx = e.clientX - swipeStartX.current;
          swipeStartX.current = null;
          if (Math.abs(dx) > 36) {
            stepCarousel(dx < 0 ? 1 : -1);
          }
        }}
        className="relative mx-auto w-full max-w-6xl touch-pan-y"
        style={{ height: `${pieceH}px`, perspective: `${PERSPECTIVE}px` }}
      >
        {/* Architectural wall-mounted brushed metal trail rail + espresso end brackets */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-2 left-2 z-10 flex items-center sm:right-5 sm:left-5"
          style={{
            top: `${hookY - RAIL_R}px`,
            height: `${RAIL_R * 2}px`,
          }}
        >
          <span className="h-4 w-2.5 shrink-0 rounded-sm bg-[#2c1d14] shadow-sm sm:h-5 sm:w-3" />
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(240,233,215,0.95) 0%, #c8bcaa 42%, #8e7e6c 76%, #625344 100%)",
              boxShadow:
                "0 2px 6px rgba(44,29,20,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
            }}
          />
          <span className="h-4 w-2.5 shrink-0 rounded-sm bg-[#2c1d14] shadow-sm sm:h-5 sm:w-3" />
        </div>

        {wide
          ? items.map((item, i) => {
              const isFocused = focused === i;
              const focusShift =
                focused === null
                  ? 0
                  : i < focused
                    ? -extraGap * 0.5
                    : i > focused
                      ? extraGap * 0.5
                      : 0;
              const left = Math.max(
                8,
                Math.min(
                  width - pieceW - 8,
                  padX + i * idleStep + focusShift,
                ),
              );
              const depth = isFocused
                ? n + 2
                : focused !== null
                  ? n - Math.abs(i - focused)
                  : i + 1;
              return (
                <PieceCard
                  key={item.id}
                  item={item}
                  turned={isFocused}
                  focused={isFocused}
                  hanger={hanger}
                  label={`${item.name} — ${labels.show}`}
                  buttonRef={(el) => {
                    if (open === i) openerRef.current = el;
                  }}
                  style={{
                    left: `${left}px`,
                    width: `${pieceW}px`,
                    height: `${pieceH}px`,
                    zIndex: depth,
                  }}
                  onEnter={() => {
                    setIdle(false);
                    setFocused(i);
                  }}
                  onClick={() => {
                    setIdle(false);
                    setFocused(i);
                    setOpened(i);
                  }}
                />
              );
            })
          : items.map((item, i) => {
              const d = i - currentCarousel;
              const isFocused = d === 0;
              return (
                <PieceCard
                  key={item.id}
                  item={item}
                  turned={isFocused}
                  focused={isFocused}
                  hanger={hanger}
                  label={`${item.name} — ${labels.show}`}
                  buttonRef={(el) => {
                    if (open === i) openerRef.current = el;
                  }}
                  style={{
                    left: "50%",
                    width: `${pieceW}px`,
                    height: `${pieceH}px`,
                    marginLeft: `${-pieceW / 2}px`,
                    transform: `translateX(${d * mobileStepX}px) translateZ(${-Math.abs(d) * 48}px)`,
                    zIndex: n - Math.abs(d) + (isFocused ? 5 : 0),
                    opacity: Math.abs(d) > 2 ? 0 : 1 - Math.abs(d) * 0.18,
                  }}
                  onClick={() => {
                    setIdle(false);
                    if (isFocused) setOpened(i);
                    else setFocused(i);
                  }}
                />
              );
            })}

        {/* Mobile Carousel Left / Right controls */}
        {!wide && n > 1 && (
          <>
            <button
              type="button"
              data-cursor="pointer"
              aria-label={labels.prev}
              onClick={() => stepCarousel(-1)}
              className="absolute top-1/2 left-1 z-30 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#2c1d14]/15 bg-[#f0e9d7]/90 text-[#2c1d14] shadow-md backdrop-blur-sm transition hover:bg-[#d86a34] hover:text-[#f0e9d7] active:scale-95"
            >
              ‹
            </button>
            <button
              type="button"
              data-cursor="pointer"
              aria-label={labels.next}
              onClick={() => stepCarousel(1)}
              className="absolute top-1/2 right-1 z-30 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#2c1d14]/15 bg-[#f0e9d7]/90 text-[#2c1d14] shadow-md backdrop-blur-sm transition hover:bg-[#d86a34] hover:text-[#f0e9d7] active:scale-95"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Progress dots on compact screens + subtle caption */}
      <div className="mx-auto mt-2 flex max-w-lg flex-col items-center justify-center gap-2 px-4 text-center sm:mt-3">
        {!wide && n > 1 && (
          <div className="flex items-center gap-1.5" role="tablist" aria-label={heading ?? "Packs"}>
            {items.map((item, i) => {
              const active = i === currentCarousel;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  data-cursor="pointer"
                  aria-label={item.name}
                  aria-selected={active}
                  onClick={() => {
                    setIdle(false);
                    setFocused(i);
                  }}
                  className={`h-2 cursor-pointer rounded-full transition-all ${
                    active ? "w-6 bg-[#d86a34]" : "w-2 bg-[#2c1d14]/25"
                  }`}
                />
              );
            })}
          </div>
        )}

        {caption && (
          <p className="text-xs text-[#2c1d14]/70 sm:text-sm">{caption}</p>
        )}
        {action}
      </div>

      {open !== null && items[open] && (
        <Detail
          item={items[open]}
          hanger={hanger}
          labels={labels}
          onClose={() => setOpened(null)}
          onSelect={
            onSelectItem
              ? () => {
                  const target = items[open];
                  const idx = open;
                  setOpened(null);
                  onSelectItem(target, idx);
                }
              : undefined
          }
        />
      )}
    </section>
  );
}

export default ClothingRailHero;
