"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthChecker from "@/components/auth/AuthChecker";
import HomeBanner from "@/components/banner/HomeBanner";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return <div className="">
    <HomeBanner/>
  </div>;
}
