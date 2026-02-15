import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-white text-black dark:bg-zinc-950 dark:text-zinc-100">
        {/* Define o tema ANTES do React hidratar */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  } catch (e) {}
})();
`,
          }}
        />

        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {children}
      </body>
    </html>
  );
}
