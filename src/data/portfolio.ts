/* Single source of truth for all portfolio content.
   Both the book view and the standard-page view render from this file. */

/** Middle-dot list separator (kept as a code point so sources stay ASCII-safe). */
export const SEP = String.fromCharCode(183);

export const profile = {
  name: 'Mayank Rana',
  role: 'Software Engineer',
  positioning: 'Software Engineer and Computer Science & Engineering (AI) undergraduate',
  location: 'Bhopal, India',
  email: 'mrana171mr@gmail.com',
  github: 'https://github.com/Mayank-Rana1',
  linkedin: 'https://linkedin.com/in/mayank-rana17',
  resume: './assets/Mayank_Rana_SWE.pdf',
  statement: 'I build software beneath the abstraction.',
  intro:
    'I work across backend infrastructure, machine learning, algorithms, and performance-sensitive products. I enjoy understanding the system first, then making it dependable, measurable, and useful.',
  recruiterIntro:
    'Computer Science and AI undergraduate at IIIT Bhopal, focused on backend systems, machine learning, algorithms, and performance-minded products.',
  availability:
    'Open to software engineering internships, technical collaborations, open-source projects, and meaningful product work.',
  education: {
    school: 'Indian Institute of Information Technology, Bhopal',
    degree: 'Bachelor of Technology in Computer Science & Engineering (Artificial Intelligence)',
    cgpa: '8.1 / 10',
    graduation: 'May 2028',
    coursework: [
      'Data Structures and Algorithms',
      'Object-Oriented Programming',
      'Database Management Systems',
      'Operating Systems',
      'Computer Networks',
    ],
  },
  interests: [
    'Backend systems',
    'AI infrastructure',
    'Machine learning',
    'Computer science fundamentals',
    'Algorithms and data structures',
    'System performance',
    'API design',
    'Cloud-connected applications',
    'Browser-based tools',
    'Game-performance engineering',
  ],
  metrics: [
    { value: '800+', label: 'Algorithmic problems solved' },
    { value: '1624', label: 'Maximum CodeChef rating' },
    { value: '8.1 / 10', label: 'CGPA at IIIT Bhopal' },
    { value: 'May 2028', label: 'Expected graduation' },
  ],
};

export type CodeExcerpt = { caption: string; lang: string; lines: string[] };

export type Project = {
  no: string;
  title: string;
  altTitle?: string;
  category: string;
  hash: string;
  value: string;
  problem: string;
  approach: string[];
  decisions: string[];
  result: string;
  outcome: string;
  outcomeTone: 'forest' | 'rust' | 'blue';
  stack: string[];
  repo?: string;
  demo?: string;
  demoLabel?: string;
  status: string;
  accent: 'forest' | 'rust' | 'blue';
  diagramTitle: string;
  diagram: string[];
  constraints: string[];
  implementation: string[];
  learned: string[];
  code: CodeExcerpt;
};

