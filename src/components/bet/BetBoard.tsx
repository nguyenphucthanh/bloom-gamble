"use client";
import supabase from "@/server/supabase.client";
import { api } from "@/trpc/react";
import { FC, useCallback, useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { Badge } from "../ui/badge";

interface BetBoardProps {
  betId: string;
}

export const BetBoard: FC<BetBoardProps> = ({ betId }) => {
  const { data, refetch } = api.bet.getBetPlayers.useQuery(betId);
  const { toast } = useToast();

  const sideA = data?.filter((player) => player.team === "A") ?? [];
  const sideB = data?.filter((player) => player.team === "B") ?? [];

  const handleEvent = useCallback(
    (_payload: unknown) => {
      refetch()
        .then(() => {
          console.log("refetch");
        })
        .catch((error) => {
          toast({
            title: "Error",
            content:
              error instanceof Error ? error?.message : "Cannot refetch board",
            variant: "destructive",
          });
        });
    },
    [refetch, toast],
  );

  useEffect(() => {
    const channelInsert = supabase
      .channel("BetPlayer")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "BetPlayer" },
        handleEvent,
      )
      .subscribe();

    return () => {
      channelInsert
        .unsubscribe()
        .then(() => {
          console.log("Ubsubscribe from channel");
        })
        .catch(() => {
          toast({
            title: "Error",
            content: "Cannot unsubscribe from channel",
            variant: "destructive",
          });
        });
    };
  }, [handleEvent, toast]);

  return (
    <div className="flex w-full flex-row items-stretch gap-4 border border-neutral-300 mt-4 rounded shadow p-2">
      <div className="flex flex-1 flex-col items-end gap-2">
        <div className="text-neutral-300">{sideA.length} người cược</div>
        {sideA.map((player) => (
          <div
            key={player.id}
            className="inline-flex flex-row items-center justify-end gap-2 text-sm"
          >
            {player.UserProfile?.name} <Badge>{player.betAmount}</Badge>
          </div>
        ))}
      </div>
      <div className="w-2 rounded bg-neutral-50"></div>
      <div className="flex flex-1 flex-col items-start gap-2">
        <div className="text-neutral-300">{sideB.length} người cược</div>
        {sideB.map((player) => (
          <div
            key={player.id}
            className="inline-flex flex-row-reverse items-center justify-end gap-2 text-sm"
          >
            {player.UserProfile?.name} <Badge>{player.betAmount}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
