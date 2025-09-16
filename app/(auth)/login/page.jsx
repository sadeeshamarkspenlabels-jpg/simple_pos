"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { loginValidations } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import Loader from "@/components/loader";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginValidations),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const { username, password } = data;
    try {
      const res = await axios.post("/api/auth/login", {
        username,
        password,
      });
      console.log(res);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      router.push(res.data.role === "admin" ? "/products" : "/sale");
    } catch (error) {
      toast.error("Invalid Login Details");
    } finally {
      setLoading(false);
    }
    console.log(data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role")
    if(token) {
      if(role === "admin") {
        router.push("/products");
      } else {
        router.push("/sale")
      }
    }
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section className=" flex justify-center items-center h-[100vh]">
          <Card className="w-full max-w-sm py-24 md:py-12">
            <CardHeader>
              <div className=" flex justify-center text-xl">
                <CardTitle className="font-bold">
                  Login to your Account
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                {loading ? <Loader /> : "Login"}
              </Button>
            </CardFooter>
          </Card>
        </section>
      </form>
    </Form>
  );
};

export default page;
