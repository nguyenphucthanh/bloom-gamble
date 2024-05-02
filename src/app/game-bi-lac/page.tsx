import React from "react";
import ProfilesProvider from "@/components/ProfilesProvider";
import Report from "@/components/Report";
import FormCreateGameFoosball from "@/components/foosball/form-create-game";
import { GAME_TYPE } from "@/consts";
import { format } from "date-fns";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export default function GameBiLac() {
  const today = format(new Date(), "yyyy-MM-dd");
  return (
    <ProfilesProvider>
      <div className="flex flex-col items-stretch gap-3 p-5">
        <Image
          src={"/foosball.svg"}
          width={100}
          height={100}
          alt="Foosball"
          className="mb-5 self-center"
        />
        <FormCreateGameFoosball />
        <div className="mt-5">
          <Report gameType={GAME_TYPE.BI_LAC} dateFrom={today} dateTo={today} />
        </div>
      </div>
    </ProfilesProvider>
  );
}
