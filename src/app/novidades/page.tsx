import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { catalog } from '@/lib/catalog';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Novidades' };

export default async function Novidades() {
  const { products, error } = await catalog({ sort: 'new' });
  return (
    <section className="section shop">
      <div className="breadcrumb">
        <Link href="/">Início</Link> / Novidades
      </div>
      <div className="section-heading">
        <div>
          <h1>Novidades</h1>
          <p>As últimas peças que entraram no catálogo da Kactus.</p>
        </div>
        <Link className="text-link" href="/loja">
          Ver catálogo completo →
        </Link>
      </div>
      {products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>
            {error
              ? 'Não conseguimos carregar as novidades.'
              : 'Ainda não há peças por aqui.'}
          </h2>
          <p>
            {error
              ? 'Tente novamente em instantes.'
              : 'As próximas peças vão aparecer aqui assim que entrarem na loja online.'}
          </p>
        </div>
      )}
    </section>
  );
}
