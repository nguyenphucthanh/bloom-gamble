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
      {children}
      {report}
    </main>
  );
}
