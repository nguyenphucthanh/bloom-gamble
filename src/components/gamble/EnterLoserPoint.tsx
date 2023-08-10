import React, { FC, Fragment, useCallback, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAppSelector } from "@/store/hooks";
import { PlayerKey, selectPlayer, selectPlayerPoint } from "./gambleSlice";

export interface IEnterLoserPointProps {
  value: number | null;
  winnerId: string;
  onChange: (value: number | null, playerId: any) => void;
}

const combineToPoint = (
  isNegative: boolean,
  input: (number | null)[]
): number | null => {
  const str = `${isNegative ? "-" : ""}${input.join("")}`;
  const n = parseInt(str, 10);
  return !isNaN(n) ? n : null;
};

const EnterLoserPoint: FC<IEnterLoserPointProps> = ({ value, onChange, winnerId }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [isNegative, setIsNegative] = React.useState<boolean>(true);
  const [input, setInput] = React.useState<(number | null)[]>([null, null]);
  const players = useAppSelector(selectPlayer);
  const playerIds = Object.keys(players).filter(id => id != winnerId)
  const [currentPlayerIndex, setCurrentPlayerIndex] = React.useState<number>(0);
  let clickTimeout: any = null

  const numberValue = useMemo(() => {
    return combineToPoint(isNegative, input);
  }, [isNegative, input]);

  useEffect(() => {
    setIsNegative(
      (value !== null && value !== undefined && value < 0) ||
        value === null ||
        value === undefined
    );
    const str = value?.toString()?.replace("-", "");
    setInput([
      str?.[0] ? parseInt(str?.[0], 10) : null,
      str?.[1] ? parseInt(str?.[1], 10) : null,
    ]);
  }, [value, open]);

  const setNextPlayer = useCallback(() => {
    setInput([null, null]);
    if (currentPlayerIndex >= (playerIds.length - 1)) {
      setCurrentPlayerIndex(0);
      return setOpen(false)
    }
    setCurrentPlayerIndex(currentPlayerIndex + 1)
  }, [currentPlayerIndex, playerIds.length])

  const confirm = useCallback(() => {
    onChange(numberValue, playerIds[currentPlayerIndex]);
    setNextPlayer()
  }, [onChange, numberValue, currentPlayerIndex, playerIds, setNextPlayer]);

  const enterNumber = useCallback(
    (number: number) => {
      setInput((prev) => {
        if (prev[0] === null) {
          // if (number === 0) {
          //   onChange(0, playerIds[currentPlayerIndex]);
          //   setNextPlayer();
          //   return [null, null];
          // }
          return [number, null];
        } else if (prev[1] === null) {
          const v = combineToPoint(isNegative, [prev[0], number]);
          // onChange(v, playerIds[currentPlayerIndex]);
          // setNextPlayer();
          return [prev[0], number];
        } else {
          return prev;
        }
      });
    },
    [isNegative]
  );

  const isNumberDisabled = useCallback(() => {
    if (input?.[0] === 0) {
      return true;
    }
    return false;
  }, [input]);

  const autoWin = useCallback(() => {
    playerIds.forEach(id => {
      onChange(-13, id);
      setOpen(false)
    })
  }, [onChange, playerIds]);

  const openPointInput = useCallback(() => {
    setIsNegative(true);
    setOpen(true);
  }, [])

  const handleClick = () => {
    if (clickTimeout !== null) {
      console.log('double click executes')
      clearTimeout(clickTimeout)
      clickTimeout = null
      autoWin()
    } else {
      console.log('single click')  
      clickTimeout = setTimeout(() => {
        console.log('first click executes')
        clearTimeout(clickTimeout)
        clickTimeout = null
        openPointInput()
      }, 300)
    }
  }

  return (
    <div>
      <button
        className="bg-yellow-100 border border-yellow-500 text-red-500 rounded text-sm p-3 px-1 block w-10 "
        onClick={handleClick}
      >
        {"️🏆"}
      </button>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Nhập điểm {players[playerIds[currentPlayerIndex] as PlayerKey]}
                  </Dialog.Title>
                  <div className="flex justify-center gap-1 text-3xl mx-auto my-3">
                    <button
                      className="w-10 p-3 rounded bg-gray-100"
                      onClick={() => {
                        setIsNegative((prev) => !prev);
                      }}
                    >
                      {isNegative ? "-" : "+"}
                    </button>
                    <div className="border-b-2 border-gray-300 w-10 text-center inline-flex items-center justify-center">
                      {input[0]}
                    </div>
                    <div className="border-b-2 border-gray-300 w-10 text-center inline-flex items-center justify-center">
                      {input[1]}
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((p: number) => (
                      <>
                        {p === 0 ? <div /> : null}
                        <button
                          className="bg-gray-100 text-gray-900 p-3 text-2xl rounded block disabled:opacity-30"
                          key={p}
                          onClick={() => enterNumber(p)}
                          disabled={isNumberDisabled()}
                        >
                          {p}
                        </button>
                      </>
                    ))}

                    <button
                      className="bg-gray-100 text-gray-900 p-3 text-2xl rounded block"
                      onClick={() => setInput([null, null])}
                    >
                      X
                    </button>
                  </div>

                  <div className="mt-4 flex gap-2 justify-between">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50"
                      onClick={() => confirm()}
                    >
                      OK
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default EnterLoserPoint;
