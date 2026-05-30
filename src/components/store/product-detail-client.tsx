"use client";

import { useCart } from "@/components/store/cart-provider";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { ChevronRight, ShoppingBag, Check } from "lucide-react";

export default function ProductDetailClient({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }

    setIsAdding(true);
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      currency: product.currency,
      image: product.image,
      size: selectedSize,
      quantity: 1,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 sm:mb-8 sm:tracking-[0.2em]">
        <span>Shop</span>
        <ChevronRight className="w-3 h-3" />
        <span>{product.category?.name || "Apparel"}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white">{product.name}</span>
      </div>

      <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none sm:text-5xl lg:text-6xl">{product.name}</h1>
      <p className="text-2xl text-gray-400 font-bold mb-8 italic sm:text-3xl">{formatCurrency(product.priceCents, product.currency)}</p>
      
      <div className="space-y-8 max-w-md">
        <p className="text-lg text-gray-400 leading-relaxed font-medium">
          {product.description}
        </p>
        
        <div className="pt-8 border-t border-gray-900">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Select Size</h3>
            <button className="min-h-10 text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors underline underline-offset-4">Size Guide</button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 min-[360px]:grid-cols-4">
            {product.variants.map((v: any) => (
              <button 
                key={v.id} 
                disabled={v.stock <= 0}
                onClick={() => setSelectedSize(v.size)}
                className={`min-h-12 py-4 border text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300
                  ${v.stock > 0 
                    ? selectedSize === v.size
                      ? "border-white bg-white text-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      : "border-gray-800 hover:border-gray-500 text-gray-400"
                    : "border-gray-900 text-gray-700 cursor-not-allowed opacity-40"}
                `}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 flex gap-4">
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 min-h-14 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 flex items-center justify-center gap-3
              ${isAdding 
                ? "bg-neutral-800 text-white translate-y-1" 
                : "bg-white text-black hover:bg-neutral-200 hover:-translate-y-1 active:scale-95 shadow-xl shadow-white/5"}
            `}
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4" />
                Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4 pt-12 sm:grid-cols-2">
          <div className="p-4 border border-gray-900 rounded-2xl">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Free Shipping</h4>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">On all domestic orders over $150</p>
          </div>
          <div className="p-4 border border-gray-900 rounded-2xl">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Easy Returns</h4>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">30-day window for all essentials</p>
          </div>
        </div>
      </div>
    </div>
  );
}
