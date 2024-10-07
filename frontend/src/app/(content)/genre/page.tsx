"use client";

import { useEffect, useState } from "react";

export default function Genre() {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/content_management/show_type_genres",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch genres");
      }

      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
    finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return <p className="text-white">Loading...</p>; 
  }

  return (
    <div className="text-white">
      <h1>Here are all the genres:</h1>
      <ul>
        {genres.map((genre) => (
          <li key={genre.id}>{genre.name}</li>
        ))}
      </ul>
    </div>
  );
}
