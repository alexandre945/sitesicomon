import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-white text-black dark:bg-zinc-950 dark:text-zinc-100"
      >
        
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var t = localStorage.getItem("theme");
                if (t === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (e) {}
            })();
          `}
        </Script>

        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {children}
      </body>
    </html>
  );
}
