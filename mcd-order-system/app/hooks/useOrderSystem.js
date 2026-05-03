"use client";
import { useState, useEffect } from "react";

let nextId = 1;
let nextInstanceId = 1;

export default function useOrderSystem() {
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [bots, setBots] = useState([]);

  function insertWithPriority(order, list) {
    const isVIP = order.type === "VIP";

    const vip = list.filter((o) => o.type === "VIP");
    const normal = list.filter((o) => o.type !== "VIP");

    const insertByTime = (arr) => {
      const idx = arr.findIndex((o) => o.createdAt > order.createdAt);
      if (idx === -1) return [...arr, order];
      return [...arr.slice(0, idx), order, ...arr.slice(idx)];
    };

    if (isVIP) {
      const newVip = insertByTime(vip);
      return [...newVip, ...normal];
    } else {
      const newNormal = insertByTime(normal);
      return [...vip, ...newNormal];
    }
  }

  function addOrder(type) {
    const order = {
      id: nextId++,
      instanceId: nextInstanceId++,
      type,
      status: "PENDING",
      createdAt: Date.now(),
    };

    setPending((prev) => insertWithPriority(order, prev));
  }

  function processOrder(botId, order) {
    const timer = setTimeout(() => {
      setBots((currentBots) => {
        const bot = currentBots.find((b) => b.id === botId);

        if (!bot || bot.currentOrder?.id !== order.id) return currentBots;

        setCompleted((prev) =>
          prev.some((o) => o.id === order.id) ? prev : [...prev, order],
        );

        return currentBots.map((b) =>
          b.id === botId
            ? { ...b, status: "IDLE", currentOrder: null, timer: null }
            : b,
        );
      });
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
      if (!prevBots.length) return prevBots;

      const lastBot = prevBots[prevBots.length - 1];

      if (lastBot.status === "BUSY" && lastBot.currentOrder) {
        if (lastBot.timer) clearTimeout(lastBot.timer);

        const restoredOrder = {
          ...lastBot.currentOrder,
          createdAt: lastBot.currentOrder.createdAt || Date.now(),
        };

        setPending((prev) => {
          const filtered = prev.filter(
            (o) => o.instanceId !== restoredOrder.instanceId,
          );
          return insertWithPriority(restoredOrder, filtered);
        });
      }

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
