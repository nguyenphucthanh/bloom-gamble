import Skeleton from "@/components/Skeleton";
import PointsByUser from "@/components/foosball/points-by-user";
import { getServerAuth } from "@/utils/supabase/getServerAuth";
import React, { Suspense } from "react";

export default async function PointsSlot() {
  const auth = await getServerAuth();

  if (!auth.user) {
    return null;
  }

  return (
    <Suspense fallback={<Skeleton />}>
      <PointsByUser emailOrId={auth.user?.email ?? auth.user?.id ?? ""} />
    </Suspense>
  );
}
