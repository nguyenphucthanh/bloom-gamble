import Link from "next/link";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image, { StaticImageData } from "next/image";

export type GameSelectorProps = {
  children: React.ReactNode;
  link: string;
  image: StaticImageData | string;
};
export default function GameSelector({
  children,
  link,
  image,
}: GameSelectorProps) {
  return (
    <Link href={link}>
      <Card className="overflow-hidden text-blue-500  shadow-blue-100 hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-blue-300">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <Image src={image} className={""} alt={"children"} fill />
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle className="text-center text-2xl">{children}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
