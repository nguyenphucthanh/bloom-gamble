import React, { FC, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RefreshCw } from "lucide-react";

export interface IConfirmEndGameModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  closeModal: () => void;
  confirm: () => void;
}
const ConfirmEndGameModal: FC<IConfirmEndGameModalProps> = ({
  isOpen,
  closeModal,
  confirm,
  isLoading,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                  Xác nhận end game
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Có chắc không đó pa? End là End luôn đó.
                  </p>
                </div>

                <div className="mt-4 flex justify-between gap-2">
                  <button
                    type="button"
                    className="inline-flex justify-center gap-2 rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                    disabled={isLoading}
                  >
                    {isLoading ? <RefreshCw className="animate-spin" /> : null}
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center gap-2 rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={confirm}
                    disabled={isLoading}
                  >
                    {isLoading ? <RefreshCw className="animate-spin" /> : null}
                    END!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default ConfirmEndGameModal;
