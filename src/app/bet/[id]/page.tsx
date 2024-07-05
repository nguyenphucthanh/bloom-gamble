import { BetBoard } from "@/components/bet/BetBoard";
import { BetHeader } from "@/components/bet/BetHeader";
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
  params: { id: string };
}) {
  const session = await getServerAuth();
  const bet = await api.bet.getById.query(params.id);
  const isOwner = session?.profile?.id === bet?.createdBy;

  if (!bet) {
    return notFound();
  }

  const isFinished = bet.teamAResult !== null && bet.teamBResult !== null;

  return (
    <div>
      <h1 className="mb-8 text-center text-3xl">Kèo</h1>
      <BetHeader
        id={bet.id}
        teamA={bet.teamA}
        teamB={bet.teamB}
      />
      <BetBoard betId={params.id} />
      {isOwner && <BetUpdateResult id={params.id} />}
      {!isFinished && (
        <div className="mt-8 flex flex-row justify-center border-t border-t-neutral-100 pt-4">
          {session?.user ? (
            <FormJoinBet
              betId={params.id}
              userProfileId={session?.profile?.id}
            />
          ) : (
            <div>
              <Link
                href={`/login?redirect=${encodeURIComponent(`/bet/${params.id}`)}`}
              >
                Login to bet
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
