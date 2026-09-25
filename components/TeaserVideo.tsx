"use client";

import { useEffect, useRef, useState } from "react";
import { SoundOffIcon, SoundOnIcon } from "./icons";

/**
 * Player do teaser. Entra tocando e MUDO — som automático assusta e faz
 * fechar a aba; é o padrão do formato vertical (TikTok, Reels, ReelShort).
 * Mudo também é o que faz o autoplay ser permitido pelos navegadores.
 *
 * O controle de som fica à mostra no canto superior direito do palco:
 * enquanto mudo, em laranja e com a etiqueta "Ativar som" (é a ação que
 * queremos); com som, vira o botão neutro da casa.
 *
 * Também garante que o áudio PARA de verdade ao sair da página: alguns
 * navegadores continuam tocando um <video> desmontado sem pause explícito
 * (o que causava "som duplicado" ao voltar e reentrar).
 */
export default function TeaserVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    return () => {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, []);

  function toggleSound() {
    const video = ref.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    setMuted(next);
    // Ligar o som é um gesto do usuário: se o autoplay tiver sido barrado,
    // é a hora de destravar a reprodução.
    if (!next && video.paused) void video.play().catch(() => {});
  }

  return (
    <>
      <video
        ref={ref}
        src={src}
        autoPlay
        muted
        playsInline
        controls
        className="h-full w-full object-cover"
      />

      <div className="absolute right-3 top-[72px] z-30 flex items-center gap-2">
        {muted && (
          <span className="micro-label bg-black/60 px-2.5 py-1.5 text-[10px] text-white/90 backdrop-blur-sm">
            Ativar som
          </span>
        )}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Ativar som" : "Silenciar"}
          aria-pressed={!muted}
          className={`flex h-11 w-11 items-center justify-center rounded-full border bg-black/40 backdrop-blur-sm transition ${
            muted
              ? "border-accent text-accent hover:bg-accent hover:text-black"
              : "border-white/30 text-white/80 hover:border-white"
          }`}
        >
          {muted ? (
            <SoundOffIcon className="h-5 w-5" />
          ) : (
            <SoundOnIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </>
  );
}
