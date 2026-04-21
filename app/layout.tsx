import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { LessonSidebar } from "@/components/game/lesson-sidebar";
import { OutputSidebar } from "@/components/game/output-panel";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "AI SDK Quest - Aprende Vercel AI SDK",
  description:
    "Juego interactivo para aprender el Vercel AI SDK desde cero hasta avanzado",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        "bg-background antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
      lang="es"
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TooltipProvider delay={200}>
            <SidebarProvider>
              <LessonSidebar />

              <SidebarInset>{children}</SidebarInset>
              <OutputSidebar />
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
