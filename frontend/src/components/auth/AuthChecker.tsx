"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthCheckerProps {
  onAuthStatusChange: (isAuthenticated: boolean | null) => void;
}

const AuthChecker: React.FC<AuthCheckerProps> = ({ onAuthStatusChange }) => {
  const router = useRouter();

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/accounts/auth-status/",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      return data.isAuthenticated;
    } catch (error) {
      console.error("Error fetching auth status:", error);
      return null;
    }
  };

  useEffect(() => {
    const handleAuth = async () => {
      const isAuthenticated = await checkAuthStatus();
      onAuthStatusChange(isAuthenticated);

      if (isAuthenticated === false) {
        router.push("/login");
      }
    };

    handleAuth();
  }, [onAuthStatusChange, router]);

  return null;
};

export default AuthChecker;
