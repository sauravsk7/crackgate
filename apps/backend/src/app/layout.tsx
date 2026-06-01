/** Root layout — backend has no UI, but Next.js still requires this file
 *  for the App Router to boot. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export const metadata = { title: "CrackGate Backend" };
