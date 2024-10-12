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
import { useState } from "react";


export function SignUpForm() {
    const [username, setUsername] = useState(""); // State for username
    const [email, setEmail] = useState(""); // State for email
    const [password, setPassword] = useState(""); // State for password
    const [passwordConfirmation, setPasswordConfirmation] = useState(""); // State for password confirmation
    const [error, setError] = useState(""); // State for error messages
  
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
      event.preventDefault(); // Prevent default form submission
  
      const response = await fetch("http://localhost:8000/accounts/signup/", { // Replace with your actual signup URL
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type for JSON
        },
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Handle successful signup response
        // Optionally redirect or show a success message
      } else {
        const errorData = await response.json();
        setError(errorData.errors || "An error occurred."); // Display error messages
      }
    };
  
  return (
    <div className="w-full max-w-md">
      <form>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter a username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password Confirmation</Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                placeholder="Confirm the password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button> Register </Button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Have an account?
          <Link className="underline ml-2" href="/login">
            Log In
          </Link>
        </div>
      </form>
    </div>
  );
}