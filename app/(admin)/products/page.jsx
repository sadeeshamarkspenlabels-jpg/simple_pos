"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { productValidate } from "@/utils/validations";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/loader";
import axios from "axios";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(productValidate),
    defaultValues: {
      id: "",
      name: "",
      price: "",
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products");
      console.log(res);
      setProducts(res.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const token = localStorage.getItem("token");
    setCreateLoading(true);
    try {
      const { name, id, price } = values;
      const res = await axios.post("/api/products", {
        id,
        name,
        price
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },);
      toast.success("Product Added Success");
      console.log(res);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    } finally {
      setCreateLoading(false);

    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
      if(!savedToken) {
        router.push("/login");
        return;
      }
    fetchData();
  }, []);

  return (
    <section className=" flex md:flex-row flex-col w-[100%] justify-between md:px-8 md:pt-8">
      <div className="md:w-[55%]">
        {loading ? (
          <div className="md:w-[50px] mx-auto mt-16">
            <Loader color={"blue"} />
          </div>
        ) : (
          <Table>
            <TableCaption>List of All the Products</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price (Rs.)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, i) => (
                <TableRow key={i}>
                  <TableCell>{product.pId}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex md:justify-end justify-center  md:w-[60%] md:ml-auto">
        <Card className="w-full md:max-w-[600px] flex ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardHeader>
                <h1 className=" font-black text-center text-[20px]">
                  Add New Product
                </h1>
              </CardHeader>
              <CardContent className=" flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  className="w-full bg-blue-700 hover:bg-blue-800 mt-4"
                >
                  {createLoading ? <Loader /> : "Add"}
                </Button>
              </CardContent>
              <CardFooter className="flex-col gap-2"></CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </section>
  );
};

export default ProductPage;
