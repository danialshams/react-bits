'use client';

/** Performance-oriented Aurora variation inspired by React Bits Aurora background.
 * Original component: https://reactbits.dev/backgrounds/aurora
 * CSS compositing here avoids a second WebGL context beside the Three.js hero.
 */
import { useEffect, useRef } from 'react';
export default function Aurora({ light = false }: {light?: boolean}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handle = (e: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) {
        ref.current?.style.setProperty('--ax', `${((e.clientX-rect.left)/rect.width)*100}%`);
        ref.current?.style.setProperty('--ay', `${((e.clientY-rect.top)/rect.height)*100}%`);
      }
    };
    window.addEventListener('pointermove', handle, {passive:true});
    return () => window.removeEventListener('pointermove', handle);
  }, []);
  return <div ref={ref} className={`rb-aurora ${light ? 'rb-aurora--light' : ''}`} aria-hidden="true">
      <div className="rb-aurora__layer rb-aurora__layer--one"/><div className="rb-aurora__layer rb-aurora__layer--two"/>
    </div>;
}
