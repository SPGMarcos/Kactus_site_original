'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function FooterHomeLink() {
  const pathname = usePathname();
  return (
    <Link
      href="/#topo"
      className="footer-brand"
      aria-label="Voltar ao topo da página"
      onNavigate={(event) => {
        if (pathname === '/') {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
    >
      KACTUS<span>STYLISH</span>
    </Link>
  );
}
