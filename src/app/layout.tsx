"use client";

import localFont from "next/font/local";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultConnectors } from "@fuels/connectors";
import { Provider } from "fuels";
import { useEffect, useState } from "react";
import { FuelProvider } from "@fuels/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const queryClient = new QueryClient();

const connectors = defaultConnectors({
  devMode: true,
  burnerWalletConfig: {
    fuelProvider: Provider.create("https://mainnet.fuel.network/v1/graphql"),
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render the component if the page has been mounted.
  if (!isMounted) return null;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <FuelProvider theme="dark" fuelConfig={{ connectors }}>
            {children}
          </FuelProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
