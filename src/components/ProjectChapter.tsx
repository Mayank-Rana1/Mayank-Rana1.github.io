import { useEffect, useRef, useState } from 'react';
import type { Project } from '../data/portfolio';
import { IconExternal, IconGithub, IconPlus } from './icons';
import { Parallax } from './motion';
import { useInView } from '../lib/reveal';
import { scrollToElement } from '../lib/smooth';

export type Accent = { color: string; bright: string; dim: string; soft: string };

const ACCENTS: Accent[] = [
  { color: 'var(--p-green)', bright: 'var(--p-green-bright)', dim: 'rgba(30,107,65,0.12)', soft: 'rgba(30,107,65,0.07)' },
  { color: 'var(--p-blue)', bright: 'var(--p-blue-bright)', dim: 'rgba(31,79,168,0.16)', soft: 'rgba(31,79,168,0.09)' },
  { color: 'var(--p-orange)', bright: 'var(--p-orange-bright)', dim: 'rgba(194,90,29,0.12)', soft: 'rgba(194,90,29,0.07)' },
  { color: 'var(--p-violet)', bright: 'var(--p-violet-bright)', dim: 'rgba(91,67,145,0.16)', soft: 'rgba(91,67,145,0.09)' },
];

/** Five-to-eight line honest code excerpt, captioned as illustration. */
function CodeExcerpt({ caption, lang, lines }: { caption: string; lang: string; lines: string[] }) {
  return (
    <figure className="codeblock">
      <figcaption><span>{caption}</span><span>{lang.toUpperCase()}</span></figcaption>
      <pre><code>{lines.join('\n')}</code></pre>
    </figure>
  );
}

/**
 * One full-width scroll chapter. Text and visual alternate sides;
 * the case study expands in place beneath them with the title intact.
 */
export default function ProjectChapter(props: {
  project: Project;
  index: number;
  flip: boolean;
  dark: boolean;
  reduced: boolean;
  visual: React.ReactNode;
}) {
  const { project: p, index, flip, dark, reduced } = props;
  const [open, setOpen] = useState(false);
  const { ref, visible } = useInView<HTMLElement>(0.15);
  const caseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // Keep the chapter title on screen when the study unfolds.
      const t = window.setTimeout(() => {
        if (caseRef.current) scrollToElement(caseRef.current, { immediate: reduced });
      }, 120);
      return () => window.clearTimeout(t);
    }
  }, [open, reduced]);

  const accent = ACCENTS[index % ACCENTS.length];
  return (
    <section
      ref={ref}
      id={p.hash}
      data-no={p.no}
      className={`chapter${dark ? ' dark' : ''}`}
      aria-labelledby={`${p.hash}-title`}
      style={{ '--pcc': accent.color } as React.CSSProperties}
    >
      <div className="wrap">
        <div className={`proj-grid${flip ? ' flip' : ''}`}>
          <div className="proj-copy" data-in={visible}>
            <p className="pnum-row">
              <span className="pnum">PROJECT {p.no}</span>
              <span className="pcat">{p.category}</span>
            </p>
            <h2 id={`${p.hash}-title`} className="ptitle">
              <span className={`rv${visible ? ' in' : ''}`}><span className="rv-in">{p.title}</span></span>
            </h2>
            <p className="pvalue">{p.value}</p>
            <p className="pexp">{p.problem}</p>
            <h3 className="sr-only">Key technologies</h3>
            <ul className="tag-row ptech" aria-label={`${p.title} key technologies`}>
              {p.stack.slice(0, 3).map((t) => <li className="tag" key={t}>{t}</li>)}
            </ul>
            <p className="presult">{p.outcome}</p>
            <div className="plinks">
              {p.repo ? (
                <a className={`btn ${dark ? 'btn-light' : 'btn-ghost'}`} href={p.repo} target="_blank" rel="noopener noreferrer">
                  <IconGithub size={15} /> GitHub
                </a>
              ) : null}
              {p.demo ? (
                <a className={`btn ${dark ? 'btn-light' : 'btn-ghost'}`} href={p.demo} target="_blank" rel="noopener noreferrer">
                  {p.demoLabel ?? 'Live demo'} <IconExternal size={14} />
                </a>
              ) : null}
            </div>
            <button
              type="button"
              className="expand-btn"
              aria-expanded={open}
              aria-controls={`${p.hash}-case`}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? 'Collapse case study' : 'Expand case study'} <IconPlus size={15} />
            </button>
          </div>
          <Parallax className="proj-visual" distance={18} scale={0.018}>
            {props.visual}
          </Parallax>
        </div>
        <div ref={caseRef} id={`${p.hash}-case`} className="case-study" data-open={open}>
          <div>
            {open ? (
              <div className="cs-body">
                <dl className="cs-grid">
                  <dt>Problem</dt><dd>{p.problem}</dd>
                  <dt>Constraints</dt>
                  <dd><ul>{p.constraints.map((c) => <li key={c}>{c}</li>)}</ul></dd>
                  <dt>Architecture</dt>
                  <dd>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>{p.diagramTitle}</p>
                    <ul>{p.diagram.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </dd>
                  <dt>Implementation</dt>
                  <dd><ul>{p.implementation.map((x) => <li key={x}>{x}</li>)}</ul></dd>
                  <dt>Difficult decisions</dt>
                  <dd><ul>{p.decisions.map((d) => <li key={d}>{d}</li>)}</ul></dd>
                  <dt>Measured result</dt><dd><strong>{p.result}</strong></dd>
                  <dt>What was learned</dt>
                  <dd><ul>{p.learned.map((l) => <li key={l}>{l}</li>)}</ul></dd>
                  <dt>Repository</dt>
                  <dd>
                    {p.repo ? <a href={p.repo} target="_blank" rel="noopener noreferrer">Source code</a> : '—'}
                    {p.demo ? <> · <a href={p.demo} target="_blank" rel="noopener noreferrer">{p.demoLabel ?? 'Live demo'}</a></> : null}
                    <span style={{ opacity: 0.65 }}> · {p.status}</span>
                  </dd>
                </dl>
                <CodeExcerpt caption={p.code.caption} lang={p.code.lang} lines={p.code.lines} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
