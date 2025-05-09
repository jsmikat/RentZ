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
  requests,
  apartments,
  relativePath,
}: {
  apartments?: IApartmentDocument[];
  relativePath: string;
  requests?: any;
}) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead className="hidden md:table-cell">Rental Price</TableHead>
          <TableHead className="hidden md:table-cell">Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apartments
          ? apartments.map((apartment) => (
              <ApartmentRow
                key={Math.random()}
                handleClick={() => {
                  router.push(
                    new URL(
                      `${relativePath}${JSON.parse(JSON.stringify(apartment._id))}`,
                      window.location.origin
                    ).toString()
                  );
                }}
                apartment={apartment}
              />
            ))
          : requests?.map((request: any) => (
              <ApartmentRow
                key={Math.random()}
                handleClick={() => {
                  router.push(
                    new URL(
                      `${relativePath}${JSON.parse(JSON.stringify(request._id))}`,
                      window.location.origin
                    ).toString()
                  );
                }}
                apartment={request.apartmentId}
                requestStatus={request.requestStatus}
              />
            ))}
      </TableBody>
    </Table>
  );
}
