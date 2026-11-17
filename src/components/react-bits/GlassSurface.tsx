'use client';

/**
 * Lightweight adaptation of React Bits / Glass Surface.
 * Original: https://reactbits.dev/components/glass-surface
 * Uses an SVG displacement map on supporting browsers and an accessible
 * backdrop-filter fallback elsewhere. Source inspiration: David Haz / React Bits.
 */
import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  radius?: number;
  blur?: number;
  saturation?: number;
};
export default function GlassSurface({ children, className = '', style, radius = 999, blur = 20, saturation = 1.25 }: Props) {
  const rawId = useId().replace(/:/g, '');
  const filterId = `glass-${rawId}`;
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<SVGFEImageElement>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const check = () => {
      const agent = navigator.userAgent;
      setSupported(!/Safari(?!.*Chrome)|Firefox/i.test(agent) && CSS.supports('backdrop-filter', `url(#${filterId})`));
    };
    check();
    const node = container.current;
    if (!node) return;
    const update = () => {
      const { width, height } = node.getBoundingClientRect();
      const w = Math.max(width, 1), h = Math.max(height, 1);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="r" x1="0" x2="1"><stop stop-color="red"/><stop offset="1" stop-color="black"/></linearGradient><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop stop-color="blue"/><stop offset="1" stop-color="black"/></linearGradient></defs><rect width="${w}" height="${h}" fill="black"/><rect width="${w}" height="${h}" rx="${radius}" fill="url(#r)" opacity=".3"/><rect width="${w}" height="${h}" rx="${radius}" fill="url(#b)" opacity=".3"/><rect x="6" y="6" width="${Math.max(w-12,0)}" height="${Math.max(h-12,0)}" rx="${radius}" fill="#808080"/></svg>`;
      map.current?.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(svg)}`);
    };
    const observer = new ResizeObserver(update);
    observer.observe(node);
    update();
    return () => observer.disconnect();
  }, [filterId, radius]);

  return <div ref={container} className={`rb-glass ${supported ? 'rb-glass--svg' : ''} ${className}`} style={{ borderRadius: radius, '--glass-blur': `${blur}px`, '--glass-saturation': saturation, '--glass-filter': `url(#${filterId})`, ...style } as CSSProperties}>
    <svg className="rb-glass__filter" aria-hidden="true"><defs><filter id={filterId} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
      <feImage ref={map} x="0" y="0" width="100%" height="100%" result="map" preserveAspectRatio="none"/>
      <feDisplacementMap in="SourceGraphic" in2="map" scale="-21" xChannelSelector="R" yChannelSelector="G"/>
    </filter></defs></svg>
    <div className="rb-glass__sheen" aria-hidden="true"/><div className="rb-glass__content">{children}</div>
  </div>;
}
