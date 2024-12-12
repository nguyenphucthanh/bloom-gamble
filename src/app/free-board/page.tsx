"use client";
import { FreeBoard } from "@/components/freeboard";
import ProfilesProvider from "@/components/ProfilesProvider";
import useProfiles from "@/hooks/useUserProfiles";

export default function PageFreeBoard() {
  return (
    <ProfilesProvider>
      <FreeBoard />
    </ProfilesProvider>
  );
}
