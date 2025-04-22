import Image from "next/image";
import Link from "next/link";

import { Building2 } from "lucide-react";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-4xl"
          >
            <div className="text-black flex size-12 items-center justify-center">
              <Building2 className="size-12" />
            </div>
            RentZ
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted hidden lg:flex justify-center items-center">
        <Image
          width={400}
          height={400}
          src="/Signin-bro.svg"
          alt="Image"
          className="size-[70%] object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
