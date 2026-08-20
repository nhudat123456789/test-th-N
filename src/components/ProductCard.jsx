import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useCart } from '@/lib/cart-context';


export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const out = product.status === 'out_of_stock' || (product.stock ?? 0) <= 0;
  const onSale = product.old_price && product.old_price > product.price;

  return (
    <div className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-emerald-50/60 ring-1 ring-emerald-900/5">
        <Link to={`/products/${product.id}`} className="block aspect-square">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fittingType="fill"
              className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-emerald-200">
              <ShoppingCart size={36} />
            </div>
          )}
        </Link>

        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
            -{product.discount_percent || Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
          </span>
        )}
        {out && (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-950/85 px-2.5 py-1 text-[11px] font-semibold text-white">
            Hết hàng
          </span>
        )}

        {!out && (
          <button
            onClick={() => addItem(product, 1)}
            className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            aria-label="Thêm vào giỏ"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 hover:bg-accent/90">
              <ShoppingCart size={18} />
            </span>
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
          <span>{product.category}</span>
          <span className="text-emerald-300">·</span>
          <span>{product.unit}</span>
        </div>
        <Link to={`/products/${product.id}`} className="mt-1">
          <h3 className="font-heading text-[15px] font-semibold leading-snug text-foreground hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-lg font-bold text-primary">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
          {onSale && (
            <span className="font-mono text-sm text-muted-foreground line-through">
              {product.old_price.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>
      </div>
    </div>
  );
}