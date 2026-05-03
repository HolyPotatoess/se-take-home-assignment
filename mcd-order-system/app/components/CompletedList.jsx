export default function CompletedList({ completed }) {
  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold mb-2">Completed Orders</h2>

      {completed.length === 0 && <p>No completed orders</p>}

      {completed.map(order => (
        <div key={order.instanceId} className="p-2 mb-1 bg-green-100 rounded text-black">
          [{order.type}] Order #{order.id}
        </div>
      ))}
    </div>
  );
}
