"use client";

import Link from "next/link";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "../../components/ui/card";

import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCsrfToken } from "../../app/utils/crsf";
import { useAuth } from "../auth/AuthenticationContext";

interface LogInFormProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export function LogInForm({ setIsAuthenticated }: LogInFormProps) {
  const router = useRouter();
  const { setUsername } = useAuth();
  const [csrfToken, setCsrfToken] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };
    fetchCsrfToken();
  }, []);
  // Handle form submission
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/login/`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            "X-CSRFToken": csrfToken,
          },
          redirect: "follow",
        }
      );

      if (response.redirected) {
        setIsAuthenticated(true);
        router.push("/");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setIsAuthenticated(true);
        router.push("/");
        return;
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Log In</CardTitle>
            <CardDescription>
              Enter your details to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter you username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="text-white px-4 py-2 rounded-md transition-colors duration-300 hover:bg-slate-700 active:bg-pink-700" >Log In</Button>
            {errorMessage && (
              <p className="error-message mt-2 p-1">
                {errorMessage}
              </p>
            )}
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm text-white">
          Don&apos;t have an account?
          <Link className="underline ml-2" href="signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
