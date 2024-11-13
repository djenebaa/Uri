import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getCsrfToken } from "@/app/utils/crsf";
import { useAuth } from "@/components/auth/AuthenticationContext";

interface FavoriteButtonProps {
  initialIsFavorited: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  initialIsFavorited,
}) => {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const searchParams = useSearchParams();
  const media_id = searchParams.get("media_id");
  const [csrfToken, setCsrfToken] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };
    fetchCsrfToken();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const checkFavoriteStatus = async () => {
        try {
          const response = await fetch(
            `http://188.165.238.74:8218/user_preferences/check_favorite_status/tv_show/${media_id}/`,
            {
              credentials: "include",
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setIsFavorited(data.isFavorited);
        } catch (error) {
          console.error("Error fetching favorite status:", error);
        }
      };

      checkFavoriteStatus();
    } else {
      console.log("User is not authenticated. Cannot check favorite status.");
    }
  }, [media_id, isAuthenticated]);
  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      alert("Please login to add this show to your favorites.");
      return;
    }
    const response = await fetch(
      `http://188.165.238.74:8218/user_preferences/add/tv_show/${media_id}/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
        },
      }
    );
    const data = await response.json();

    if (data.success) {
      setIsFavorited(true);
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (!isAuthenticated) {
      alert("Please login to add this show to your favorites.");
      return;
    }
    const response = await fetch(
      `http://188.165.238.74:8218/user_preferences/remove/tv_show/${media_id}/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
        },
      }
    );
    const data = await response.json();

    if (data.success) {
      setIsFavorited(false);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        isFavorited ? (
          <button onClick={handleRemoveFromFavorites}>
            ❌ Remove from Favorites
          </button>
        ) : (
          <button onClick={handleAddToFavorites}>❤️ Add to Favorites</button>
        )
      ) : (
        <button disabled>Please log in to add or remove favorites.</button>
      )}
    </div>
  );
};

export default FavoriteButton;
