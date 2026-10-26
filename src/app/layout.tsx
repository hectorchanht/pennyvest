import { Inter, Noto_Sans_TC } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className={`${inter.variable} ${notoSansTC.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');var m=location.pathname.match(/^\\/(zh-HK|zh)/);if(m)document.documentElement.lang='zh-HK';})();` }} />
        {/* Cloudflare Web Analytics */}<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "9e939fe6c32b450d9edcfbe41256e8ee"}'></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
