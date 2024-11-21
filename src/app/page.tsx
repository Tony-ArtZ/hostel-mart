"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartContext";
import { toast } from "sonner";

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  description?: string;
}

export default function Home() {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/products");
        const result = await response.json();

        if (result.success) {
          // Ensure each product has an 'id' field for frontend compatibility
          const processedProducts = result.data.map((product: Product) => ({
            ...product,
            id: product._id || product.id, // Use _id from MongoDB or existing id
          }));
          setProducts(processedProducts);
          setError(null);
        } else {
          throw new Error(result.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Custom add to cart with stock check
  const handleAddToCart = async (product: Product) => {
    try {
      // Fetch latest product info to check stock
      const response = await fetch(`/api/products/${product.id}`);
      const result = await response.json();

      if (!result.success) {
        toast.error("Failed to verify product availability");
        return;
      }

      const latestProductInfo = result.data;

      // Check stock before adding to cart
      if (latestProductInfo.stock > 0) {
        addToCart(product);
        toast.success(`${product.name} added to cart`);
      } else {
        toast.error(`${product.name} is out of stock`);
      }
    } catch (error) {
      console.error("Error checking product stock:", error);
      toast.error("Unable to add product to cart");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-10 bg-emerald-800/50 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-emerald-900/50 border border-emerald-700 rounded-lg h-96"
              ></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-600/20 border border-red-500 rounded-lg p-6">
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-emerald-600/50 text-emerald-300 px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-emerald-900/50 border border-emerald-700
          rounded-lg text-emerald-100 placeholder-emerald-500
          focus:ring-2 focus:ring-emerald-500 transition-all"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center text-emerald-500">No products found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic"; // Ensures fresh data on each request
