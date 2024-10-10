"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthenticationContext";

const AuthChecker: React.FC = () => {
  const { setIsAuthenticated, setUsername } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/accounts/auth-status/", {
          credentials: "include",
        });

        if (response.redirected) {
          setIsAuthenticated(false);
          router.push("/login");
        } else {
          const data = await response.json();
          setIsAuthenticated(data.isAuthenticated);
          setUsername(data.username);
        }
      } catch (error) {
        console.error("Error fetching auth status:", error);
      }
    };

    checkAuthStatus();
  }, [router, setIsAuthenticated, setUsername]);

  return null;
};

export default AuthChecker;
