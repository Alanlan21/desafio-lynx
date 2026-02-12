import React from "react";
import ProductCard from "./ProductCard";
import type { Product } from "../services/api";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product, quantity: number) => void;
}

// Loading skeleton component
const ProductSkeleton: React.FC = () => (
  <div className="bg-white p-4 rounded-lg border animate-pulse">
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
    <div className="h-6 bg-gray-200 rounded mb-3 w-1/2"></div>
    <div className="h-8 bg-gray-200 rounded"></div>
  </div>
);

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  onAddToCart,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">📦</div>
        <p className="text-gray-500">
          Nenhum produto encontrado com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
