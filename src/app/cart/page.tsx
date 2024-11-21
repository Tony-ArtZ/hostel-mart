"use client";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {cart.length === 0 ? (
        <p className="text-emerald-500 text-center">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center 
                bg-emerald-900/50 p-4 rounded-lg border border-emerald-700"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-emerald-400">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-600/50 text-red-300 px-3 py-1 rounded-md 
                    hover:bg-red-700/50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold text-emerald-300">
              Total: ₹{total.toFixed(2)}
            </p>
            <div className="space-x-4">
              <button
                onClick={clearCart}
                className="bg-red-600/50 text-red-300 px-4 py-2 rounded-md"
              >
                Clear Cart
              </button>
              <Link
                href="/buy"
                className="bg-emerald-600/50 text-emerald-300 px-4 py-2 
                rounded-md hover:bg-emerald-700/50 transition-colors"
              >
                Proceed to Buy
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
