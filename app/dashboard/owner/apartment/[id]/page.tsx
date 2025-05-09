import { auth } from "@/auth";
import { ApartmentDetails } from "@/components/apartment-card";
import { Separator } from "@/components/ui/separator";
import { GetApartment } from "@/lib/actions";

type Params = Promise<{ id: string }>;
async function page({ params }: { params: Params }) {
  const { id } = await params;
  const apartment = await GetApartment(id);

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
    <div className="flex flex-col h-full">
      {apartment.data?.apartment && (
        <ApartmentDetails apartment={apartment.data?.apartment} />
      )}
      <Separator orientation="horizontal" className="my-12" />
      {apartment.data?.apartment.allotedTo ? (
        <p>Alloted to {apartment.data?.apartment.allotedTo.userId}</p>
      ) : (
        <p>Not alotted to anyone yet</p>
      )}
    </div>
  );
}

export default page;
