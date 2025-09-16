"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login")
  })
  return (
    <section>
      <h1 className=" font-bold">Hello</h1>
    </section>
  );
}
