import { promises as fs } from "fs";
import path from "path";

const statsPath = path.join(process.cwd(), "data", "mint-stats.json");

type MintStats = {
  totalMints: number;
};

export async function readMintStats(): Promise<MintStats> {
  try {
    const file = await fs.readFile(statsPath, "utf8");
    const parsed = JSON.parse(file) as Partial<MintStats>;
    const totalMints =
      typeof parsed.totalMints === "number" && Number.isFinite(parsed.totalMints)
        ? parsed.totalMints
        : 0;

    return {
      totalMints
    };
  } catch {
    return { totalMints: 0 };
  }
}

export async function writeMintStats(stats: MintStats) {
  await fs.mkdir(path.dirname(statsPath), { recursive: true });
  await fs.writeFile(statsPath, JSON.stringify(stats, null, 2), "utf8");
}
