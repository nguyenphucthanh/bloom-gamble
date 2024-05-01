"use client";
import { EnterPlayer } from "../gamble/EnterPlayer";
import { selectPlayer } from "../gamble/gambleSlice";
import { useMemo } from "react";
import Gamble from "./Gamble";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import ProfilesProvider from "../ProfilesProvider";

function GambleComponent() {
  const player = useAppSelector(selectPlayer);

  const A = useMemo(() => player.A, [player.A]);
  const B = useMemo(() => player.B, [player.B]);
  const C = useMemo(() => player.C, [player.C]);
  const D = useMemo(() => player.D, [player.D]);

  const isGameStarted = useMemo(() => {
    return !!A && !!B && !!C && !!D ? true : false;
  }, [A, B, C, D]);

  return (
    <ProfilesProvider>
      <div className="flex w-full flex-col items-center">
        <header className="">
          <Image
            src={"/logo.svg"}
            className="App-logo"
            alt="logo"
            width={120}
            height={120}
            priority={true}
          />
        </header>
        {isGameStarted ? <Gamble /> : <EnterPlayer />}
      </div>
    </ProfilesProvider>
  );
}

export default GambleComponent;
