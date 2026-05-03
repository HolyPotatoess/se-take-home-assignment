"use client";
import { useState, useEffect } from "react";

let nextId = 1;

export default function useOrderSystem() {
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [bots, setBots] = useState([]);

  function insertWithPriority(order, list) {
    if (order.type === "VIP") {
      const idx = list.findIndex((o) => o.type !== "VIP");
      if (idx === -1) return [...list, order];
      return [...list.slice(0, idx), order, ...list.slice(idx)];
    }
    return [...list, order];
  }

  function addOrder(type) {
    const order = {
      id: nextId++,
      type,
      status: "PENDING",
    };

    setPending((prev) => insertWithPriority(order, prev));
  }

  function processOrder(botId, order) {
    const timer = setTimeout(() => {
      setCompleted((prev) => {
        if (prev.some((o) => o.id === order.id)) return prev;
        return [...prev, order];
      });

      setBots((prev) =>
        prev.map((bot) =>
          bot.id === botId
            ? { ...bot, status: "IDLE", currentOrder: null, timer: null }
            : bot,
        ),
      );
    }, 10000);

    setBots((prev) =>
      prev.map((bot) =>
        bot.id === botId
          ? { ...bot, status: "BUSY", currentOrder: order, timer }
          : bot,
      ),
    );
  }

  function assignOrder(bot) {
    setPending((prev) => {
      if (prev.length === 0) return prev;

      const [order, ...rest] = prev;
      processOrder(bot.id, order);
      return rest;
    });
  }

  useEffect(() => {
    const idleBot = bots.find((b) => b.status === "IDLE");

    if (!idleBot || pending.length === 0) return;

    assignOrder(idleBot);
  }, [pending, bots]);

  function addBot() {
    setBots((prev) => [
      ...prev,
      {
        id: Date.now(),
        status: "IDLE",
        currentOrder: null,
        timer: null,
      },
    ]);
  }

  function removeBot() {
    setBots((prevBots) => {
      if (prevBots.length === 0) return prevBots;

      const lastBot = prevBots[prevBots.length - 1];

      // If BUSY → recover order back to pending
      if (lastBot.status === "BUSY" && lastBot.currentOrder) {
        if (lastBot.timer) {
          clearTimeout(lastBot.timer);
        }

        setPending((prevPending) =>
          insertWithPriority(lastBot.currentOrder, prevPending),
        );
      }

      // Remove bot (always allowed now)
      return prevBots.slice(0, -1);
    });
  }

  return {
    pending,
    completed,
    bots,
    addOrder,
    addBot,
    removeBot,
  };
}
