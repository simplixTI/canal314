# PRODUCT.md — Canal314

## O que é
Plataforma de streaming de micro-documentários verticais (episódios de 1–2 min) sobre os grandes nomes religiosos e políticos do Brasil. Referência de formato: ReelShort (feed vertical imersivo, episódios curtos em sequência).

## Marca
- Nome: Canal314 / "314 NO DETALHE" (selo das séries documentais)
- Logo: monocromática, microfone vintage + "314!" — preto sobre claro; no site escuro usa-se invertida (branca)
- Compromisso de marca: **preto, branco e laranja** — neutros P&B carregam as superfícies; um único laranja (#FF6A00) carrega ações e destaques (decisão do dono, 2026-09-21)
- Idioma: pt-BR
- Série carro-chefe: "Pastor Everaldo Dias: Do Poder à Prisão" (pôster próprio em public/thumbnails/)

## Audiência e cena
Brasileiros no celular, consumindo vídeo curto vertical (hábito TikTok/Reels/Shorts), interessados em histórias reais de fé e política. Uso à noite, tela pequena, polegar, atenção de segundos.

## Modelo de negócio
- Episódios 1 e 2 de cada série: grátis para todos, sem login
- Episódio 3+: login obrigatório; assiste quem tem **314 Pass** (R$19,90/mês, tudo liberado) ou desbloqueou o episódio com **314Coins** (30 coins/episódio; pacotes 200 R$9,90 · 500 R$19,90 · 1200 R$39,90)
- Pagamentos simulados/mock nesta versão; gateway real (Mercado Pago/Stripe) plugável via webhook (lib/billing/ + rotas /api/coins/*)
- Séries planejadas com 30–40 episódios de 1–2 min

## Produto (verdades funcionais)
- Catálogo de séries (religioso/político), página da série com episódios
- Player vertical 9:16 com vídeos do YouTube não listados
- Auth por e-mail/senha (+ Google opcional) via Supabase
- Regras de acesso: anônimo navega; trial assiste eps 1–2; assinante vê tudo
- Conta: status do trial/assinatura, continuar assistindo, cancelar
- Stack: Next.js 15 + Tailwind + Supabase, deploy Vercel (canal314.vercel.app), repo simplixTI/canal314

## Direção visual escolhida (2026-09-21)
- Estilo: **ReelShort clássico** — home com hero do carro-chefe + fileiras horizontais de mini-thumbs, player fullscreen
- Cor: **P&B + laranja** — superfícies neutras (preto/branco/cinzas) com UM acento laranja (#FF6A00) para CTAs, item ativo do nav e destaques
