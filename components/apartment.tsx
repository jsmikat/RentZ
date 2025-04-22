import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { IApartmentDocument } from "@/database/apartment.model";

export function Apartment({ apartment }: { apartment: IApartmentDocument }) {
  return (
    <TableRow>
      {/* <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={product.imageUrl}
          width="64"
        />
      </TableCell> */}
      <TableCell className="font-medium">{`${apartment.name}, ${apartment.address.city}, ${apartment.address.district}, ${apartment.address.division}`}</TableCell>
      <TableCell>
        {apartment.rentalPrice}
      </TableCell>
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              {/* <form action={deleteProduct}>
                <button type="submit">Delete</button>
              </form> */}
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
