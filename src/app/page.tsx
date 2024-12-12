"use client";

import GameSelector from "@/components/GameSelector";
import React from "react";
import imgGamble from "@/assets/images/danhbai.png";
import imgBiLac from "@/assets/images/foosball.jpg";
import imgBet from "@/assets/images/bet.png";
import deadpool from "@/assets/images/deadpool.jpeg";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col gap-3">
        <h1 className="mb-5 text-center text-4xl font-bold uppercase text-slate-700">
          Work Hard
          <br />
          Play Harder
        </h1>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <GameSelector image={imgGamble} link="/game-tien-len">
            Tiến Lên
          </GameSelector>
          <GameSelector image={imgBiLac} link="/game-bi-lac">
            Bi Lắc
          </GameSelector>
          <GameSelector image={imgBet} link="/bet">
            Cá cược
          </GameSelector>
          <GameSelector image={deadpool} link="/free-board">
            Free Board
          </GameSelector>
        </div>
      </div>
      <div className="text-center font-bold">
        <div className="m-4">Donate cho developer bạn ơi!</div>
        <a
          className="rounded-full bg-red-500 px-8 py-4 text-lg text-white"
          href="https://me.momo.vn/pwI4TzsVu3FKsEFQUyTeiB"
          target="_blank"
        >
          🙏 DONATE 🙏
        </a>
      </div>
    </main>
  );
}
