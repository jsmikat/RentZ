import Memo from "@/components/memo";
import { GetPaymentMemoData } from "@/lib/actions";

type Params = Promise<{ id: string }>;
async function page({ params }: { params: Params }) {
  const { id } = await params;
  const memoData = await GetPaymentMemoData(id);

  if (!memoData) {
    return <p className="text-destructive text-4xl">No Data Found</p>;
  }

  return <Memo data={memoData} />;
}

export default page;
