"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
interface Genre {
  id: number;
  name: string;
}

interface Show {
  id: number;
  name: string;
  poster_path: string;
  genre_ids: number[];
}

export default function ShowsByGenre() {
  const searchParams = useSearchParams();

  const genre_id = searchParams.get("id");

  const [shows, setShows] = useState<Show[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
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
      console.log("DATA SHOW", data[0]);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the genre type
  const fetchGenres = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/content_management/show_type_genres/`,
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
  };

  useEffect(() => {
    fetchTvShow();
    fetchGenres();
  }, [genre_id]);

  if (loading) return <p>Loading...</p>;
  if (shows.length === 0) return <p>No shows available.</p>;
  const currentGenre = genres.find((genre) => genre.id === parseInt(genre_id!));

  return (
    <div className="text-white">
      <h1>
        Shows of genre: {currentGenre ? currentGenre.name : "Unknown Genre"}
      </h1>

      <div
        style={{
          display: "grid",
          gridGap: "8px",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, auto))",
        }}
      >
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
