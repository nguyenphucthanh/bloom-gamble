import Header from "@/components/Header";
import React from "react";

export default function GameBiLacLayout({
  children,
  report,
}: {
  children: React.ReactNode;
  report: React.ReactNode;
}) {
  return (
    <main className="">
      <Header title="Bi lắc" gamePath="/game-bi-lac" />
      {children}
      {report}
    </main>
  );
}
