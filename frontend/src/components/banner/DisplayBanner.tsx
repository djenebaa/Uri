"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Show {
  id: number;
  name: string;
  backdrop_path: string;
  first_air_date: string;
}

export default function Banner() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [shows, setShows] = useState<Show[]>([]);

  const fetchLastShowOfGenre = async (genreId: number): Promise<Show | null> =>  {
    try {
      const response = await fetch(
        `http://localhost:8000/content_management/external-media/${genreId}/`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      data.sort((a: Show, b: Show) => new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime());

      return data[0]
    } catch (error) {
      console.error("Error fetching movies:", error);
      return null;
    }
  };
  const fetchLastShowOfAllGenre = async () =>{
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
      console.log("Genres fetched:", data);
      const promises = data.map(async (genre: { id: number }) => {
        const lastShow = await fetchLastShowOfGenre(genre.id);
        return lastShow;
      });

       const lastShows = await Promise.all(promises);
       const filteredShows = lastShows.filter((show) => show !== null) as Show[];

       setShows(filteredShows);
       setCount(filteredShows.length);
      } catch (error) {
        console.error("Error fetching genres and last shows:", error);
      }
    };

  useEffect(() => {
    fetchLastShowOfAllGenre();
  }, []);

  useEffect(() => {
    if (api) {
      setCurrent(api.selectedScrollSnap() + 1);
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1);
      });
    }
  }, [api]);

  return (
    <div className="mx-auto max-w-xs">
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {shows.length > 0 ? (
            shows.map((show) => (
              <CarouselItem key={show.id}>
                <div className="flex flex-col items-center">
                  <Image
                    src={
                      show.backdrop_path
                        ? `https://image.tmdb.org/t/p/w500${show.backdrop_path}`
                        : "/picture/ian-valerio-CAFq0pv9HjY-unsplash.jpg"
                    }
                    width={500}
                    height={500}
                    alt={show.name}
                    className="image-class"
                    priority
                  />
                  <h3 className="mt-2 text-center text-white">{show.name} - {show.first_air_date}</h3>
                </div>
              </CarouselItem>
            ))
          ) : (
            <div>No shows available</div>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
}
