"use client";
import React, { useCallback, useEffect, useTransition } from "react";
import PlayerNameInput from "@/components/gamble/PlayerNameInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
import * as z from "zod";
import {
  FrownIcon,
  LoaderCircle,
  RefreshCwIcon,
  SmileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CreateState, createGameBiLac } from "@/app/game-bi-lac/actions";
import { BiLacSchema } from "@/validations/schemas";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

export type FormValues = z.infer<typeof BiLacSchema>;

export default function FormCreateGameFoosball() {
  const form = useForm<FormValues>({
    resolver: zodResolver(BiLacSchema),
    mode: "all",
  });
  const [state, formAction] = useFormState<CreateState, FormData>(
    createGameBiLac,
    null,
  );
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state?.state === "error") {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
      if (state.errors) {
        state.errors.forEach((error) => {
          form.setError(error.path as FieldPath<FormValues>, {
            message: error.message,
          });
        });
      }
    }
  }, [state, form, toast]);

  const onReset = useCallback(() => {
    form.reset({
      winner1: "",
      winner2: "",
      loser1: "",
      loser2: "",
    });
  }, [form]);

  const router = useRouter();

  const onHandleSwap = useCallback(() => {
    const values = form.getValues();
    form.setValue("winner1", values.loser1);
    form.setValue("winner2", values.loser2);
    form.setValue("loser1", values.winner1);
    form.setValue("loser2", values.winner2);
  }, [form]);

  const onAction = useCallback((formData: FormData) => {
    startTransition(() => {
      formAction(formData);
      router.refresh();
    });
  }, []);

  return (
    <Form {...form}>
      <form action={onAction}>
        <div className="grid grid-cols-7 gap-3">
          <div className="col-span-3 flex flex-col items-stretch gap-3 rounded border border-blue-300 p-3 shadow-lg shadow-blue-100">
            <h3 className="inline-flex gap-2 text-xl font-bold text-blue-500">
              <SmileIcon /> Winners
            </h3>
            <FormField
              name={"winner1"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player 1</FormLabel>
                  <FormControl>
                    <PlayerNameInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={"Winner 1"}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={"winner2"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player 2</FormLabel>
                  <FormControl>
                    <PlayerNameInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={"Winner 1"}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col items-stretch justify-center">
            <Button
              type="button"
              onClick={onHandleSwap}
              variant={"outline"}
              className="p-1"
            >
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="col-span-3 flex flex-col items-stretch gap-3 rounded border border-red-100 p-3 shadow-lg shadow-red-100">
            <h3 className="inline-flex gap-2 text-xl font-bold text-red-500">
              <FrownIcon />
              Losers
            </h3>
            <FormField
              name={"loser1"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player 1</FormLabel>
                  <FormControl>
                    <PlayerNameInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={"Loser 1"}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={"loser2"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player 2</FormLabel>
                  <FormControl>
                    <PlayerNameInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={"Loser 2"}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          className="mt-5 inline-flex w-full gap-2"
          disabled={isPending || !form.formState.isValid}
          type="submit"
        >
          {isPending ? <LoaderCircle className="animate-spin" /> : null}
          Submit
        </Button>

        <Button
          className="mt-5 inline-flex w-full gap-2"
          disabled={isPending}
          type="reset"
          variant={"destructive"}
          onClick={onReset}
        >
          <RefreshCwIcon />
          Reset
        </Button>
      </form>
    </Form>
  );
}