export const projects: Project[] = [
  {
    no: '01',
    title: 'LLM Gateway Engine',
    category: 'AI Infrastructure / Backend Engineering',
    hash: 'llm-gateway',
    value: 'A high-throughput asynchronous API gateway that provides a unified streaming interface across multiple LLM providers.',
    problem:
      'Every LLM vendor ships a different request shape and failure mode, so clients couple to one provider and break when it degrades.',
    approach: [
      'Standardized JSON request and response handling across three or more LLM providers',
      'Asynchronous request processing with AsyncIO, HTTPX, and FastAPI',
      'Automatic provider failover with circuit-breaking and cooldown logic',
      'Normalized provider streams into a single Server-Sent Events interface',
    ],
    decisions: [
      'Decouple clients from vendor APIs behind one stable contract',
      'Fail over to a secondary provider instead of failing the request',
      'Treat HTTP failures, connection drops, socket timeouts, and provider errors as distinct, handled cases',
    ],
    result: 'Reduced overall server response latency by 25%.',
    outcome: '25% lower response latency',
    outcomeTone: 'forest',
    stack: ['Python', 'FastAPI', 'AsyncIO', 'Server-Sent Events', 'HTTPX', 'Pydantic', 'REST APIs', 'JSON', 'Uvicorn'],
    repo: 'https://github.com/Mayank-Rana1/llm-gateway-engine',
    constraints: [
      'Must speak three or more vendor APIs without leaking vendor shapes to clients.',
      'Streaming responses cannot buffer: bytes must flow as they arrive.',
      'A single provider outage must never become a client-facing outage.',
    ],
    implementation: [
      'Pydantic schemas validate one canonical request and response shape.',
      'AsyncIO + HTTPX fan requests out concurrently with per-provider timeouts.',
      'A router tracks provider health; failures trip a breaker with cooldown.',
    ],
    learned: [
      'Design the client contract first; let providers adapt to it, never the reverse.',
      'Distinct failure modes (HTTP, drops, timeouts, provider errors) need distinct handling.',
    ],
    code: {
      caption: 'FastAPI SSE endpoint - one contract, many providers',
      lang: 'python',
      lines: [
        '@app.get("/v1/chat")',
        'async def chat(req: ChatRequest):',
        '    async with pool.acquire() as provider:',
        '        stream = await provider.complete(req.prompt)',
        '        async for chunk in normalize(stream):',
        '            yield "data: " + chunk.json()',
        '    yield "data: [DONE]"',
      ],
    },
    status: 'Backend system · 2025',
    accent: 'forest',
    diagramTitle: 'Request path',
    diagram: [
      'Client sends one unified JSON request',
      'FastAPI gateway validates with Pydantic',
      'Provider router selects the primary LLM',
      'On failure, secondary provider takes over',
      'Streams normalized into Server-Sent Events',
      'Client reads one stable SSE stream',
    ],
  },
  {
    no: '02',
    title: 'Digit Inference Engine',
    altTitle: 'Neural Network From Scratch',
    category: 'Machine Learning / Browser Inference',
    hash: 'digit-inference',
    value: 'A neural-network learning pipeline built from raw mathematics, then shrunk for private in-browser digit recognition.',
    problem:
      'Framework-only ML hides the mathematics, and server-side inference forces users to upload images for a task a small local model can do.',
    approach: [
      'Hand-coded forward propagation, backpropagation, and gradient descent with NumPy',
      'Vectorized matrix operations for a 30% faster training step',
      'Expanded a single-layer net into an MLP with ReLU and Softmax',
      'Reproduced the architecture in PyTorch, then upgraded to a CNN with augmentation and dropout',
      'Quantized to 8-bit ONNX and deployed with ONNX Runtime Web',
    ],
    decisions: [
      'Learn the math first in NumPy, then use PyTorch for scale',
      'Quantize to 8-bit to shrink the model without losing accuracy',
      'Run inference in the browser so images never leave the device',
    ],
    result: '89% accuracy with the first simple model, ~97% after deepening; model shrank ~4× from ~900 KB to ~225 KB.',
    outcome: '97% accuracy · ~4× smaller model',
    outcomeTone: 'blue',
    stack: ['Python', 'NumPy', 'PyTorch', 'ONNX', 'ONNX Runtime Web', 'Vanilla JavaScript', 'HTML5 Canvas', 'WebRTC'],
    repo: 'https://github.com/Mayank-Rana1/NeuralNet-From-Scratch',
    demo: 'https://mayank-rana1.github.io/NeuralNet-From-Scratch/',
    demoLabel: 'Live demo',
    constraints: [
      'Learn the real mathematics, not just framework calls.',
      'Browser inference budget: roughly 225 KB, zero uploads.',
      'Strokes and camera frames must survive downscaling to 28 by 28.',
    ],
    implementation: [
      'NumPy single-layer net with hand-coded forward and backward passes.',
      'MLP with ReLU and Softmax, then a PyTorch CNN with augmentation and dropout.',
      '8-bit ONNX quantization; ONNX Runtime Web runs it on-device.',
    ],
    learned: [
      'Mathematics first makes frameworks tools instead of magic.',
      'Measure every stage: accuracy 89 to 97, size 900 KB to 225 KB.',
    ],
    code: {
      caption: 'NumPy forward pass - the network in five lines',
      lang: 'python',
      lines: [
        'def forward(X, W1, b1, W2, b2):',
        '    Z1 = X.dot(W1) + b1      # affine',
        '    A1 = relu(Z1)            # non-linearity',
        '    Z2 = A1.dot(W2) + b2',
        '    return softmax(Z2)       # probabilities',
      ],
    },
    status: 'ML pipeline · browser deployment',
    accent: 'blue',
    diagramTitle: 'From math to browser',
    diagram: [
      'Hand-coded NumPy net: forward + backward passes',
      'Vectorized training runs ~30% faster',
      'MLP with ReLU and Softmax reaches ~97%',
      'PyTorch CNN adds augmentation and dropout',
      '8-bit ONNX quant: ~900 KB down to ~225 KB',
      'Canvas and camera input inferred locally',
    ],
  },
  {
    no: '03',
    title: 'Square Dash',
    category: 'Game Engineering / Mobile Performance',
    hash: 'square-dash',
    value: 'A competitive mobile endless runner with cloud leaderboards, rewarded advertising, reusable game entities, and performance tuning for low-end Android devices.',
    problem:
      'Budget Android devices stutter when a runner instantiates and destroys dozens of entities per second while syncing scores and serving ads.',
    approach: [
      'Global cloud leaderboard with REST-based score synchronization',
      'Rewarded video ads via Google AdMob and Unity Ads',
      'Object-pooling system recycling 100+ active entities per frame',
      'Optimized physics and collision handling for stable frame pacing',
    ],
    decisions: [
      'Pool and reuse entities instead of allocating per spawn',
      'Separate leaderboard, ads, spawning, and UI into dedicated managers',
      'Tune for the weakest target device first, then scale up',
    ],
    result: 'Recycled 100+ entities per frame, eliminated 40ms+ of garbage-collection stutter, and held a stable 60 FPS.',
    outcome: 'Stable 60 FPS on budget Android hardware',
    outcomeTone: 'rust',
    stack: ['C#', 'Unity', 'Unity Cloud Services', 'REST APIs', 'Unity Leaderboards', 'Google AdMob', 'Unity Ads', 'Android SDK', 'ShaderLab', 'HLSL'],
    repo: 'https://github.com/Mayank-Rana1/Square-Dash',
    demo: 'https://emberlab.itch.io/squaredash',
    demoLabel: 'Play / download',
    constraints: [
      'Stable 60 FPS on budget Android hardware, not flagships.',
      'Cloud leaderboards and rewarded ads must never hitch gameplay.',
      'Dozens of entities spawn and die every second.',
    ],
    implementation: [
      'Fixed-size object pools recycle 100+ entities per frame.',
      'Dedicated managers isolate game, score, leaderboard, ads, and UI state.',
      'Collision and physics tuned for stable frame pacing.',
    ],
    learned: [
      'Pool and reuse; never allocate per spawn on a hot path.',
      'Tune for the weakest target device first, then scale up.',
    ],
    code: {
      caption: 'C# object pool - reuse instead of allocate',
      lang: 'csharp',
      lines: [
        'Obstacle Get() {',
        '    if (pool.Count > 0) return pool.Pop();',
        '    return Instantiate(prefab); // cold path only',
        '}',
        'void Release(Obstacle o) {',
        '    o.gameObject.SetActive(false); pool.Push(o);',
        '}',
      ],
    },
    status: 'Shipped Android game',
    accent: 'rust',
    diagramTitle: 'Runtime systems',
    diagram: [
      'Player input reaches the Game Manager',
      'Score System records runs, Leaderboard Manager syncs to Unity Cloud',
      'Object Pool feeds the Spawn Manager with reused entities',
      'UI Manager renders HUD from a single state source',
      'Ads Manager mediates AdMob and Unity Ads',
    ],
  },
  {
    no: '04',
    title: 'Client-Side Web Tool Suite',
    category: 'Web Engineering / Browser Tools',
    hash: 'web-tools',
    value: 'A collection of practical browser utilities designed to complete image and calculation tasks locally without server uploads.',
    problem:
      'Simple image and calculation tasks still force users through server uploads, queues, and privacy trade-offs they should never need.',
    approach: [
      'Processed 4K images entirely in the browser with the Canvas API',
      'Shipped Photo Grid Editor, Bill Splitter, and image utilities',
      'Refactored interface logic into modular, reusable functions',
      'Avoided server-upload delays by keeping every byte local',
    ],
    decisions: [
      'Local-first: no upload, no queue, no waiting room',
      'One shared function library across tools for easier debugging',
      'Optimize the build cycle, not just the runtime',
    ],
    result: '4K client-side processing with a 40% faster build cycle.',
    outcome: '4K client-side processing · 40% faster build cycle',
    outcomeTone: 'forest',
    stack: ['JavaScript', 'HTML5', 'CSS', 'Canvas API', 'Browser APIs'],
    demo: 'https://all.html-5.me',
    demoLabel: 'Visit live site',
    constraints: [
      '4K images must process on the main thread without jank.',
      'Zero uploads: privacy is a feature, not a policy page.',
      'One shared function library across every editor tool.',
    ],
    implementation: [
      'Canvas pipelines process pixels entirely on-device.',
      'Photo Grid Editor, Bill Splitter, and image utilities share modules.',
      'Modular functions cut the build cycle by 40 percent.',
    ],
    learned: [
      'Local-first removes whole categories of latency and failure.',
      'Small shared modules beat copied logic every time.',
    ],
    code: {
      caption: 'Canvas grayscale - pixels never leave the device',
      lang: 'javascript',
      lines: [
        'const img = ctx.getImageData(0, 0, w, h);',
        'for (let i = 0; i < img.data.length; i += 4) {',
        '  const y = 0.2126*r + 0.7152*g + 0.0722*b;',
        '  img.data[i] = img.data[i+1] = img.data[i+2] = y;',
        '}',
        'ctx.putImageData(img, 0, 0); // done, locally',
      ],
    },
    status: 'Live · maintained',
    accent: 'forest',
    diagramTitle: 'Local-first flow',
    diagram: [
      'User drops a 4K image into the tool',
      'Canvas pipeline processes pixels on-device',
      'Modular functions shared across editors',
      'Result exports instantly — nothing uploaded',
    ],
  },
];

