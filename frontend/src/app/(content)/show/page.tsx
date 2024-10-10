"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Show {
  id: number;
  name: string;
  poster_path: URL;
}

export default function ShowsByGenre() {
  const searchParams = useSearchParams();

  const genre_id = searchParams.get("id");

  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTvShow = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/content_management/external-media/${genre_id}/`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch genres");
      }

      const data = await response.json();
      setShows(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTvShow();
  }, [genre_id]);

  if (loading) return <p>Loading...</p>;
  if (shows.length === 0) return <p>No shows available.</p>;

  return (
    <div className="text-white">
      <h1>Shows in {genre_id}</h1>
      <div style={{
        display: "grid",
        gridGap: '8px',
        gridTemplateColumns:'repeat(auto-fit, minmax(400px, auto))',
       
      }}>
<ul>
        {shows.map((show) => (
          <li key={show.id}>
            {show.name}
            <Image
              src={
                show.poster_path
                  ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                  : "/picture/ian-valerio-CAFq0pv9HjY-unsplash.jpg"
              }
              width={500}
              height={500}
              alt={show.name}
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
