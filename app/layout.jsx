import { Manrope } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import {
  ThemeProvider,
  ThemedToastContainer,
} from "@/components/providers/ThemeProvider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "DairyMart | Fresh Dairy Products",
  description:
    "DairyMart is a convenient platform for discovering and ordering fresh dairy products, including milk, yogurt, butter, cheese, and more.",
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");t=t==="dark"||t==="light"?t:"light";var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={manrope.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={manrope.className}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <SessionProvider>
          <ReduxProvider>
            <ThemeProvider>
              {children}
              <ThemedToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
              />
            </ThemeProvider>
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
