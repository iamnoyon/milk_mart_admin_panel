import { Manrope } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { ToastContainer } from "react-toastify";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { siteConfig } from "@/config/siteConfig";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "DairyMart | Fresh Dairy Products",
  description:
    "DairyMart is a convenient platform for discovering and ordering fresh dairy products, including milk, yogurt, butter, cheese, and more.",
};

export default function RootLayout({ children }) {
  const theme = siteConfig.theme;

  return (
    <html
      lang="en"
      className={`${manrope.variable}${theme === "dark" ? " dark" : ""}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={manrope.className}>
        <SessionProvider>
          <ReduxProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ReduxProvider>
        </SessionProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          theme={theme}
        />
      </body>
    </html>
  );
}
