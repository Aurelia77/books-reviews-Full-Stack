import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/Theme-provider";
import Script from "next/script";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="fr">
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-V034HWED7J"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-V034HWED7J');
  `}
        </Script>
      </head>
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
};

export default RootLayout;
