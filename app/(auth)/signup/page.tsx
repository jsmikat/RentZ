import Image from "next/image";
import Link from "next/link";

import { AlignVerticalJustifyEnd } from "lucide-react";

import RegisterForm from "@/components/register-form";

function page() {
  return (
    <div className="grid lg:grid-cols-2 max-h-screen overflow-y-hidden">
      <div className="bg-muted hidden lg:flex justify-center items-center">
        <Image
          width={400}
          height={400}
          src="/Signup-bro.svg"
          alt="Image"
          className="size-[70%]"
        />
      </div>
      <div className="h-max-screen overflow-y-auto p-4">
        <div className="flex items-center justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-4xl"
          >
            <AlignVerticalJustifyEnd className="size-8" />
            <p>RentZ</p>
          </Link>
        </div>
        <div className="max-h-screen flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
