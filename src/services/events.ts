type EventHandler = (...args: any[]) => void;

const listeners: Record<string, EventHandler[]> = {};

export function on(event: string, handler: EventHandler) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(handler);
}

export function off(event: string, handler: EventHandler) {
  if (!listeners[event]) return;
  listeners[event] = listeners[event].filter((h) => h !== handler);
}

export function emit(event: string, ...args: any[]) {
  const handlers = listeners[event] || [];
  handlers.forEach((h) => {
    try {
      h(...args);
    } catch (e) {
      // swallow handler errors to avoid breaking the emitter
      // in a real app we'd log this to an internal logger
      // eslint-disable-next-line no-console
      console.error('Event handler error', e);
    }
  });
}
