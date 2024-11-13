"use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import AuthChecker from "../components/auth/AuthChecker";

import Link from "next/link";
import HomeBanner from "../components/banner/HomeBanner";

export default function Home() {
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // const router = useRouter();

  // useEffect(() => {
  //   if (isAuthenticated === false) {
  //     router.push("/login");
  //   }
  // }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen text-white bg-gray-900 p-6">
       <AuthChecker />
      <h1 className="text-4xl font-extrabold text-center py-6">
        Discover amazing shows by exploring different genres!
      </h1>
      <div className="flex flex-col md:flex-row items-center">
        <div className="flex-1 p-6 md:p-10">
          <h2 className="text-4xl font-bold">Welcome to the Home Page</h2>
          <p className="mt-6 text-xl">
            Catch the hottest new shows this week, handpicked just for you.
          </p>
          <Link href="/genre" className="inline-block mt-8 px-6 py-2 bg-pink-500 rounded-full text-white hover:bg-pink-600">
          Browse Genres
        </Link>
        </div>
        <div className="flex-1 md:w-[600px] p-6 md:p-10">
          <HomeBanner />
        </div>
      </div>
    </div>
  );
}
