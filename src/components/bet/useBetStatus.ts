import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import supabase from "@/server/supabase.client";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

export const useBetStatus = (betId: string) => {
  const [teamAResult, setTeamAResult] = useState<number | null>(null);
  const [teamBResult, setTeamBResult] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const {data: bet} = api.bet.getById.useQuery(betId);

  useEffect(() => {
    if (bet) {
      setTeamAResult(bet.teamAResult);
      setTeamBResult(bet.teamBResult);
    }
  }, [bet])

  useEffect(() => {
    const sub = supabase
      .channel("Bet")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Bet",
        },
        (payload) => {
          if (
            "id" in payload.old &&
            !payload.old.locked &&
            "id" in payload.new &&
            payload.new?.id === betId &&
            payload.new?.teamAResult !== null &&
            payload.new?.teamBResult !== null &&
            payload.new?.locked
          ) {
            setTeamAResult(payload.new?.teamAResult as number);
            setTeamBResult(payload.new?.teamBResult as number);
            router.refresh();
            location.reload();
          }
        }
      )
      .subscribe();

    return () => {
      sub
        .unsubscribe()
        .then(() => {
          console.log("Unsubscribe from channel");
        })
        .catch((ex) => {
          toast({
            title: "Error",
            content:
              ex instanceof Error
                ? ex.message
                : "Cannot unsubscribe from channel",
            variant: "destructive",
          });
        });
    };
  }, [betId, router, toast]);

  const isFinished = teamAResult !== null && teamBResult !== null;

  return { isFinished, teamAResult, teamBResult };
};
