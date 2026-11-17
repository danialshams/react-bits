'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
export default function ScrollEngine() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration:1.22, smoothWheel:true, syncTouch:false, anchors:true, autoRaf:false });
    const update = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time*1000);
    lenis.on('scroll', update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const refresh = () => lenis.resize();
    window.addEventListener('resize',refresh);
    return () => {window.removeEventListener('resize',refresh);lenis.off('scroll',update);gsap.ticker.remove(tick);lenis.destroy();};
  },[]);
  return null;
}
