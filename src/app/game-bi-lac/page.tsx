import React from "react";
import ProfilesProvider from "@/components/ProfilesProvider";
import FormCreateGameFoosball from "@/components/foosball/form-create-game";
import Image from "next/image";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Bi Lắc",
  description: "Work Hard Play Harder",
};

export default function GameBiLac() {
  return (
    <div className="flex flex-col items-stretch gap-3">
      <Image
        src={"/foosball.svg"}
        width={100}
        height={100}
        alt="Foosball"
        className="mb-5 self-center"
      />
      <ProfilesProvider>
        <FormCreateGameFoosball />
      </ProfilesProvider>
    </div>
  );
}
