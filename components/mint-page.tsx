"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction
} from "@solana/web3.js";
import {
  Flame,
  ShieldAlert,
  ShieldCheck,
  Twitter
} from "lucide-react";
import logo from "@/logo.png";
import {
  INITIAL_TOTAL_MINTS,
  MAX_MINTS_PER_WALLET,
  PROJECT_NAME,
  PROJECT_X_URL,
  SUPPLY_CAP,
  TOTAL_SUPPLY_LABEL,
  TOKENS_PER_MINT,
  TOTAL_MINT_PRICE_USD
} from "@/lib/mint-config";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getStoredMintCount(walletAddress: string) {
  if (typeof window === "undefined") {
    return 0;
  }

  const raw = window.localStorage.getItem(`mint-count:${walletAddress}`);
  const parsed = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

function setStoredMintCount(walletAddress: string, count: number) {
  window.localStorage.setItem(`mint-count:${walletAddress}`, String(count));
}

export function MintPage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [mintCount, setMintCount] = useState(0);
  const [totalMints, setTotalMints] = useState(INITIAL_TOTAL_MINTS);
  const [loading, setLoading] = useState(false);
  const [showMaxPopup, setShowMaxPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setMintCount(0);
      return;
    }

    setMintCount(getStoredMintCount(publicKey.toBase58()));
  }, [publicKey]);

  async function handleMint() {
    if (!publicKey) {
      setErrorMessage("Connect a Solana wallet before minting.");
      return;
    }

    const treasuryStr =
      process.env.NEXT_PUBLIC_TREASURY_ADDRESS ||
      process.env.NEXT_PUBLIC_TREASURY_WALLET;

    if (!treasuryStr) {
      setErrorMessage("Configuration error: treasury address is missing in .env.local");
      return;
    }

    if (mintCount >= MAX_MINTS_PER_WALLET) {
      setShowMaxPopup(true);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const treasury = new PublicKey(treasuryStr);
      const latestBlockhash = await connection.getLatestBlockhash("confirmed");
      const transaction = new Transaction({
        feePayer: publicKey,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasury,
          lamports: Math.floor(0.035 * LAMPORTS_PER_SOL)
        })
      );

      await sendTransaction(transaction, connection);

      const nextMintCount = mintCount + 1;
      setStoredMintCount(publicKey.toBase58(), nextMintCount);
      setMintCount(nextMintCount);
      setTotalMints((current) => current + 1);
      window.alert("Payment Sent! $LAMBOON will arrive in your wallet in 60 seconds.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Transaction failed. Make sure you have enough SOL.");
    } finally {
      setLoading(false);
    }
  }

  const progress = Math.min((totalMints / SUPPLY_CAP) * 100, 100);

  return (
    <main className="min-h-screen bg-black px-6 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <nav className="z-10 flex w-full items-center justify-between py-8">
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt={`${PROJECT_NAME} logo`}
              className="h-10 w-10 rounded-xl object-cover"
              priority
            />
            <div className="text-2xl font-black italic text-[#14F195]">{PROJECT_NAME}</div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={PROJECT_X_URL}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer text-slate-400 transition-colors hover:text-[#14F195]"
            >
              <Twitter size={20} />
            </a>
            <WalletMultiButton className="!rounded-xl !bg-[#9945FF]" />
          </div>
        </nav>

        <div className="z-10 mt-10 w-full max-w-lg rounded-[40px] border border-white/5 bg-[#111] p-10 shadow-2xl">
          <div className="mb-6 flex justify-center">
            <Image
              src={logo}
              alt={`${PROJECT_NAME} hero logo`}
              className="h-24 w-24 rounded-[28px] object-cover shadow-lg"
            />
          </div>
          <h1 className="mb-2 text-center text-5xl font-black uppercase italic">{PROJECT_NAME}</h1>
          <p className="mb-10 text-center text-sm text-gray-500">
            Fixed supply. No team tokens. High performance.
          </p>

          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-white/5 p-5 text-center">
              <div className="text-[10px] font-bold uppercase text-gray-500">Price</div>
              <div className="text-2xl font-black">{formatUsd(TOTAL_MINT_PRICE_USD)}</div>
            </div>
            <div className="rounded-3xl bg-white/5 p-5 text-center">
              <div className="text-[10px] font-bold uppercase text-gray-500">Per Mint</div>
              <div className="text-2xl font-black">{TOKENS_PER_MINT / 1000}K</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMint}
            disabled={loading || !connected || mintCount >= MAX_MINTS_PER_WALLET}
            className="w-full rounded-3xl bg-[#d1d1d1] py-6 text-xl font-black uppercase text-black transition-all hover:bg-white disabled:opacity-50"
          >
            {loading ? "Processing..." : `Mint ${PROJECT_NAME}`}
          </button>

          <div className="mt-10">
            <div className="mb-2 flex justify-between text-[10px] font-bold uppercase text-gray-500">
              <span>Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/5">
              <div className="h-full bg-[#14F195]" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 text-center text-[10px] font-bold uppercase text-gray-600">
              {formatInteger(totalMints)} / {formatInteger(SUPPLY_CAP)} Minted
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <div className="mt-16 grid grid-cols-3 gap-10 opacity-80">
          <TrustSignal
            icon={<ShieldCheck className="text-[#14F195]" size={24} />}
            label="Mint Auth Revoked"
          />
          <TrustSignal
            icon={<Flame className="text-orange-500" size={24} />}
            label="LP Will Be Burned"
          />
          <TrustSignal
            icon={<Twitter className="text-blue-400" size={24} />}
            label="Check X For Announcements"
          />
        </div>

        <div className="mt-12 pb-8 text-[10px] uppercase tracking-[0.2em] text-gray-600">
          Total Supply: {TOTAL_SUPPLY_LABEL} | Solana Mainnet
        </div>
      </div>

      {showMaxPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur">
          <div className="w-full max-w-md rounded-[2rem] border border-red-400/30 bg-slate-950 p-8 text-center shadow-panel">
            <ShieldAlert className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-5 text-2xl font-black uppercase tracking-tight">Wallet limit reached</h3>
            <p className="mt-3 text-sm text-slate-300">
              This wallet already recorded {MAX_MINTS_PER_WALLET} mints on this device. Raise the hard limit in your backend or smart contract if your sale rules differ.
            </p>
            <button
              type="button"
              onClick={() => setShowMaxPopup(false)}
              className="mt-6 w-full rounded-[1.25rem] bg-white px-4 py-3 font-bold uppercase tracking-[0.15em] text-ink"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function TrustSignal({
  icon,
  label
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {icon}
      <span className="text-center text-[9px] font-bold uppercase">
        {label}
      </span>
    </div>
  );
}
