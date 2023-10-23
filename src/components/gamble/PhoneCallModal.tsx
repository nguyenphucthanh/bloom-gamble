import React, { FC, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import IconPhoneDeclined from "../icons/phone-decline"
import IconPhoneAccepted from "../icons/phone-accepted"

export interface IPhoneCallModalProps {
  title: string
  isOpen: boolean
  closeModal: () => void
}
const PhoneCallModal: FC<IPhoneCallModalProps> = ({
  title,
  isOpen,
  closeModal,
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
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black bg-opacity-80 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  {title}
                </Dialog.Title>
                <div className="flex flex-row gap-2 items-center justify-between">
                  <p className="text-sm text-white">Calling...</p>
                  <div className="mt-4 flex flex-row gap-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      title="Accept"
                      className="relative bg-red-500 text-white p-3 h-12 w-12 inline-flex items-center justify-center rounded-full"
                    >
                      <IconPhoneDeclined />
                    </button>
                    <div className="relative flex">
                      <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-300"></div>
                      <button
                        type="button"
                        onClick={closeModal}
                        title="Accept"
                        className="relative bg-lime-500 text-white p-3 h-12 w-12 inline-flex items-center justify-center rounded-full"
                      >
                        <IconPhoneAccepted />
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
export default PhoneCallModal
