"use client";
import React, { useCallback, useMemo, useState } from "react";
import useProfiles from "@/hooks/useUserProfiles";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type PlayerNameInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
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
  ...props
}: PlayerNameInputProps) {
  const profiles = useProfiles();
  const [open, setOpen] = useState(false);

  const players = useMemo(() => {
    return (
      profiles?.slice().sort((a, b) => {
        return a?.name?.localeCompare(b?.name ?? "") ?? 0;
      }) ?? []
    );
  }, [profiles]);

  const selectedUser = useMemo(
    () => profiles?.find((profile) => profile.id === value),
    [profiles, value],
  );

  const onFilter = useCallback(
    (id: string, search: string) => {
      const found = players?.some((player) => {
        if (player.id !== id) {
          return false;
        }
        const { name, firstName, lastName } = player;
        if (
          name?.toLowerCase().includes(search.toLowerCase()) ??
          firstName?.toLowerCase().includes(search.toLowerCase()) ??
          lastName?.toLowerCase().includes(search.toLowerCase())
        ) {
          return true;
        }
      });

      return found ? 1 : 0;
    },
    [players],
  );

  return (
    <>
      <input
        type="hidden"
        name={name}
        value={value}
        data-players={JSON.stringify(players)}
        {...props}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            type="button"
            disabled={props.disabled}
          >
            {value
              ? selectedUser?.name ?? selectedUser?.firstName ?? "Unknown user"
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command filter={onFilter}>
            <CommandInput placeholder="Search player..." />
            <CommandEmpty>No player found.</CommandEmpty>
            <CommandList>
              <CommandGroup heading="Players">
                {players?.map((player) => (
                  <CommandItem
                    key={player.id}
                    value={player.id}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === player.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {player.name ??
                      player.firstName ??
                      player.lastName ??
                      "Unknown"}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
