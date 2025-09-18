"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Report = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [cashier, setCashier] = useState("");

  // Fetch sales data from API
 useEffect(() => {
  const today = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD
  setFromDate(today);
  setToDate(today);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get("/api/sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // set all sales
      setSales(res.data);

      // filter today's sales immediately
      const filtered = res.data.filter((s) => {
        const saleDate = new Date(s.createdAt).toISOString().split("T")[0];
        return saleDate === today;
      });

      setFilteredSales(filtered);
    } catch (err) {
      setError("Failed to fetch sales data.");
    } finally {
      setLoading(false);
    }
  };

  fetchSales();
}, []);


  // Apply filters
  const applyFilters = () => {
  let filtered = [...sales];

  if (fromDate) {
    filtered = filtered.filter(
      (s) => new Date(s.createdAt).setHours(0,0,0,0) >= new Date(fromDate).setHours(0,0,0,0)
    );
  }
  if (toDate) {
    filtered = filtered.filter(
      (s) => new Date(s.createdAt).setHours(23,59,59,999) <= new Date(toDate).setHours(23,59,59,999)
    );
  }
  if (cashier && cashier.trim() !== "") {
    filtered = filtered.filter((s) =>
      s.cashier.toLowerCase().includes(cashier.toLowerCase())
    );
  }

  setFilteredSales(filtered);
};


  // Export to Excel
  const exportToExcel = () => {
    if (filteredSales.length === 0) {
      alert("No data to export!");
      return;
    }

    // Prepare rows
    const data = filteredSales.map((sale) => ({
      "Invoice ID": sale._id,
      Date: new Date(sale.createdAt).toLocaleDateString(),
      Cashier: sale.cashier,
      Items: sale.items
        ?.map((i) => `${i.name} (x${i.quantity})`)
        .join(", "),
      Total: sale.total,
      "Cash Paid": sale.cashPaid,
      "Cash Due": sale.cashDue,
    }));

    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    // Export file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, `sales_report_${Date.now()}.xlsx`);
  };

  // Summary calculations
  const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalInvoices = filteredSales.length;
  const totalItems = filteredSales.reduce(
    (sum, s) =>
      sum + s.items?.reduce((iSum, i) => iSum + (i.quantity || 0), 0),
    0
  );

  return (
    <div className="px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales Report</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2 cursor-pointer"
          onClick={exportToExcel}
        >
          <Download className="w-4 h-4" />
          Export Excel
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4 flex-wrap">
          <div>
            <Label>From Date</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-44"
            />
          </div>
          <div>
            <Label>To Date</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-44"
            />
          </div>
          <div>
            <Label>Cashier</Label>
            <Input
              type="text"
              value={cashier}
              onChange={(e) => setCashier(e.target.value)}
              placeholder="Enter cashier username"
              className="w-44"
            />
          </div>
          <Button className="self-end" onClick={applyFilters}>
            Apply
          </Button>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="grid grid-cols-3 gap-4">
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

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading sales...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredSales.length === 0 ? (
            <p>No sales found for the selected filters.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cashier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell>{sale._id}</TableCell>
                    <TableCell>
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{sale.cashier}</TableCell>
                    <TableCell>
                      {sale.items
                        ?.map((i) => `${i.name} (x${i.quantity})`)
                        .join(", ")}
                    </TableCell>
                    <TableCell>Rs. {sale.total}</TableCell>
                    <TableCell>Rs. {sale.cashPaid}</TableCell>
                    <TableCell>Rs. {sale.cashDue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Report;
