import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://skywashaustralia.com.au"),
  title: "Sky Wash Australia — Precision Drone Exterior Cleaning | Mornington Peninsula",
  description:
    "Premium drone-powered exterior cleaning on the Mornington Peninsula. CASA-certified, fully insured. Roofs, facades, solar, gutters and high surfaces cleaned from the sky — no ladders, no scaffolding, no risk.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Sky Wash Australia",
    title: "Sky Wash Australia — Precision Drone Exterior Cleaning",
    description: "Exterior cleaning, reimagined from the sky. CASA-certified drone cleaning on the Mornington Peninsula.",
    url: "/",
    locale: "en_AU",
    images: ["/og-image.jpg"], // TODO: add real 1200x630 OG image
  },
  twitter: {
    card: "summary_large_image",
    title: "Sky Wash Australia — Precision Drone Exterior Cleaning",
    description: "Exterior cleaning, reimagined from the sky. CASA-certified drone cleaning on the Mornington Peninsula.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0A0D11",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sky Wash Australia",
  description:
    "Premium drone-powered exterior cleaning. CASA-certified remote operator serving the Mornington Peninsula, Victoria.",
  url: "https://skywashaustralia.com.au/",
  image: "https://skywashaustralia.com.au/og-image.jpg",
  telephone: "+61-000-000-000",
  email: "hello@skywashaustralia.com.au",
  areaServed: { "@type": "Place", name: "Mornington Peninsula, Victoria, Australia" },
  address: { "@type": "PostalAddress", addressRegion: "VIC", addressCountry: "AU" },
  priceRange: "$$",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        {/* Fonts via link (no build-time fetch). TODO: licensed Clash Display / Neue Montreal pairing. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
