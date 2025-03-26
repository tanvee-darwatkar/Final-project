import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format large numbers to k/m/b format (e.g., 1000 -> 1k)
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

// Generate a random integer between min and max (inclusive)
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Format a date to a human-readable string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// Convert CSV data to downloadable blob
export function convertToCSV(objArray: any[]): Blob {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';

  // Add headers
  const headers = Object.keys(array[0]);
  str += headers.join(',') + '\r\n';

  // Add data rows
  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (const index in headers) {
      if (line !== '') line += ',';
      let value = array[i][headers[index]];
      
      // Handle strings with commas by wrapping in quotes
      if (typeof value === 'string' && value.includes(',')) {
        value = `"${value}"`;
      }
      
      line += value;
    }
    str += line + '\r\n';
  }

  return new Blob([str], { type: 'text/csv;charset=utf-8;' });
}
