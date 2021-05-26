import { EventColor } from 'calendar-utils';
export interface EventData {
  id?: string;
  title: string ;
  start: string;
  end?: string;
  color: EventColor ;
};
