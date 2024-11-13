"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LikeButton from "../../../components/like_dislike/LikeButton";
import Image from "next/image";

interface Media {
  id: number;
  title: string;
  description: string;
  first_air_date: string;
  image: string;
  number_of_episodes: number;
  status: string;
  popularity: string;
}

const ShowDetails = () => {
  const searchParams = useSearchParams();
  const media_id = searchParams.get("media_id");
  const [mediaDetails, setMediaDetails] = useState<Media | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (media_id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/content_management/media/${media_id}/`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch media details");
          }

          const data = await response.json();
          setMediaDetails(data.media);
          console.log(data.media);
        } catch (error) {
          console.error("Error fetching media details:", error);
        }
      }
    };

    fetchMediaDetails();
  }, [media_id]);

  if (!mediaDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4 text-white bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-2">{mediaDetails.title}</h1>
      <div className="flex items-start">
        <Image
          src={`https://image.tmdb.org/t/p/w500/${mediaDetails.image}`}
          width={500}
          height={500}
          alt={mediaDetails.title}
          className="w-48 h-auto rounded-md shadow-md"
        />
        <div className="ml-4 mt-4">
          <p className="text-gray-300 mb-4">{mediaDetails.description}</p>
          <p className="text-lg">Popularity: {mediaDetails.popularity}</p>
          <p className="text-lg">
            First air date: {mediaDetails.first_air_date}
          </p>
          <p className="text-lg">
            Number of Episodes: {mediaDetails.number_of_episodes}
          </p>
          <p className="text-lg">Status: {mediaDetails.status}</p>
          <LikeButton initialIsFavorited={true} />
        </div>
      </div>
      <button
        onClick={() => router.back()}
        className="flex items-center px-4 py-2 m-2 bg-pink-500 rounded hover:bg-pink-600 transition"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2"
        >
          <path
            d="M30 16H2M2 16L16 30M2 16L16 2"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Return to the list
      </button>
    </div>
  );
};

export default function Searchbar() {
  return (
    <Suspense>
      <ShowDetails />
    </Suspense>
  );
}