export const skills = [
  { group: 'Languages', items: ['C', 'C++', 'Python', 'C#', 'JavaScript', 'SQL'] },
  { group: 'AI & Data', items: ['PyTorch', 'TensorFlow', 'NumPy', 'Pandas', 'ONNX'] },
  { group: 'Backend', items: ['FastAPI', 'REST APIs', 'AsyncIO', 'SSE', 'MySQL'] },
  { group: 'Tools & Cloud', items: ['Git', 'Docker', 'GitHub Actions', 'GCP', 'Unity Cloud'] },
  { group: 'Foundations', items: ['DSA', 'OOP', 'DBMS', 'OS', 'Computer Networks'] },
];

export const journey = {
  cp: {
    solved: '800+',
    codechef: '1624',
    codeforces: '1324',
    focus: ['Graph theory', 'Dynamic programming', 'Trees'],
    profiles: [
      { label: 'CodeChef', href: 'https://www.codechef.com/users/mayank_rana17' },
      { label: 'LeetCode', href: 'https://leetcode.com/u/Mayank_Rana/' },
      { label: 'Codeforces', href: 'https://codeforces.com/profile/Mayank_Rana7' },
    ],
  },
  leadership: {
    org: 'Codame — official DSA coding club, IIIT Bhopal',
    role: 'Competitive Programming Executive',
    period: 'August 2024 – Present',
    points: [
      'Organized OPTIGO, an Inter-IIIT coding competition',
      'Supported 5,000+ concurrent student participants',
      'Authored 15+ original algorithmic problems with rigorous edge-case test sets',
      'Mentored 50+ juniors in C++ memory management, OOP, and DSA fundamentals',
    ],
  },
};

