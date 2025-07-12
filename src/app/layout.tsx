import "./globals.css";
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <title>2025 SNU FastMRI Challenge Leaderboard</title>
        <meta charSet="utf-8" />
        <link href='//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css' rel='stylesheet' type='text/css' />
      </head>
      <body>{children}</body>
    </html>
  );
}
