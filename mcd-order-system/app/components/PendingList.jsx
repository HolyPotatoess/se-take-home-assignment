export default function PendingList({ pending }) {
  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold mb-2">Pending Orders</h2>

      {pending.length === 0 && <p>No pending orders</p>}

      {pending.map(order => (
        <div
          key={order.instanceId}
          className={`p-2 mb-1 rounded ${
            order.type === "VIP"
              ? "bg-yellow-100 border-l-4 border-yellow-500 text-black"
              : "bg-gray-100 text-black"
          }`}
        >
          [{order.type}] Order #{order.id}
        </div>
      ))}
    </div>
  );
}
