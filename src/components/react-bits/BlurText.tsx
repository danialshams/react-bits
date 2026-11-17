'use client';

/** GSAP-powered character reveal in the style of React Bits / Blur Text.
 * https://reactbits.dev/text-animations/blur-text
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
export default function BlurText({ text, className = '', delay = .06 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const letters = ref.current?.querySelectorAll('.rb-blur-text__char');
    if (!letters) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => gsap.fromTo(letters, { opacity:0, filter:'blur(14px)', y:35 }, { opacity:1, filter:'blur(0px)', y:0, duration:1.3, ease:'power3.out', stagger:delay, delay:.3 }), ref);
    return () => context.revert();
  }, [text, delay]);
  return <span ref={ref} className={`rb-blur-text ${className}`} aria-label={text}>{Array.from(text).map((ch, i) => <span aria-hidden="true" className="rb-blur-text__char" key={`${ch}-${i}`}>{ch === ' ' ? '\u00a0' : ch}</span>)}</span>;
}
