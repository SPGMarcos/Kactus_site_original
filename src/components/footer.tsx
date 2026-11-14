import Link from 'next/link';

import { settings } from '@/lib/catalog';
import { FooterHomeLink } from './footer-home-link';
export async function Footer() {
  const s = await settings();
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand-block">
          <FooterHomeLink />
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/">Início</Link>
          <Link href="/loja">Loja</Link>
          <Link href="/novidades">Novidades</Link>
          <Link href="/carrinho">Carrinho</Link>
          <Link href="/conta">Minha conta</Link>
        </div>
        <div>
          <h3>Informações</h3>
          <Link href="/politicas/entrega">Entrega e retirada</Link>
          <Link href="/politicas/trocas">Trocas e devoluções</Link>
          <Link href="/politicas/privacidade">Privacidade</Link>
        </div>
        <div>
          <h3>Fale com a Kactus</h3>
          <a
            href="https://www.instagram.com/kactus_stylish_01/"
            target="_blank"
            rel="noreferrer"
          >
            Nos encontre no Instagram ↗
          </a>
          <a
            href={
              s?.whatsapp
                ? `https://wa.me/${s.whatsapp.replace(/\D/g, '')}`
                : 'https://bio.site/kactusstylish01'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp das lojas ↗
          </a>
          <p>Buenópolis e Curvelo · MG</p>
          {s?.address && <p>{s.address}</p>}
          <span className="footer-note">Moda masculina. Sua identidade.</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kactus Stylish</span>
        <span>AMBIENTE DE TESTES · NENHUMA COBRANÇA REAL</span>
        <Link href="/admin">Área administrativa ↗</Link>
      </div>
    </footer>
  );
}
