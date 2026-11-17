'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject, FormEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowLeft, ArrowUpLeft, ArrowUpRight, Check, ChevronLeft, Menu, MousePointer2, MoveUpLeft, Plus, X } from 'lucide-react';
import ScrollEngine from './ScrollEngine';
import Aurora from './react-bits/Aurora';
import BlurText from './react-bits/BlurText';
import GlassSurface from './react-bits/GlassSurface';
import Magnet from './react-bits/Magnet';
import SpotlightCard from './react-bits/SpotlightCard';

const SculptureScene = dynamic(() => import('./SculptureScene'), { ssr: false });
gsap.registerPlugin(ScrollTrigger);

type Project = {
  index: string; title: string; label: string; category: string; year: string; blurb: string; tech: string[]; visual: string;
};
const projects: Project[] = [
  { index: '01', title: 'AETHER', label: 'ورای یک محصول', category: 'DIGITAL COMMERCE', year: '2026', blurb: 'تجربه‌ای فرضی برای ارائه یک محصول آینده‌گرا؛ ترکیبی از فرم، بافت و داستان، بدون فروشگاه سنتی.', tech: ['3D ART', 'MOTION', 'COMMERCE'], visual: 'aether' },
  { index: '02', title: 'MONO / FORM', label: 'سکوتی که دیده می‌شود', category: 'ARCHITECTURE', year: '2026', blurb: 'یک کانسپت معماری با قاب‌بندی‌های جسورانه، فضای سفید و انتقال‌های ظریف میان تصاویر و متن.', tech: ['ART DIRECTION', 'SCROLL', 'EDITORIAL'], visual: 'mono' },
  { index: '03', title: 'NOCTURNE', label: 'زیبایی در تاریکی', category: 'LUXURY EXPERIENCE', year: '2026', blurb: 'کانسپت یک برند لوکس با نورپردازی سینمایی، اشیای شناور و حرکت‌های هماهنگ با اسکرول.', tech: ['WEBGL', 'INTERACTION', 'BRANDING'], visual: 'nocturne' },
];

function ProjectArtwork({variant}: {variant:string}) {
  return <div className={`project-art project-art--${variant}`} aria-hidden="true">
    <div className="project-art__grain"/>
    {variant === 'aether' && <><div className="aether-halo"/><div className="aether-object"><div className="aether-object__inner"/></div><span className="art-label art-label--a">OBJECT / 001</span><span className="art-label art-label--b">A NEW DIMENSION</span></>}
    {variant === 'mono' && <><div className="mono-sun"/><div className="mono-building"><i/><i/><i/><i/></div><span className="art-label art-label--a">FORM FOLLOWS FEELING</span><span className="art-label art-label--b">M / F STUDIO</span></>}
    {variant === 'nocturne' && <><div className="nocturne-glow"/><div className="nocturne-bottle"><span className="nocturne-bottle__cap"/><span className="nocturne-bottle__text">N.</span></div><span className="art-label art-label--a">MADE OF MIDNIGHT</span><span className="art-label art-label--b">EDITION 01</span></>}
  </div>;
}

