import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyFlow — Academic Command Center",
  description:
    "An interactive study hub with course tracking, 3D flashcards, LaTeX notes, and Pomodoro timer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
