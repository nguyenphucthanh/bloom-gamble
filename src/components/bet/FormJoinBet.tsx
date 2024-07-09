"use client";
import { FC, useCallback, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BetPlayerSchema } from "@/validations/schemas";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { HandCoinsIcon, RefreshCcwIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { ExitIcon } from "@radix-ui/react-icons";
import supabase from "@/server/supabase.client";
import { useToast } from "../ui/use-toast";

export type FormJoinBetProps = {
  betId: string;
  userProfileId?: string;
  teamA: string;
  teamB: string;
};

export const FormJoinBet: FC<FormJoinBetProps> = ({
  betId,
  userProfileId,
  teamA,
  teamB,
}) => {
  const [locked, setLocked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const subscriber = supabase
      .channel("Bet")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Bet",
        },
        (payload) => {
          console.log(payload);
          if ("id" in payload.new && payload.new.id === betId) {
            setLocked(payload.new.locked as boolean);
          }
        },
      )
      .subscribe();

    return () => {
      subscriber
        .unsubscribe()
        .then(() => {
          console.log("Unsubscribe from channel");
        })
        .catch((ex) => {
          toast({
            title: "Error",
            variant: "destructive",
            content:
              ex instanceof Error
                ? ex.message
                : "Cannot unsubscribe from channel",
          });
        });
    };
  }, [betId, toast]);

  const form = useForm<z.infer<typeof BetPlayerSchema>>({
    defaultValues: {
      betId,
      betAmount: 0,
      team: "A",
    },
    resolver: zodResolver(BetPlayerSchema),
  });
  const createBetPlayer = api.bet.createBetPlayer.useMutation();
  const updateBetPlayer = api.bet.updateBetPlayer.useMutation();
  const cancelBetPlayer = api.bet.cancelBetPlayer.useMutation();
  const queryBetPlayer = api.bet.getBetPlayerByUserProfileId.useQuery({
    betId,
    userProfileId: userProfileId ?? "",
  });

  const handleCancel = useCallback(async () => {
    if (!form.getValues("id")) {
      return;
    }
    await cancelBetPlayer.mutateAsync(form.getValues("id")!);
    form.reset({
      id: "",
      betId,
      betAmount: 0,
      team: "A",
    });
  }, [betId, cancelBetPlayer, form]);

  useEffect(() => {
    if (queryBetPlayer?.data) {
      form.reset({
        betId: queryBetPlayer.data?.bet_id,
        id: queryBetPlayer.data?.id,
        betAmount: queryBetPlayer.data?.betAmount,
        team: queryBetPlayer.data?.team,
      });
    }
  }, [form, queryBetPlayer.data]);

  const onSubmit = useCallback(
    async (values: z.infer<typeof BetPlayerSchema>) => {
      if (!values.id) {
        const result = await createBetPlayer.mutateAsync(values);
        if (result?.data?.id) {
          form.reset({
            id: result?.data?.id,
            betId: result?.data?.bet_id,
            betAmount: result?.data?.betAmount,
            team: result?.data?.team,
          });
        }
      } else {
        const result = await updateBetPlayer.mutateAsync(values);
        if (result?.data?.id) {
          form.reset({
            id: result?.data?.id,
            betId: result?.data?.bet_id,
            betAmount: result?.data?.betAmount,
            team: result?.data?.team,
          });
        }
      }
    },
    [createBetPlayer, form, updateBetPlayer],
  );

  if (locked) {
    return <div>Kèo đã đóng</div>;
  }

  return (
    <div className="flex flex-col p-4 rounded ring-4 ring-red-100">
      <Form {...form}>
        <h5 className="text-xl font-semibold">Tham gia đặt cược</h5>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => {
              return (
                <input type="hidden" {...field} value={field.value ?? ""} />
              );
            }}
          />
          <FormField
            control={form.control}
            name="betId"
            render={({ field }) => {
              return <input type="hidden" {...field} />;
            }}
          />
          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn team</FormLabel>
                <FormControl>
                  <ToggleGroup
                    size={"lg"}
                    variant={"outline"}
                    type="single"
                    {...field}
                    onValueChange={(v) => field.onChange(v)}
                    className="items-stretch"
                  >
                    <ToggleGroupItem
                      value="A"
                      aria-label="Team A"
                      className="h-auto p-4"
                    >
                      <span className="text-blue-500">{teamA}</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="B"
                      aria-label="Team B"
                      className="h-auto p-4"
                    >
                      <span className="text-red-500">{teamB}</span>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="betAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số tiền chung</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min={1000} />
                </FormControl>
                <div className="grid grid-cols-4 gap-2">
                  {[10000, 20000, 50000, 100000].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      size="lg"
                      variant={"outline"}
                      onClick={() => field.onChange(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
                <FormDescription>Please enter your bet amount</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            variant={"destructive"}
            disabled={createBetPlayer.isLoading ?? updateBetPlayer.isLoading}
          >
            {createBetPlayer.isLoading ?? updateBetPlayer.isLoading ? (
              <RefreshCcwIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <HandCoinsIcon className="mr-2 h-4 w-4" />
            )}
            {form.getValues("id") ? "Cập nhật" : "Chung"}
          </Button>
          {form.getValues("id") && (
            <Button
              type="button"
              size="lg"
              variant={"ghost"}
              onClick={handleCancel}
              disabled={cancelBetPlayer.isLoading}
            >
              {createBetPlayer.isLoading ?? updateBetPlayer.isLoading ? (
                <RefreshCcwIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExitIcon className="mr-2 h-4 w-4" />
              )}
              Hủy
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
