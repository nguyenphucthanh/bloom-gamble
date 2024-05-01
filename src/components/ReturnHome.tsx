import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

export default function ReturnHome() {
  return (
    <Button asChild variant={"outline"} className="mt-5">
      <Link href={"/"}>Return Home</Link>
    </Button>
  );
}
