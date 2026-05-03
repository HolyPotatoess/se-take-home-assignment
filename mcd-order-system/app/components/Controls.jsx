export default function Controls({ addOrder, addBot, removeBot }) {
  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={() => addOrder("NORMAL")}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        New Normal Order
      </button>

      <button
        onClick={() => addOrder("VIP")}
        className="px-4 py-2 bg-yellow-500 text-black rounded"
      >
        New VIP Order
      </button>

      <button
        onClick={addBot}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        + Bot
      </button>

      <button
        onClick={removeBot}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        - Bot
      </button>
    </div>
  );
}
