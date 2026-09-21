import Image from "next/image";

/**
 * Arte de pôster autoral. Séries com foto real usam a foto (sempre em P&B);
 * as demais recebem capas tipográficas autorais — composição própria por série,
 * como capas de livro: tipo condensado pesado, selo "314 NO DETALHE",
 * moldura em hairline e grão de filme. Preto e branco absoluto.
 */

interface PosterArtProps {
  slug: string;
  title: string;
  category: string;
  thumbnail?: string;
  /** "fill" cobre o pai absoluto (feed/player); sempre position relative no pai */
  priority?: boolean;
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

function Frame() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-4 border border-white/[0.12]"
    />
  );
}

function categoryLabel(category: string) {
  return category === "religioso" ? "Religioso" : "Político";
}

/** Capas tipográficas autorais, uma composição por série. */
function TypographicCover({ slug, title, category }: { slug: string; title: string; category: string }) {
  const label = categoryLabel(category);

  if (slug === "getulio-vargas") {
    return (
      <div className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-[#0d0d0d] p-8">
        <Marca314 className="absolute -right-6 -top-10 text-[16rem]" />
        <Selo className="relative mt-6" />
        <div className="relative flex flex-1 flex-col justify-center">
          <p className="micro-label mb-4 text-white/60">
            {label} · 1930–1954
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-[4.6rem] font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-white">
            Getúlio
            <br />
            Vargas
          </h2>
          <div className="mt-5 h-px w-24 bg-white/40" aria-hidden />
        </div>
        <div className="relative h-24" aria-hidden />
        <Frame />
        <Grain />
      </div>
    );
  }

  if (slug === "padre-cicero") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden bg-[#0c0c0c] p-8 text-center">
        <Marca314 className="absolute -left-10 bottom-0 text-[15rem]" />
        <Selo className="relative mt-6" />
        <div className="relative">
          <div className="mx-auto mb-6 h-16 w-px bg-white/40" aria-hidden />
          <h2 className="font-[family-name:var(--font-display)] text-[4.2rem] font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-white">
            Padre
            <br />
            Cícero
          </h2>
          <p className="micro-label mt-6 text-white/60">
            {label} · Juazeiro do Norte
          </p>
        </div>
        <div className="relative mb-8 h-px w-24 bg-white/40" aria-hidden />
        <Frame />
        <Grain />
      </div>
    );
  }

  if (slug === "chico-xavier") {
    return (
      <div className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-[#0d0d0d] p-8">
        <Marca314 className="absolute -bottom-8 -right-8 text-[16rem]" />
        <div className="relative mt-16 self-end text-right">
          <p className="micro-label mb-4 text-white/60">
            {label} · Psicografia
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-[4.4rem] font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-white">
            Chico
            <br />
            Xavier
          </h2>
          <div className="ml-auto mt-5 h-px w-24 bg-white/40" aria-hidden />
        </div>
        <Selo className="relative mb-10 self-start" />
        <Frame />
        <Grain />
      </div>
    );
  }

  // Capa genérica para séries futuras sem foto: mesma gramática tipográfica
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden bg-[#0c0c0c] p-8 text-center">
      <Marca314 className="absolute -right-8 -top-8 text-[15rem]" />
      <Selo className="relative mt-6" />
      <div className="relative">
        <p className="micro-label mb-4 text-white/60">{label}</p>
        <h2 className="font-[family-name:var(--font-display)] text-6xl font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-white">
          {title}
        </h2>
      </div>
      <div className="relative mb-8 h-px w-24 bg-white/40" aria-hidden />
      <Frame />
      <Grain />
    </div>
  );
}

export default function PosterArt({ slug, title, category, thumbnail, priority }: PosterArtProps) {
  if (thumbnail) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#0c0c0c]">
        <Image
          src={thumbnail}
          alt={`Pôster da série ${title}`}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-[50%_15%] brightness-[0.92] grayscale contrast-[1.05]"
        />
        <div aria-hidden className="scrim-vignette absolute inset-0" />
        <Grain opacity={0.07} />
      </div>
    );
  }
  return <TypographicCover slug={slug} title={title} category={category} />;
}

export { categoryLabel };
