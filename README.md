# NOVA — Cinematic Digital Studio

An RTL-first, responsive, scroll-driven creative studio demo built with **Next.js**, **React 19**, **GSAP / ScrollTrigger**, **Lenis**, **React Three Fiber / Three.js**, and purposefully customized **React Bits** effects.

> Status: **V1 implementation**. Frontend source is ready to move into a new GitHub repository. Deployment, dependency installation, runtime browser QA, and Vercel checks are pending. This demo does not represent completed client projects.

## Run locally

Requirements: Node.js 22 (20.9+ supported), npm, internet for first dependency install.

```bash
npm install
npm run dev
# http://localhost:3000
```

For production:

```bash
npm run typecheck
npm run build
npm start
```

No `.env` variables, paid services, database, external images, or third-party API keys are needed.

## What's included

1. Animated letter-assembly brand intro (blocks underlying scrolling while the intro is visible).
2. Liquid-glass-style navigation and magnetic CTA buttons.
3. Three.js procedural chrome artwork with a **local procedural studio environment**, requiring no remote 3D models or HDR assets.
4. Pinned-look 3-step scroll storytelling with GSAP ScrollTrigger, driven by one shared Lenis/GSAP ticker.
5. Horizontal case-study gallery on desktop; regular vertical cards on mobile.
6. Three concept case-study artworks created in CSS without external image dependencies; modal details explain that these are demos.
7. Light-mode design-philosophy chapter and responsive service bento cards with cursor-following light.
8. Final CTA and a functional demo brief form that downloads a `.txt` file locally instead of pretending to send it to an unconnected server.
9. `prefers-reduced-motion`, keyboard focus styles, responsive type and spacing, basic metadata.

## React Bits component map

| Effect in this app | Local component | React Bits original |
|---|---|---|
| Liquid/frosted glass | `src/components/react-bits/GlassSurface.tsx` | [Glass Surface](https://reactbits.dev/components/glass-surface) |
| Pointer spotlight service cards | `src/components/react-bits/SpotlightCard.tsx` | [Spotlight Card](https://reactbits.dev/components/spotlight-card) |
| Magnetic buttons | `src/components/react-bits/Magnet.tsx` | [Magnet](https://reactbits.dev/animations/magnet) |
| Animated ambient background | `src/components/react-bits/Aurora.tsx` | [Aurora](https://reactbits.dev/backgrounds/aurora) |
| Blur-and-reveal heading | `src/components/react-bits/BlurText.tsx` | [Blur Text](https://reactbits.dev/text-animations/blur-text) |

**Important implementation detail:** The locally included components are **purpose-built, lightweight adaptations inspired by the above React Bits components**, not byte-for-byte copies of the latest upstream implementations. They are functioning local React components, with no external component registry required at runtime. In particular, the Aurora variation uses CSS compositing instead of adding another heavy WebGL context to the hero. The glass implementation uses a browser-compatible backdrop filter fallback. React Bits originally created by David Haz; [original repository](https://github.com/DavidHDev/react-bits) is licensed under MIT + Commons Clause.

### If upstream React Bits components are required

These are the *official free-component* shadcn installer commands. Choose the TypeScript/CSS versions when adding/replacing the local adaptations:

```bash
npx shadcn@latest add @react-bits/GlassSurface-TS-CSS
npx shadcn@latest add @react-bits/SpotlightCard-TS-CSS
npx shadcn@latest add @react-bits/Magnet-TS-CSS
npx shadcn@latest add @react-bits/Aurora-TS-CSS
npx shadcn@latest add @react-bits/BlurText-TS-CSS
```

> These commands fetch source files into the project and may require a `components.json` initialized via `npx shadcn@latest init`. This README does not claim those upstream files have already been installed. Avoid combining two heavy WebGL backgrounds with the 3D scene.

Other candidates to selectively test later: Fluid Glass, Chroma Grid, Glass Icons, Gooey Nav, Dark Veil, Iridescence, Staggered Menu, Dome Gallery. **Do not install every library component at once**; it would harm performance and visual consistency.

## Deployment plan

Once the GitHub repo exists:

1. Add all files at repository root and commit to `main`.
2. Import repo into Vercel. Framework should auto-detect **Next.js**; build command `npm run build`, no environment variables.
3. Verify desktop and mobile: navigation anchors, scroll pin/reversal, WebGL, buttons, modals, keyboard, responsiveness, performance, reduced motion.
4. Connect a real business contact endpoint before treating the demo brief form as a submission service. Replace placeholder NOVA identity and concept case studies with the desired brand and real work.

## Note about test status

During creation, the execution container could not resolve `registry.npmjs.org`; therefore `npm install`, `next build`, and live browser interaction checks **were not run**. All project TS/TSX files were parsed via the TypeScript transpiler and the stylesheet was parsed with PostCSS. These checks do **not** prove the app is free of runtime/build errors. A full CI/Vercel build is required after dependency installation.
