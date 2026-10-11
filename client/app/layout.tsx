import type { Metadata } from "next";
import "./globals.css";
import {AuthProvider} from "@/lib/auth/auth-context"

export const metadata: Metadata = {
  title: "PromptVault",
  description: "A simple prompt vault for managing and organizing your prompts -- Jagdeep Singh",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased font-sans" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
