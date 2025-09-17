"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/components/loader";
import { formatDate } from "@/lib/utils";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    setLoading(true)
    try {
      const res = await axios.get("/api/sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      setSales(res.data);
    } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong Contact Your System Administrator")
    } finally {
        setLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, [])
  return (
    <section>
      <div>
        {loading ? (
          <div className="md:w-[50px] mx-auto mt-16">
            <Loader color={"blue"} />
          </div>
        ) : (
          <ScrollArea className="h-[80vh]">
            <Table>
              <TableCaption>List of All the Sales</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cashier</TableHead>
                  <TableHead>Total Bill Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale, i) => (
                  <TableRow key={i}>
                    <TableCell>{sale._id}</TableCell>
                    <TableCell>{formatDate(sale.createdAt)}</TableCell>
                    <TableCell>{sale.cashier}</TableCell>
                    <TableCell>{sale.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </section>
  );
};

export default page;
