import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/Theme-provider";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <div className="h-auto min-h-screen bg-background text-foreground">
            <NavBar />
            {children}
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
