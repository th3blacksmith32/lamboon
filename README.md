# SOLANA PRIME MINT

Solana split-payment mint page built with Next.js, Tailwind CSS, and the Solana wallet adapter.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
copy .env.example .env.local
```

3. Fill in:

- `NEXT_PUBLIC_TREASURY_ADDRESS` or `NEXT_PUBLIC_TREASURY_WALLET`
- `NEXT_PUBLIC_SOLANA_RPC_URL` or `NEXT_PUBLIC_RPC_URL`

4. Run locally:

```bash
npm run dev
```

5. Start the backend bot scaffold:

```bash
npm run bot
```

## Deployment

1. Frontend (Vercel):
- Push the code to GitHub.
- Import the repo into Vercel.
- Add `NEXT_PUBLIC_TREASURY_ADDRESS` in the Vercel environment settings.

2. Backend (Railway):
- Deploy [scripts/bot.js](C:\Users\crypt\Downloads\minttoken\scripts\bot.js) on Railway.
- Add `PRIVATE_KEY`, `TOKEN_MINT_ADDRESS`, and your RPC variables.
- Ensure the bot wallet has SOL for gas and enough SPL tokens to fulfill mints.

## Important

- The wallet mint cap is stored per wallet in browser local storage. This is not a secure anti-bot or anti-sybil control.
- Token delivery is not automatic in this frontend. Run a backend worker that watches confirmed payments and distributes tokens.
- The frontend exposes only the treasury payment address. There is no platform fee address in the public app.
- [scripts/bot.js](C:\Users\crypt\Downloads\minttoken\scripts\bot.js) is only a scaffold. It can send SPL tokens, but it does not yet monitor treasury payments or persist state.
