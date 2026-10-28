const ITEMS = [
  'Python', 'FastAPI', 'PyTorch', 'NumPy', 'ONNX', 'Unity',
  'C#', 'Docker', 'JavaScript', 'SQL', 'REST', 'AsyncIO',
  'TypeScript', 'Canvas', 'SSE', 'Git',
];

/**
 * Infinite tech ticker between sections. Pure CSS motion, duplicated list
 * for a seamless loop; static row under reduced motion.
 */
export default function Marquee({ label = 'WORKING SET' }: { label?: string }) {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee" role="presentation" aria-hidden="true">
      <div className="marquee-inner">
        <span className="marquee-label">{label}</span>
        <div className="marquee-track">
          {row.map((t, i) => (
            <span key={i} className="marquee-item">
              {t}
              <i>&middot;</i>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
