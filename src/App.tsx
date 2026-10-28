import { useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import ProofStrip from './components/ProofStrip';
import StatementStrip from './components/StatementStrip';
import WorkIndex from './components/WorkIndex';
import Marquee from './components/Marquee';
import ProjectChapter from './components/ProjectChapter';
import GatewayVisual from './components/GatewayVisual';
import DigitVisual from './components/DigitVisual';
import DashVisual from './components/DashVisual';
import ToolsVisual from './components/ToolsVisual';
import SkillsIndex from './components/SkillsIndex';
import About from './components/About';
import Journey from './components/Journey';
import Contact from './components/Contact';
import { projects } from './data/portfolio';
import { useMotionPreference } from './lib/motion';
import { initSmoothScroll, scrollToHash } from './lib/smooth';

/**
 * Built From First Principles: a normal scrolling portfolio.
 * Thought -> Structure -> System -> Result, one evolving visual idea.
 */
export default function App() {
  const { pref } = useMotionPreference();
  const reduced = pref === 'reduced';

  // One scroll engine for the whole document. It is destroyed under
  // reduced motion so the browser's native scrolling is untouched.
  useEffect(() => initSmoothScroll(reduced), [reduced]);

  const visuals = [
    <GatewayVisual key="v0" reduced={reduced} />,
    <DigitVisual key="v1" reduced={reduced} />,
    <DashVisual key="v2" reduced={reduced} />,
    <ToolsVisual key="v3" reduced={reduced} />,
  ];
  const dark = [false, true, false, true];

  // Deep links on first load: the browser scrolls before React mounts
  // anything, so anchor targets don't exist yet - scroll manually once
  // the fonts (and therefore the layout) have settled.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    let cancelled = false;
    const go = () => {
      if (!cancelled) scrollToHash(hash, true);
    };
    const id = window.setTimeout(() => {
      const fonts = document.fonts?.ready ?? Promise.resolve();
      fonts.then(() => requestAnimationFrame(() => requestAnimationFrame(go))).catch(go);
    }, 40);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  return (
    <div className="app">
      <a className="skip-link" href="#work">
        Skip to selected work
      </a>
      <Nav />
      <main>
        <Hero reduced={reduced} />
        <ProofStrip reduced={reduced} />
        <div id="work" style={{ scrollMarginTop: 'calc(var(--nav-h) + 8px)' }}>
          <WorkIndex />
          {projects.map((p, i) => (
            <ProjectChapter
              key={p.no}
              project={p}
              index={i}
              flip={i % 2 === 1}
              dark={dark[i]}
              reduced={reduced}
              visual={visuals[i]}
            />
          ))}
        </div>
        <StatementStrip reduced={reduced} />
        <SkillsIndex />
        <About />
        <Journey />
        <Marquee label="WORKING SET" />
        <Contact />
      </main>
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
