import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Camera, Leaf, Sprout, Droplets, Sun, CheckCircle2, ShoppingBag, Radio } from 'lucide-react';

const STATUSES = [
  { label: 'Đang tưới nước', icon: Droplets, color: 'text-sky-300' },
  { label: 'Đang phơi nắng', icon: Sun, color: 'text-amber-300' },
  { label: 'Phát triển tốt', icon: Sprout, color: 'text-accent' },
  { label: 'Gần thu hoạch', icon: CheckCircle2, color: 'text-emerald-300' },
];

function CameraCard({ product, idx, now, tick, large }) {
  const status = STATUSES[(idx + tick) % STATUSES.length];
  const progress = Math.min(97, 58 + ((idx * 13) % 30) + (tick % 4));
  return (
    <div className="relative overflow-hidden rounded-3xl bg-emerald-950 ring-1 ring-emerald-900/30">
      <div className="relative aspect-video w-full">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fittingType="fill" className="h-full w-full opacity-90" />
        ) : (
          <div className="grid h-full w-full place-items-center text-emerald-700"><Camera size={40} /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/30 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.06)_50%)] bg-[length:100%_4px] mix-blend-overlay" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          LIVE
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white backdrop-blur">
          <Radio size={11} /> Cam {idx + 1}
        </div>
        <div className="absolute bottom-3 right-3 font-mono text-[11px] text-white/90">{now.toLocaleTimeString('vi-VN')}</div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className={`font-display ${large ? 'text-3xl' : 'text-xl'} leading-none`}>{product.name}</div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-100/80"><Leaf size={11} /> {product.origin || 'Nông trại Rau Nhà Phố'}</div>
            </div>
            <div className={`flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] ${status.color}`}><status.icon size={12} /> {status.label}</div>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[10px] text-emerald-100/70">
              <span>Tiến độ sinh trưởng</span><span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyGarden() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    const t2 = setInterval(() => setTick((x) => x + 1), 5000);
    return () => { clearInterval(t); clearInterval(t2); };
  }, []);

  useEffect(() => {
    if (!user?.email) { setLoading(false); return; }
    (async () => {
      try {
        const orders = await base44.entities.Order.filter({ customer_email: user.email }, '-created_date', 50);
        const ids = [...new Set(orders.flatMap((o) => (o.items || []).map((i) => i.product_id).filter(Boolean)))];
        const prods = await Promise.all(ids.map((id) => base44.entities.Product.get(id).catch(() => null)));
        setProducts(prods.filter(Boolean));
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-accent">
            <Camera size={13} /> Camera vườn · Trực tiếp
          </p>
          <h1 className="mt-1 font-display text-5xl text-primary">Vườn của bạn</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Theo dõi rau củ bạn đã đặt đang lớn lên từng ngày — cập nhật hình ảnh trực tiếp từ nông trại.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-primary">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" /></span>
          Đang phát trực tiếp
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-video animate-pulse rounded-3xl bg-emerald-100" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-900/15 py-20 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-primary"><Sprout size={30} /></div>
          <h2 className="font-display text-3xl text-primary">Vườn chưa có cây nào</h2>
          <p className="mt-2 text-muted-foreground">Đặt hàng rau củ để bắt đầu theo dõi vườn tươi của riêng bạn.</p>
          <Link to="/products"><Button className="mt-6 rounded-full bg-primary px-8"><ShoppingBag size={16} className="mr-2" /> Mua sắm ngay</Button></Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CameraCard product={products[0]} idx={0} now={now} tick={tick} large />
          </div>
          {products.slice(1, 3).map((p, i) => (
            <CameraCard key={p.id} product={p} idx={i + 1} now={now} tick={tick} />
          ))}
          {products.length > 3 && (
            <div className="lg:col-span-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(3).map((p, i) => (
                <CameraCard key={p.id} product={p} idx={i + 3} now={now} tick={tick} />
              ))}
            </div>
          )}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-muted-foreground">
        * Hình ảnh vườn là nguồn cấp trực tiếp mô phỏng từ nông trại đối tác, cập nhật trạng thái sinh trưởng theo thời gian thực.
      </p>
    </div>
  );
}