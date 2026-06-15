import { mundial2026Event, type PlatformEvent } from "../../../config/events/mundial-2026";

const REGISTERED_EVENTS: PlatformEvent[] = [mundial2026Event];

function isWithinEventWindow(event: PlatformEvent, now = new Date()): boolean {
  const start = new Date(`${event.startsAt}T00:00:00-04:00`);
  const end = new Date(`${event.endsAt}T23:59:59-04:00`);
  return now >= start && now <= end;
}

export function getActiveEvent(now = new Date()): PlatformEvent | null {
  return (
    REGISTERED_EVENTS.find((event) => event.active && isWithinEventWindow(event, now)) ?? null
  );
}

export function getFeaturedEvent(now = new Date()): PlatformEvent {
  return getActiveEvent(now) ?? mundial2026Event;
}
