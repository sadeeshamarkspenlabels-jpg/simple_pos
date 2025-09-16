"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ThermalReceipt from "@/components/receipt";

export default function CashierPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [sale, setSale] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);

      try {
        const res = await axios.get("/api/products", {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const exists = cart.find((item) => item.productId === product._id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const completeSale = async () => {
    if (cart.length === 0) return alert("Cart is empty");

    try {
      const res = await axios.post(
        "/api/sales",
        {
          items: cart,
          cashier: "Admin", // later use token data
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSale(res.data.sale);
      setCart([]);

      // Print only the receipt
      setTimeout(() => window.print(), 300);
    } catch (err) {
      console.error("Error completing sale:", err);
    }
  };

  return (
    <div>
      {/* POS UI - hidden in print */}
      <div className="flex md:flex-row flex-col h-screen no-print">
        {/* Products List */}
        <div className="md:w-2/3 p-4 border-r overflow-y-auto">
          <h1 className="text-xl font-bold mb-4">Products</h1>
          <div className="grid grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="p-4 border rounded shadow hover:bg-gray-100 cursor-pointer"
                onClick={() => addToCart(p)}
              >
                <h2 className="font-semibold">{p.name}</h2>
                <p>${p.price}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Cart Section */}
        <div className="md:w-1/3 p-4 flex flex-col">
          <h1 className="text-xl font-bold mb-4">Cart</h1>
          <div className=" w-full overflow-y-auto flex-1">
            <div className=" grid grid-cols-5 text-[13px] font-bold mb-2">
              <h3>Name</h3>
              <h3>Qty</h3>
              <h3>Rate</h3>
              <h3>Price</h3>
            </div>
            {/* Items */}
            {cart.map((item, i) => (
              <div key={i} className="grid grid-cols-5">
                <h3>{item.name}</h3>
                <h3>{item.quantity}</h3>
                <h3>{item.price}</h3>
                <h3>{(item.price * item.quantity).toFixed(2)}</h3>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-2">
            <p className="text-lg font-bold">
              Total: $
              {cart
                .reduce((sum, i) => sum + i.price * i.quantity, 0)
                .toFixed(2)}
            </p>
            <button
              onClick={completeSale}
              className="w-full bg-green-600 text-white py-2 mt-2 rounded hover:bg-green-700"
            >
              Complete Sale
            </button>
          </div>
        </div>
      </div>

      {/* Receipt - only visible in print */}
      {sale && (
        <div className="hidden print-only">
          <ThermalReceipt sale={sale} />
        </div>
      )}
    </div>
  );
}
