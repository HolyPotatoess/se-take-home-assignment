"use client";

import useOrderSystem from "./hooks/useOrderSystem";
import Controls from "./components/Controls";
import PendingList from "./components/PendingList";
import CompletedList from "./components/CompletedList";
import BotStatus from "./components/BotStatus";

export default function Home() {
  const {
    pending,
    completed,
    bots,
    addOrder,
    addBot,
    removeBot
  } = useOrderSystem();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">McDonald's Order System</h1>

      <Controls
        addOrder={addOrder}
        addBot={addBot}
        removeBot={removeBot}
      />

      <div className="grid md:grid-cols-3 gap-4">
        <PendingList pending={pending} />
        <BotStatus bots={bots} />
        <CompletedList completed={completed} />
      </div>
    </main>
  );
}
