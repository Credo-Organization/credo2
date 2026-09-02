import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  interactiveWidget: "resizes-visual",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF9F6" },
    { media: "(prefers-color-scheme: dark)", color: "#18181B" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Minskey — AI-Powered Skill Passport",
    template: "%s | Minskey",
  },
  description:
    "Transform your GitHub activity and certifications into an evidence-backed professional identity. Understand your strengths, identify skill gaps, and get personalized career roadmaps.",
  keywords: [
    "skill passport",
    "github analysis",
    "career roadmap",
    "skill verification",
    "professional identity",
  ],
  authors: [{ name: "Minskey" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Minskey — AI-Powered Skill Passport",
    description:
      "Transform your GitHub activity and certifications into an evidence-backed professional identity.",
    siteName: "Minskey",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minskey — AI-Powered Skill Passport",
    description:
      "Transform your GitHub activity and certifications into an evidence-backed professional identity.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen min-h-[100dvh] overflow-x-hidden bg-background text-foreground antialiased selection:bg-blue-100 selection:text-blue-950">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
