import { auth } from "@/auth";
import ApartmentForm from "@/components/apartment-form";
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

  return <ApartmentForm type="edit" apartment={apartment.data?.apartment} />;
}

export default page;
