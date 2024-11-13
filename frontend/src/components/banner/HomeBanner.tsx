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
  // type CarouselApi,
} from "../../components/ui/carousel";

interface Show {
  id: number;
  name: string;
  backdrop_path: string;
  first_air_date: string;
  genre: string;
}

export default function HomeBanner() {
  // const [api, setApi] = useState<CarouselApi | null>(null);
  // const [current, setCurrent] = useState(0);
  // const [count, setCount] = useState(0);
  const [shows, setShows] = useState<Show[]>([]);

  const fetchLastShowOfAllGenre = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/content_management/show_type_genres/`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch genres");
      }

      const genres = await response.json();

      const promises = genres.map(
        async (genre: { id: number; name: string }) => {
          const showResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/content_management/external-media/${genre.id}/`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!showResponse.ok) {
            throw new Error("Failed to fetch shows");
          }

          const shows = await showResponse.json();
          shows.sort(
            (a: Show, b: Show) =>
              new Date(b.first_air_date).getTime() -
              new Date(a.first_air_date).getTime()
          );

          if (shows.length > 0) {
            return { ...shows[0], genre: genre.name };
          }
          return null;
        }
      );
      //  Check is the show was successfully fetched
      const lastShows = await Promise.all(promises);
      // This filter to only keep value that are not null, This is needed to avoid rendering errors
      const filteredShows = lastShows.filter((show) => show !== null) as Show[];

      setShows(filteredShows);
    } catch (error) {
      console.error("Error fetching genres and last shows:", error);
    }
  };

  useEffect(() => {
    fetchLastShowOfAllGenre();
  }, []);

  // useEffect(() => {
  //   if (api) {
  //     setCurrent(api.selectedScrollSnap() + 1);
  //     api.on("select", () => {
  //       setCurrent(api.selectedScrollSnap() + 1);
  //     });
  //   }
  // }, [api]);

  return (
    <div className="mx-auto max-w-2xl">
      <Carousel className="w-full max-w-2xl">
        <CarouselContent>
          {shows.length > 0 ? (
            shows.map((show) => (
              <CarouselItem key={`${show.id}-${show.genre}`}>
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
                    className="w-full h-auto"
                    priority
                  />
                  <h3 className="mt-2 text-center text-white">
                    {" "}
                    {show.name} - {show.genre}
                  </h3>
                </div>
              </CarouselItem>
            ))
          ) : (
            <p>No shows available</p>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div> */}
    </div>
  );
}
