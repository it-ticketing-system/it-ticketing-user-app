import type { Metadata } from 'next';
import { Geist, Vazirmatn } from 'next/font/google';

import './globals.css';
import Providers from '@/providers';
import { getTranslations } from 'next-intl/server';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const vazirmatn = Vazirmatn({
  variable: '--font-vazirmatn',
  subsets: ['arabic'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('main_layout');

  return {
    title: {
      template: t('meta.title.template'),
      default: t('meta.title.default'),
    },
    description: t('meta.description'),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${geistSans.variable} ${vazirmatn.variable} light`}
      data-theme="light"
    >
      <body className="min-h-dvh flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
