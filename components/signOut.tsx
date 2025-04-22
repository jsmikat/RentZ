"use client";

import { useRouter } from "next/navigation";

import { signOut } from "next-auth/react";

import { Button } from "./ui/button";

function SignOut() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="w-full mt-4"
      onClick={async () => {
        await signOut();
        router.push("/signin");
      }}
    >
      Sign Out
    </Button>
  );
}

export default SignOut;
