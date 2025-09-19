"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { FaMoneyBillWave, FaFileInvoiceDollar, FaBoxOpen } from "react-icons/fa";
import Loader from "./loader";
import CountUp from "react-countup";

const Dashboard = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");

    const fetchSales = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/sales", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSales(res.data);
      } catch (err) {
        console.error("Failed to fetch sales", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  // Process data
  const revenueByDate = sales.reduce((acc, sale) => {
    const date = new Date(sale.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + sale.total;
    return acc;
  }, {});
  const revenueData = Object.entries(revenueByDate).map(([date, total]) => ({ date, total }));

  const salesByCashier = sales.reduce((acc, sale) => {
    acc[sale.cashier] = (acc[sale.cashier] || 0) + sale.total;
    return acc;
  }, {});
  const cashierData = Object.entries(salesByCashier).map(([name, value]) => ({ name, value }));

  const productSales = {};
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
    });
  });
  const productData = Object.entries(productSales).map(([name, qty]) => ({ name, qty }));

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalInvoices = sales.length;
  const totalItems = sales.reduce(
    (sum, s) => sum + s.items.reduce((iSum, i) => iSum + i.quantity, 0),
    0
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE", "#FF6B6B"];

  return (
    <section className="p-6">
      {loading ? (
        <div className="w-[80px] mx-auto mt-24">
          <Loader color="#008284" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard</h1>

          {/* Summary Cards with Animated Count */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl bg-gradient-to-r from-green-100 to-green-50">
              <CardHeader className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500 text-2xl" />
                <CardTitle className="dark:text-black">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-700">
                  Rs. <CountUp end={totalRevenue} duration={1.5} separator="," />
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl bg-gradient-to-r from-blue-100 to-blue-50">
              <CardHeader className="flex items-center gap-2">
                <FaFileInvoiceDollar className="text-blue-500 text-2xl" />
                <CardTitle className="dark:text-black">Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-700">
                  <CountUp end={totalInvoices} duration={1.5} />
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl bg-gradient-to-r from-purple-100 to-purple-50">
              <CardHeader className="flex items-center gap-2">
                <FaBoxOpen className="text-purple-500 text-2xl" />
                <CardTitle className="dark:text-black">Total Items Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-700">
                  <CountUp end={totalItems} duration={1.5} />
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Over Time with Animation */}
          <Card className="shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" stroke="#555" />
                  <YAxis stroke="#555" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#008284"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sales by Cashier */}
          <Card className="shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300 mt-6">
            <CardHeader>
              <CardTitle>Sales by Cashier</CardTitle>
            </CardHeader>
            <CardContent className="w-full flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cashierData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                    isAnimationActive={true}
                    animationDuration={1500}
                  >
                    {cashierData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Selling Products with Animated Bars */}
          <Card className="shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300 mt-6">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#555" />
                  <YAxis stroke="#555" />
                  <Tooltip />
                  <Bar
                    dataKey="qty"
                    fill="#00C49F"
                    radius={[5, 5, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
};

export default Dashboard;
