"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { MapPinned, Search, X } from "lucide-react";

export function SearchForm() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = useRef<HTMLInputElement>(null);

  const query = searchParams.get("q");
  const [searchQuery, setSearchQuery] = useState(query || "");

  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     const params = new URLSearchParams(window.location.search);
  //     if (searchQuery) {
  //       params.set("q", searchQuery);
  //       router.push(`${pathname}/?${params.toString()}`, { scroll: false });
  //     } else {
  //       params.delete("q");
  //       router.push(`${pathname}/?${params.toString()}`, { scroll: false });
  //     }
  //   }, 500);

  //   return () => clearTimeout(delayDebounce);
  // }, [searchQuery, pathname, router]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      const params = new URLSearchParams(window.location.search);
      if (searchQuery) {
        params.set("q", searchQuery);
        router.push(`${pathname}/?${params.toString()}`, {
          scroll: false,
        });
      } else {
        params.delete("q");
        router.push(`${pathname}/?${params.toString()}`, { scroll: false });
      }
      ref.current?.blur();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (searchQuery) {
      params.set("q", searchQuery);
      router.push(`${pathname}/?${params.toString()}`, {
        scroll: false,
      });
    } else {
      params.delete("q");
      router.push(`${pathname}/?${params.toString()}`, { scroll: false });
    }
  }

  function handleClearSearch() {
    setSearchQuery("");
    const params = new URLSearchParams(window.location.search);
    params.delete("q");
    router.push(`${pathname}/?${params.toString()}`, { scroll: false });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto mt-10 max-w-sm lg:mt-12"
    >
      <div className="bg-background has-[input:focus]:ring-muted grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius))] border shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
        <MapPinned className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

        <input
          ref={ref}
          value={searchQuery}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find your next home"
          className="h-14 w-full bg-transparent pl-12 focus:outline-none"
          type="text"
        />
        {query ? (
          <button
            className="size-14 border bg-primary/5 flex items-center justify-center cursor-pointer"
            onClick={handleClearSearch}
          >
            <X className="size-6" />
          </button>
        ) : (
          <button
            className="size-14 border bg-primary/5 flex items-center justify-center cursor-pointer"
            type="submit"
          >
            <Search className="size-6" />
          </button>
        )}
      </div>
    </form>
  );
}
