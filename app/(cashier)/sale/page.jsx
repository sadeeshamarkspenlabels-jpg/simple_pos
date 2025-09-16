"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ThermalReceipt from "@/components/receipt";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

export default function CashierPage() {

  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [sale, setSale] = useState(null);
  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const [productIdInput, setProductIdInput] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [changeDue, setChangeDue] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const savedToken = localStorage.getItem("token");
      if(!savedToken) {
        router.push("/login");
        return;
      }
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

  const changeQty = (productId, delta) => {
    setCart(
      cart
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const addByProductId = () => {
    const product = products.find(
      (p) => p.pId === Number(productIdInput.trim())
    );
    if (product) {
      addToCart(product);
      setProductIdInput("");
    } else {
      alert("Product not found");
    }
  };

  // Compute total and change due
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    const cash = parseFloat(cashReceived) || 0;
    setChangeDue(Math.max(0, cash - total));
  }, [cashReceived, cart]);

  const completeSale = async () => {
    if (cart.length === 0) return alert("Cart is empty");
    const cash = parseFloat(cashReceived) || 0;
    if (cash < total) return alert("Cash received is less than total");

    try {
      const res = await axios.post(
        "/api/sales",
        {
          items: cart,
          cashier: "Admin",
          cashReceived: cash,
          changeDue: cash - total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSale(res.data.sale);
      setCart([]);
      setCashReceived("");
      setChangeDue(0);

      // Print only the receipt
      setTimeout(() => window.print(), 300);
    } catch (err) {
      console.error("Error completing sale:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear("token");
    localStorage.clear("role")
    router.push("/login")
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* POS UI - hidden in print */}
      <div className="flex md:flex-row flex-col h-screen no-print">
        {/* Products List */}
        <div className="md:w-2/3 p-4 border-r overflow-y-auto">
          <h1 className="text-xl font-bold mb-2">Products</h1>
          <Input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
          <div className="grid grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="p-4 border rounded shadow hover:bg-gray-100 cursor-pointer"
                onClick={() => addToCart(p)}
              >
                <h2 className="font-semibold">{p.name}</h2>
                <p>Rs.{p.price}</p>
                <p className=" text-gray-400">ID: {p.pId}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="md:w-1/3 p-4 flex flex-col">
          <div className=" flex justify-between pb-4">
            <h1 className="text-xl font-bold mb-2">Cart</h1>
            <LogOut onClick={handleLogout} className=" text-white bg-red-500 p-2 rounded-full cursor-pointer hover:bg-white border border-red-500 hover:text-red-500 duration-300" size={40}/>
          </div>

          {/* Quick Add by Product ID */}
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Product ID"
              value={productIdInput}
              onChange={(e) => setProductIdInput(e.target.value)}
            />
            <Button onClick={addByProductId}>Add</Button>
          </div>

          <div className="w-full overflow-y-auto flex-1">
            <div className="grid grid-cols-4 md:grid-cols-5 text-[13px] font-bold mb-2">
              <span>Name</span>
              <span>Qty</span>
              <span className="hidden md:block">Rate</span>
              <span>Price</span>
              <span>Action</span>
            </div>

            {cart.map((item, i) => (
              <div key={i} className="grid md:grid-cols-5 grid-cols-4 items-center mb-1">
                <span>{item.name}</span>
                <span className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => changeQty(item.productId, -1)}
                  >
                    -
                  </Button>
                  {item.quantity}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => changeQty(item.productId, 1)}
                  >
                    +
                  </Button>
                </span>
                <span className=" hidden md:block">{item.price}</span>
                <span>{(item.price * item.quantity).toFixed(2)}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    setCart(cart.filter((c) => c.productId !== item.productId))
                  }
                >
                  <Trash />
                </Button>
              </div>
            ))}
          </div>

          {/* Cash Received & Change Due */}

          <div className="mt-4 border-t pt-2">
            <p className="text-lg font-bold">Total: Rs.{total.toFixed(2)}</p>
            <div className="mt-4">
              <Input
                type="number"
                placeholder="Cash Received"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
              />
              <p className="mt-1 text-lg font-bold">
                Change Due: Rs.{changeDue.toFixed(2)}
              </p>
            </div>
            <Button onClick={completeSale} className="w-full mt-2" size="lg">
              Complete Sale
            </Button>
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
