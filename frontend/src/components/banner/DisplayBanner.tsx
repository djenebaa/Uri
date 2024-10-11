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
}

export default function Banner() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [shows, setShows] = useState<Show[]>([]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/content_management/external-media/10759/",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      setShows(data);
      setCount(data.length)
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (api) {
      setCurrent(api.selectedScrollSnap() + 1); // Update current slide
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1); // Update current slide on selection
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
                  <h3 className="mt-2 text-center text-white">{show.name}</h3>
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
