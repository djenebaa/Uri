"use client";
import AuthChecker from "@/components/auth/AuthChecker";
import { getCsrfToken } from "@/app/utils/crsf";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthenticationContext";

export default function Profile() {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated, setUsername } = useAuth();

  const handleLogout = async () => {
    const csrfToken = await getCsrfToken();
    try {
      const response = await fetch("http://localhost:8000/accounts/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      if (response.ok) {
        setIsAuthenticated(false);
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="text-white">
       <AuthChecker />
      {isAuthenticated === null && (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg">Loading...</p>
          {/* Here add a loading */}
        </div>
      )}

      {isAuthenticated === false && (
        <>
          <p>You are not authenticated.</p>
          <button
            onClick={handleLoginRedirect}
            className="mt-4 p-2 bg-blue-600 text-white rounded"
          >
            Go to Login
          </button>
        </>
      )}

      {isAuthenticated === true && (
        <>
          <h1>Welcome to your Profile</h1>
          <button
            onClick={handleLogout}
            className="mt-4 p-2 bg-slate-600 text-white rounded"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
