import { useId } from "react";
import type { DoctorGender } from "../hooks/useDoctorVoice";

interface DoctorIllustrationProps {
  gender: DoctorGender;
  size?: number;
  ringColor?: string;
}

export function DoctorIllustration({ gender, size = 32, ringColor }: DoctorIllustrationProps) {
  // useId() includes colons (e.g. ":r0:"), which some browsers fail to resolve
  // in an SVG `url(#...)` reference (the colon gets parsed as a namespace
  // separator) — strip them so the gradient fill/stroke actually renders.
  const gradId = `doctor-grad-${useId().replace(/:/g, "")}`;
  const isFemale = gender === "female";
  // A color-coded halo is the distinguishing signal at a glance (the hair-shape
  // difference alone is too subtle at the small sizes used in chat bubbles).
  const resolvedRing = ringColor ?? (isFemale ? "#FDF2F8" : "#EFF6FF");
  const hairColor = isFemale ? "#4A3323" : "#241B16";
  const topHair = "M27 36c0-13 9-22 21-22s21 9 21 22c-2-4-6-7-10-7 0 3-3 5-7 5h-8c-4 0-7-2-7-5-4 0-8 3-10 7Z";

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" role="img" aria-label={`Illustration of ${isFemale ? "Dr. Aria" : "Dr. Andrew"}`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14B8A6" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="48" fill={resolvedRing} />
      <path d="M18 96c2-20 12-30 28-30s26 10 28 30" fill="#FFFFFF" />

      {/* female: one continuous hair silhouette long enough to fall past the
          shoulders — the face circle drawn afterwards naturally frames it, so
          there's no risk of visible seams between separate hair pieces */}
      {isFemale && <ellipse cx="48" cy="43" rx="23" ry="33" fill={hairColor} />}

      <rect x="40" y="54" width="16" height="14" rx="6" fill="#F0C9A0" />
      <circle cx="48" cy="40" r="20" fill="#F0C9A0" />
      {!isFemale && <path d={topHair} fill={hairColor} />}
      {isFemale && (
        <path d="M44 13c1 3 1 7 0 10" stroke="#2B231C" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
      )}

      {/* eyebrows — a more attentive, professional expression */}
      <path d="M38 37c1.2-1.1 3-1.1 4.2 0" stroke="#2B2620" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M53.8 37c1.2-1.1 3-1.1 4.2 0" stroke="#2B2620" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <circle cx="41" cy="41" r="1.6" fill="#2B2620" />
      <circle cx="55" cy="41" r="1.6" fill="#2B2620" />
      {isFemale && (
        <>
          <circle cx="37.5" cy="45.5" r="2.1" fill="#F0A395" opacity="0.35" />
          <circle cx="58.5" cy="45.5" r="2.1" fill="#F0A395" opacity="0.35" />
        </>
      )}
      <path d="M42 48c2 2 10 2 12 0" stroke="#2B2620" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* lab coat lapels + a small ID badge, for a more clinical/professional coat */}
      <path d="M40 68l4 11M56 68l-4 11" stroke="#DCDCD5" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <rect x="30" y="76" width="9" height="6.5" rx="1.3" fill="#FFFFFF" stroke="#DCDCD5" strokeWidth="1" />
      <circle cx="32.3" cy="79.2" r="1.1" fill={`url(#${gradId})`} />

      <path
        d="M34 62c0 10 6 16 14 16s14-6 14-16"
        stroke={`url(#${gradId})`}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="34" cy="62" r="3" fill={`url(#${gradId})`} />
      <circle cx="62" cy="78" r="4" fill={`url(#${gradId})`} />
    </svg>
  );
}
