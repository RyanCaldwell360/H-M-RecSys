import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    title: "H&M For You · Personalized Fashion",
    description: "A production-like fashion storefront powered by explainable recommendations and real H&M competition data.",
    openGraph: {
      title: "The edit, for you.",
      description: "20 real products · explainable recommendations",
      type: "website",
      url: origin,
      images: [{ url: `${origin}/og.png`, width: 1536, height: 1024, alt: "H&M For You personalized fashion edit" }],
    },
    twitter: { card: "summary_large_image", title: "The edit, for you.", description: "20 real products · explainable recommendations", images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
