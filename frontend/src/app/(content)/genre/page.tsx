"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
// import Image from "next/image";

export default function Genre() {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://188.165.238.74:8218/content_management/show_type_genres`,
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
      // console.log(process.env.NEXT_PUBLIC_API_URL);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
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
      <div className="bg-gray-800 w-full py-4 mx-auto text-center mb-8">
        <h1 className="text-white text-3xl font-bold">
          Explore shows by choosing a genre
        </h1>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {genres.map((genre) => (
          <li
            key={genre.id}
            className="list-none flex flex-col items-center text-center"
          >
            <Link href={`/show?id=${genre.id}`}>
              <div className="relative w-[300px] h-[200px] rounded-md bg-gray-900 flex items-center justify-center mx-auto m-5 hover:bg-pink-600">
                <p className="text-lg font-bold text-white">{genre.name}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
