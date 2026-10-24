import {
  Geist,
  Geist_Mono,
  Noto_Sans_Armenian,
  Noto_Serif_Armenian,
  Playfair_Display,
} from "next/font/google";
import "../globals.css";
import { getHomeContent } from "@/lib/home-content";
import {
  defaultLocale,
  isLocale,
  locales,
  type Locale,
} from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const notoSansArmenian = Noto_Sans_Armenian({
  variable: "--font-noto-sans-armenian",
  subsets: ["armenian"],
  display: "swap",
});

const notoSerifArmenian = Noto_Serif_Armenian({
  variable: "--font-noto-serif-armenian",
  subsets: ["armenian"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale;
  const content = getHomeContent(activeLocale);

  return (
    <html
      lang={activeLocale}
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${notoSansArmenian.variable} ${notoSerifArmenian.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          {content.common.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
