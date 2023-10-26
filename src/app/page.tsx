"use client";

import GambleComponent from "@/components/gamble";
import React from "react";

export default function Home() {
  return (
    <main>
      <GambleComponent />
      <div className="text-center font-bold">
        <div className="m-4">Donate cho developer bạn ơi!</div>
        <a className="py-4 px-8 text-lg rounded-full bg-red-500 text-white" href="https://me.momo.vn/pwI4TzsVu3FKsEFQUyTeiB" target="_blank">🙏 DONATE 🙏</a>
      </div>
    </main>
  );
}
