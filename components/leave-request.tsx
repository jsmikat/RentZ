"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { addMonths, format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitLeaveRequest } from "@/lib/actions";

export default function LeaveRequestForm({
  apartmentId,
}: {
  apartmentId: string;
}) {
  const [month, setMonth] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const months = Array.from({ length: 6 }, (_, i) =>
    format(addMonths(new Date(), i + 2), "yyyy-MM")
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await SubmitLeaveRequest(apartmentId, month, info);
      if (!res.success) {
        toast.error("Failed to submit leave request");
        return;
      }
      toast.success("Leave request submitted successfully");
      router.push("/dashboard/user");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">
          Leave From Month
        </label>
        <Select onValueChange={setMonth} value={month} required>
          <SelectTrigger>
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {format(new Date(m), "MMMM yyyy")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Additional Info
        </label>
        <Input
          placeholder="Your message"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Leave Request"}
      </Button>
    </form>
  );
}
