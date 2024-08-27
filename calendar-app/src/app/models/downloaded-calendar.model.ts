import { Calendar } from './calendar.model';

export type DownloadedCalendar = Pick<
  Calendar,
  'name' | 'description' | 'systemConfig' | 'gameEvents'
>;
