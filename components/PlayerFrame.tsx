"use client";

import { useEffect, useState } from "react";

/**
 * Iframe do YouTube montado apenas no breakpoint da sua variante —
 * a página de episódio tem dois layouts (mobile imersivo / desktop watch)
 * e sem isso os DOIS players carregariam e dariam autoplay ao mesmo tempo.
 */
export default function PlayerFrame({
  youtubeId,
  title,
  variant,
}: {
  youtubeId: string;
  title: string;
  variant: "mobile" | "desktop";
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      variant === "mobile" ? "(max-width: 1023px)" : "(min-width: 1024px)"
    );
    const update = () => setShow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [variant]);

  if (!show) return null;

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="h-full w-full"
    />
  );
}
