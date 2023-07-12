import React, { FC, Fragment, useCallback, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

export interface IEnterPointProps {
  playerName: string;
  value: number | null;
  onChange: (value: number | null) => void;
}
const EnterPoint: FC<IEnterPointProps> = ({ playerName, value, onChange }) => {
  const [point, setPoint] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  useEffect(() => {
    setPoint(value);
  }, [value]);
  const confirm = useCallback(
    (point: number) => {
      setPoint(point);
      onChange(point);
      setOpen(false);
    },
    [onChange]
  );
  return (
    <div>
      <button
        className="bg-gray-100 text-gray-900 rounded text-lg p-3 block w-full"
        onClick={() => setOpen(true)}
      >
        {point || "-"}
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
                  <div className="mt-2 grid grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 26].map(
                      (p) => (
                        <button
                          className="bg-gray-100 text-gray-900 p-3 text-2xl rounded block"
                          key={p}
                          onClick={() => confirm(p)}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
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
