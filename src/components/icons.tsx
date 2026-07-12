type IconProps = { size?: number };

function base(size = 15) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
}

export const IconArrowLeft = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);
export const IconArrowRight = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
export const IconExternal = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
  </svg>
);
export const IconMail = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);
export const IconGithub = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
export const IconLinkedin = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
export const IconFile = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);
export const IconMenu = ({ size = 20 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </svg>
);
export const IconClose = ({ size = 20 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
export const IconDownload = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5" />
    <path d="M12 15V3" />
  </svg>
);
export const IconZap = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
export const IconActivity = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
export const IconLayers = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="m12 2 10 5.7L12 13.3 2 7.7z" />
    <path d="m2 12.3 10 5.7 10-5.7" />
    <path d="m2 16.9 10 5.7 10-5.7" />
  </svg>
);
export const IconCpu = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 2v2" />
    <path d="M15 2v2" />
    <path d="M9 20v2" />
    <path d="M15 20v2" />
    <path d="M2 9h2" />
    <path d="M2 15h2" />
    <path d="M20 9h2" />
    <path d="M20 15h2" />
  </svg>
);
export const IconEye = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const IconPlus = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);
export const IconArrowDown = ({ size }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);
