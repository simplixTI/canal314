"use client";

import { useEffect, useState } from "react";

/**
 * `true` quando a página já rolou além de `threshold` px. Para o header
 * fixo trocar de traje: degradê cinematográfico no topo, barra sólida
 * quando há conteúdo passando por baixo.
 */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return scrolled;
}
