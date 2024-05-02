import Header from "@/components/Header";
import React from "react";

export default function GameTienLenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="">
      <Header title="Tiến lên" needSigin={false} gamePath="/game-tien-len" />
      {children}
    </main>
  );
}
