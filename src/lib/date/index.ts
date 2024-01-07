import { format } from "date-fns";

export const DateFormat = {
  Short: "M/dd/yyyy",
  Long: "MMMM d, yyyy",
  Time: "h:mm a",
  DateTime: "M/dd/yyyy h:mm a",
  Iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

export type DateFormat = (typeof DateFormat)[keyof typeof DateFormat];

export function formatDate(
  date: Date | string | number,
  dateFormat: DateFormat = DateFormat.Short,
): string {
  const d = new Date(date);
  return format(d, dateFormat);
}
