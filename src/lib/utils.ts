import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const mergedOptions = { ...defaultOptions, ...options };
  
  // Create date object - if string is UTC, it will be converted to local time when formatted
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  // Use the browser's local time zone for conversion
  return date.toLocaleString('en-US', mergedOptions);
};
