"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import Loader from "./loader";

const Dashboard = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
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

  // 📊 Process data for charts
  const revenueByDate = sales.reduce((acc, sale) => {
    const date = new Date(sale.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + sale.total;
    return acc;
  }, {});

  const revenueData = Object.entries(revenueByDate).map(([date, total]) => ({
    date,
    total,
  }));

  const salesByCashier = sales.reduce((acc, sale) => {
    acc[sale.cashier] = (acc[sale.cashier] || 0) + sale.total;
    return acc;
  }, {});

  const cashierData = Object.entries(salesByCashier).map(([name, value]) => ({
    name,
    value,
  }));

  const productSales = {};
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
    });
  });

  const productData = Object.entries(productSales).map(([name, qty]) => ({
    name,
    qty,
  }));

  // 📋 Summary
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalInvoices = sales.length;
  const totalItems = sales.reduce(
    (sum, s) => sum + s.items.reduce((iSum, i) => iSum + i.quantity, 0),
    0
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <section>
      {loading ? (
        <div className=" w-[80px] mx-auto mt-24">
          <Loader color="blue"/>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">Rs. {totalRevenue}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{totalInvoices}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Items Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{totalItems}</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue over time */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#0088FE" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sales by cashier */}
          <Card>
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

          {/* Top products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="qty" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
