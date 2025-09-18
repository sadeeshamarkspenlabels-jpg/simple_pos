"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { productValidate } from "@/utils/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/loader";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash } from "lucide-react";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(productValidate),
    defaultValues: {
      name: "",
      price: "",
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      router.push("/login");
      return;
    }
    fetchData();
  }, []);

  const onSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setCreateLoading(true);
    try {
      await axios.post(
        "/api/products",
        { name: values.name, price: values.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product Added Successfully");
      form.reset();
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    toast.promise(
      axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      {
        loading: "Deleting product...",
        success: () => {
          fetchData();
          return "Deleted successfully!";
        },
        error: (error) => error.response?.data?.message || "Something went wrong!",
      }
    );
  };

  // Filter products
  const applyFilters = () => {
    let filtered = [...products];

    if (searchName.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchId.trim()) {
      filtered = filtered.filter((p) => p._id.toString().includes(searchId));
    }

    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchName("");
    setSearchId("");
    setMinPrice("");
    setMaxPrice("");
    setFilteredProducts([...products]);
  };

  return (
    <section className="px-6 flex flex-col md:flex-row gap-6">
      {/* Products Table & Filters */}
      <div className="md:w-2/3 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 items-end">
            <Input
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-36"
            />
            <Input
              placeholder="Search by ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-28"
            />
            <Input
              placeholder="Min Price"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24"
            />
            <Input
              placeholder="Max Price"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24"
            />
            <Button onClick={applyFilters}>Apply</Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </CardContent>
        </Card>

        {loading ? (
          <div className="w-12 mx-auto mt-16">
            <Loader color="blue" />
          </div>
        ) : (
          <ScrollArea className="h-[70vh]">
            <Table>
              <TableCaption>
                {filteredProducts.length > 0
                  ? `Showing ${filteredProducts.length} products`
                  : "No products found"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price (Rs.)</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, i) => (
                  <TableRow key={i}>
                    <TableCell>{product._id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 hover:bg-red-600 p-2"
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>

      {/* Compact Add Product Form */}
      <div className="md:w-1/3 flex justify-center self-start">
        <Card className="w-full max-w-[400px]">
          <CardHeader>
            <CardTitle>Add Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800"
                >
                  {createLoading ? <Loader /> : "Add"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProductPage;
