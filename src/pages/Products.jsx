import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';

const SORTS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá thấp → cao' },
  { value: 'price_desc', label: 'Giá cao → thấp' },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const saleOnly = params.get('sale') === '1';
  const sort = params.get('sort') || 'newest';
  const maxPrice = params.get('maxPrice') || '';
  const inStockOnly = params.get('inStock') === '1';
  const combo = params.get('combo') === '1';

  useEffect(() => {
    setLoading(true);
    base44.entities.Product.list('-created_date', 100).then((d) => { setProducts(d); setLoading(false); }).catch(() => setLoading(false));
    base44.entities.Category.list().then(setCategories).catch(() => {});
  }, []);

  const normalizeCategoryName = (name = '') => {
    const value = String(name || '').trim();
    const normalized = value.toLowerCase();

    if (['trái cây', 'trai cay', 'rau củ quả', 'rau cu qua'].includes(normalized)) {
      return 'Rau Củ Quả';
    }

    return value;
  };

  const cats = categories.length ? categories.map((c) => normalizeCategoryName(c.name)) : ['Rau Lá', 'Củ Quả', 'Rau Củ Quả', 'Gia Vị'];

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category) list = list.filter((p) => p.category === category);
    if (saleOnly) list = list.filter((p) => p.old_price && p.old_price > p.price);
    if (inStockOnly) list = list.filter((p) => p.status !== 'out_of_stock' && (p.stock ?? 0) > 0);
    if (combo) list = list.filter((p) => p.is_combo);
    if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, search, category, saleOnly, inStockOnly, combo, maxPrice, sort]);

  const update = (key, val) => {
    const next = new URLSearchParams(params);
    if (val === '' || val === false || val === null) next.delete(key);
    else next.set(key, val);
    setParams(next);
  };

  const clearAll = () => setParams(new URLSearchParams());

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-primary">Danh mục</h4>
        <div className="space-y-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => update('category', category === c ? '' : c)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${category === c ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-emerald-50'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold text-primary">Khoảng giá</h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">≤</span>
          <Input type="number" placeholder="200000" value={maxPrice} onChange={(e) => update('maxPrice', e.target.value)} className="text-sm" />
          <span className="text-sm text-muted-foreground">₫</span>
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold text-primary">Tình trạng</h4>
        <button
          onClick={() => update('inStock', inStockOnly ? '' : '1')}
          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${inStockOnly ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-emerald-50'}`}
        >
          Chỉ hàng còn
        </button>
        <button
          onClick={() => update('sale', saleOnly ? '' : '1')}
          className={`mt-2 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${saleOnly ? 'bg-destructive text-white' : 'text-muted-foreground hover:bg-emerald-50'}`}
        >
          Đang khuyến mại
        </button>
        <button
          onClick={() => update('combo', combo ? '' : '1')}
          className={`mt-2 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${combo ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-emerald-50'}`}
        >
          Combo rau củ
        </button>
      </div>
      {(category || saleOnly || inStockOnly || combo || maxPrice || search) && (
        <Button variant="ghost" onClick={clearAll} className="w-full justify-start text-destructive hover:bg-red-50">
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">Cửa hàng</p>
        <h1 className="mt-1 font-display text-4xl text-primary sm:text-5xl">
          {category || (saleOnly ? 'Khuyến mại' : 'Tất cả sản phẩm')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{filtered.length} sản phẩm tươi sạch</p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-emerald-900/10 bg-white p-6">
            <FilterPanel />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center gap-3">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilter(true)}>
              <SlidersHorizontal size={16} /> Bộ lọc
            </Button>
            <div className="relative ml-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                value={search}
                onChange={(e) => update('search', e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full rounded-full pl-9 sm:w-64"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => update('sort', e.target.value)}
              className="rounded-full border border-emerald-900/10 bg-white px-4 py-2 text-sm text-primary outline-none"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-emerald-50" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-emerald-900/15 py-24 text-center">
              <p className="font-display text-2xl text-primary">Không tìm thấy sản phẩm</p>
              <p className="mt-1 text-sm text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {showFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-auto rounded-t-3xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl text-primary">Bộ lọc</h3>
              <button onClick={() => setShowFilter(false)}><X /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  );
}