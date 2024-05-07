import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

const GambleComponent = dynamic(() => import("@/components/gamble"));

export const metadata: Metadata = {
  title: "Tiến Lên",
  description: "Work Hard Play Harder",
};

export default function GameTienLen() {
  return (
    <div>
      <GambleComponent />
    </div>
  );
}
