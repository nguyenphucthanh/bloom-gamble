import Header from "@/components/Header";
import React from "react";

export default function GameBiLacLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="">
      <Header title="Bi lắc" needSigin={false} gamePath="/game-bi-lac" />
      {children}
    </main>
  );
}
