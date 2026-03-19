import { PublicKey } from "@solana/web3.js";

export const PROJECT_NAME = "$LAMBOON";
export const TOTAL_MINT_PRICE_USD = 5;
export const PLATFORM_FEE_USD = 1.5;
export const TOKENS_PER_MINT = 10_000;
export const MAX_MINTS_PER_WALLET = 10;
export const SUPPLY_CAP = 40_000;
export const INITIAL_TOTAL_MINTS = 28_450;
export const FALLBACK_SOL_PRICE = 150;
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

function readFeeValue() {
  return (
    process.env.NEXT_PUBLIC_FEE_WALLET ||
    process.env.NEXT_PUBLIC_FEE_ADDRESS
  );
}

export function getTreasuryWallet() {
  return parsePublicKey(readTreasuryValue());
}

export function getFeeWallet() {
  return parsePublicKey(readFeeValue());
}

export function getWalletConfigError() {
  if (!readTreasuryValue()?.trim() || !readFeeValue()?.trim()) {
    return "Add NEXT_PUBLIC_TREASURY_WALLET or NEXT_PUBLIC_TREASURY_ADDRESS, and NEXT_PUBLIC_FEE_WALLET or NEXT_PUBLIC_FEE_ADDRESS, to run live payments.";
  }

  if (!getTreasuryWallet() || !getFeeWallet()) {
    return "Wallet configuration is invalid. Check your public key values.";
  }

  return null;
}
