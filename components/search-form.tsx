"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";

import { MapPinned, SearchIcon } from "lucide-react";

import { Button } from "./ui/button";

export function SearchForm() {
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const value = ref.current?.value.trim() || "";

    value ? params.set("q", value) : params.delete("q");

    router.push(`${pathname}/?${params.toString()}`, { scroll: false });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-sm lg:mt-12">
      <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius))] border pr-3 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
        <MapPinned className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

        <input
          ref={ref}
          placeholder="Find your next home"
          className="h-14 w-full bg-transparent pl-12 focus:outline-none"
          type="text"
        />

        <div className="md:pr-1.5 lg:pr-0">
          <Button type="submit" className="rounded-(--radius)">
            <span className="hidden md:block">Search</span>
            <SearchIcon
              className="relative mx-auto size-5 md:hidden"
              strokeWidth={2}
            />
          </Button>
        </div>
      </div>
    </form>
  );
}
