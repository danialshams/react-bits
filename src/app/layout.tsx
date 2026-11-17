import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NOVA — Digital experiences, reimagined',
  description: 'استودیوی خلاق طراحی تجربه‌های دیجیتال. طراحی، حرکت و تکنولوژی در یک روایت سینمایی.',
  openGraph: { title: 'NOVA — Creative Digital Studio', description: 'Where imagination becomes interaction.', type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
