import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export type StatCardProps = {
  title: React.ReactNode;
  value: React.ReactNode;
  description: React.ReactNode;
};

export default function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardContent>
      <CardFooter>
        <p>{description}</p>
      </CardFooter>
    </Card>
  );
}
