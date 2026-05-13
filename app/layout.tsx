import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import TopNav from "@/components/layout/TopNav";
import ThemedShell from "@/components/layout/ThemedShell";

export const metadata: Metadata = {
  title: "Dashtrans Admin — Dashboard",
  description: "Dashtrans admin dashboard with analytics and modern UI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body style={{ background: "#1a1f2e", minHeight: "100vh" }}>
        <ThemeProvider>
          <SidebarProvider>
            <ThemedShell>
              {/* Full-width layout — no sidebar */}
              <div className="flex flex-col min-h-screen">
                <TopNav />
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </ThemedShell>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
