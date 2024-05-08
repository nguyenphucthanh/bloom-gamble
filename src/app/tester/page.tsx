import Header from "@/components/Header";
import React from "react";
import TestMessage from "./test-message";

export default function TesterPage() {
  return (
    <main>
      <Header title="Tester area" />
      <TestMessage />
    </main>
  );
}
