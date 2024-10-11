"use client";
import AuthChecker from "@/components/auth/AuthChecker";
import { getCsrfToken } from "@/app/utils/crsf";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthenticationContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import ProfileBanner from "@/components/banner/ProfileBanner";

interface FavoriteMedia {
  id: number;
  title: string;
  image: string;

}


export default function Profile() {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated, setUsername } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteMedia[]>([]);
  const [loading, setLoading] = useState(true);


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
  // Fetch user's favorite media
  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:8000/profile/user/favorites', {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user favorites");
      }

      const data = await response.json();
      console.log("DATA FAV", data);
      
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching user favorites:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (favorites.length === 0) return <p>No favorite media found.</p>;


  return (
    <div className="text-white">
       <AuthChecker />
       <ProfileBanner />
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
      

      <h1>Your Favorite Media</h1>
      <div
        style={{
          display: "grid",
          gridGap: "8px",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, auto))",
        }}
      >
        <ul>
          {favorites.map((media) => (
            <li key={media.id}>
              {media.title}
              <Image
                src={
                  media.image
                    ? `https://image.tmdb.org/t/p/w500${media.image}`
                    : "/picture/ian-valerio-CAFq0pv9HjY-unsplash.jpg"
                }
                width={500}
                height={500}
                alt={media.title}
                className="image-class"
                priority
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  
    
  );
}
