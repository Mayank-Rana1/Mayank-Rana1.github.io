import { Fragment, type CSSProperties } from 'react';
import type { Project } from '../data/portfolio';
import { useInView } from '../lib/reveal';

function StepGlyph({ index, blocked }: { index: number; blocked?: boolean }) {
  if (blocked) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="7" width="16" height="12" rx="2" />
        <path d="M8 7V4h8v3" />
        <path d="M4 4l16 16" />
      </svg>
    );
  }
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5" width="9" height="14" rx="1.5" />
        <path d="M13 12h7" />
        <path d="M17 8.5l3.5 3.5-3.5 3.5" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="4" y="5" width="16" height="4" rx="1" />
        <rect x="4" y="10" width="11" height="4" rx="1" />
        <rect x="4" y="15" width="16" height="4" rx="1" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 12h7" />
        <path d="M10 4.5v15" />
        <path d="M10 7h5" />
        <path d="M10 17h5" />
        <circle cx="18" cy="7" r="2.2" />
        <circle cx="18" cy="17" r="2.2" />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="7" width="16" height="12" rx="2" />
        <path d="M8 7V4h8v3" />
        <path d="M8 12h8" />
        <path d="M8 15h5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h10" />
      <path d="M9.5 8.5l3.5 3.5-3.5 3.5" />
      <path d="M16 5h4v14h-4" />
    </svg>
  );
}

function Connector({ index, active, reduced }: { index: number; active: boolean; reduced: boolean }) {
  return (
    <div className="plate-link" style={{ '--i': index } as CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 38 14" preserveAspectRatio="none" focusable="false">
        <path className="link-line" pathLength={1} d="M2 7H29" />
        <path className="link-arrow" d="M26 3l7 4-7 4" />
        {active && !reduced ? (
          <circle className="link-packet" r="2.2">
            <animateMotion dur="2.8s" begin={`${index * 0.35}s`} repeatCount="indefinite" path="M2 7H29" />
          </circle>
        ) : null}
      </svg>
    </div>
  );
}

/**
 * Full-width system map. A diagram, not a demo: each stage is a documented
 * part of the architecture, drawn on entry with connectors and packets that
 * stay purely decorative. The layout gives the system room to be read.
 */
export default function ProjectPlate({
  project,
  accent,
  reduced,
}: {
  project: Project;
  accent: string;
  reduced: boolean;
}) {
  const { ref, visible } = useInView<HTMLElement>(0.05);
  const active = reduced || visible;
  const plate = project.plate;

  return (
    <figure
      ref={ref}
      className="plate"
      data-in={active}
      style={{ '--pcc': accent } as CSSProperties}
      aria-labelledby={`${project.hash}-plate-caption`}
    >
      <figcaption className="plate-top" id={`${project.hash}-plate-caption`}>
        <span><b>FIG. {project.no}</b> / {plate.title}</span>
        <span>{plate.steps.length} stages / system map</span>
      </figcaption>

      <div className="plate-manifesto">
        <div className="plate-thesis">
          <p className="plate-statement">{plate.statement}</p>
          <p className="plate-note">{plate.note}</p>
        </div>
        <dl className="plate-specs">
          {plate.specs.map((s) => (
            <div key={s.k}>
              <dt>{s.k}</dt>
              <dd>{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="plate-flow">
        {plate.steps.map((step, i) => (
          <Fragment key={`${step.label}-${i}`}>
            {i > 0 ? <Connector index={i} active={active} reduced={reduced} /> : null}
            <article
              className="plate-node"
              style={{ '--i': i } as CSSProperties}
              data-blocked={step.blocked ? 'true' : undefined}
            >
              <div className="node-head">
                <span className="node-no">{String(i + 1).padStart(2, '0')}</span>
                <span className="node-glyph"><StepGlyph index={i} blocked={step.blocked} /></span>
              </div>
              <p className="node-label">{step.label}</p>
              <p className="node-detail">{step.detail}</p>
              {step.sub ? (
                <ul className="node-sub" aria-label={`${step.label} components`}>
                  {step.sub.map((s) => <li key={s}>{s}</li>)}
                </ul>
              ) : null}
              {step.blocked ? <span className="node-bypass">Bypassed</span> : null}
            </article>
          </Fragment>
        ))}
      </div>

      <div className="plate-foot">
        <span>{project.diagramTitle} / documented architecture</span>
        <span className="plate-dir-x">Read left to right</span>
        <span className="plate-dir-y">Read top to bottom</span>
      </div>
    </figure>
  );
}
