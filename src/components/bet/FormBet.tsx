"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormItem,
  Form,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { BetInputSchema } from "@/validations/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type BetInput = z.infer<typeof BetInputSchema>;

export const FormBet: FC = () => {
  const form = useForm<BetInput>({
    resolver: zodResolver(BetInputSchema),
  });
  const router = useRouter();
  const createBet = api.bet.create.useMutation();

  const onSubmit = useCallback(
    async (values: BetInput) => {
      const result = await createBet.mutateAsync(values);
      if (result.id) {
        router.push(`/bet/${result.id}`);
      }
    },
    [createBet, router],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mở kèo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="bg-gradient-to-r from-white to-blue-50 rounded p-4 border border-blue-50">
              <FormField
                control={form.control}
                name="teamA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team A</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="bg-white" />
                    </FormControl>
                    <FormDescription>Nhập tên đội A</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="text-center font-bold p-2 text-2xl">V.S.</div>
            <div className="bg-gradient-to-r from-white to-red-50 rounded p-4 border border-red-50">
              <FormField
                control={form.control}
                name="teamB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team B</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="bg-white" />
                    </FormControl>
                    <FormDescription>Nhập tên đội B</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              disabled={createBet.isLoading}
            >
              {createBet.isLoading && (
                <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Mở kèo Đặt cược
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
