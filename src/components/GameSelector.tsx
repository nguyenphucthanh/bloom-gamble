import Link from "next/link";
import React from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";

export type GameSelectorProps = {
  children: React.ReactNode;
  link: string;
};
export default function GameSelector({ children, link }: GameSelectorProps) {
  return (
    <Link href={link}>
      <Card className="text-blue-500 shadow-blue-100  hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-blue-300">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{children}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
