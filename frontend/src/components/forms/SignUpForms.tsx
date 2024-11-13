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
import { useEffect, useState } from "react";
import { getCsrfToken } from "../../app/utils/crsf";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

interface ErrorMessages {
  username?: string;
  email?: string;
  password1?: string;
  password2?: string;
  general?: string;
}

export function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2Confirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({});
  const router = useRouter();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const validateForm = () => {
      const errors: ErrorMessages = {};
      if (username.trim() === "") {
        errors.username = "Username is required.";
      }
      if (email.trim() === "") {
        errors.email = "Email is required.";
      }
      if (password1.trim().length < 6) {
        errors.password1 = "Password must be at least 6 characters long.";
      }
      if (password1 !== password2) {
        errors.password2 = "Passwords must match.";
      }
      return errors;
    };
    console.log("CSRF Token:", csrfToken);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrorMessages(validationErrors);
      return;
    } else {
      setErrorMessages({});
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/accounts/signup/`,
      {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
        },
        body: formData,
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      router.push("/login");
    } else {
      const errorData = await response.json();
      
      const backendErrors: ErrorMessages = {};

      // Traitement de l'erreur du backend pour username déjà pris
      if (errorData.error && errorData.error.includes("username")) {
        backendErrors.username = "This username is already taken.";
      }
      if (errorData.error && errorData.error.includes("email")) {
        backendErrors.email = "This email is already taken.";
      }
  
      if (errorData.errors) {
        if (errorData.errors.username) backendErrors.username = errorData.errors.username[0];
        if (errorData.errors.email) backendErrors.email = errorData.errors.email[0];
        if (errorData.errors.password1) backendErrors.password1 = errorData.errors.password1[0];
      }
  
      setErrorMessages(backendErrors);
      setError("An error occurred.");
    }

  };

    return (
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
              <CardDescription>Enter your details to create a new account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errorMessages.username && <p className="text-red-500">{errorMessages.username}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errorMessages.email && <p className="text-red-500">{errorMessages.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password1"
                  type="password"
                  placeholder="Create a password"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                />
                {errorMessages.password1 && <p className="text-red-500">{errorMessages.password1}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Password Confirmation</Label>
                <Input
                  id="password_confirmation"
                  name="password2"
                  type="password"
                  placeholder="Confirm the password"
                  value={password2}
                  onChange={(e) => setPassword2Confirmation(e.target.value)}
                />
                {errorMessages.password2 && <p className="text-red-500">{errorMessages.password2}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit">Register</Button>
            </CardFooter>
          </Card>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="mt-4 text-center text-sm">
            Have an account?
            <Link className="underline ml-2" href="/login">Log In</Link>
          </div>
        </form>
      </div>
    )
  }