import Link from "next/link";
import { MicIcon } from "./icons";

/**
 * Marca tipográfica do Canal314: microfone desenhado + "canal" em micro-label
 * sobre "314!" em display pesado. Nítida em qualquer tamanho, sem raster.
 */
const sizes = {
  sm: { mic: "h-6 w-6", word: "text-[22px]", label: "text-[9px]" },
  lg: { mic: "h-11 w-11", word: "text-[42px]", label: "text-xs" },
} as const;

export default function Logo({ size = "sm" }: { size?: keyof typeof sizes }) {
  const s = sizes[size];
  return (
    <span className="inline-flex items-center gap-2 text-white">
      <MicIcon className={`${s.mic} shrink-0`} strokeWidth={1.75} />
      <span className="flex flex-col leading-none">
        <span
          className={`${s.label} font-semibold uppercase tracking-[0.3em] text-white/60`}
        >
          canal
        </span>
        <span
          className={`${s.word} font-[family-name:var(--font-display)] font-bold uppercase leading-[0.95] tracking-[-0.02em]`}
        >
          314!
        </span>
      </span>
    </span>
  );
}

export function LogoLink() {
  return (
    <Link href="/" aria-label="Canal314 — página inicial" className="shrink-0">
      <Logo />
    </Link>
  );
}
