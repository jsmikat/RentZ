"use client";

import Link from "next/link";

import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

function page() {
  const session = useSession();
  if (session.status === "unauthenticated") {
    return (
      <div className="flex flex-col min-h-[60vh] h-full w-full items-center justify-center py-8">
        <h1 className="text-6xl font-black">
          Please <span className="text-primary">Sign in</span> to access this
          page
        </h1>
        <div className="flex gap-4">
          <Button className="mt-4" variant="default">
            <Link href="/signin">Sign in</Link>
          </Button>
          <Button className="mt-4" variant="outline">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] h-full w-full px-4">
      <h1 className="text-6xl font-bold">
        You are logged In: {session.data?.user.id}
      </h1>
      <Button className="mt-4" variant="outline" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}

export default page;
