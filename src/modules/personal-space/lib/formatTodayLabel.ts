export function formatTodayLabel(currentDate: Date): string {
  const label = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(currentDate);

  return label.charAt(0).toUpperCase() + label.slice(1);
}
