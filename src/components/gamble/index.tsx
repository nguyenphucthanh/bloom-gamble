import { EnterPlayer } from "../gamble/EnterPlayer";
import { selectPlayer } from "../gamble/gambleSlice";
import { useMemo } from "react";
import Gamble from "./Gamble";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

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
    <div className="App">
      <header className="App-header">
        <Image
          src={"/logo.svg"}
          className="App-logo"
          alt="logo"
          width={120}
          height={120}
          priority={true}
        />
      </header>
      <div className="text-center text-red-500 font-bold">
        Cờ bạc là bác thằng bần
      </div>
      <div className="text-center text-red-500 font-bold">
        Người thua bạc theo quy định pháp luật không cần phải trả nợ.
      </div>
      {isGameStarted ? <Gamble /> : <EnterPlayer />}
    </div>
  );
}

export default GambleComponent;
