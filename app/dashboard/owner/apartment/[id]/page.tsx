import { auth } from "@/auth";
import AllotmentInfo from "@/components/allotment-info";
import { ApartmentDetails } from "@/components/apartment-card";
import { GetApartment } from "@/lib/actions";

type Params = Promise<{ id: string }>;
async function page({ params }: { params: Params }) {
  const { id } = await params;
  const apartment = await GetApartment(id);
  console.log(apartment);

  if (!apartment.success) {
    return (
      <p className="text-destructive text-4xl"> Unauthorised Access Request </p>
    );
  }
  const session = await auth();

  if (!session) {
    if (session?.user.role !== "owner") {
      return (
        <p className="text-destructive text-4xl">
          {" "}
          Unauthorised Access Request{" "}
        </p>
      );
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-4 p-4">
      {apartment.data?.apartment && (
        <ApartmentDetails apartment={apartment.data.apartment} />
      )}

      {apartment.data?.apartment.allottedTo ? (
        <AllotmentInfo
          allottedTo={apartment.data.apartment.allottedTo.userId}
          apartmentId={apartment.data.apartment._id}
        />
      ) : (
        <div className="border p-4 rounded-xl text-center">
          <p className="text-muted-foreground">Not allotted to anyone yet</p>
        </div>
      )}
    </div>
  );
}

export default page;
