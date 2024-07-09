import { FormBet } from "@/components/bet/FormBet";
import { api } from "@/trpc/server";
import { getServerAuth } from "@/utils/supabase/getServerAuth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BetCard } from "@/components/bet/BetCard";

export default async function BetGame() {
  const session = await getServerAuth();
  if (!session?.user) {
    redirect("/login");
  }

  const bets = await api.bet.getBets.query();

  const myBets =
    bets?.filter((bet) => bet?.UserProfile?.id === session.profile?.id) ?? [];

  return (
    <div>
      <FormBet />

      <div className="mt-4">
        <h2 className="mb-4 text-2xl font-bold">Các kèo (trong 10 ngày qua)</h2>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="my">Của tôi</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="flex flex-col gap-4">
              {bets?.map((bet) => (
                <BetCard
                  key={bet.id}
                  id={bet.id}
                  teamA={bet.teamA}
                  teamB={bet.teamB}
                  teamAResult={bet.teamAResult}
                  teamBResult={bet.teamBResult}
                  createdAt={new Date(bet.createdAt)}
                  createdBy={bet.UserProfile?.name}
                  locked={bet.locked}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="my">
            <div className="flex flex-col gap-4">
              {myBets?.map((bet) => (
                <BetCard
                  key={bet.id}
                  id={bet.id}
                  teamA={bet.teamA}
                  teamB={bet.teamB}
                  teamAResult={bet.teamAResult}
                  teamBResult={bet.teamBResult}
                  createdAt={new Date(bet.createdAt)}
                  createdBy={bet.UserProfile?.name}
                  locked={bet.locked}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
