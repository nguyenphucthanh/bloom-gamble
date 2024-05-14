import { FC, useMemo } from "react";
import SendMessageToSlack from "./SendMessageToSlack";
import { Payback, InputPoint } from "@/lib/payback";

const SendResultToSlack: FC<
  {
    paybacks: Payback;
    playerPoints: InputPoint;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ paybacks, playerPoints, ...buttonProps }) => {
  const message = useMemo(() => {
    const result = Object.entries(playerPoints).map(([player, point]) => {
      return `${player}: ${point}`;
    });
    const paybackResult: string[] = [];

    Array.from(paybacks.keys()).map((collector) => {
      return paybacks
        ?.get(collector)
        ?.forEach((payback) =>
          paybackResult.push(
            `${payback.player} chuyển cho ${collector} ${payback.amount}K`,
          ),
        );
    });

    const text = `${result.join(", ")}\n - ${paybackResult.join("\n - ")}`;
    return text;
  }, [paybacks, playerPoints]);

  return <SendMessageToSlack {...buttonProps} message={message} />;
};

export default SendResultToSlack;
