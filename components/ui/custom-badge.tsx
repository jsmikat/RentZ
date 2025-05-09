import { cn } from "@/lib/utils";

function badge({ type }: { type: "available" | "not-available" }) {
  const badgeStyle =
    type === "available"
      ? "bg-sky-100 text-sky-700 border-sky-700"
      : "bg-red-100 text-red-700 border-red-700";
  const badgeDotStyle = type === "available" ? "bg-sky-700" : "bg-red-700";
  return (
    <div
      className={cn(
        "flex items-center space-x-2",
        badgeStyle,
        "rounded-full px-2 py-[2px]"
      )}
    >
      <div className={cn("h-2 w-2 rounded-full", badgeDotStyle)}></div>
      <p className="text-[10px] font-semibold capitalize">
        {type === "available" ? "Available" : "Not Available"}
      </p>
    </div>
  );
}

export default badge;
