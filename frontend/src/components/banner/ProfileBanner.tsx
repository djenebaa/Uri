import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useEffect } from "react"

interface Show {
    id: number;
    name: string;
    poster_path: string;
  }

  
export default function ProfileBanner() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [favorites, setFavorites] = React.useState<Show[]>([])

  const fetchUserFavorites = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/profile/user/favorites/`, 
        {
          method: "GET",
          credentials: "include",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch user favorites")
      }

      const data = await response.json()
      setFavorites(data) 
    } catch (error) {
      console.error("Error fetching user favorites:", error)
    }
  }

   useEffect(() => {
    fetchUserFavorites() 
  }, [])

    useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="mx-auto max-w-xs">
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {favorites.length > 0 ? (
            favorites.map((show) => (
              <CarouselItem key={show.id}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <img
                      src={
                        show.poster_path
                          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                          :  "/picture/ian-valerio-CAFq0pv9HjY-unsplash.jpg"
                      }
                      alt={show.name}
                      className="object-cover h-full w-full"
                    />
                    <span className="text-2xl font-semibold text-center">{show.name}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))
          ) : (
            <div>No favorites available</div>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
