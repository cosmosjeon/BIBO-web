"use client";

import { motion, useSpring } from "framer-motion";
import { FC, JSX, RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface Position {
  x: number;
  y: number;
}

export interface SpringConfig {
  damping: number;
  stiffness: number;
  mass: number;
  restDelta: number;
}

export interface SmoothCursorProps {
  cursor?: JSX.Element;
  springConfig?: SpringConfig;
  className?: string;
  size?: number;
  color?: string;
  hideOnLeave?: boolean;
  trailLength?: number;
  showTrail?: boolean;
  rotateOnMove?: boolean;
  scaleOnClick?: boolean;
  glowEffect?: boolean;
  magneticDistance?: number;
  magneticElements?: string;
  onCursorMove?: (position: Position) => void;
  onCursorEnter?: () => void;
  onCursorLeave?: () => void;
  disabled?: boolean;
  /**
   * Container element to scope the custom cursor to.
   * When provided, listeners and cursor hiding apply only within this element.
   */
  containerRef?: RefObject<HTMLDivElement | null>;
  /**
   * 배경 밝기에 따라 자동으로 흑/백 색상을 반전합니다.
   */
  autoInvertByBackground?: boolean;
  /**
   * 이 선택자에 해당하는 영역 위에서는 시스템 기본 커서를 사용하고
   * 커스텀 커서를 숨깁니다. 예: "[data-native-cursor]".
   */
  nativeCursorSelector?: string;
}

const DefaultCursorSVG: FC<{ size?: number; color?: string; className?: string }> = ({
  size = 25,
  color = "black",
  className,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size * 2}
      height={size * 2.16}
      viewBox="0 0 50 54"
      fill="none"
      className={cn("pointer-events-none", className)}
    >
      <g filter="url(#filter0_d_91_7928)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill={color}
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_91_7928"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export function SmoothCursor({
  cursor,
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
  className,
  size = 25,
  color = "black",
  hideOnLeave = true,
  trailLength = 5,
  showTrail = false,
  rotateOnMove = true,
  scaleOnClick = true,
  glowEffect = false,
  magneticDistance = 50,
  magneticElements = "[data-magnetic]",
  onCursorMove,
  onCursorEnter,
  onCursorLeave,
  disabled = false,
  containerRef,
  autoInvertByBackground = false,
  nativeCursorSelector = '[data-native-cursor]',
}: SmoothCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<Position[]>([]);
  const [effectiveColor, setEffectiveColor] = useState<string>(color);
  const [mounted, setMounted] = useState(false);

  const lastMousePos = useRef<Position>({ x: 0, y: 0 });
  const velocity = useRef<Position>({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);

  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  });
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 35,
  });

  const cursorElement = cursor || (
    <DefaultCursorSVG size={size} color={effectiveColor} />
  );

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const parseRgb = (value: string) => {
    // supports rgb(a) like: rgb(255, 255, 255) or rgba(0,0,0,0.5)
    const match = value
      .replace(/\s+/g, "")
      .match(/^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(?:,(\d*(?:\.\d+)?))?\)$/i);
    if (!match) return null;
    const r = Math.min(255, Math.max(0, parseInt(match[1], 10)));
    const g = Math.min(255, Math.max(0, parseInt(match[2], 10)));
    const b = Math.min(255, Math.max(0, parseInt(match[3], 10)));
    const a = match[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(match[4]))) : 1;
    return { r, g, b, a };
  };

  const isTransparent = (c: string) => {
    if (!c) return true;
    if (c === "transparent") return true;
    const parsed = parseRgb(c);
    return !parsed || parsed.a === 0;
  };

  const getBackgroundAtPoint = (x: number, y: number): string => {
    const el = document.elementFromPoint(x, y);
    let node: HTMLElement | null = (el as HTMLElement) ?? null;
    while (node) {
      const bg = getComputedStyle(node).backgroundColor;
      if (!isTransparent(bg)) return bg;
      node = node.parentElement;
    }
    // fallback to body/html
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    if (!isTransparent(bodyBg)) return bodyBg;
    const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
    if (!isTransparent(htmlBg)) return htmlBg;
    return "rgb(255,255,255)"; // default white
  };

  const relativeLuminance = (r: number, g: number, b: number) => {
    const srgb = [r, g, b].map((v) => v / 255);
    const lin = srgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  };

  useEffect(() => {
    if (disabled) return;

    const container = containerRef?.current ?? (typeof document !== "undefined" ? document.body : null);
    if (!container) return;

    const updateVelocity = (currentPos: Position) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime.current;
      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        };
      }
      lastUpdateTime.current = currentTime;
      lastMousePos.current = currentPos;
    };

    const updateTrail = (pos: Position) => {
      if (!showTrail) return;
      setTrail((prev) => [pos, ...prev.slice(0, trailLength - 1)]);
    };

    const findMagneticElement = (x: number, y: number) => {
      const elements = container.querySelectorAll(magneticElements);
      for (const element of Array.from(elements)) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(x - centerX, y - centerY);
        if (distance < magneticDistance) {
          return { x: centerX, y: centerY, distance };
        }
      }
      return null;
    };

    const smoothMouseMove = (e: MouseEvent) => {
      let currentPos = { x: e.clientX, y: e.clientY };

      const magneticTarget = findMagneticElement(currentPos.x, currentPos.y);
      if (magneticTarget) {
        const strength = 1 - magneticTarget.distance / magneticDistance;
        currentPos = {
          x: currentPos.x + (magneticTarget.x - currentPos.x) * strength * 0.3,
          y: currentPos.y + (magneticTarget.y - currentPos.y) * strength * 0.3,
        };
      }

      updateVelocity(currentPos);
      updateTrail(currentPos);

      const speed = Math.hypot(velocity.current.x, velocity.current.y);

      cursorX.set(currentPos.x);
      cursorY.set(currentPos.y);

      onCursorMove?.(currentPos);

      // 네이티브 커서 존 감지: 해당 영역에서는 시스템 커서 사용 + 커스텀 숨김
      const elAtPoint = document.elementFromPoint(currentPos.x, currentPos.y) as HTMLElement | null;
      const isInNativeZone = !!elAtPoint?.closest(nativeCursorSelector);
      if (isInNativeZone) {
        setIsVisible(false);
        (container as HTMLElement).style.cursor = 'auto';
      } else if (!hideOnLeave) {
        // 컨테이너 내에서는 기본적으로 커스텀 노출
        setIsVisible(true);
        (container as HTMLElement).style.cursor = 'none';
      }

      if (autoInvertByBackground) {
        const bg = getBackgroundAtPoint(currentPos.x, currentPos.y);
        const rgb = parseRgb(bg);
        if (rgb) {
          const lum = relativeLuminance(rgb.r, rgb.g, rgb.b);
          // dark background -> white cursor, light background -> black cursor
          setEffectiveColor(lum < 0.5 ? "#ffffff" : "#000000");
        } else {
          setEffectiveColor("#000000");
        }
      }

      if (speed > 0.1 && rotateOnMove) {
        const currentAngle = Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) + 90;
        let angleDiff = currentAngle - previousAngle.current;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        accumulatedRotation.current += angleDiff;
        rotation.set(accumulatedRotation.current);
        previousAngle.current = currentAngle;

        scale.set(0.95);
        const timeout = setTimeout(() => {
          scale.set(1);
        }, 150);
        return () => clearTimeout(timeout);
      }
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
      (container as HTMLElement).style.cursor = "none";
      onCursorEnter?.();
    };

    const handleMouseLeave = () => {
      if (hideOnLeave) setIsVisible(false);
      (container as HTMLElement).style.cursor = "auto";
      onCursorLeave?.();
    };

    const handleMouseDown = () => {
      if (scaleOnClick) {
        scale.set(0.8);
      }
    };

    const handleMouseUp = () => {
      if (scaleOnClick) {
        scale.set(1);
      }
    };

    let rafId = 0 as number;
    const throttledMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        if (!isVisible) {
          setIsVisible(true);
          (container as HTMLElement).style.cursor = "none";
        }
        smoothMouseMove(e);
        rafId = 0 as unknown as number;
      });
    };

    container.addEventListener("mousemove", throttledMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousemove", throttledMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseup", handleMouseUp);
      (container as HTMLElement).style.cursor = "auto";
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [
    containerRef,
    cursorX,
    cursorY,
    rotation,
    scale,
    disabled,
    showTrail,
    trailLength,
    rotateOnMove,
    scaleOnClick,
    hideOnLeave,
    magneticDistance,
    magneticElements,
    onCursorMove,
    onCursorEnter,
    onCursorLeave,
    autoInvertByBackground,
    nativeCursorSelector,
  ]);

  if (disabled || !mounted || !isVisible) return null;
  const portalTarget = typeof document !== "undefined" ? document.body : null;
  if (!portalTarget) return null;

  return createPortal(
    <>
      {showTrail &&
        trail.map((pos, index) => (
          <motion.div
            key={index}
            style={{
              position: "fixed",
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
              zIndex: 99 - index,
              pointerEvents: "none",
              opacity: ((trailLength - index) / trailLength) * 0.5,
              scale: ((trailLength - index) / trailLength) * 0.8,
            }}
            className="w-2 h-2 bg-current rounded-full"
          />
        ))}

      <motion.div
        style={{
          position: "fixed",
          left: cursorX,
          top: cursorY,
          transform: "translate(-50%, -50%)",
          rotate: rotateOnMove ? rotation : 0,
          scale: scale,
          zIndex: 100,
          pointerEvents: "none",
          willChange: "transform",
          filter: glowEffect ? `drop-shadow(0 0 10px ${effectiveColor}40)` : "none",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn("select-none", className)}
      >
        {cursorElement}
      </motion.div>
    </>,
    portalTarget
  );
}

export default SmoothCursor;
