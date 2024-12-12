import { FC } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
export type ProfileBarProps = {
  profileId: string;
  point: number;
  onChange: (profileId: string, point: number) => void;
};
export const ProfileBar: FC<ProfileBarProps> = ({
  profileId,
  point,
  onChange,
}) => {
  return (
    <div className="flex flex-row items-center gap-4" data-name={profileId}>
      <Button
        className="text-3xl"
        variant={"outline"}
        onClick={() => onChange(profileId, -1)}
      >
        -
      </Button>
      <Input
        value={point}
        className={cn(
          "w-[80px] text-center text-3xl",
          point > 0 ? "text-green-500" : "text-red-500",
        )}
      />
      <Button
        className="text-3xl"
        variant={"outline"}
        onClick={() => onChange(profileId, 1)}
      >
        +
      </Button>
    </div>
  );
};
