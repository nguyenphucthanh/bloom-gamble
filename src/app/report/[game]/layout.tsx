import Header from "@/components/Header";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header title="Report" />
      {children}
    </main>
  );
}
