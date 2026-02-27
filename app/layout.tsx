// app/layout.tsx
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";
import BottomNav from "./components/BottomNav";

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
        <BottomNav />
      </body>
    </html>
  );
}
//このauthproviderでログイン情報を全体に配る