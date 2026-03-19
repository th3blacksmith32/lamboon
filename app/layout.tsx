import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

export const metadata: Metadata = {
  title: "SOLANA PRIME | FAIR MINT",
  description: "Solana split-payment mint page"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
