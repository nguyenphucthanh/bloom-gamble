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
      setLocked(bet.locked ?? false);
    }
  }, [bet]);

  const handleLock = useCallback(
    async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!bet) {
        return;
      }
      const locked = e.currentTarget.dataset.lock === "true";
      const result = await setLock.mutateAsync({
        id: bet.id,
        locked: locked,
      });

      setLocked(result?.locked ?? false);
    },
    [bet, setLock],
  );

  if (locked) {
    return (
      <Button
        variant={"ghost"}
        data-lock={false}
        onClick={handleLock}
        disabled={setLock.isLoading}
      >
        <UnlockIcon className="mr-2" />
        Mở khóa
        {setLock.isLoading && <RefreshCwIcon className="ml-2 animate-spin" />}
      </Button>
    );
  }

  return (
    <Button
      variant={"destructive"}
      data-lock={true}
      onClick={handleLock}
      disabled={setLock.isLoading}
    >
      <LockIcon className="mr-2" />
      Khóa
      {setLock.isLoading && <RefreshCwIcon className="ml-2 animate-spin" />}
    </Button>
  );
};
