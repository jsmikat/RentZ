"use client";

import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IApartmentDocument } from "@/database/apartment.model";

import { ApartmentRow } from "./apartment-row";

export function ApartmentsTable({
  apartments,
}: {
  apartments: IApartmentDocument[];
}) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead>Rental Price</TableHead>
          <TableHead className="hidden md:table-cell">Description</TableHead>
          <TableHead className="hidden md:table-cell">Allocated To</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apartments.map((apartment) => (
          <ApartmentRow
            key={Math.random()}
            handleClick={() => {
              router.push(
                new URL(
                  `/dashboard/owner/apartment/edit/${JSON.parse(
                    JSON.stringify(apartment._id)
                  )}`,
                  window.location.origin
                ).toString()
              );
            }}
            apartment={apartment}
          />
        ))}
      </TableBody>
    </Table>
  );
}
