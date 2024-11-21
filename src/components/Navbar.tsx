"use client";

import Link from "next/link";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="bg-emerald-800 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl text-emerald-100 font-bold">Food Hamster</div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <div className="flex items-center text-emerald-100 hover:text-emerald-300">
                <FaHome className="mr-1" />
                Home
              </div>
            </Link>
          </li>
          <li>
            <Link href="/cart">
              <div className="flex items-center text-emerald-100 hover:text-emerald-300">
                <FaShoppingCart className="mr-1" />
                Cart {cart.length > 0 && `(${cart.length})`}
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
