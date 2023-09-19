import { format } from "date-fns";

export function formatDate(
  date: Date | string | number,
  dateFormat = "M/dd/yyyy"
): string {
  const d = new Date(date);
  return format(d, dateFormat);
}
