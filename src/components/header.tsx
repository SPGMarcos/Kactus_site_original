'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, UserRound, ShoppingBag, Menu, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useCart } from './cart-provider';
export function Header() {
  const { items } = useCart();
  const path = usePathname();
  return (
    <>
      <div className="announcement">REFERÊNCIA EM MODA MASCULINA </div>
      <header className="header">
        <Link className="brand" href="/" aria-label="Kactus Stylish, início">
          <img src="/logo.png" alt="" />
          <span>
            KACTUS<small>STYLISH</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Principal">
          <Link className={path === '/' ? 'active' : ''} href="/">
            Início
          </Link>
          <Link className={path === '/loja' ? 'active' : ''} href="/loja">
            Loja
          </Link>
          <Link
            className={path === '/novidades' ? 'active' : ''}
            href="/novidades"
          >
            Novidades
          </Link>
        </nav>
        <div className="header-actions">
          <Link href="/loja#busca" aria-label="Buscar produtos">
            <Search size={21} />
          </Link>
          <Link href="/conta" aria-label="Minha conta">
            <UserRound size={21} />
          </Link>
          <Link
            className="bag"
            href="/carrinho"
            aria-label={`Carrinho, ${items.reduce((n, i) => n + i.quantity, 0)} itens`}
          >
            <ShoppingBag size={21} />
            <span>{items.reduce((n, i) => n + i.quantity, 0)}</span>
          </Link>
          <Dialog.Root>
            <Dialog.Trigger
              className="mobile-menu icon-button"
              aria-label="Abrir menu"
            >
              <Menu />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="menu-content">
                <Dialog.Title>Explore a Kactus</Dialog.Title>
                <Dialog.Description>
                  Moda masculina com personalidade.
                </Dialog.Description>
                <Dialog.Close
                  className="icon-button close"
                  aria-label="Fechar menu"
                >
                  <X />
                </Dialog.Close>
                {[
                  ['/', 'Início'],
                  ['/loja', 'Loja'],
                  ['/novidades', 'Novidades'],
                ].map(([href, label]) => (
                  <Dialog.Close asChild key={href}>
                    <Link href={href}>{label}</Link>
                  </Dialog.Close>
                ))}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
    </>
  );
}
