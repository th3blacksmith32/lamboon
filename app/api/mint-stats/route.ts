import { NextResponse } from "next/server";
import { readMintStats, writeMintStats } from "@/lib/mint-stats";

export async function GET() {
  const stats = await readMintStats();
  return NextResponse.json(stats);
}

export async function POST() {
  const stats = await readMintStats();
  const nextStats = {
    totalMints: stats.totalMints + 1
  };

  await writeMintStats(nextStats);

  return NextResponse.json(nextStats);
}
