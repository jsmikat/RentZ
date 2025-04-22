"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IApartmentDocument } from "@/database/apartment.model";

import { Apartment } from "./apartment";

export function ApartmentsTable({
  apartments,
}: {
  apartments: IApartmentDocument[];
}) {
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
          <Apartment
            key={JSON.parse(JSON.stringify(apartment._id))}
            apartment={apartment}
          />
        ))}
      </TableBody>
    </Table>
  );
}
