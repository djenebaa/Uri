import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getCsrfToken } from "@/app/utils/crsf";
import { useAuth } from "@/components/auth/AuthenticationContext";

const FavoriteButton = () => {
  const [isFavorited, setIsFavorited] = useState(false);
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
                const response = await fetch(`http://localhost:8000/user_preferences/check_favorite_status/tv_show/${media_id}/`, {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setIsFavorited(data.isFavorited);
            } catch (error) {
                console.error('Error fetching favorite status:', error);
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
      `http://localhost:8000/user_preferences/add/tv_show/${media_id}/`,
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
      `http://localhost:8000/user_preferences/remove/tv_show/${media_id}/`,
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
            ❌ Retirer des favoris
          </button>
        ) : (
          <button onClick={handleAddToFavorites}>❤️ Ajouter aux favoris</button>
        )
      ) : (
        <button disabled>
          Veuillez vous connecter pour ajouter ou retirer des favoris.
        </button>
      )}
    </div>
  );
};

export default FavoriteButton;
