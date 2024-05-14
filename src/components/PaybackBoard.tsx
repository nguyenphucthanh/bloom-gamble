import React, { FC } from "react";
import IconMoney from "./icons/money";
import { Payback } from "@/lib/payback";

const Line: FC<{ nameFrom: string; nameTo: string; amount: number }> = ({
  nameFrom,
  nameTo,
  amount,
}) => {
  return (
    <li className="flex gap-2">
      <IconMoney />
      <span>
        {nameFrom} chuyển cho {nameTo}{" "}
        <span className="font-bold text-red-500">{amount}K</span>
      </span>
    </li>
  );
};

const PaybackBoard: FC<{ paybacks: Payback }> = ({ paybacks }) => {
  return (
    <ul className="ml-3 flex flex-col gap-2 text-left">
      {Array.from(paybacks.keys()).map((key) => {
        return paybacks
          ?.get(key)
          ?.map((payback, index: number) => (
            <Line
              key={`${key}-${index}`}
              nameTo={key}
              nameFrom={payback.player}
              amount={payback.amount}
            />
          ));
      })}
    </ul>
  );
};

export default PaybackBoard;
