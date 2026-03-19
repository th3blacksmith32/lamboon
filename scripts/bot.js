const {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl
} = require("@solana/web3.js");
const {
  getOrCreateAssociatedTokenAccount,
  transfer
} = require("@solana/spl-token");

const rpcUrl =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  process.env.NEXT_PUBLIC_RPC_URL ||
  clusterApiUrl("mainnet-beta");

const privateKeyRaw = process.env.PRIVATE_KEY;
const mintAddress = process.env.TOKEN_MINT_ADDRESS;
const treasuryAddress =
  process.env.NEXT_PUBLIC_TREASURY_WALLET ||
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS;
const tokensPerMint = Number(process.env.TOKENS_PER_MINT || "10000");

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function loadSigner() {
  const secret = JSON.parse(requireEnv("PRIVATE_KEY", privateKeyRaw));
  return Keypair.fromSecretKey(Uint8Array.from(secret));
}

async function sendTokens(recipientAddress, amount) {
  const signer = loadSigner();
  const connection = new Connection(rpcUrl, "confirmed");
  const mint = new PublicKey(requireEnv("TOKEN_MINT_ADDRESS", mintAddress));
  const recipient = new PublicKey(recipientAddress);

  const sourceAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    signer,
    mint,
    signer.publicKey
  );
  const destinationAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    signer,
    mint,
    recipient
  );

  const signature = await transfer(
    connection,
    signer,
    sourceAccount.address,
    destinationAccount.address,
    signer.publicKey,
    amount
  );

  return signature;
}

async function main() {
  const signer = loadSigner();
  console.log("Bot wallet:", signer.publicKey.toBase58());
  console.log("RPC:", rpcUrl);
  console.log("Treasury watcher target:", treasuryAddress || "not configured");
  console.log("Mint address:", requireEnv("TOKEN_MINT_ADDRESS", mintAddress));
  console.log("Tokens per mint:", tokensPerMint);
  console.log("Bot scaffold ready. Implement payment monitoring before calling sendTokens().");
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  sendTokens
};
