import { useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../api/client";
import { useAuth, getToken } from "../auth/auth";

const WS_ENDPOINT = `${API_BASE_URL}/ws`;

export const useNotifications = (onNotification) => {
  const clientRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const token = getToken();

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        // Subscribe to user-specific notifications
        client.subscribe("/user/queue/notifications", (message) => {
          const notification = JSON.parse(message.body);
          if (onNotification) {
            onNotification(notification);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [onNotification, currentUser]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
    }
  }, []);

  return { disconnect };
};
