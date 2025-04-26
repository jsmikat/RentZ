import Link from "next/link";

import { AlignVerticalJustifyEnd, ArrowRight } from "lucide-react";

import { auth } from "@/auth";
import ApartmentCardExpandable from "@/components/apartment-card";
import { SearchForm } from "@/components/search-form";
import SignoutButton from "@/components/signoutButton";
import { Button } from "@/components/ui/button";
import { GetAvailableApartments } from "@/lib/actions";
import { ApartmentObject } from "@/types/MongodbObjectTypes";

export default async function HeroSection() {
  const session = await auth();

  const fetchedData = await GetAvailableApartments();

  const apartments: ApartmentObject[] = fetchedData.data?.apartments || [];
  return (
    <>
      <header>
        <nav className="fixed z-20 w-full border-b border bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
          <div className="flex max-w-5xl px-6 justify-between m-auto items-center gap-6 py-3 lg:py-4">
            <Link
              href="/"
              aria-label="home"
              className="flex items-center space-x-2"
            >
              <div className="flex gap-2 items-center justify-center">
                <AlignVerticalJustifyEnd className="size-8" />
                <p className="text-3xl font-black">RentZ</p>
              </div>
            </Link>
            {session ? (
              <div className="flex gap-3 lg:border-l lg:pl-6">
                <SignoutButton />
                <Button asChild>
                  <Link
                    href={
                      session.user.role === "owner"
                        ? "/dashboard/owner"
                        : "/dashboard/user"
                    }
                  >
                    Dashboard
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex gap-3 lg:border-l lg:pl-6">
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
        </nav>
      </header>

      {/* Main Section */}
      <main className="overflow-hidden">
        <section className="relative">
          <div className="relative py-24 lg:py-28">
            <div className="mx-auto space-y-6 max-w-7xl px-6 md:px-12">
              <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                <Link
                  href="#apartments"
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
              </div>
              <SearchForm />
            </div>
          </div>
        </section>
        <section id="apartments" className="flex items-center justify-center">
          <div className="flex flex-col max-w-5xl px-6 gap-8">
            {apartments.map((apartment) => (
              <ApartmentCardExpandable
                key={apartment._id}
                apartment={apartment}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
