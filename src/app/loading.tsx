import { LoaderCircle } from "lucide-react";
import React from "react";

export default function Loading() {
  <div className="flex flex-col items-stretch gap-3">
    <h1 className="text-center text-3xl font-bold uppercase">
      Work Hard Play Harder
    </h1>
    <LoaderCircle className="animate-spin" />
  </div>;
}
