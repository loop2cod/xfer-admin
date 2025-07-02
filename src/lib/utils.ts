import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'UTC', // Explicitly use UTC timezone for consistent display
  };

  const mergedOptions = { ...defaultOptions, ...options };

  // Create date object from UTC timestamp string
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  // Format in UTC timezone to show the actual UTC time
  return date.toLocaleString('en-US', mergedOptions);
};