function CaseModal({ project, onClose }: {project: Project;onClose:()=>void}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {if (e.key === 'Escape') onClose();};
    document.addEventListener('keydown',onKey);
    return () => document.removeEventListener('keydown',onKey);
  },[onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <div className="case-modal" role="dialog" aria-modal="true" aria-label={`پروژه ${project.title}`} onMouseDown={e=>e.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="بستن پنجره"><X size={20}/></button>
      <div className="case-modal__visual"><ProjectArtwork variant={project.visual}/></div>
      <div className="case-modal__content"><span className="eyebrow">CONCEPT PROJECT / {project.index}</span><h2>{project.title}</h2><h3>{project.label}</h3><p>{project.blurb}</p><div className="case-modal__tags">{project.tech.map(t=><span key={t}>{t}</span>)}</div><p className="case-modal__note">این پروژه صرفاً یک کانسپت نمایشی برای طراحی این وب‌سایت است.</p></div>
    </div>
  </div>;
}

export default function Experience() {
  const progress = useRef(0);
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [intro, setIntro] = useState(true);
  const [activeProject, setActiveProject] = useState<Project|null>(null);
  const [briefOpen, setBriefOpen] = useState(false);
  const [briefSent, setBriefSent] = useState(false);
  const [briefName, setBriefName] = useState('');
  const [briefDescription, setBriefDescription] = useState('');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(reduced);
    if (reduced) {setIntro(false); return;}
    const timer = window.setTimeout(() => setIntro(false), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (intro) return;
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const context = gsap.context(() => {
        ScrollTrigger.create({ trigger: '.cinematic-wrap', start:'top top', end:'bottom bottom', onUpdate:self => { progress.current = self.progress; } });
        const story = gsap.timeline({scrollTrigger:{trigger:'.story',start:'top 75%',end:'bottom bottom',scrub:1.1}});
        story.to('.story-copy--one',{opacity:0,y:-65,duration:1},.25)
          .fromTo('.story-copy--two',{opacity:0,y:55},{opacity:1,y:0,duration:1},.6)
          .to('.story-copy--two',{opacity:0,y:-55,duration:1},2)
          .fromTo('.story-copy--three',{opacity:0,y:55},{opacity:1,y:0,duration:1},2.4)
          .to('.story-interface',{opacity:1,scale:1,y:0,duration:1},2.5)
          .to('.story-copy--three',{opacity:1,duration:1},3.2);
        gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => {
          gsap.fromTo(el,{opacity:0,y:64},{opacity:1,y:0,duration:1.25,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'}});
        });
        gsap.fromTo('.morph-visual__panel',{borderRadius:'2px',scale:.84},{borderRadius:'44px',scale:1,ease:'none',scrollTrigger:{trigger:'.morph',start:'top bottom',end:'center center',scrub:1}});
        gsap.to('.progress-indicator__line',{scaleX:1,ease:'none',scrollTrigger:{trigger:root,start:'top top',end:'bottom bottom',scrub:.15}});
      },root);
      mm.add('(min-width: 900px)', () => {
        const section = root.querySelector<HTMLElement>('.work');
        const track = trackRef.current;
        if (!track || !section) return;
        const travel = () => Math.max(0,track.scrollWidth - window.innerWidth + 56);
        const tween = gsap.to(track,{x:()=> -travel(),ease:'none',scrollTrigger:{trigger:section,start:'top top',end:()=>`+=${travel()}`,pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true}});
        return () => {tween.scrollTrigger?.kill();tween.kill();};
      });
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load',refresh,{once:true});
      return () => { window.removeEventListener('load',refresh); mm.revert(); context.revert(); };
    }
    return () => mm.revert();
  }, [intro]);

  useEffect(() => {
    if (!intro) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [intro]);

  useEffect(() => {
    if (!menuOpen && !briefOpen && !activeProject) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow='hidden';
    return () => {document.body.style.overflow=previous;};
  }, [menuOpen,briefOpen,activeProject]);

  const closeAndGo = () => setMenuOpen(false);
  const submitBrief = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = `NOVA — PROJECT BRIEF\n\nنام: ${briefName}\n\nشرح پروژه:\n${briefDescription}\n\nCreated: ${new Date().toISOString()}\n`;
    const url = URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a');link.href=url;link.download='nova-project-brief.txt';link.click();
    window.setTimeout(()=>URL.revokeObjectURL(url),500);setBriefSent(true);
  };

  return <main ref={rootRef} className="site">
    {!intro && <ScrollEngine/>}
    <div className="progress-indicator" aria-hidden="true"><div className="progress-indicator__line"/></div>
    {intro && <div className="intro" aria-label="در حال آماده‌سازی تجربه"><div className="intro__word"><span>N</span><span>O</span><span>V</span><span>A</span><i/></div><div className="intro__sub">CRAFTING WHAT'S NEXT</div><div className="intro__line"/></div>}

    <header className="header">
      <a className="logo" href="#top" onClick={closeAndGo} aria-label="بازگشت به بالای صفحه">NOVA<span className="logo__dot">.</span><span className="logo__subtitle">CREATIVE STUDIO</span></a>
      <GlassSurface className="header__glass" radius={28} blur={18}>
        <nav className="header__nav" aria-label="منوی اصلی"><a href="#work">پروژه‌ها</a><a href="#about">درباره ما</a><a href="#services">توانایی‌ها</a></nav>
      </GlassSurface>
      <div className="header__actions"><Magnet><button className="header__contact" onClick={()=>{setBriefSent(false);setBriefOpen(true);}}>شروع یک پروژه <ArrowUpLeft size={16}/></button></Magnet><button className="mobile-toggle" onClick={()=>setMenuOpen(true)} aria-label="باز کردن منو"><Menu/></button></div>
    </header>

    {menuOpen && <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="منوی سایت"><button onClick={()=>setMenuOpen(false)} className="mobile-menu__close" aria-label="بستن منو"><X/></button><div className="mobile-menu__brand">NOVA.</div><nav><a onClick={closeAndGo} href="#top">صفحه اول</a><a onClick={closeAndGo} href="#work">پروژه‌ها</a><a onClick={closeAndGo} href="#about">درباره ما</a><a onClick={closeAndGo} href="#services">توانایی‌ها</a><a onClick={closeAndGo} href="#contact">ارتباط</a></nav><span>MADE TO MOVE YOU.™</span></div>}

    <div className="cinematic-wrap" id="top">
      <div className="scene-sticky" aria-hidden="true"><Aurora/><div className="scene-vignette"/>{!intro && <SculptureScene progress={progress as MutableRefObject<number>} reducedMotion={reducedMotion}/>}<div className="scene-grid"/></div>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__top"><span><span className="online-dot"/> INDEPENDENT CREATIVE STUDIO</span><span>DIGITAL / EVERYWHERE — 2026</span></div>
        <div className="hero__content">
          <div className="hero__pill"><span className="hero__pill-line"/> طراحی فراتر از انتظار</div>
          <h1 id="hero-title"><span className="hero__title-line">{intro ? "تجربه‌هایی که" : <BlurText text="تجربه‌هایی که" />}</span><span className="hero__title-line hero__title-line--alt">{intro ? "حس می‌شن." : <BlurText text="حس می‌شن." />}</span></h1>
          <p className="hero__description">جایی که خلاقیت، حرکت و تکنولوژی<br/>با هم یک داستان متفاوت می‌سازن.</p>
          <div className="hero__cta"><Magnet><a href="#work" className="button-primary">کشف دنیای ما <ArrowUpLeft size={19}/></a></Magnet><a className="button-outline" href="#story" aria-label="مشاهده تجربه اسکرولی"><span className="button-outline__icon"><ArrowDown size={16}/></span> با اسکرول تجربه کن</a></div>
        </div>
        <div className="hero__bottom"><div className="hero__index">01 <span>—</span> 05</div><div className="hero__scroll"><div className="mouse"><i/></div><span>SCROLL TO EXPLORE</span></div><div className="hero__coordinates">AVAILABLE WORLDWIDE</div></div>
      </section>
      <section className="story" id="story" aria-label="روایت اسکرولی طراحی">
        <div className="story__rail"><span>01 / THE EXPERIENCE</span><span>↓</span></div>
        <div className="story-copy story-copy--one"><span className="eyebrow">01 / FORM</span><h2>همه‌چیز با یک<br/><em>فرم</em> شروع می‌شه.</h2><p>نه یک قالب تکراری؛ یک ایده که کم‌کم شخصیت پیدا می‌کنه.</p></div>
        <div className="story-copy story-copy--two"><span className="eyebrow">02 / MOTION</span><h2>به ایده‌ها<br/><em>حرکت</em> می‌دیم.</h2><p>هر جزئیات، هر ترنزیشن و هر لحظه، بخشی از روایت شماست.</p></div>
        <div className="story-copy story-copy--three"><span className="eyebrow">03 / FEELING</span><h2>تا چیزی فراتر<br/>از یک صفحه <em>بسازیم.</em></h2><p>تجربه‌ای که فقط دیده نمی‌شه؛ حس می‌شه.</p></div>
        <div className="story-interface" aria-hidden="true"><div className="story-interface__head"><span>PROCESS / LIVE</span><span>● ● ●</span></div><div className="story-interface__visual"><span>IDEA</span><i/><span>DESIGN</span><i/><span>EXPERIENCE</span></div><div className="story-interface__foot">FORM MEETS FUNCTION <span>100%</span></div></div>
      </section>
    </div>

    <section className="work" id="work" aria-labelledby="work-title">
      <div className="work__header"><div className="eyebrow">02 / SELECTED PROJECTS</div><div className="work__heading"><h2 id="work-title">ایده‌هایی برای<br/><em>دنیایی متفاوت.</em></h2><p>سه کانسپت نمایشی برای نمایش قدرت طراحی و تعامل. پروژه‌های واقعی بعداً جایگزین می‌شن.</p></div><div className="work__hint"><ArrowLeft size={18}/> اسکرول کن تا کشف کنی</div></div>
      <div className="work__track" ref={trackRef}>
        {projects.map(project=><button type="button" className="project-card" key={project.index} onClick={()=>setActiveProject(project)} aria-label={`نمایش پروژه ${project.title}`}>
          <div className="project-card__visual"><ProjectArtwork variant={project.visual}/><div className="project-card__explore"><ArrowUpLeft size={24}/></div><span className="project-card__number">/{project.index}</span></div>
          <div className="project-card__footer"><div><span>{project.category} / {project.year}</span><h3>{project.title}</h3></div><div><span>PROJECT CONCEPT</span><p>{project.label}</p></div></div>
        </button>)}
      </div>
      <div className="work__bottom">SCROLL-DRIVEN STORIES <span>✳</span> CRAFTED WITH INTENT</div>
    </section>

    <section className="morph" id="about" aria-labelledby="about-title">
      <div className="morph__top reveal"><span className="eyebrow">03 / OUR PHILOSOPHY</span><span>DESIGN IS NOT DECORATION. IT'S DIRECTION.</span></div>
      <h2 id="about-title" className="morph__heading reveal">ما به <span>جزئیات</span> وسواس داریم.<br/>چون تفاوت همین‌جاست.</h2>
      <div className="morph__body"><div className="morph-visual reveal"><div className="morph-visual__panel"><div className="morph-visual__orb"><i/><i/><i/></div><span className="morph-visual__caption">THE ART OF TRANSFORMATION</span><div className="morph-visual__coordinate">X: 024.87<br/>Y: 140.39</div></div></div><div className="morph__copy reveal"><span className="eyebrow">BEYOND THE ORDINARY</span><p>از اولین پیکسل تا آخرین فریم، همه‌چیز باید هدف داشته باشه. ما سرعت، روایت و تعامل رو کنار هم می‌ذاریم تا محصول فقط زیبا نباشه؛ <strong>زنده به نظر برسه.</strong></p><div className="morph__signature">NOVA <span>— CREATIVE DIRECTION</span></div></div></div>
    </section>

    <section className="services" id="services" aria-labelledby="services-title"><div className="services__backdrop"><Aurora light/></div>
      <div className="services__head reveal"><span className="eyebrow">04 / WHAT WE DO</span><div><h2 id="services-title">هر چیزی،<br/><em>به‌شکل متفاوت.</em></h2><p>از یک خط کد تا یک جهان بصری؛ هر ابزار در خدمت یک تجربه بهتر.</p></div></div>
      <div className="services__grid">
        <SpotlightCard className="service-card service-card--large reveal" spotlightColor="rgba(133,159,255,.24)"><div className="service-card__top"><span>01 / IMMERSIVE WEB</span><ArrowUpLeft size={21}/></div><div className="service-card__art service-card__art--orbit"><div className="service-orbit"><i/><i/><i/></div></div><div className="service-card__bottom"><h3>تجربه‌های سه‌بعدی</h3><p>محیط‌های تعاملی، مدل‌های سه‌بعدی و روایت بصری با Three.js و WebGL.</p></div></SpotlightCard>
        <SpotlightCard className="service-card reveal" spotlightColor="rgba(157,162,255,.28)"><div className="service-card__top"><span>02 / MOTION SYSTEMS</span><ArrowUpLeft size={21}/></div><div className="service-card__art service-card__art--type"><span>MOVE</span><span>WITH</span><span>MEANING.</span></div><div className="service-card__bottom"><h3>انیمیشن و اسکرول</h3><p>تایم‌لاین‌های سینمایی و تعامل‌های دقیق.</p></div></SpotlightCard>
        <SpotlightCard className="service-card reveal" spotlightColor="rgba(180,193,255,.28)"><div className="service-card__top"><span>03 / DIGITAL DESIGN</span><ArrowUpLeft size={21}/></div><div className="service-card__art service-card__art--glass"><div className="mini-glass"><span>DESIGN</span><span>IS A FEELING</span><i/></div></div><div className="service-card__bottom"><h3>طراحی تجربه کاربری</h3><p>مینیمال، سریع، واکنش‌گرا و فراتر از الگوهای تکراری.</p></div></SpotlightCard>
      </div>
      <div className="services__footer reveal"><span>TOOLS WE LOVE</span><div>REACT <i/> GSAP <i/> LENIS <i/> THREE.JS <i/> REACT BITS</div></div>
    </section>

    <section className="contact" id="contact" aria-labelledby="contact-title"><div className="contact__orb" aria-hidden="true"/><div className="contact__background" aria-hidden="true"/>
      <div className="contact__top"><span className="eyebrow">05 / THE NEXT CHAPTER</span><span>HAVE A PROJECT IN MIND?</span></div>
      <div className="contact__center reveal"><p>فکر می‌کنی ایده‌ات آماده‌ست؟</p><h2 id="contact-title">بیایید چیز<br/><em>خاصی</em> بسازیم.</h2><Magnet strength={3.8}><button type="button" className="contact__button" onClick={()=>{setBriefOpen(true);setBriefSent(false);}}><span>شروع گفتگو</span><ArrowUpLeft size={28}/></button></Magnet></div>
      <footer className="footer"><a href="#top" className="footer__logo">NOVA<span>.</span></a><span>© 2026 NOVA STUDIO. CONCEPT DEMO.</span><a href="#top" className="footer__back">بازگشت به بالا <ArrowUpRight size={15}/></a></footer>
    </section>

    {activeProject && <CaseModal project={activeProject} onClose={()=>setActiveProject(null)}/>}
    {briefOpen && <div className="modal-backdrop" onMouseDown={()=>setBriefOpen(false)}><div role="dialog" aria-modal="true" aria-labelledby="brief-title" className="brief-modal" onMouseDown={e=>e.stopPropagation()}><button onClick={()=>setBriefOpen(false)} className="modal-close" aria-label="بستن"><X size={20}/></button><span className="eyebrow">LET'S MAKE SOMETHING GREAT</span><h2 id="brief-title">پروژه بعدی، از اینجا شروع می‌شه.</h2><p>این نسخه یک دموست؛ اطلاعات فعلاً به سرور ارسال نمی‌شن. می‌تونی خلاصه پروژه‌ات رو دانلود کنی.</p><form onSubmit={submitBrief}><label htmlFor="brief-name">نام شما</label><input id="brief-name" required maxLength={80} value={briefName} onChange={e=>setBriefName(e.target.value)} placeholder="نام یا نام مجموعه"/><label htmlFor="brief-description">ایده یا نیاز پروژه</label><textarea id="brief-description" required minLength={12} maxLength={1500} rows={4} value={briefDescription} onChange={e=>setBriefDescription(e.target.value)} placeholder="کمی درباره چیزی که می‌خوای بسازی بنویس..."/><button className="brief-submit" type="submit">دانلود بریف پروژه <ArrowUpLeft size={19}/></button>{briefSent && <div className="brief-success"><Check size={17}/> فایل آماده و دانلود شد. این فرم هنوز ارسال آنلاین ندارد.</div>}</form></div></div>}
  </main>;
}
