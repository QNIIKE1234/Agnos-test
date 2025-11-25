"use client";
import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        setLastMessage(JSON.parse(event.data));
      } catch {
        setLastMessage(event.data);
      }
    };

    return () => socket.close();
  }, [url]);

  const send = (data: any) => {
    socketRef.current?.send(JSON.stringify(data));
  };

  return { lastMessage, send };
}
