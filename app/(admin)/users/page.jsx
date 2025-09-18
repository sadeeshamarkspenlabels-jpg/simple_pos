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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userValidate } from "@/utils/validations";
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
import { Trash } from "lucide-react";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const router = useRouter();

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
      setUsers(res.data);
      setFilteredUsers(res.data); // default all
    } catch (error) {
      console.log(error);
      toast.error("Error fetching users");
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

  const applyFilters = () => {
    let filtered = [...users];

    if (searchName.trim() !== "") {
      filtered = filtered.filter((u) =>
        u.username.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setSearchName("");
    setRoleFilter("");
    setFilteredUsers([...users]);
  };

  const onSubmit = async (values) => {
    setCreateLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post("/api/auth/register", values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User created successfully");
      form.reset();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    toast.promise(
      axios.delete(`/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      {
        loading: "Deleting User...",
        success: () => {
          fetchData();
          return "Deleted successfully!";
        },
        error: (error) => error.response?.data?.message || "Something went wrong!",
      }
    );
  };

  return (
    <section className="p-6 flex flex-col md:flex-row gap-6">
      {/* Users Table & Filters */}
      <div className="md:w-2/3 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 items-end">
            <div>
              <Input
                placeholder="Search by username"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="w-40">
              <Select
                onValueChange={(val) => setRoleFilter(val)}
                value={roleFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableCaption>
                  {filteredUsers.length > 0
                    ? `Showing ${filteredUsers.length} users`
                    : "No users found"}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, i) => (
                    <TableRow key={i}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 hover:bg-red-600 p-2"
                        >
                          <Trash size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Compact Create User Form */}
      <div className="md:w-1/3 flex justify-center">
        <Card className="w-full max-w-[400px]">
          <CardHeader>
            <CardTitle>Create User</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
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
                        <Input {...field} type="password" />
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
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
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
                  className="w-full "
                >
                  {createLoading ? <Loader /> : "Create"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default UserPage;
