import React, { useState, useEffect } from "react";
import { getCsrfToken } from "@/app/utils/crsf";
import { useAuth } from "@/components/auth/AuthenticationContext";

interface RemoveFavoriteButtonProps {
  initialIsFavorited: boolean;
  media_id: number;
  onRemoveFavorite: (mediaId: number) => void; 
}

const RemoveFavoriteButton: React.FC<RemoveFavoriteButtonProps> = ({
    initialIsFavorited,
    media_id,
    onRemoveFavorite,
  }) => {
  const [isDisliked, setIsDisliked] = useState(initialIsFavorited);
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
            `http://localhost:8000/user_preferences/check_favorite_status/tv_show/${media_id}/`,
            {
              credentials: "include",
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setIsDisliked(data.isDisliked);
        } catch (error) {
          console.error("Error fetching favorite status:", error);
        }
      };

      checkFavoriteStatus();
    } else {
      console.log("User is not authenticated. Cannot check favorite status.");
    }
  }, [media_id, isAuthenticated]);

  const handleRemoveFromFavorites = async () => {
    if (!isAuthenticated) {
      alert("Please login to remove this show from your favorites.");
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
      setIsDisliked(true);
      onRemoveFavorite(media_id);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <button 
        onClick={handleRemoveFromFavorites} 
        className="flex items-center justify-center bg-pink-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 hover:bg-pink-600"
      >
        {/* <span className="mr-2">❌</span>  */}
        Remove from favorites
      </button>
      ) : (
        <button disabled>Please log in to remove favorites.</button>
      )}
      {isDisliked && (
        <p className={`mt-2 text-white transition-opacity duration-300 opacity-100`}>
          This show was removed from your list.
        </p>
      )}
    </div>
  );
};
export default RemoveFavoriteButton;
