"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackArrow = () => {
  const router = useRouter();

  return (
    <ArrowLeft
      className="absolute left-1 top-1 z-20 cursor-pointer text-muted/60"
      size={36}
      onClick={() => router.back()}
    />
  );
};

export default BackArrow;
