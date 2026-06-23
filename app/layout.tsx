import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/components/Providers";
import Script from "next/script";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: { default: "Achado Inteligente | Reviews e Comparativos", template: "%s | Achado Inteligente" },
  description: "Reviews imparciais e comparativos dos melhores produtos com links de afiliado do Mercado Livre.",
  other: {
    "google-adsense-account": "ca-pub-4615237498354130",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <head>
        {/* Google AdSense — ativo quando NEXT_PUBLIC_ADSENSE_ID estiver configurado */}
        {ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {/* Google Analytics 4 — ativo quando NEXT_PUBLIC_GA_ID estiver configurado */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
