export default function BotStatus({ bots }) {
  return (
    <div className="p-4 border rounded ">
      <h2 className="font-bold mb-2">Bots</h2>

      {bots.length === 0 && <p>No bots available</p>}

      {bots.map(bot => (
        <div key={bot.id} className="p-2 mb-1 bg-gray-50 rounded text-black">
          <strong>Bot {bot.id}</strong> — {bot.status}

          {bot.currentOrder && (
            <span
              className={`ml-2 px-2 py-1 rounded text-sm ${
                bot.currentOrder.type === "VIP"
                  ? "bg-yellow-300 text-black"
                  : "bg-blue-300 text-black"
              }`}
            >
              [{bot.currentOrder.type}] Order #{bot.currentOrder.id}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
