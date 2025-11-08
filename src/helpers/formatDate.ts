export function FormatDate(date: string | undefined) {
  if (date) {
    return new Date(date).toLocaleDateString();
  }
}
