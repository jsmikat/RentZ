"use client";

import { useRouter } from "next/navigation";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { IApartmentDocument } from "@/database/apartment.model";
import { DeleteApartment } from "@/lib/actions";

export function ApartmentRow({
  apartment,
  handleClick,
}: {
  apartment: IApartmentDocument;
  handleClick?: () => void;
}) {
  const router = useRouter();
  return (
    <TableRow className="cursor-pointer" onClick={handleClick}>
      <TableCell className="font-medium">{`${apartment.address.street}, ${apartment.address.area}, ${apartment.address.city}`}</TableCell>
      <TableCell>{apartment.rentalPrice}</TableCell>
      <TableCell className="hidden md:table-cell">
        {apartment.description}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {JSON.parse(JSON.stringify(apartment.allocatedTo)) || "Not Allocated"}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Button
                variant="outline"
                className="w-[8rem]"
                onClick={(e) =>
                  router.push(
                    new URL(
                      `/dashboard/owner/apartment/edit/${apartment._id}`,
                      window.location.origin
                    ).toString()
                  )
                }
              >
                Edit
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                className="w-[8rem]"
                variant="destructive"
                onClick={async (e) => {
                  e.preventDefault();
                  await DeleteApartment(apartment._id as string);
                  router.refresh();
                }}
              >
                Delete
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
