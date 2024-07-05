"use client";
import { FC, useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { LockIcon, RefreshCwIcon, UnlockIcon } from "lucide-react";

export type BetLockProps = {
  id: string;
};

export const BetLock: FC<BetLockProps> = ({ id }) => {
  const [locked, setLocked] = useState(false);
  const { data: bet } = api.bet.getById.useQuery(id);

  const setLock = api.bet.setBetLock.useMutation();

  useEffect(() => {
    if (bet) {
      setLocked((bet.locked as boolean) ?? false);
    }
  }, [bet]);

  const handleLock = useCallback(
    async (locked: boolean) => {
      if (!bet) {
        return;
      }
      const result = await setLock.mutateAsync({
        id: bet.id,
        locked: locked,
      });

      setLocked((result?.locked as boolean) ?? false);
    },
    [bet, setLock],
  );

  if (locked) {
    return (
      <Button
        variant={"default"}
        onClick={() => handleLock(false)}
        disabled={setLock.isLoading}
      >
        <UnlockIcon className="mr-2" />
        Unlock
        {setLock.isLoading && <RefreshCwIcon className="ml-2 animate-spin" />}
      </Button>
    );
  }

  return (
    <Button
      variant={"destructive"}
      onClick={() => handleLock(true)}
      disabled={setLock.isLoading}
    >
      <LockIcon className="mr-2" />
      Lock
      {setLock.isLoading && <RefreshCwIcon className="ml-2 animate-spin" />}
    </Button>
  );
};
