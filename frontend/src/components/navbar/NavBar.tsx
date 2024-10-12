"use client";
import Link from "next/link";
import AuthChecker from "../auth/AuthChecker";
import { useAuth } from "@/components/auth/AuthenticationContext";

function NavBar() {
  const { isAuthenticated, username } = useAuth();
  return (
    <nav className="text-white flex justify-between m-7">
      <AuthChecker />
      <ul className="flex flex-row space-x-5">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/genre">Genres</Link>
        </li>
          {/* <li>
            <Link href="/login">Login</Link>
          </li> */}
      </ul>
      {isAuthenticated === true && (
        <ul>
          <li>
            <Link href="/profile">Profile of {username}!</Link>
          </li>
        </ul>
      )}

      {isAuthenticated === false && (
        <ul>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
      )}
      {/* {isAuthenticated === null && (
        <ul>
          <li>Loading...</li>
        </ul>
      )} */}
    </nav>
  );
}

export default NavBar;
