"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  /** Duration in ms */
  duration?: number;
  /** Prefix like "$" */
  prefix?: string;
  /** Suffix like "%" */
  suffix?: string;
  /** Max decimals */
  decimals?: number;
  /** Optional className applied to the outer span */
  className?: string;
}

/**
 * Odometer-style animated number. Tweens from the previous value to the
 * current one using requestAnimationFrame + an easing function.
 */
export default function AnimatedNumber({
  value,
  duration = 700,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  // React 19 requires an initial value for every useRef() call
  const prevRef = useRef<number>(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    if (start === end) {
      setDisplay(end);
      return;
    }

    const t0 = performance.now();
    const tick = (now: number) => {
      const elapsed = now - t0;
      const progress = Math.min(1, elapsed / duration);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
      }
    };
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

