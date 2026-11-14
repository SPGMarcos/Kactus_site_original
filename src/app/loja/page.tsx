import { BrandAsterisk } from '@/components/brand-asterisk';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { catalog, taxonomies } from '@/lib/catalog';
import { ProductCard } from '@/components/product-card';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Loja' };
export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const [{ products, count, error }, { categories, collections }] =
    await Promise.all([catalog(params), taxonomies()]);
  const page = Math.max(1, Number(params.page) || 1);
  return (
    <section className="section shop">
      <div className="breadcrumb">
        <Link href="/">Início</Link> / Loja
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">SELEÇÃO KACTUS STYLISH</p>
          <h1>Seu próximo estilo.</h1>
          <p className="muted">Encontre as peças que combinam com você.</p>
        </div>
        <span className="catalog-count">{count} produtos</span>
      </div>
      <form className="filters" action="/loja">
        <label className="search-field" htmlFor="busca">
          <Search size={18} />
          <input
            id="busca"
            name="q"
            placeholder="O que você procura?"
            defaultValue={params.q}
          />
        </label>
        <label>
          Categoria
          <select name="category" defaultValue={params.category || ''}>
            <option value="">Todas</option>
            {categories.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Coleção
          <select name="collection" defaultValue={params.collection || ''}>
            <option value="">Todas as coleções</option>
            {collections.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tamanho
          <select name="size" defaultValue={params.size || ''}>
            <option value="">Todos</option>
            {['PP', 'P', 'M', 'G', 'GG', 'XG'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Cor
          <input name="color" placeholder="Todas" defaultValue={params.color} />
        </label>
        <label>
          Ordenar
          <select name="sort" defaultValue={params.sort || 'new'}>
            <option value="new">Novidades</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
          </select>
        </label>
        <label className="checkbox">
          <input
            name="available"
            type="checkbox"
            value="1"
            defaultChecked={!!params.available}
          />{' '}
          Disponíveis
        </label>
        <button className="button" type="submit">
          <SlidersHorizontal size={16} /> Filtrar
        </button>
      </form>
      {products.length ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span><BrandAsterisk /></span>
          <h2>
            {error
              ? 'Catálogo temporariamente indisponível'
              : Object.keys(params).length
                ? 'Nenhuma peça encontrada'
                : 'Nossa coleção está a caminho.'}
          </h2>
          <p>
            {error
              ? 'Tente novamente em instantes.'
              : 'Acompanhe as novidades da Kactus no Instagram ou explore outros filtros.'}
          </p>
          <Link
            className="text-link"
            href={
              Object.keys(params).length
                ? '/loja'
                : 'https://www.instagram.com/kactus_stylish_01/'
            }
          >
            {Object.keys(params).length
              ? 'Limpar filtros'
              : 'Conhecer a Kactus'}{' '}
            <ArrowRight size={17} />
          </Link>
        </div>
      )}
      {count > 12 && (
        <nav className="pagination" aria-label="Paginação">
          {Array.from({ length: Math.ceil(count / 12) }, (_, i) => (
            <Link
              aria-current={page === i + 1 ? 'page' : undefined}
              key={i}
              href={
                '/loja?' +
                new URLSearchParams({
                  ...(Object.fromEntries(
                    Object.entries(params).filter(([, v]) => v !== undefined),
                  ) as Record<string, string>),
                  page: String(i + 1),
                })
              }
            >
              {i + 1}
            </Link>
          ))}
        </nav>
      )}
    </section>
  );
}
