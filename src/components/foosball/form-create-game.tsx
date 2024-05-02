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
import { CreateState, create } from "@/app/game-bi-lac/actions";
import { useFormState } from "react-dom";
import { BiLacSchema } from "@/validations/schemas";
import { useRouter } from "next/navigation";

export type FormCreateGameFoosballProps = {};

export type FormValues = z.infer<typeof BiLacSchema>;

export default function FormCreateGameFoosball({}: FormCreateGameFoosballProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(BiLacSchema),
    mode: "all",
  });
  const [state, formAction] = useFormState<CreateState, FormData>(create, null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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
  }, [state, form.setError]);

  const onReset = useCallback(() => {
    form.reset({
      winner1: "",
      winner2: "",
      loser1: "",
      loser2: "",
    });
  }, [form.reset]);

  const router = useRouter();

  return (
    <Form {...form}>
      <form
        action={(formData) =>
          startTransition(() => {
            formAction(formData);
            router.refresh();
          })
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-stretch gap-3 rounded border border-blue-300 p-3 shadow-lg shadow-blue-100">
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col items-stretch gap-3 rounded border border-red-100 p-3 shadow-lg shadow-red-100">
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
