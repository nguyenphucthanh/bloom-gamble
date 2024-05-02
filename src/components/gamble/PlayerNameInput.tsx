import React from "react";
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
  name?: string;
};

export default function PlayerNameInput({
  placeholder,
  value,
  onChange,
  name,
}: PlayerNameInputProps) {
  const profiles = useProfiles();

  const players =
    profiles?.slice().sort((a, b) => {
      return a?.name?.localeCompare(b?.name ?? "") ?? 0;
    }) ?? [];

  return (
    <Select
      value={value}
      defaultValue={value}
      onValueChange={onChange}
      name={name}
    >
      <SelectTrigger className={"w-full"}>
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
