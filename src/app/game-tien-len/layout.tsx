import React from "react";

export default function GameTienLenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="">
      {children}
    </main>
  );
}
