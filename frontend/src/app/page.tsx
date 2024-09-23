"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter(); 

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await fetch("http://localhost:8000/accounts/auth-status/");
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error("Error fetching auth status:", error);
      }
    }
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("authentication/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="">
      {isAuthenticated === false ? ( 
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <h1>Welcome back!</h1>
      ) : (
        <div>
          <h1>Please log in</h1>
          <a href="authentication/login">Log In</a>
        </div>
      )}
    </div>
  );
}

