'use client';

/** React Bits / Magnet adaptation: https://reactbits.dev/animations/magnet */
import { useEffect, useRef, type ReactNode } from 'react';

export default function Magnet({ children, padding = 70, strength = 3, className = '' }: { children: ReactNode; padding?: number; strength?: number; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = outer.current, subject = inner.current;
    if (!wrap || !subject || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0, x = 0, y = 0, tx = 0, ty = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const b = wrap.getBoundingClientRect(), cx = b.left + b.width/2, cy = b.top + b.height/2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      if (Math.abs(dx) < b.width/2+padding && Math.abs(dy) < b.height/2+padding) { tx = dx/strength; ty = dy/strength; }
      else { tx = 0; ty = 0; }
    };
    const loop = () => { x += (tx-x)*.12; y += (ty-y)*.12; subject.style.transform = `translate3d(${x}px,${y}px,0)`; frame = requestAnimationFrame(loop); };
    window.addEventListener('pointermove', move, { passive:true });
    window.addEventListener('blur', () => {tx=0;ty=0;});
    loop();
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(frame); };
  }, [padding,strength]);
  return <div ref={outer} className={`rb-magnet ${className}`}><div ref={inner}>{children}</div></div>;
}
