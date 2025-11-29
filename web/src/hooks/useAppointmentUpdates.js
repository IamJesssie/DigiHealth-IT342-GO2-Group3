import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs/esm6';
import SockJS from 'sockjs-client';

const WS_ENDPOINT = '/ws';

export const useAppointmentUpdates = (onUpdate) => {
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/appointments', (message) => {
          const appointment = JSON.parse(message.body);
          if (onUpdate) {
            onUpdate(appointment);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [onUpdate]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
    }
  }, []);

  return { disconnect };
};
