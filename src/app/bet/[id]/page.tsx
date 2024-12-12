import { BetBoard } from "@/components/bet/BetBoard";
import { BetHeader } from "@/components/bet/BetHeader";
import { BetResult } from "@/components/bet/BetResult";
import { BetUpdateResult } from "@/components/bet/BetUpdateResult";
import { FormJoinBet } from "@/components/bet/FormJoinBet";
import { api } from "@/trpc/server";
import { getServerAuth } from "@/utils/supabase/getServerAuth";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PageBetDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await getServerAuth();
  const bet = await api.bet.getById.query(id);
  const isOwner = session?.profile?.id === bet?.createdBy;

  if (!bet) {
    return notFound();
  }

  const isFinished = bet.teamAResult !== null && bet.teamBResult !== null;

  return (
    <div>
      <h1 className="mb-8 text-center text-3xl">Kèo</h1>
      <BetHeader id={bet.id} teamA={bet.teamA} teamB={bet.teamB} />
      <BetBoard betId={id} />
      {isOwner && <BetUpdateResult id={id} />}
      {!isFinished ? (
        <div className="mt-8 flex flex-row justify-center border-t border-t-neutral-100 pt-4">
          {session?.user ? (
            <FormJoinBet
              betId={id}
              userProfileId={session?.profile?.id}
              teamA={bet.teamA}
              teamB={bet.teamB}
            />
          ) : (
            <div>
              <Link
                href={`/login?redirect=${encodeURIComponent(`/bet/${id}`)}`}
              >
                Login to bet
              </Link>
            </div>
          )}
        </div>
      ) : (
        <BetResult
          players={bet?.BetPlayer.map((player) => ({
            id: player.id,
            name: player.UserProfile?.name ?? "",
            betAmount: player.betAmount,
            team: player.team,
          }))}
          winTeam={
            (bet?.teamAResult ?? 0) > (bet?.teamBResult ?? 0) ? "A" : "B"
          }
        />
      )}
    </div>
  );
}
