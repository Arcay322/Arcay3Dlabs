import type { Metadata } from 'next';
import { Roboto, Poppins, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { ClientShell } from '@/components/layout/client-shell';
import { siteConfig } from '@/config/site';

const fontRoboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const fontJetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Taller de Manufactura Digital 3D`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'impresión 3D',
    'manufactura digital',
    'PLA',
    'FDM',
    'prototipado',
    'diseño 3D',
    'Perú',
    'Arcay3DLabs',
  ],
  authors: [{ name: 'Arcay3DLabs' }],
  creator: 'Arcay3DLabs',
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/images/a3dl_logo.webp`,
        width: 800,
        height: 800,
        alt: 'Arcay3DLabs Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/a3dl_logo.webp`],
  },
  icons: {
    icon: '/images/a3dl_logo.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${fontRoboto.variable} ${fontPoppins.variable} ${fontJetbrains.variable} font-body antialiased`}
      >
        <Providers>
          <ClientShell>{children}</ClientShell>
        </Providers>
      </body>
    </html>
  );
}
