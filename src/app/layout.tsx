import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

/**
 * Inter Tight sustituye a Helvetica Now Display, que es una fuente paga de
 * Monotype y requiere licencia web. Si la AIF la tiene, se reemplaza acá y en
 * --font-display de globals.css. Ver docs/02-design-system.md
 */
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// `||` y no `??`: la variable puede llegar como cadena vacía —un ARG de Docker
// sin valor, o un campo vacío en el panel de Vercel— y `??` solo cubre
// null/undefined, con lo que new URL("") rompe el build entero.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://copat3d.com.ar";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "COPAT 3D - Congreso Patagónico de Impresión 3D",
    template: "%s · COPAT 3D",
  },
  description:
    "Congreso Patagónico de Impresión 3D, Fabricación Digital e Innovación Aplicada. 2 y 3 de octubre de 2026 en la ciudad Autónoma de Buenos Aires. Diseñando el futuro capa a capa.",
  keywords: [
    "impresión 3D",
    "fabricación digital",
    "Industria 4.0",
    "Ushuaia",
    "Tierra del Fuego",
    "Patagonia",
    "congreso",
    "bioimpresión",
    "AeIAS",
    "Patagonia",
    "Buenos Aires",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "COPAT 3D",
    title: "COPAT 3D - Diseñando el futuro capa a capa",
    description:
      "Congreso Patagónico de Impresión 3D, Fabricación Digital e Innovación Aplicada. 2 y 3 de octubre, Ciudad Autónoma de Buenos Aires.",
  },
  twitter: {
    card: "summary_large_image",
    title: "COPAT 3D - Diseñando el futuro capa a capa",
    description:
      "Congreso Patagónico de Impresión 3D, Fabricación Digital e Innovación Aplicada. 2 y 3 de octubre, Ciudad Autónoma de Buenos Aires.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0410" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: next-themes escribe la clase de tema en <html>
    // antes de la hidratación, por lo que servidor y cliente difieren a propósito.
    <html
      lang="es-AR"
      suppressHydrationWarning
      className={`${interTight.variable} ${inter.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning también en <body>: extensiones como
          ColorZilla o Grammarly le inyectan atributos (cz-shortcut-listen,
          data-gr-*) antes de que React hidrate. No es un desajuste nuestro
          y no hay forma de evitarlo desde la aplicación. */}
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navbar y Footer viven en el layout, fuera de template.tsx: son
              chrome persistente y además el navbar es position:fixed, que se
              rompería dentro del contenedor animado de la transición. */}
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
