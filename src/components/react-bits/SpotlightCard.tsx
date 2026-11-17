'use client';

/** React Bits / Spotlight Card adaptation: https://reactbits.dev/components/spotlight-card */
import { type CSSProperties, type HTMLAttributes, useRef } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  spotlightColor?: string;
  spotlightSize?: number;
};
export default function SpotlightCard({ children, className = '', spotlightColor = 'rgba(160,172,255,.22)', spotlightSize = 350, onPointerMove, onPointerLeave, style, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} className={`rb-spotlight ${className}`} style={{ '--spotlight-color': spotlightColor, '--spotlight-size': `${spotlightSize}px`, ...style } as CSSProperties}
    onPointerMove={e => { const rect = ref.current?.getBoundingClientRect(); if (rect) { ref.current?.style.setProperty('--mx', `${e.clientX - rect.left}px`); ref.current?.style.setProperty('--my', `${e.clientY - rect.top}px`); ref.current?.style.setProperty('--mo', '1'); } onPointerMove?.(e); }}
    onPointerLeave={e => { ref.current?.style.setProperty('--mo', '0'); onPointerLeave?.(e); }} {...rest}>
    <div className="rb-spotlight__light" aria-hidden="true"/>{children}
  </div>;
}
