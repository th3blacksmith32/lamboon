"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction
} from "@solana/web3.js";
import {
  ExternalLink,
  Flame,
  Send,
  ShieldCheck,
  Twitter
} from "lucide-react";
import logo from "@/logo.png";
import {
  INITIAL_TOTAL_MINTS,
  PROJECT_NAME,
  PROJECT_X_URL,
  SUPPLY_CAP
} from "@/lib/mint-config";

export function MintPage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [currentMints, setCurrentMints] = useState(INITIAL_TOTAL_MINTS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadGlobalMintCount() {
      try {
        const response = await fetch("/api/mint-stats", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load mint stats");
        }

        const data = (await response.json()) as { totalMints?: number };

        if (!ignore && typeof data.totalMints === "number") {
          setCurrentMints(data.totalMints);
        }
      } catch {
        if (!ignore) {
          setCurrentMints(INITIAL_TOTAL_MINTS);
        }
      }
    }

    void loadGlobalMintCount();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleMint() {
    if (!publicKey) {
      setErrorMessage("Connect a Solana wallet before minting.");
      return;
    }

    const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

    if (!treasuryAddress) {
      setErrorMessage("Missing NEXT_PUBLIC_TREASURY_ADDRESS.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(treasuryAddress),
          lamports: Math.floor(0.035 * LAMPORTS_PER_SOL)
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      try {
        const response = await fetch("/api/mint-stats", {
          method: "POST"
        });

        if (response.ok) {
          const data = (await response.json()) as { totalMints?: number };
          setCurrentMints(
            typeof data.totalMints === "number" ? data.totalMints : currentMints + 1
          );
        } else {
          setCurrentMints((value) => value + 1);
        }
      } catch {
        setCurrentMints((value) => value + 1);
      }

      window.alert("Payment Confirmed! Bot is sending $LAMBOON.");
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Transaction failed.");
    } finally {
      setLoading(false);
    }
  }

  const progressWidth = `${Math.min((currentMints / SUPPLY_CAP) * 100, 100)}%`;

  return (
    <div className="min-h-screen select-none bg-black px-4 pb-10 text-white selection:bg-[#9945FF] md:p-10">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,#1d0b30_0%,#000000_100%)] opacity-70" />

      <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Lamboon Logo" className="h-10 w-10 object-contain" priority />
          <span className="text-2xl font-black uppercase tracking-tighter text-[#14F195] italic">
            {PROJECT_NAME}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={PROJECT_X_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
          >
            <Twitter size={20} />
          </a>
          <a
            href="#"
            className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
          >
            <Send size={20} />
          </a>
          <WalletMultiButton className="!rounded-xl !bg-white !font-black !text-black transition-all hover:!bg-[#9945FF] hover:!text-white" />
        </div>
      </nav>

      <main className="relative z-10 mx-auto mt-10 flex w-full max-w-6xl flex-col items-center gap-10 md:mt-16 lg:flex-row">
        <div className="flex flex-1 flex-col items-center space-y-6 lg:items-start">
          <Image
            src={logo}
            alt="Lamboon"
            className="w-full max-w-[450px] drop-shadow-[0_0_50px_rgba(153,69,255,0.4)]"
            priority
          />
          <div className="text-center lg:text-left">
            <h2 className="mb-2 text-xl font-bold uppercase tracking-widest text-[#14F195]">
              First Fair-Mint Meme on Solana
            </h2>
            <p className="max-w-md leading-relaxed text-gray-400">
              $LAMBOON is a 100% community-owned token. No team allocation. No insider
              tokens. 100% of supply goes to the community through this mint and the
              liquidity pool.
            </p>
          </div>
        </div>

        <div className="w-full max-w-xl rounded-[50px] border border-white/5 bg-[#0a0a0a] p-8 shadow-2xl md:p-12">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter italic">
                {PROJECT_NAME}
              </h1>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-[#9945FF]">
                Fair Launch Live
              </p>
            </div>
            <div className="text-right">
              <span className="mb-1 block text-[10px] font-bold uppercase text-gray-500">
                Price
              </span>
              <span className="text-2xl font-black text-[#14F195]">$5.00</span>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-white/5 bg-white/5 p-5">
              <span className="mb-1 block text-[10px] font-bold uppercase text-gray-500">
                Per Mint
              </span>
              <span className="text-xl font-black italic">10K TOKENS</span>
            </div>
            <div className="rounded-3xl border border-white/5 bg-white/5 p-5 text-right">
              <span className="mb-1 block text-[10px] font-bold uppercase text-gray-500">
                Max Supply
              </span>
              <span className="text-xl font-black italic text-[#9945FF]">1 BILLION</span>
            </div>
          </div>

          <button
            onClick={handleMint}
            disabled={loading}
            className="mb-8 w-full rounded-[24px] bg-white py-6 text-2xl font-black uppercase text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all hover:bg-[#14F195] active:scale-95 disabled:opacity-50"
          >
            {loading ? "Confirming..." : "Mint $LAMBOON"}
          </button>

          <div className="space-y-3">
            <div className="flex justify-between text-[11px] font-black uppercase italic text-gray-500">
              <span>Minted: {currentMints.toLocaleString("en-US")}</span>
              <span>Remaining: {(SUPPLY_CAP - currentMints).toLocaleString("en-US")}</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full border border-white/10 bg-white/5 p-1">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] transition-all duration-1000"
                style={{ width: progressWidth }}
              />
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {errorMessage}
            </div>
          ) : null}
        </div>
      </main>

      <div className="relative z-10 mx-auto mt-20 grid w-full max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <h3 className="mb-6 flex items-center gap-3 text-2xl font-black uppercase italic">
            <ShieldCheck className="text-[#14F195]" /> Token Allocation
          </h3>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm font-bold">
                <span>COMMUNITY SALE (MINT)</span>
                <span className="text-[#14F195]">70%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[70%] bg-[#14F195]" />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm font-bold text-gray-400">
                <span>LIQUIDITY POOL (LOCKED/BURNED)</span>
                <span>30%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[30%] bg-[#9945FF]" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[40px] border border-white/5 bg-white/5 p-8">
          <h3 className="mb-4 text-2xl font-black uppercase italic">Roadmap & Trust</h3>
          <p className="mb-6 text-sm leading-relaxed text-gray-400">
            Liquidity will be created on Raydium immediately after the mint sells out. LP
            tokens will be burned forever. Mint authority is revoked to guarantee a fixed
            supply.
          </p>
          <div className="flex flex-col gap-4 md:flex-row">
            <a
              href={PROJECT_X_URL}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#9945FF]/10 py-3 text-xs font-black uppercase text-[#9945FF] transition-all hover:bg-[#9945FF]/20"
            >
              <Twitter size={16} /> Follow Twitter
            </a>
            <a
              href="#"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#14F195]/10 py-3 text-xs font-black uppercase text-[#14F195] transition-all hover:bg-[#14F195]/20"
            >
              <Send size={16} /> Join Telegram
            </a>
          </div>
        </div>
      </div>

      <footer className="relative z-10 mt-32 pb-10 text-[10px] font-bold uppercase tracking-[0.5em] text-gray-700">
        Solana Mainnet • $LAMBOON 2026 • Verified Fair Launch
      </footer>
    </div>
  );
}
