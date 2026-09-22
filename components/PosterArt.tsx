import Image from "next/image";

/**
 * Arte de pôster autoral. Séries com foto real usam a foto (sempre em P&B);
 * as demais recebem capas tipográficas autorais — composição própria por série,
 * como capas de livro: tipo condensado pesado, selo "314 NO DETALHE",
 * moldura em hairline e grão de filme. Preto e branco absoluto.
 *
 * size="thumb" escala a mesma composição para os cards das fileiras.
 */

interface PosterArtProps {
  slug: string;
  title: string;
  category: string;
  thumbnail?: string;
  priority?: boolean;
  size?: "full" | "thumb";
}

function Grain({ opacity = 0.09 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="film-grain pointer-events-none absolute inset-0"
      style={{ opacity }}
    />
  );
}

function Selo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`micro-label flex items-center gap-2 text-white/70 ${className}`}
    >
      <span className="inline-block h-px w-6 bg-white/50" aria-hidden />
      314 no detalhe
    </div>
  );
}

function Marca314({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none select-none font-[family-name:var(--font-display)] font-bold leading-none text-white/[0.05] ${className}`}
    >
      314
    </span>
  );
}

function Frame({ thumb }: { thumb?: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute border border-white/[0.12] ${thumb ? "inset-2" : "inset-4"}`}
    />
  );
}

function categoryLabel(category: string) {
  return category === "religioso" ? "Religioso" : "Político";
}

function Title({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-[family-name:var(--font-display)] font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-white ${className}`}
    >
      {children}
    </h2>
  );
}

/** Capas tipográficas autorais, uma composição por série. */
function TypographicCover({
  slug,
  title,
  category,
  thumb,
}: {
  slug: string;
  title: string;
  category: string;
  thumb?: boolean;
}) {
  const label = categoryLabel(category);
  const pad = thumb ? "p-3" : "p-8";
  const marcaSize = thumb ? "text-[4.5rem]" : "text-[15rem]";
  const titleSize = thumb ? "text-xl" : "text-[4.4rem]";

  if (slug === "getulio-vargas") {
    return (
      <div className={`absolute inset-0 flex flex-col justify-between overflow-hidden bg-[#0d0d0d] ${pad}`}>
        <Marca314 className={`absolute -right-6 -top-10 ${thumb ? "text-[5rem]" : "text-[16rem]"}`} />
        {!thumb && <Selo className="relative mt-6" />}
        <div className="relative flex flex-1 flex-col justify-center">
          {!thumb && (
            <p className="micro-label mb-4 text-white/60">{label} · 1930–1954</p>
          )}
          <Title className={thumb ? "text-xl" : "text-[4.6rem]"}>
            Getúlio
            <br />
            Vargas
          </Title>
          <div className={`${thumb ? "mt-2 w-10" : "mt-5 w-24"} h-px bg-white/40`} aria-hidden />
        </div>
        {!thumb && <div className="relative h-24" aria-hidden />}
        <Frame thumb={thumb} />
        <Grain />
      </div>
    );
  }

  if (slug === "padre-cicero") {
    return (
      <div className={`absolute inset-0 flex flex-col items-center justify-between overflow-hidden bg-[#0c0c0c] text-center ${pad}`}>
        <Marca314 className={`absolute -left-10 bottom-0 ${marcaSize}`} />
        {!thumb && <Selo className="relative mt-6" />}
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <div className={`mb-4 w-px bg-white/40 ${thumb ? "h-5" : "h-16"}`} aria-hidden />
          <Title className={thumb ? "text-xl" : "text-[4.2rem]"}>
            Padre
            <br />
            Cícero
          </Title>
          {!thumb && (
            <p className="micro-label mt-6 text-white/60">{label} · Juazeiro do Norte</p>
          )}
        </div>
        {!thumb && <div className="relative mb-8 h-px w-24 bg-white/40" aria-hidden />}
        <Frame thumb={thumb} />
        <Grain />
      </div>
    );
  }

  if (slug === "chico-xavier") {
    return (
      <div className={`absolute inset-0 flex flex-col justify-between overflow-hidden bg-[#0d0d0d] ${pad}`}>
        <Marca314 className={`absolute -bottom-8 -right-8 ${thumb ? "text-[5rem]" : "text-[16rem]"}`} />
        <div className={`relative self-end text-right ${thumb ? "" : "mt-16"}`}>
          {!thumb && (
            <p className="micro-label mb-4 text-white/60">{label} · Psicografia</p>
          )}
          <Title className={titleSize}>
            Chico
            <br />
            Xavier
          </Title>
          <div className={`ml-auto ${thumb ? "mt-2 w-10" : "mt-5 w-24"} h-px bg-white/40`} aria-hidden />
        </div>
        {!thumb && <Selo className="relative mb-10 self-start" />}
        <Frame thumb={thumb} />
        <Grain />
      </div>
    );
  }

  // ---- Séries futuras: composições próprias via variantes ----
  const variant = VARIANTS[slug] ?? DEFAULT_VARIANT;
  const alignCls = {
    start: "items-start text-left",
    center: "items-center text-center",
    end: "items-end text-right",
  }[variant.align];
  const titleJustify = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  }[variant.titleAt];

  return (
    <div className={`absolute inset-0 flex flex-col overflow-hidden bg-[#0c0c0c] ${pad}`}>
      <Marca314 className={`absolute ${variant.marca} ${marcaSize}`} />
      {variant.titleAt !== "start" && !thumb && <Selo className="relative mt-6" />}
      <div className={`relative flex w-full flex-1 flex-col ${alignCls} ${titleJustify}`}>
        {!thumb && variant.titleAt === "start" && <span className="flex-1" aria-hidden />}
        {!thumb && (
          <p className="micro-label mb-3 text-white/60">{label}</p>
        )}
        <Title className={titleSize}>{title}</Title>
        {variant.rule && (
          <div className={`${thumb ? "mt-2 w-10" : "mt-4 w-16"} h-px bg-white/40`} aria-hidden />
        )}
        {!thumb && variant.titleAt !== "start" && <span className="flex-1" aria-hidden />}
      </div>
      {variant.titleAt === "start" && !thumb && <Selo className="relative mb-6" />}
      <Frame thumb={thumb} />
      <Grain />
    </div>
  );
}

