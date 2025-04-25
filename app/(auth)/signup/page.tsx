import Image from "next/image";

import { AlignVerticalJustifyEnd, Link } from "lucide-react";

import RegisterForm from "@/components/register-form";
import { ScrollArea } from "@/components/ui/scroll-area";

function page() {
  return (
    <div className="grid lg:grid-cols-2">
      <div className="bg-muted hidden lg:flex justify-center items-center">
        <Image
          width={400}
          height={400}
          src="/Signup-bro.svg"
          alt="Image"
          className="size-[70%] object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <ScrollArea className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-4xl"
          >
            <div className="text-black flex size-12 items-center justify-center">
              <AlignVerticalJustifyEnd className="size-12" />
            </div>
            RentZ
          </Link>
        </div>
        <div className="max-h-screen flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default page;
