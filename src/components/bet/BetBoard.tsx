"use client";
import supabase from "@/server/supabase.client";
import { api } from "@/trpc/react";
import { FC, useCallback, useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/lib/utils";

interface BetBoardProps {
  betId: string;
}

const LoadingPlayer = () => {
  return Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className="block h-4 w-full animate-pulse rounded-sm bg-neutral-200"
    />
  ));
};

export const BetBoard: FC<BetBoardProps> = ({ betId }) => {
  const { data, refetch, isLoading } = api.bet.getBetPlayers.useQuery(betId);
  const { toast } = useToast();

  const sideA =
    data
      ?.filter((player) => player.team === "A")
      .sort((a, b) => a.betAmount - b.betAmount) ?? [];
  const sideB =
    data
      ?.filter((player) => player.team === "B")
      .sort((a, b) => a.betAmount - b.betAmount) ?? [];

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
    <div className="mt-4 flex w-full flex-row items-stretch gap-4 rounded-xl border border-neutral-300 p-2 shadow">
      <div className="flex flex-1 flex-col items-end gap-2">
        <div className="text-neutral-300">{sideA.length} người cược</div>
        {isLoading && <LoadingPlayer />}
        {sideA.map((player) => (
          <div
            key={player.id}
            className="inline-flex flex-row items-center justify-end gap-2 text-sm"
          >
            {player.UserProfile?.name} <Badge>{formatCurrency(player.betAmount)}</Badge>
          </div>
        ))}
      </div>
      <div className="w-2 rounded bg-neutral-50"></div>
      <div className="flex flex-1 flex-col items-start gap-2">
        <div className="text-neutral-300">{sideB.length} người cược</div>
        {isLoading && <LoadingPlayer />}
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
