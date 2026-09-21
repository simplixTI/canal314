"use client";

import { useEffect, useRef } from "react";

/**
 * Player do teaser. Garante que o áudio PARA de verdade ao sair da página:
 * alguns navegadores continuam tocando um <video> desmontado sem pause
 * explícito (o que também causava "som duplicado" ao voltar e reentrar).
 */
export default function TeaserVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

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

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      playsInline
      controls
      className="h-full w-full object-cover"
    />
  );
}
