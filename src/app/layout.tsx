import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ContentProvider } from "@/components/content-provider";
import { AuthProvider } from "@/lib/auth-context";
import { ServiceWorkerRegister } from "@/components/shared/service-worker-register";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});
const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Our Forever ❤️",
  description: "A private corner of the internet that belongs to us.",
  icons: { icon: "/logo.svg", apple: "/icon-192.png" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Our Forever",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff4d6d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dancing.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            <ContentProvider>
              {children}
              <Toaster />
              <ServiceWorkerRegister />
            </ContentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
