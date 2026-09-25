import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps): IconProps {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" />
      <path d="M8.5 10.5V7.75a3.5 3.5 0 0 1 7 0v2.75" />
      <path d="M12 14.5v2" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5.5 9.5 6.5 6.5 6.5-6.5" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base({ fill: "currentColor", stroke: "none", ...props })}>
      <path d="M8 5.75v12.5L19 12Z" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5c.6 2.3-.6 3.9-1.7 5.2C9 10.3 8 11.5 8 13.3a4 4 0 0 0 8 0c0-1.4-.6-2.6-1.2-3.5-.2.9-.8 1.6-1.5 1.9.5-2.6-.2-6-1.3-8.2Z" />
    </svg>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M9.5 6.5h5M9.5 9.5h5" />
      <path d="M5.5 10.5a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17v4" />
      <path d="M8.5 21h7" />
    </svg>
  );
}

export function HeartIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base({ ...(filled ? { fill: "currentColor" } : {}), ...props })}>
      <path d="M12 20.25c-4.9-3.1-8.25-6.05-8.25-10A4.6 4.6 0 0 1 8.25 5.5c1.55 0 2.95.75 3.75 1.95a4.68 4.68 0 0 1 3.75-1.95 4.6 4.6 0 0 1 4.5 4.75c0 3.95-3.35 6.9-8.25 10Z" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 14.5V3.5" />
      <path d="m7.5 7 4.5-4.5L16.5 7" />
      <path d="M8 10.5H6a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5.5a2 2 0 0 0-2-2h-2" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function CoinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <text
        x="12"
        y="15.6"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="inherit"
      >
        314
      </text>
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function UserCircleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="9.25" r="2.75" />
      <path d="M6.5 18.25a5.75 5.75 0 0 1 11 0" />
    </svg>
  );
}

/* ---------- Redes sociais ----------
   Traçadas no mesmo traço da casa (stroke 1.5) em vez dos glifos oficiais
   sólidos: no footer elas convivem com os ícones autorais acima. */

export function YouTubeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.4v5.2l4.6-2.6-4.6-2.6Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
      <path d="M16.9 7.1h.01" strokeWidth="2" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13.9 3.4v10.4a3.6 3.6 0 1 1-3.6-3.6c.35 0 .69.05 1 .15" />
      <path d="M13.9 3.4c.32 2.3 1.93 3.86 4.3 4.03" />
    </svg>
  );
}

/* ---------- Som do player ---------- */

export function SoundOnIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 9.5v5h3l4.5 4v-13L7 9.5H4Z" />
      <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
      <path d="M18.2 6.5a7.6 7.6 0 0 1 0 11" />
    </svg>
  );
}

export function SoundOffIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 9.5v5h3l4.5 4v-13L7 9.5H4Z" />
      <path d="m15.5 9.5 5 5M20.5 9.5l-5 5" />
    </svg>
  );
}
