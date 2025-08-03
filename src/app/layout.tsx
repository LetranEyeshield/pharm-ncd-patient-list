import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pharm NCD Patient List",
  description: "Simple CRUD Web App for RHU-Manaoag NCD Patient List.",
  keywords:
    "pharmacy, RHU, Rural Health Unit, Manaoag, patient, medicine, medicines",
  openGraph: {
    title: "RHU-Manaoag NCD Patient List",
    description: "rhu-manaoag pharmacy",
    // url: "https://yourdomain.com",
    url: "https://pharm-ncd-patient-list.vercel.app",
    siteName: "Pharm NCD Patient List",
    images: [
      {
        url: "/banner.jpg", // Make sure this is a real image path
        width: 1200,
        height: 630,
        alt: "Banner",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playwrite+HU:wght@100..400&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" />
        <footer>
          <p className="text-center py-6">
            &copy; by RHU Pharma Team 2025. All Rights Reserved
          </p>
        </footer>
      </body>
    </html>
  );
}
