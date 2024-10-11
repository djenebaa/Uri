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
      const response = await fetch(
        "http://localhost:8000/profile/user/favorites",
        {
          method: "GET",
          credentials: "include",
        }
      );

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
      {/* <ProfileBanner /> */}
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
          <section className="flex flex-col md:flex-row items-center">
           <div className="flex-1 pr-3 p-10">
              <h1>Welcome to your Profile</h1>
              <p>
               Here you can keep track of your top picks.
              </p>
            </div>
            <div className="flex-1 hidden md:block">
              <Image
                src={"/picture/ian-valerio-CAFq0pv9HjY-unsplash.jpg"}
                width={500}
                height={500}
                alt="default image city at night"
                className="w-full h-auto"
                priority
              />
            </div>
          </section>
        </>
      )}

      <div className="bg-gray-800 w-full py-4 rounded-md mx-auto text-center mb-8">
        <h2 className="text-white text-3xl font-bold">Your Top Picks</h2>
      </div>

      <section className="m-11 justify-items-center">
      <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> 
        {favorites.map((media) => (
          <li key={media.id} className="list-none flex flex-col items-center text-center p-10">
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
             className="rounded-md w-full h-full bject-contain"
              priority
            />
          </li>
        ))}
        </ul>
      </section>
      <button
        onClick={handleLogout}
        className="mt-4 p-2 bg-slate-600 rounded m-5"
      >
        Logout
      </button>
    </div>
  );
}
