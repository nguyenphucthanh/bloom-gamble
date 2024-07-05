import { FormBet } from "@/components/bet/FormBet";
import { getServerAuth } from "@/utils/supabase/getServerAuth";
import { redirect } from "next/navigation";

export default async function BetGame() {
  const session = await getServerAuth();
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <div>
      <FormBet />
    </div>
  );
}
