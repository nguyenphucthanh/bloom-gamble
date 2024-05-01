import React, { useEffect } from "react";
import { api } from "@/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useProfiles from "@/hooks/useUserProfiles";

export type PlayerNameInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export default function PlayerNameInput({
  placeholder,
  value,
  onChange,
}: PlayerNameInputProps) {
  const profiles = useProfiles();

  const players =
    profiles?.slice().sort((a, b) => {
      return a?.name?.localeCompare(b?.name ?? "") ?? 0;
    }) ?? [];

  return (
    <Select value={value} defaultValue={value} onValueChange={onChange}>
      <SelectTrigger className={"w-48"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {players.map((player) => (
          <SelectItem key={player.id} value={player.id}>
            {player.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
