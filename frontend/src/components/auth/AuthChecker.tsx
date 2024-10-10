"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthCheckerProps {
  onAuthStatusChange: (isAuthenticated: boolean | null) => void;
}

const AuthChecker: React.FC<AuthCheckerProps> = ({ onAuthStatusChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/accounts/auth-status/", {
          credentials: "include",
        });
        
        if (response.redirected) {
          setIsAuthenticated(false);
          onAuthStatusChange(false);
          router.push("/login");
        } else {
          const data = await response.json();
          setIsAuthenticated(data.isAuthenticated);
          onAuthStatusChange(data.isAuthenticated);
        }
      } catch (error) {
        console.error("Error fetching auth status:", error);
      }
    };

    checkAuthStatus();
  }, [router, onAuthStatusChange]);

  return null;
};

export default AuthChecker;
