// app/layout.tsx
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";

export const metadata = {
  title: "Kodo",
  description: "Private productivity app",
};

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <html lang="ja">
      <body>
        <div>
          <AuthProvider>{children}</AuthProvider>
        </div>
        <nav
        style={{
          position:"fixed",
          bottom:0,
          left:0,
          height:"200px",
          background:"#ff3",
          borderTop:"1px solid #ddd",
          display:"flex",
          justifyContent: "space-around",
          alignItems: "center",
          }}>
          <Link href="/login">login</Link>
          <Link href="/">Home</Link>
          <Link href="/post">Post</Link>
          <Link href="/timeline">Timeline</Link>
          <Link href="/today">today</Link>
          
        </nav>
      </body>
    </html>
  );
}
