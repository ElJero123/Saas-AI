import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

export default function BtnCancelSub({ handleCancel }: { handleCancel: () => void }) {
    return (
        <Popover className="w-full flex justify-center">
            <PopoverButton className="w-full mt-4 bg-red-500 text-white p-2 rounded-md hover:outline-1 hover:outline-red-500 hover:bg-transparent hover:text-red-500 duration-200">
                    Cancel Subscribe
            </PopoverButton>
            <PopoverPanel className="absolute z-10 w-80 p-4 mt-2 bg-black/95 border border-gray-200 rounded shadow-lg">
                <div className="text-center">
                    <p className="mb-4">Are you sure you want to cancel your subscription?</p>
                    <p className="mb-4 text-red-500 font-bold">You will lose access to premium features at the end of the current billing period.</p>
                    <button
                        className="hover:outline-1 hover:text-red-500 hover:bg-transparent hover:outline-red-500 p-2 bg-red-500 rounded-md btn-outline w-full"
                        onClick={() => handleCancel()}
                    >
                        Confirm Cancel
                    </button>
                </div>
            </PopoverPanel>
        </Popover>
    )
}