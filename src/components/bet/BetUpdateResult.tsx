"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { RefreshCcwIcon } from "lucide-react";
import { BetLock } from "./BetLock";
import { useBetStatus } from "./useBetStatus";

export type BetUpdateResultProps = {
  id: string;
};

const formSchema = z.object({
  teamAResult: z.preprocess(
    (value) => Number.parseInt(value as string),
    z.number().min(0),
  ),
  teamBResult: z.preprocess(
    (value) => Number.parseInt(value as string),
    z.number().min(0),
  ),
});

export const BetUpdateResult: FC<BetUpdateResultProps> = ({ id }) => {
  const updateBet = api.bet.setBetLock.useMutation();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { isFinished } = useBetStatus(id);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      await updateBet.mutateAsync({
        id,
        teamAResult: values.teamAResult,
        teamBResult: values.teamBResult,
        locked: true,
      });

      router.refresh();
    },
    [id, router, updateBet],
  );

  if (isFinished) {
    return null;
  }

  return (
    <div className="mt-8 rounded bg-neutral-50 p-4">
      <h2 className="mb-3 text-2xl font-semibold text-neutral-700">
        Người mở kèo
      </h2>
      <Form {...form}>
        <h5 className="text-xl font-semibold">Cập nhật kết quả </h5>
        <form
          className="grid grid-cols-2 gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="teamAResult"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team A</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="teamBResult"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team B</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <BetLock id={id} />
          <Button type="submit" disabled={updateBet.isLoading}>
            {updateBet.isLoading && (
              <RefreshCcwIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Lưu & đóng kèo
          </Button>
        </form>
      </Form>
    </div>
  );
};
