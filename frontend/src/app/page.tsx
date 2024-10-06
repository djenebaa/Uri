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
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="text-white">
      {isAuthenticated === false ? ( 
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <h1>Welcome back!</h1>
      ) : (
        <div>
          <h2>Already have an account ? Log In </h2>
          <a href="/login">Log In</a>
          <h2>Else Sign Up</h2>
          <a href="/signup">Sign Up</a>
        </div>
      )}
    </div>
  );
}