type CoverVariant = {
  align: "start" | "center" | "end";
  titleAt: "start" | "center" | "end";
  marca: string;
  rule?: boolean;
};

const VARIANTS: Record<string, CoverVariant> = {
  "edir-macedo": { align: "start", titleAt: "start", marca: "-bottom-6 -right-6", rule: true },
  lula: { align: "center", titleAt: "end", marca: "-top-8 -left-8" },
  "irma-dulce": { align: "center", titleAt: "center", marca: "-top-8 -right-8" },
  "jair-bolsonaro": { align: "end", titleAt: "start", marca: "-bottom-6 -left-6", rule: true },
  "silas-malafaia": { align: "end", titleAt: "end", marca: "-top-8 -right-10" },
  "tancredo-neves": { align: "start", titleAt: "end", marca: "-top-10 -right-6", rule: true },
  "divaldo-franco": { align: "start", titleAt: "center", marca: "-bottom-8 -left-8" },
  "dom-helder-camara": { align: "center", titleAt: "start", marca: "-bottom-8 -right-8" },
};

const DEFAULT_VARIANT: CoverVariant = {
  align: "center",
  titleAt: "center",
  marca: "-top-8 -right-8",
};

export default function PosterArt({
  slug,
  title,
  category,
  thumbnail,
  priority,
  size = "full",
}: PosterArtProps) {
  if (thumbnail) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#0c0c0c]">
        <Image
          src={thumbnail}
          alt={`Pôster da série ${title}`}
          fill
          priority={priority}
          sizes={size === "thumb" ? "256px" : "100vw"}
          className="object-cover object-[50%_15%] brightness-[0.95]"
        />
        <div aria-hidden className="scrim-vignette absolute inset-0" />
        <Grain opacity={0.07} />
      </div>
    );
  }
  return (
    <TypographicCover slug={slug} title={title} category={category} thumb={size === "thumb"} />
  );
}

export { categoryLabel };
