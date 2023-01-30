import { format, intervalToDuration } from 'date-fns';

export const DATE_UI = 'dd.MM.yyyy';
export const DATETIME_UI = 'dd.MM.yyyy hh:mm';

export class DateService {
  public static formatDatetimeUI = (date: Date) => {
    return format(date, DATETIME_UI);
  };

  public static formatDateUI = (date: Date) => {
    return format(date, DATE_UI);
  };

  public static secondsToDurationString = (seconds: number = 0) => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

    const zeroPad = (num?: number) => String(num).padStart(2, '0');

    return `${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`;
  };
}
