"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthChecker from "@/components/auth/AuthChecker";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
<div className="text-white">
        <div className="flex space-x-7 m-5 bg-pink-400 w-fit">
        </div>
 
    </div>
  );
}
