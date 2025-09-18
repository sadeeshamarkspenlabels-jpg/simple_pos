"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/components/loader";
import { formatDate } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SalesPage = () => {
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [cashier, setCashier] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get("/api/sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSales(res.data);

      // Default filter = today's sales
      const today = new Date().toISOString().split("T")[0];
      setFromDate(today);
      setToDate(today);

      const filtered = res.data.filter((s) => {
        const saleDate = new Date(s.createdAt).toISOString().split("T")[0];
        return saleDate === today;
      });
      setFilteredSales(filtered);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Contact your system administrator.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters
  const applyFilters = () => {
    let filtered = [...sales];

    if (fromDate) {
      filtered = filtered.filter(
        (s) =>
          new Date(s.createdAt).setHours(0, 0, 0, 0) >=
          new Date(fromDate).setHours(0, 0, 0, 0)
      );
    }
    if (toDate) {
      filtered = filtered.filter(
        (s) =>
          new Date(s.createdAt).setHours(23, 59, 59, 999) <=
          new Date(toDate).setHours(23, 59, 59, 999)
      );
    }
    if (cashier && cashier.trim() !== "") {
      filtered = filtered.filter((s) =>
        s.cashier.toLowerCase().includes(cashier.toLowerCase())
      );
    }

    setFilteredSales(filtered);
  };

  // Clear filters (reset to today)
  const clearFilters = () => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
    setCashier("");

    const filtered = sales.filter((s) => {
      const saleDate = new Date(s.createdAt).toISOString().split("T")[0];
      return saleDate === today;
    });
    setFilteredSales(filtered);
  };

  return (
    <section className="px-6 space-y-6">
      <h1 className="text-2xl font-bold">Sales</h1>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-sm font-medium">From Date</label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-44"
            />
          </div>
          <div>
            <label className="text-sm font-medium">To Date</label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-44"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Cashier</label>
            <Input
              type="text"
              value={cashier}
              onChange={(e) => setCashier(e.target.value)}
              placeholder="Enter cashier name"
              className="w-44"
            />
          </div>
          <Button onClick={applyFilters}>Apply</Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </CardContent>
      </Card>

      {/* Sales Table */}
      {loading ? (
        <div className="w-[50px] mx-auto mt-16">
          <Loader color="blue" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sales List</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[45vh]">
              <Table>
                <TableCaption>
                  {filteredSales.length > 0
                    ? `Showing ${filteredSales.length} sales`
                    : "No sales found"}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Cashier</TableHead>
                    <TableHead>Total Bill Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale, i) => (
                    <TableRow key={i}>
                      <TableCell>{sale._id}</TableCell>
                      <TableCell>{formatDate(sale.createdAt)}</TableCell>
                      <TableCell>{sale.cashier}</TableCell>
                      <TableCell>Rs. {sale.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default SalesPage;
