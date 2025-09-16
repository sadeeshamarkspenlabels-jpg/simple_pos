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
import { userValidate } from "@/utils/validations";
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

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [loading, setLoading] = useState(false);  

  const form = useForm({
    resolver: zodResolver(userValidate),
    defaultValues: {
      username: "",
      password: "",
      role: "",
    },
  });

  const fetchData = async () => {
     const token = localStorage.getItem("token");
     setLoading(true);
    try {
      const res = await axios.get("/api/auth/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    setUsers(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Error Getting users")
      
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
     setCreateLoading(true);
     const token = localStorage.getItem("token");
    try {
      const { userName, password, role } = values;
     
      const res = await axios.post("/api/auth/register", values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      setCreateLoading(false);
      toast.success("User Created Success")
      console.log(res);
      fetchData();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      setCreateLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className=" flex md:flex-row flex-col w-[100%] justify-between md:px-8 md:pt-8">
      <div className="md:w-[40%]">
        {loading ? (
          <div className="w-[50px] mx-auto mt-16">
            <Loader color={"blue"} />
          </div>
        ) : (
          <Table>
            <TableCaption>Users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, i) => (
                <TableRow key={i}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex justify-end  md:w-[60%] md:ml-auto mt-8 md:mt-0">
        <Card className="w-full max-w-[600px] flex ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardHeader>
                <h1 className=" font-black text-center text-[20px]">
                  Create New User
                </h1>
              </CardHeader>
              <CardContent className=" flex flex-col gap-2">
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
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select the Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="cashier">Cashier</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 mt-4"
                >
                  {createLoading ? <Loader /> : "Create"}
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

export default UserPage;
