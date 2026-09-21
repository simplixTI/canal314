export default function PodcastPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden px-6 pb-20 pt-32">
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-8 select-none font-[family-name:var(--font-display)] text-[16rem] font-bold leading-none text-white/[0.04]"
      >
        314
      </span>

      <div className="relative mx-auto w-full max-w-3xl">
        <p className="micro-label text-accent">PodCast</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
          Canal 314 no detalhe
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
          Conversas e histórias na voz de quem viveu — o podcast do Canal314.
        </p>

        <div className="mt-10 border border-white/15">
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src="https://www.youtube-nocookie.com/embed/XrhcJl8tf5w?rel=0"
              title="PodCast Canal314"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4">
            <p className="micro-label text-white/50">Episódio mais recente</p>
            <p className="text-xs text-white/40">YouTube · Canal314</p>
          </div>
        </div>
      </div>
    </div>
  );
}
