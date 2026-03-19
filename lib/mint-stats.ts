import { createClient } from "@supabase/supabase-js";

type MintStats = {
  totalMints: number;
};

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function readMintStats(): Promise<MintStats> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("mint_stats")
    .select("total_mints")
    .eq("id", 1)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    totalMints: typeof data?.total_mints === "number" ? data.total_mints : 0
  };
}

export async function writeMintStats(stats: MintStats) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("mint_stats")
    .upsert({ id: 1, total_mints: stats.totalMints });

  if (error) {
    throw new Error(error.message);
  }
}
