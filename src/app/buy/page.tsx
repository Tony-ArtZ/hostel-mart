"use client";
import { useState, FormEvent } from "react";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Optional: for better notifications

export default function BuyPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !roomNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate cart
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Prepare order data
    const orderItems = cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    setIsSubmitting(true);

    try {
      // Create order via API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          roomNumber,
          items: orderItems,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Order successful
        toast.success("Order placed successfully!");

        // Clear cart and redirect
        clearCart();
        router.push("/");
      } else {
        // Handle API-level errors
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Order submission error:", error);
      toast.error("An error occurred while placing the order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-emerald-500">
          Your cart is empty. Please add items first.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2
        className="text-3xl font-bold mb-6 text-emerald-300
        drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
      >
        Confirm Your Order
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-emerald-400">
            Order Summary
          </h3>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-2 font-bold text-emerald-300">
            Total: ₹{total.toFixed(2)}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-emerald-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-emerald-900/50 border border-emerald-700
              rounded-lg text-emerald-100 placeholder-emerald-500
              focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="Enter your name"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block mb-2 text-emerald-400">Room Number</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full p-3 bg-emerald-900/50 border border-emerald-700
              rounded-lg text-emerald-100 placeholder-emerald-500
              focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="Enter room number"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-lg transition-colors font-semibold ${
              isSubmitting
                ? "bg-emerald-800/50 text-emerald-500 cursor-not-allowed"
                : "bg-emerald-600/50 text-emerald-300 hover:bg-emerald-700/50"
            }`}
          >
            {isSubmitting ? "Processing Order..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
