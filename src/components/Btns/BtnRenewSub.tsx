export default function BtnRenewSub({ handleRenew }: { handleRenew: () => void }) {
  return (
    <button
      onClick={() => handleRenew()}
      className="bg-green-500 hover:bg-green-600 font-bold py-2 px-4 rounded w-full"
    >
      Renew Subscription
    </button>
  )
}