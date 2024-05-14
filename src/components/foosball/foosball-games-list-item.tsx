"use client";
import React, { useCallback, useTransition } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrashIcon as DeleteIcon, LoaderIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export type FoosballGameInfo = {
  id: string;
  winner1: string;
  winner2: string;
  loser1: string;
  loser2: string;
};

export type FoosballGamesListItemProps = {
  game: FoosballGameInfo;
};

export default function FoosballGamesListItem({
  game,
}: FoosballGamesListItemProps) {
  const [isPending, startTransition] = useTransition();
  const deleteMutation = api.game.deleteGame.useMutation();
  const router = useRouter();

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      await deleteMutation.mutateAsync(game.id);
      router.refresh();
    });
  }, [deleteMutation, game.id, router]);

  return (
    <TableRow key={game.id}>
      <TableCell className="text-blue-500">{game.winner1}</TableCell>
      <TableCell className="text-blue-500">{game.winner2}</TableCell>
      <TableCell className="text-red-500">{game.loser1}</TableCell>
      <TableCell className="text-red-500">{game.loser2}</TableCell>
      <TableCell>
        <Button variant={"ghost"} onClick={handleDelete} disabled={isPending}>
          {isPending ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            <DeleteIcon className="text-red-500" />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
}
