"use client";

import { useSession } from "next-auth/react";

import AddApartment from "@/components/CreateApartment";

function page() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Please login to add an apartment</div>;
  }

  if (session.user.role !== "owner") {
    return (
      <div className="h-screen">
        <h1 className="h-full flex justify-center items-center text-4xl font-black">
          <span className="text-rose-500">Access denied:</span> You do not have
          permission to assess this page!
        </h1>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-6xl font-black">The page rendered</h1>
      <AddApartment />
    </>
  );
}

export default page;
