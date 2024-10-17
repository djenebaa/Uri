"use client"
import { LogInForm } from "@/components/forms/LogInForms";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogInRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <LogInForm setIsAuthenticated={setIsAuthenticated} />
  );
}