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
        const response = await fetch(
          `http://188.165.238.74:8218/accounts/auth-status/`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUsername(data.username);
        } else {
          setIsAuthenticated(false);
          // router.push("/login");
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
