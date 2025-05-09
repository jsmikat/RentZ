import { auth } from "@/auth";
import { ApartmentDetails } from "@/components/apartment-card";
import RequestCard from "@/components/request-card";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apartment.data?.apartment.requests.map((request: any) => (
          <RequestCard
            key={request._id}
            requestStatus={request.requestStatus}
            requestId={request._id}
            requesterName={request.requesterId.name}
            phoneNumber={request.requesterId.phoneNumber}
            type={request.type}
            members={request.members}
            message={request.additionalInfo}
          />
        ))}
      </div>
    </div>
  );
}

export default page;
