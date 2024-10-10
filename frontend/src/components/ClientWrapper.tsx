"use client"; 

import React from "react";
import { AuthProvider } from "@/components/auth/AuthenticationContext";
import NavBar from "@/components/navbar/NavBar";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavBar />
      {children}
    </AuthProvider>
  );
}
