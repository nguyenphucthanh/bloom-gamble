import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TIME_FORMATS } from "@/lib/datetime";
import { formatDate } from "date-fns";
import { LockIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

type BetCardProps = {
  id: string;
  teamA: string;
  teamB: string;
  teamAResult?: number | null;
  teamBResult?: number | null;
  createdAt: Date;
  createdBy?: string | null;
  locked?: boolean;
};

export const BetCard: FC<BetCardProps> = ({
  id,
  teamA,
  teamB,
  teamAResult,
  teamBResult,
  createdAt,
  createdBy,
  locked,
}) => {
  return (
    <Link href={`/bet/${id}`}>
      <Card className="relative">
        {locked && (
          <div className="bg-red-500 absolute -right-2 -top-2 z-10 h-8 w-8 rounded-full text-white flex items-center justify-center">
            <LockIcon />
          </div>
        )}
        <CardHeader>
          <CardTitle>
            <span className="text-xl text-blue-500">{teamA}</span> VS{" "}
            <span className="text-xl text-red-500">{teamB}</span>
          </CardTitle>
          <CardDescription className="text-sm text-neutral-500">
            {formatDate(createdAt, TIME_FORMATS.DISPLAY_DATE)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Result: {teamAResult ?? "?"} - {teamBResult ?? "?"}
          </p>
        </CardContent>
        {createdBy && (
          <CardFooter>
            <p className="flex flex-row items-center gap-2 text-neutral-500">
              <UserIcon /> {createdBy}
            </p>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};
