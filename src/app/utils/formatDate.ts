const timeUnits: { [key: string]: string } = {
  seconds: "s",
  minutes: "m",
  hours: "h",
  days: "d",
  months: "mon",
  years: "y",
};

export function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}${timeUnits.years}`;
  if (months > 0) return `${months}${timeUnits.months}`;
  if (days > 0) return `${days}${timeUnits.days}`;
  if (hours > 0) return `${hours}${timeUnits.hours}`;
  if (minutes > 0) return `${minutes}${timeUnits.minutes}`;
  if (seconds > 0) return `${seconds}${timeUnits.seconds}`;

  return "just now";
}
