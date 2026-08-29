import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Search, Truck, Leaf, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const HERO = 'https://media.base44.com/images/public/6a744c90a68d158dc5771806/67f03a62b_generated_4fea614b.png';
const CAT_IMG = {
  'Rau Lá': 'https://media.base44.com/images/public/6a744c90a68d158dc5771806/d1bf4ccae_generated_e8ad0358.png',
  'Củ Quả': 'https://media.base44.com/images/public/6a744c90a68d158dc5771806/1a17dfc97_generated_2ab8c650.png',
  'Rau Củ Quả': 'https://media.base44.com/images/public/6a744c90a68d158dc5771806/cf57910e2_generated_fff0d306.png',
  'Gia Vị': 'https://media.base44.com/images/public/6a744c90a68d158dc5771806/3dad338ad_generated_0dd42b74.png'
};

const normalizeCategoryName = (name = '') => {
  const value = String(name || '').trim();
  const normalized = value.toLowerCase();

  if (['trái cây', 'trai cay', 'rau củ quả', 'rau cu qua'].includes(normalized)) {
    return 'Rau Củ Quả';
  }

  return value;
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    base44.entities.Product.list('-created_date', 50).then(setProducts).catch(() => {});
    base44.entities.Category.list().then(setCategories).catch(() => {});
  }, []);

  const cats = categories.length
    ? categories.map((c) => ({ ...c, name: normalizeCategoryName(c.name) }))
    : [{ name: 'Rau Lá' }, { name: 'Củ Quả' }, { name: 'Rau Củ Quả' }, { name: 'Gia Vị' }];

  const onSale = products.filter((p) => p.old_price && p.old_price > p.price).slice(0, 8);
  const bestSellers = products.filter((p) => p.is_best_seller).slice(0, 4);
  const combos = products.filter((p) => p.is_combo).slice(0, 3);

  const search = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
        <Image src={HERO} alt="Rau tươi đọng sương" fittingType="fill" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-950/20 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6">
          <div className="max-w-2xl text-white leaf-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Leaf size={13} /> Thu hoạch sáng nay — giao trước trưa
            </span>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] sm:text-7xl">
              Tươi mỗi lá,<br />sạch từng bữa.
            </h1>
            <p className="mt-4 max-w-md text-emerald-50/90">
              Rau củ quả tươi sạch từ những nông trại uy tín, chọn lọc bằng tay và giao nhanh đến bếp nhà bạn.
            </p>
          </div>
          <form onSubmit={search} className="mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-2 shadow-2xl shadow-emerald-950/30">
            <Search className="ml-2 text-muted-foreground" size={18} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm cải, cà chua, khoai tây..."
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            
            <Button type="submit" className="rounded-full bg-primary px-6 hover:bg-primary/90">Tìm</Button>
          </form>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-emerald-900/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 md:grid-cols-4">
          {[
          { icon: Truck, t: 'Giao 2h', s: 'Nội thành TP.HCM' },
          { icon: Leaf, t: 'Tươi sạch', s: 'Nguồn gốc rõ ràng' },
          { icon: ShieldCheck, t: 'Cam kết', s: 'Đổi trả nếu héo' },
          { icon: Clock, t: 'Thu hoạch', s: 'Sáng hôm nay' }].
          map((f) =>
          <div key={f.t} className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-primary"><f.icon size={18} /></span>
              <div>
                <div className="text-sm font-semibold text-primary">{f.t}</div>
                <div className="text-xs text-muted-foreground">{f.s}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-accent">Danh mục</p>
            <h2 className="mt-1 font-display text-4xl text-primary">Mùa này có gì</h2>
          </div>
          <Link to="/products" className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-accent sm:flex">
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cats.map((c) =>
          <Link
            key={c.name}
            to={`/products?category=${encodeURIComponent(c.name)}`}
            className="group relative overflow-hidden rounded-2xl">
            
              <div className="aspect-[4/5] w-full">
                <Image
                src={c.image || CAT_IMG[c.name]}
                alt={c.name}
                fittingType="fill"
                className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
              
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 to-transparent" />
              <div className="absolute bottom-0 p-4 text-white">
                <h3 className="font-display text-2xl">{c.name}</h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-50/90">Khám phá <ArrowRight size={12} /></span>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ON SALE */}
      {onSale.length > 0 &&
      <section className="bg-emerald-50/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-destructive">Tiết kiệm hôm nay</p>
                <h2 className="mt-1 text-4xl text-primary">
  Đang khuyến mãi
</h2>
              </div>
              <Link to="/products?sale=1" className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-accent sm:flex">
                Xem tất cả <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {onSale.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      }

      {/* BEST SELLERS */}
      {bestSellers.length > 0 &&
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-accent">Yêu thích nhất</p>
              <h2 className="mt-1 font-display text-4xl text-primary">Sản phẩm bán chạy</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      }

      {/* COMBOS */}
      {combos.length > 0 && (
        <section className="bg-emerald-50/60 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-accent">Mua trọn giỏ — tiết kiệm hơn</p>
                <h2 className="mt-1 font-display text-4xl text-primary">Combo rau củ</h2>
                <p className="mt-1 text-sm text-muted-foreground">Một giỏ đủ nấu, giá tốt hơn mua lẻ.</p>
              </div>
              <Link to="/products?combo=1" className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-accent sm:flex">
                Xem tất cả <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-3">
              {combos.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-white sm:px-12">
          <Leaf className="mx-auto mb-4 text-accent" size={32} />
          <h2 className="text-4xl sm:text-5xl [font-family:'Be_Vietnam_Pro',_sans-serif]">Bếp nhà bạn đáng có rau tươi</h2>
          <p className="mx-auto mt-3 max-w-md text-emerald-50/90">Đặt hàng ngay hôm nay — giao tươi tận cửa trong 2 giờ.</p>
          <Link to="/products">
            <Button className="mt-6 rounded-full bg-white px-8 text-primary hover:bg-emerald-50">Mua sắm ngay</Button>
          </Link>
        </div>
      </section>
    </div>);

}