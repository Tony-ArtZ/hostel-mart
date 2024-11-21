import React from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div
      className="bg-emerald-900/50 border border-emerald-700 rounded-lg 
      overflow-hidden shadow-lg transform transition-all 
      hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-96 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-emerald-300">
          {product.name}
        </h2>
        <div className="flex justify-between items-center mb-4">
          <span className="text-emerald-400 font-semibold">
            ₹{product.price.toFixed(2)}
          </span>
          <span
            className={`text-sm ${
              product.stock > 10
                ? "text-emerald-500"
                : product.stock > 0
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            Stock: {product.stock}
          </span>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded-md transition-colors ${
            product.stock > 0
              ? "bg-emerald-600/50 text-emerald-300 hover:bg-emerald-700/50"
              : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
          }`}
        >
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
