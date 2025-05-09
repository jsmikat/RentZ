"use client";

import { useRouter } from "next/navigation";

import { signOut } from "next-auth/react";

import { Button } from "./ui/button";

function SignoutButton() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await signOut();
        router.refresh();
      }}
      variant="outline"
    >
      Logout
    </Button>
  );
}

export default SignoutButton;
