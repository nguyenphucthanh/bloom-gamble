import { getServerAuth } from "@/utils/supabase/getServerAuth";
import React from "react";

export default async function Profile() {
  const auth = await getServerAuth();
  return <div></div>;
}
