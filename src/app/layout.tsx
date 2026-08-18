import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Credify — AI-Powered Skill Passport",
    template: "%s | Credify",
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
  authors: [{ name: "Credify" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Credify — AI-Powered Skill Passport",
    description:
      "Transform your GitHub activity and certifications into an evidence-backed professional identity.",
    siteName: "Credify",
  },
  twitter: {
    card: "summary_large_image",
    title: "Credify — AI-Powered Skill Passport",
    description:
      "Transform your GitHub activity and certifications into an evidence-backed professional identity.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
