import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeLabel, setActiveLabel] = useState<"before" | "after" | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const labelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showLabel = useCallback((pos: number) => {
    if (labelTimerRef.current) clearTimeout(labelTimerRef.current);
    if (pos >= 65) {
      setActiveLabel("before");
    } else if (pos <= 35) {
      setActiveLabel("after");
    } else {
      setActiveLabel(null);
    }
  }, []);

  const calcPos = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(pct);
      showLabel(pct);
    },
    [showLabel],
  );

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      calcPos(e.clientX);
    },
    [calcPos],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      calcPos(e.clientX);
    },
    [isDragging, calcPos],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      calcPos(e.touches[0].clientX);
    },
    [calcPos],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      calcPos(e.touches[0].clientX);
    },
    [calcPos],
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Determine label visibility
  const showBeforeLabel = activeLabel === "before";
  const showAfterLabel = activeLabel === "after";

  return (
    <div
      ref={containerRef}
      data-ocid="transformation.canvas_target"
      className="relative w-full overflow-hidden select-none"
      style={{
        aspectRatio: "16/9",
        minHeight: "280px",
        maxHeight: "75vh",
        cursor: "col-resize",
        touchAction: "none",
        borderRadius: "2px",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* After image — full container background */}
      <img
        src={afterSrc}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: "cover", objectPosition: "center" }}
        draggable={false}
      />

      {/* Before image — clipped to left portion */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="absolute inset-y-0 left-0 h-full"
          style={{
            width:
              containerRef.current?.getBoundingClientRect().width ?? "100vw",
            objectFit: "cover",
            objectPosition: "center",
          }}
          draggable={false}
        />
      </div>

      {/* Drag handle line */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      >
        {/* Thin white line */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.35)]" />

        {/* Circular grab handle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-[0_2px_16px_rgba(0,0,0,0.3)] flex items-center justify-center"
          style={{ pointerEvents: "none" }}
        >
          {/* Double chevron arrows */}
          <svg
            width="22"
            height="14"
            viewBox="0 0 22 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M7 1L1 7L7 13"
              stroke="#1a1a1a"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 1L21 7L15 13"
              stroke="#1a1a1a"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Before label — centre-left pop-up */}
      <div
        className="absolute inset-0 flex items-center justify-start pointer-events-none pl-8 md:pl-12"
        style={{
          transition: "opacity 0.25s ease, transform 0.25s ease",
          opacity: showBeforeLabel ? 1 : 0,
          transform: showBeforeLabel ? "scale(1)" : "scale(0.85)",
        }}
      >
        <span
          className="px-5 py-2 text-sm md:text-base tracking-[0.2em] uppercase text-white font-medium"
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            borderRadius: "2px",
            letterSpacing: "0.22em",
          }}
        >
          {beforeLabel}
        </span>
      </div>

      {/* After label — centre-right pop-up */}
      <div
        className="absolute inset-0 flex items-center justify-end pointer-events-none pr-8 md:pr-12"
        style={{
          transition: "opacity 0.25s ease, transform 0.25s ease",
          opacity: showAfterLabel ? 1 : 0,
          transform: showAfterLabel ? "scale(1)" : "scale(0.85)",
        }}
      >
        <span
          className="px-5 py-2 text-sm md:text-base tracking-[0.2em] uppercase text-white font-medium"
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            borderRadius: "2px",
            letterSpacing: "0.22em",
          }}
        >
          {afterLabel}
        </span>
      </div>

      {/* Hint arrows shown at start */}
      <div
        className="absolute inset-0 flex items-end justify-center pb-5 pointer-events-none"
        style={{
          opacity: activeLabel === null && sliderPos === 50 ? 0.7 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <span
          className="text-[10px] tracking-[0.2em] uppercase text-white"
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          }}
        >
          Drag to compare
        </span>
      </div>
    </div>
  );
}
