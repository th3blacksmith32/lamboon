import { PublicKey } from "@solana/web3.js";

export const PROJECT_NAME = "$LAMBOON";
export const TOTAL_MINT_PRICE_USD = 5;
export const TOKENS_PER_MINT = 10_000;
export const MAX_MINTS_PER_WALLET = 10;
export const SUPPLY_CAP = 40_000;
export const INITIAL_TOTAL_MINTS = 28_450;
export const TOTAL_SUPPLY_LABEL = "1,000,000,000";
export const PROJECT_X_URL = "https://x.com/yourhandle";

function parsePublicKey(value: string | undefined) {
  if (!value?.trim()) {
    return null;
  }

  try {
    return new PublicKey(value.trim());
  } catch {
    return null;
  }
}

function readTreasuryValue() {
  return (
    process.env.NEXT_PUBLIC_TREASURY_WALLET ||
    process.env.NEXT_PUBLIC_TREASURY_ADDRESS
  );
}

export function getTreasuryWallet() {
  return parsePublicKey(readTreasuryValue());
}