export type BookPage = {
  index: number;
  id: string;
  hash: string;
  chapter: string;
  folio: string;
  kind: 'guide' | 'profile' | 'record' | 'education' | 'project-a' | 'project-b' | 'tools-a' | 'tools-b' | 'skills-a' | 'skills-b' | 'journey' | 'contact' | 'back';
  projectIndex?: number;
};

export const pages: BookPage[] = [
  { index: 0, id: 'guide', hash: 'guide', chapter: 'Cover', folio: 'How to read this book', kind: 'guide' },
  { index: 1, id: 'profile', hash: 'profile', chapter: 'Profile', folio: 'Profile', kind: 'profile' },
  { index: 2, id: 'record', hash: 'record', chapter: 'Profile', folio: 'By the numbers', kind: 'record' },
  { index: 3, id: 'education', hash: 'education', chapter: 'Profile', folio: 'Education', kind: 'education' },
  { index: 4, id: 'llm-a', hash: 'llm-gateway', chapter: 'Selected Work', folio: 'Project 01 · A', kind: 'project-a', projectIndex: 0 },
  { index: 5, id: 'llm-b', hash: 'llm-gateway-b', chapter: 'Selected Work', folio: 'Project 01 · B', kind: 'project-b', projectIndex: 0 },
  { index: 6, id: 'digit-a', hash: 'digit-inference', chapter: 'Selected Work', folio: 'Project 02 · A', kind: 'project-a', projectIndex: 1 },
  { index: 7, id: 'digit-b', hash: 'digit-inference-b', chapter: 'Selected Work', folio: 'Project 02 · B', kind: 'project-b', projectIndex: 1 },
  { index: 8, id: 'dash-a', hash: 'square-dash', chapter: 'Selected Work', folio: 'Project 03 · A', kind: 'project-a', projectIndex: 2 },
  { index: 9, id: 'dash-b', hash: 'square-dash-b', chapter: 'Selected Work', folio: 'Project 03 · B', kind: 'project-b', projectIndex: 2 },
  { index: 10, id: 'tools-a', hash: 'web-tools', chapter: 'Selected Work', folio: 'Project 04 · A', kind: 'tools-a', projectIndex: 3 },
  { index: 11, id: 'tools-b', hash: 'web-tools-b', chapter: 'Selected Work', folio: 'Project 04 · B', kind: 'tools-b', projectIndex: 3 },
  { index: 12, id: 'skills-a', hash: 'skills', chapter: 'Engineering Focus', folio: 'Skills · I', kind: 'skills-a' },
  { index: 13, id: 'skills-b', hash: 'skills-b', chapter: 'Engineering Focus', folio: 'Skills · II', kind: 'skills-b' },
  { index: 14, id: 'journey', hash: 'journey', chapter: 'Journey', folio: 'Journey', kind: 'journey' },
  { index: 15, id: 'contact', hash: 'contact', chapter: 'Contact', folio: 'Contact', kind: 'contact' },
  { index: 16, id: 'back', hash: 'back', chapter: 'Contact', folio: 'Back cover', kind: 'back' },
];

export type Chapter = { label: string; hash: string; page: number; closed?: boolean; pageLabel: string };

export const chapters: Chapter[] = [
  { label: 'Cover', hash: 'cover', page: 0, closed: true, pageLabel: 'Front' },
  { label: 'Profile', hash: 'profile', page: 1, pageLabel: 'p. 2' },
  { label: 'Selected Work', hash: 'llm-gateway', page: 4, pageLabel: 'p. 5' },
  { label: 'Engineering Focus', hash: 'skills', page: 12, pageLabel: 'p. 13' },
  { label: 'Journey', hash: 'journey', page: 14, pageLabel: 'p. 15' },
  { label: 'Contact', hash: 'contact', page: 15, pageLabel: 'p. 16' },
];


export function pageForHash(hash: string): number {
  const clean = hash.replace(/^#/, '');
  const direct = pages.findIndex((p) => p.hash === clean);
  if (direct >= 0) return direct;
  const chapter = chapters.find((c) => c.hash === clean);
  return chapter ? chapter.page : 0;
}
