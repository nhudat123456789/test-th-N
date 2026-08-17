import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/AuthContext';
import { ShoppingCart, Minus, Plus, ChevronRight, MapPin, Truck } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

function DotRating({ value = 0, size = 18, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) =>
      <button
        key={n}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onChange?.(n)}
        className={`h-[${size}px] w-[${size}px] ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        style={{ width: size, height: size }}>
        
          <span
          className="block h-full w-full rounded-full transition-colors"
          style={{ backgroundColor: n <= value ? 'var(--accent)' : 'rgba(0,0,0,0.1)' }} />
        
        </button>
      )}
    </div>);

}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.Product.get(id).
    then((p) => {
      setProduct(p);
      if (p?.category) {
        base44.entities.Product.filter({ category: p.category }, '-created_date', 5).
        then((r) => setRelated(r.filter((x) => x.id !== p.id).slice(0, 4))).
        catch(() => {});
      }
      setLoading(false);
    }).
    catch(() => setLoading(false));
    base44.entities.Review.filter({ product_id: id }, '-created_date', 50).
    then((r) => setReviews(r.filter((x) => !x.hidden))).
    catch(() => {});
  };

  useEffect(() => {load();window.scrollTo(0, 0);}, [id]);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-32 text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-primary" /></div>;
  }
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 text-center">
        <h1 className="font-display text-3xl text-primary">Không tìm thấy sản phẩm</h1>
        <Link to="/products"><Button className="mt-6 rounded-full bg-primary">Quay lại cửa hàng</Button></Link>
      </div>);

  }

  const out = product.status === 'out_of_stock' || (product.stock ?? 0) <= 0;
  const onSale = product.old_price && product.old_price > product.price;
  const images = product.images?.length ? product.images : [];
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleAdd = () => {
    addItem(product, qty);
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setPosting(true);
    try {
      await base44.entities.Review.create({
        product_id: id,
        customer_name: user?.full_name || user?.email || 'Khách',
        rating,
        comment: comment.trim()
      });
      setComment('');
      setRating(5);
      load();
    } catch {
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
        <ChevronRight size={14} />
        <span className="truncate text-primary">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* GALLERY */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl bg-emerald-50/60">
            <div className="aspect-square">
              {images[activeImg] ?
              <Image src={images[activeImg]} alt={product.name} fittingType="fill" className="h-full w-full" /> :

              <div className="grid h-full w-full place-items-center text-emerald-200"><ShoppingCart size={48} /></div>
              }
            </div>
          </div>
          {images.length > 1 &&
          <div className="mt-3 flex gap-2 overflow-x-auto hide-scrollbar">
              {images.map((img, i) =>
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition ${i === activeImg ? 'ring-primary' : 'ring-transparent'}`}>
              
                  <Image src={img} alt="" fittingType="fill" className="h-full w-full" />
                </button>
            )}
            </div>
          }
        </div>

        {/* INFO */}
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <span>{product.category}</span>
            {product.origin && <><span className="text-emerald-300">·</span><span className="inline-flex items-center gap-1"><MapPin size={12} /> {product.origin}</span></>}
          </div>
          <h1 className="mt-2 text-primary [font-family:'Be_Vietnam_Pro',_sans-serif] text-[33px] sm:text-[33px]">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <DotRating value={Math.round(avg)} />
            <span className="text-sm text-muted-foreground">{reviews.length ? `${avg.toFixed(1)} · ${reviews.length} đánh giá` : 'Chưa có đánh giá'}</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-mono text-4xl font-bold text-primary">{product.price.toLocaleString('vi-VN')}₫</span>
            <span className="text-sm text-muted-foreground">/ {product.unit}</span>
            {onSale &&
            <>
                <span className="font-mono text-lg text-muted-foreground line-through">{product.old_price.toLocaleString('vi-VN')}₫</span>
                <span className="rounded-full bg-destructive px-2.5 py-1 text-xs font-bold text-white">
                  -{product.discount_percent || Math.round((product.old_price - product.price) / product.old_price * 100)}%
                </span>
              </>
            }
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description || 'Sản phẩm tươi sạch, chọn lọc kỹ, giao đến tay bạn trong ngày thu hoạch.'}</p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <Truck size={16} className="text-accent" />
            <span className="text-muted-foreground">Giao tươi trong 2 giờ · Tồn kho: <span className="font-medium text-primary">{product.stock ?? 0} {product.unit}</span></span>
          </div>

          {/* ADD TO CART */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-emerald-900/15">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-11 w-11 place-items-center text-primary hover:bg-emerald-50"><Minus size={16} /></button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="grid h-11 w-11 place-items-center text-primary hover:bg-emerald-50"><Plus size={16} /></button>
            </div>
            <Button onClick={handleAdd} disabled={out} className="h-11 flex-1 rounded-full bg-accent text-white hover:bg-accent/90 disabled:opacity-50">
              <ShoppingCart size={18} className="mr-2" /> {out ? 'Hết hàng' : 'Thêm vào giỏ'}
            </Button>
          </div>

          {/* REVIEWS */}
          <div className="mt-12 border-t border-emerald-900/10 pt-8">
            <h2 className="font-display text-3xl text-primary">Đánh giá từ khách hàng</h2>

            {isAuthenticated ?
            <form onSubmit={submitReview} className="mt-6 rounded-2xl bg-emerald-50/50 p-5">
                <p className="mb-2 text-sm font-medium text-primary">Viết đánh giá của bạn</p>
                <DotRating value={rating} interactive onChange={setRating} />
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Chia sẻ trải nghiệm về sản phẩm..." className="mt-3 bg-white" rows={3} />
                <Button type="submit" disabled={posting || !comment.trim()} className="mt-3 rounded-full bg-primary">
                  {posting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </Button>
              </form> :

            <div className="mt-6 rounded-2xl border border-dashed border-emerald-900/15 p-5 text-center text-sm text-muted-foreground">
                <Link to={`/login?returnTo=${encodeURIComponent('/products/' + id)}`} className="font-medium text-accent hover:underline">Đăng nhập</Link> để viết đánh giá.
              </div>
            }

            <div className="mt-6 space-y-5">
              {reviews.length === 0 ?
              <p className="text-sm text-muted-foreground">Chưa có đánh giá nào. Hãy là người đầu tiên!</p> :
              reviews.map((r) =>
              <div key={r.id} className="border-b border-emerald-900/5 pb-5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary">{r.customer_name}</span>
                    <DotRating value={r.rating} size={12} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 &&
      <section className="mt-20">
          <h2 className="mb-6 font-display text-3xl text-primary">Sản phẩm tương tự</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      }
    </div>);

}