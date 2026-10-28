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

/**
 * Built From First Principles: a normal scrolling portfolio.
 * Thought → Structure → System → Result, one evolving visual idea.
 */
export default function App() {
  const { pref } = useMotionPreference();
  const reduced = pref === 'reduced';

  const visuals = [
    <GatewayVisual key="v0" reduced={reduced} />,
    <DigitVisual key="v1" reduced={reduced} />,
    <DashVisual key="v2" reduced={reduced} />,
    <ToolsVisual key="v3" reduced={reduced} />,
  ];
  const dark = [false, true, false, true];

  // Deep links on first load: the browser scrolls before React mounts
  // anything, so anchor targets don't exist yet — scroll manually once.
  useEffect(() => {
    try {
      const el = window.location.hash
        ? document.querySelector(window.location.hash)
        : null;
      if (el) {
        el.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="app">
      <a className="skip-link" href="#work">
        Skip to selected work
      </a>
      <Nav />
      <main>
        <Hero reduced={reduced} />
        <ProofStrip />
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
        <StatementStrip />
        <SkillsIndex />
        <About />
        <Journey />
        <Marquee label="WORKING SET" />
        <Contact />
      </main>
    </div>
  );
}
