import React, { createContext, useContext, useMemo, useState } from 'react';
import { useLogger } from './Logger';

export enum EventType {
  BTN_CLICKED,
  CHAT_RECEIVED,
}

interface Observer {
  eventType: EventType;
  callback: (payload: any) => void;
}

interface Subject {
  eventType: EventType;
  payload: any;
}

interface EventBusActions {
  subscribe: (o: Observer) => void;
  notify: ({ eventType, payload }: Subject) => void;
}

const EventBusContext = createContext<EventBusActions | undefined>(undefined);

export const EventBus: React.FC = ({ children }) => {
  const [observers, setObservers] = useState<Observer[]>([]);
  const log = useLogger();

  const subscribe = useMemo(
    () => (o: Observer) => {
      setObservers([...observers, o]);
      log?.debug(`An observer has subscribed to event type ${o.eventType}`);
    },
    [observers],
  );

  const notify = useMemo(
    () =>
      ({ eventType, payload }: Subject) => {
        log?.debug(`Event type of ${eventType} has been triggered`);
        observers.filter((o) => o.eventType === eventType).forEach((o) => o.callback(payload));
      },
    [observers],
  );

  return <EventBusContext.Provider value={{ subscribe, notify }}>{children}</EventBusContext.Provider>;
};

export const useEvents = () => {
  const ctx = useContext(EventBusContext);

  if (!ctx) {
    throw new Error('useEvents must be used inside EventBusContext');
  }

  return ctx;
};
