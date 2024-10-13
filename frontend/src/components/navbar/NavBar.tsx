"use client";
import Link from "next/link";
import AuthChecker from "../auth/AuthChecker";
import { useAuth } from "@/components/auth/AuthenticationContext";

function NavBar() {
  const { isAuthenticated, username } = useAuth();
  return (
    <nav className="sticky top-0 left-0 w-full bg-black text-white flex justify-between items-center p-4 z-50"> 
      <AuthChecker />
      <ul className="flex flex-row space-x-5">
      <li className="relative group">
          <Link href="/" className="block px-4 py-2">
            Home
          </Link>
          <span className="absolute left-0 bottom-0 w-full h-1 bg-pink-600 scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
        </li>
        <li className="relative group">
          <Link href="/genre" className="block px-4 py-2">
            Genre
          </Link>
          <span className="absolute left-0 bottom-0 w-full h-1 bg-pink-600 scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
        </li>
      </ul>
      {isAuthenticated === true && (
        <ul>
          <li className="relative group">
            <Link href="/profile" className="block px-4 py-2">
              Profile of {username}!
            </Link>
            <span className="absolute left-0 bottom-0 w-full h-1 bg-pink-600 scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
          </li>
        </ul>
      )}
      {isAuthenticated === false && (
        <ul>
          <li className="relative group">
            <Link href="/login" className="block px-4 py-2">
              Login
            </Link>
            <span className="absolute left-0 bottom-0 w-full h-1 bg-pink-600 scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default NavBar;
