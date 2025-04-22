"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowRight, Castle, Rocket } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import ApartmentGrid from "@/components/apartment-card";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { GetAvailableApartments } from "@/lib/actions";
import { ApartmentObject } from "@/types/MongodbObjectTypes";

export default function HeroSection() {
  const [apartments, setApartments] = useState<ApartmentObject[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const data = await GetAvailableApartments();
        setApartments(data.data?.apartments || []);
      } catch (error) {
        console.error("Failed to fetch apartments:", error);
      }
    };

    fetchApartments();
  }, []);
  return (
    <>
      <header>
        <nav className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
          <div className="flex m-auto max-w-5xl px-6">
            <div className="w-full flex items-center justify-between gap-6 py-3 lg:py-4">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <div className="flex gap-2 items-center justify-center">
                  <Castle className="size-8" />
                  <p className="text-3xl font-black">RentZ</p>
                </div>
              </Link>
              {session ? (
                session.user.role === "owner" ? (
                  <div className="flex w-full gap-3 md:w-fit lg:border-l lg:pl-6">
                    <Button
                      onClick={async () => {
                        await signOut();
                        router.refresh();
                      }}
                      variant="outline"
                    >
                      Logout
                    </Button>
                    <Button asChild>
                      <Link href="/owner/dashboard">
                        <span>Dashboard</span>
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <p>Normal User</p>
                )
              ) : (
                <div className="flex w-full gap-3 md:w-fit lg:border-l lg:pl-6">
                  <Button asChild variant="outline">
                    <Link href="/signin">
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">
                      <span>Sign up</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="overflow-hidden">
        <section className="relative">
          <div className="relative py-24 lg:py-28">
            <div className="mx-auto space-y-6 max-w-7xl px-6 md:px-12">
              <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                <Link
                  href="#apratments"
                  className="rounded-(--radius) mx-auto flex w-fit items-center gap-2 border p-1 pr-3"
                >
                  <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">
                    New
                  </span>
                  <span className="text-sm">Browse Latest Rentals</span>
                  <span className="bg-(--color-border) block h-4 w-px"></span>

                  <ArrowRight className="size-4" />
                </Link>

                <h1 className="mt-8 text-4xl font-semibold md:text-5xl xl:text-5xl xl:[line-height:1.125]">
                  Find Your Perfect Rental Home <br /> Apartments & Houses
                </h1>
                <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block">
                  Search thousands of apartments, houses, condos, and rooms for
                  rent. Affordable rental listings, verified landlords, instant
                  booking—everything you need in one platform.
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">
                  Discover rental apartments, homes, and rooms—fast, easy,
                  affordable.
                </p>

                {!session && (
                  <div className="mt-8">
                    <Button size="lg" asChild>
                      <Link href="/signin">
                        <Rocket className="relative size-4" />
                        <span className="text-nowrap">Join Today</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              <SearchForm className="max-w-1/2 mx-auto" />
            </div>
          </div>
        </section>
        <section id="apratments">
          <ApartmentGrid apartments={apartments} />
        </section>
      </main>
    </>
  );
}
