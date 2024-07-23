// app/page.tsx
import React from "react";
import Home from "../pages/dashboard";
import Login from "../pages/api/login";
import Register from "../pages/api/register";
import Profile from "../pages/profile";

const Page = () => {
  return (
    <>
      <Home />
      <Login />
      <Register />
      <Profile />
    </>
  );
};

export default Page;