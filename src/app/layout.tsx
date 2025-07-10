"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";

import DynamicLogoBar from "./components/DynamicLogoBar";
import { InsightsPanelProvider } from "./components/InsightsPanelContext";
import { LayoutProvider } from "./components/LayoutContext";
import MainContentWrapper from "./components/MainContentWrapper";
import InsightsPanel from "./components/insights/InsightsPanel";
import LeftNavBar from "./components/nav/LeftNavBar";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/";
  const isAoiSelectionPage = pathname === "/aoi-selection";

  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <LayoutProvider>
          <InsightsPanelProvider>
            {/* Logo Bar - Fixed at top */}
            <DynamicLogoBar />

            {/* Main Layout Container */}
            <div className="relative flex w-full flex-row">
              {/* Sidebar - Fixed on left (hidden for auth and AOI selection pages) */}
              {!isAuthPage && !isAoiSelectionPage && <LeftNavBar />}

              {/* Main Content - Adjusts based on sidebar and insights panel */}
              {isAuthPage || isAoiSelectionPage ? (
                children
              ) : (
                <MainContentWrapper>{children}</MainContentWrapper>
              )}

              {/* Insights Panel - Fixed on right (hidden for auth and AOI selection pages) */}
              {!isAuthPage && !isAoiSelectionPage && <InsightsPanel />}
            </div>
          </InsightsPanelProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}
