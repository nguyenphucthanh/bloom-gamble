"use client";
import { FreeBoard } from "@/components/freeboard";
import ProfilesProvider from "@/components/ProfilesProvider";

export default function PageFreeBoard() {
  return (
    <ProfilesProvider>
      <FreeBoard />
    </ProfilesProvider>
  );
}
