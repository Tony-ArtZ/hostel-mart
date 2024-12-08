"use client";
import { useState, useEffect, FormEvent } from "react";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Optional: for better notifications

export default function BuyPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [nameError, setNameError] = useState("");
  const [roomError, setRoomError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRoomDelivery, setIsRoomDelivery] = useState(false);
  const [isDeliveryEnabled, setIsDeliveryEnabled] = useState(false);

  useEffect(() => {
    const fetchDeliveryStatus = async () => {
      try {
        const response = await fetch("/api/delivery-status");
        const data = await response.json();
        console.log(data);
        setIsDeliveryEnabled(data.data.delivering);
      } catch (error) {
        console.error("Failed to fetch delivery status:", error);
      }
    };

    fetchDeliveryStatus();
  }, []);

  const total =
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    (isRoomDelivery ? 7 : 0);

  const validateName = (name: string): boolean => {
    if (name.length < 3) {
      setNameError("Name must be at least 3 characters long");
      return false;
    }
    if (name.length > 50) {
      setNameError("Name must be less than 50 characters");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateRoom = (room: string): boolean => {
    const roomPattern = /^\d[B]-\d+$/;
    if (!roomPattern.test(room)) {
      setRoomError("Room must be in format: XB-XX (e.g., 2B-28)");
      return false;
    }
    setRoomError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Reset errors
    setNameError("");
    setRoomError("");

    // Validate inputs
    const isNameValid = validateName(name);
    const isRoomValid = validateRoom(roomNumber);

    if (!isNameValid || !isRoomValid) {
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
          delivery: isRoomDelivery,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Order successful
        toast.success("Order placed successfully!");
        alert("Success! for more info visit 2B-28");

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
          {isDeliveryEnabled && (
            <div className="flex justify-between mt-4">
              <label className="text-emerald-400">Room Delivery (+₹7)</label>
              <input
                type="checkbox"
                checked={isRoomDelivery}
                onChange={(e) => setIsRoomDelivery(e.target.checked)}
                className="form-checkbox h-5 w-5 text-emerald-600"
              />
            </div>
          )}
          {!isDeliveryEnabled && (
            <p className="text-red-500 mt-4">
              Delivery is currently unavailable. Please choose pickup.
            </p>
          )}
          <div className="border-t mt-4 pt-2 font-bold text-emerald-300">
            Total: ₹{total.toFixed(2)}
          </div>
          {!isRoomDelivery && (
            <p className="text-emerald-500 mt-4 text-lg font-bold">
              For pickup, visit room{" "}
              <span className="text-white text-2xl font-extrabold">2B-28</span>.
            </p>
          )}
          <p className="text-emerald-500 mt-4 text-lg font-bold">
            For Contact:{" "}
            <span className="text-white text-2xl font-extrabold">
              Visit 2B-28
            </span>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-emerald-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 bg-emerald-900/50 border ${
                nameError ? "border-red-500" : "border-emerald-700"
              } rounded-lg text-emerald-100 placeholder-emerald-500
              focus:ring-2 focus:ring-emerald-500 transition-all`}
              placeholder="Enter your name"
              required
              disabled={isSubmitting}
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-emerald-400">Room Number</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className={`w-full p-3 bg-emerald-900/50 border ${
                roomError ? "border-red-500" : "border-emerald-700"
              } rounded-lg text-emerald-100 placeholder-emerald-500
              focus:ring-2 focus:ring-emerald-500 transition-all`}
              placeholder="Enter room number (e.g., 2B-28)"
              required
              disabled={isSubmitting}
            />
            {roomError && (
              <p className="text-red-500 text-sm mt-1">{roomError}</p>
            )}
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
