"use client";
import { useAuth } from "@/components/auth/AuthenticationContext";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Media {
  id: any;
  title: string;
  description: string;
  first_air_date: string;
  image: string;
  number_of_episodes: number;
  status: string;
  popularity: string;
}

import { useRouter } from "next/router";

const ShowDetails = () => {
  const searchParams = useSearchParams();
  const media_id = searchParams.get("media_id");
  const [mediaDetails, setMediaDetails] = useState<Media | null>(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (media_id) {
        try {
          const response = await fetch(
            `http://localhost:8000/content_management/media/${media_id}/`,
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
        <img
          src={`https://image.tmdb.org/t/p/w500/${mediaDetails.image}`}
          alt={mediaDetails.title}
          className="w-48 h-auto rounded-md shadow-md"
        />
        <div className="ml-4 mt-4"> 
        <p className="text-gray-300 mb-4">{mediaDetails.description}</p>
          <p className="text-lg">Popularity: {mediaDetails.popularity}</p>
          <p className="text-lg">First air date: {mediaDetails.first_air_date}</p>
          <p className="text-lg">Number of Episodes: {mediaDetails.number_of_episodes}</p>
          <p className="text-lg">Status: {mediaDetails.status}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;
