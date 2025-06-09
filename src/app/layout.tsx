import type { Metadata } from "next"
import "./globals.css"
import { monserrat } from "@/ui/fonts"
import Header from "@/components/Headers/Header";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Saas AI",
  description: "Saas AI is a platform that provides AI tools and services for SaaS applications",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${monserrat.className} antialiased w-full flex flex-col min-h-screen m-0 p-0 bg-black/98 text-white`}
      >
        <Header />
        <main className="flex-1">
          <Toaster />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
