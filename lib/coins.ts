/**
 * 314Coins — configuração estática dos pacotes.
 * A compra é simulada (mock) nesta versão; um gateway real entra via
 * webhook confirmando o pagamento e inserindo a mesma linha de ledger
 * (kind='purchase') — ver app/api/coins/purchase/route.ts.
 */

export interface CoinPack {
  id: string;
  coins: number;
  priceLabel: string;
  popular?: boolean;
}

export const COIN_PACKS: CoinPack[] = [
  { id: "pack-200", coins: 200, priceLabel: "R$9,90" },
  { id: "pack-500", coins: 500, priceLabel: "R$19,90", popular: true },
  { id: "pack-1200", coins: 1200, priceLabel: "R$39,90" },
];

export function getPack(packId: string): CoinPack | undefined {
  return COIN_PACKS.find((p) => p.id === packId);
}
