import React, { FC, Fragment, useCallback, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";

export interface IEnterPointProps {
  playerName: string;
  value: number | null;
  onChange: (value: number | null) => void;
}

const combineToPoint = (
  isNegative: boolean,
  input: (number | null)[]
): number | null => {
  const str = `${isNegative ? "-" : ""}${input.join("")}`;
  const n = parseInt(str, 10);
  return !isNaN(n) ? n : null;
};

const EnterPoint: FC<IEnterPointProps> = ({ playerName, value, onChange }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [isNegative, setIsNegative] = React.useState<boolean>(true);
  const [input, setInput] = React.useState<(number | null)[]>([null, null]);

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

  const confirm = useCallback(() => {
    onChange(numberValue);
    setOpen(false);
  }, [onChange, numberValue]);

  const enterNumber = useCallback(
    (number: number) => {
      setInput((prev) => {
        if (prev[0] === null) {
          if (number === 0) {
            onChange(0);
            setOpen(false);
          }
          return [number, null];
        } else if (prev[1] === null) {
          const v = combineToPoint(isNegative, [prev[0], number]);
          onChange(v);
          setOpen(false);
          return [prev[0], number];
        } else {
          return prev;
        }
      });
    },
    [onChange, isNegative]
  );

  const isNumberDisabled = useCallback(() => {
    if (input?.[0] === 0) {
      return true;
    }
    return false;
  }, [input]);

  return (
    <div>
      <button
        className="bg-gray-100 text-gray-900 rounded text-sm p-3 px-1 block w-10  "
        onClick={() => {
          setIsNegative(true);
          setOpen(true);
        }}
      >
        {value ?? "-"}
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
                    Nhập điểm {playerName}
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

export default EnterPoint;
