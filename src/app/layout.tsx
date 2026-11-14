import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/cart-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ),
  title: {
    default: 'Kactus Stylish | Vista sua essência',
    template: '%s | Kactus Stylish',
  },
  description:
    'Moda masculina com personalidade. Conheça a Kactus Stylish e descubra seu próximo estilo.',
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body id="topo">
        <CartProvider>
          <a className="skip-link" href="#conteudo">
            Pular para o conteúdo
          </a>
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
