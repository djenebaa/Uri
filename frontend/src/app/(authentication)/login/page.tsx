"use client"
import { LogInForm } from "../../../components/forms/LogInForms";
import { useState } from "react";

export default function LogInRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  return (
    <>
      {isAuthenticated ? (
        <p>Welcome back!</p>
      ) : (
        <LogInForm setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
}