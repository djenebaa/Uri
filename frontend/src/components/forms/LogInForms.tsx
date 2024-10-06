"use client";

import Link from "next/link";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { FormEvent } from 'react'
import { redirect } from "next/dist/server/api-utils";
import { url } from "inspector";
import { useRouter } from "next/navigation";
 
export function LogInForm() {
    // # Add fetch 
    const router = useRouter(); 
    async function getCsrfToken() {
      const response = await fetch("http://localhost:8000/accounts/csrf-token/", {
          credentials: 'include', 
      });
      const data = await response.json();
      return data.csrfToken;
   }
    // Handle form submission
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault(); 
      const form = event.currentTarget
    
      const csrfToken = await getCsrfToken();
      const formData = new FormData(form); 
      
      try {
          const response = await fetch("http://localhost:8000/accounts/login/", {
              method: 'POST',
              body: formData,
              credentials: 'include', 
              headers: {
                  'X-CSRFToken': csrfToken, 
              },
          });

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json(); 
          console.log("Login successful:", data);

          
          router.push("/home");
      } catch (error) {
          console.error("Error during login:", error);
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
            <Button type="submit">Log In</Button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Don't have an account?
          <Link className="underline ml-2" href="signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}