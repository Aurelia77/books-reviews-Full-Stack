import { cn } from "@/lib/utils";

const FeedbackMessage = ({
  message,
  type = "info",
  className,
}: {
  message: string;
  type?: "info" | "error";
  className?: string;
}) => {
  const messageClass = cn(
    "my-8 mx-[10%] p-4 rounded-md text-center",
    // type === "info" && "bg-blue-100 text-blue-700",
    // type === "error" && "text-red-500 border border-red-700"
    {
      "text-muted border border-muted bg-primary/50": type === "info",
      "text-red-500 border border-red-500 bg-red-500/15": type === "error",
    },
    className
  );

  return <div className={messageClass}>{message}</div>;
};

export default FeedbackMessage;
