import { format } from 'date-fns';

export const DATE_UI = 'dd.MM.yyyy';
export const DATETIME_UI = 'dd.MM.yyyy hh:mm';

export class DateService {
  public static formatDatetimeUI = (date: Date) => {
    return format(date, DATETIME_UI);
  };

  public static formatDateUI = (date: Date) => {
    return format(date, DATE_UI);
  };
}
