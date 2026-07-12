import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import { z } from 'zod';

/**
 * Reusable utility helpers for TransitOps
 */

/**
 * Merges Tailwind classes dynamically without conflicts (clsx + tailwind-merge)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format numerical amounts to localized currency strings
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '$0.00';
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format dates using dayjs helper
 */
export function formatDate(date, formatStr = 'MMM DD, YYYY') {
  if (!date) return '-';
  return dayjs(date).format(formatStr);
}

/**
 * Format timestamps with detailed time components
 */
export function formatDateTime(date, formatStr = 'MMM DD, YYYY hh:mm A') {
  if (!date) return '-';
  return dayjs(date).format(formatStr);
}

/**
 * Basic Validation schemas using Zod for future use
 */
export const schemas = {
  login: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
  }),
  vehicle: z.object({
    plateNumber: z.string().min(2, 'Plate number is required'),
    model: z.string().min(1, 'Model is required'),
    type: z.string().min(1, 'Vehicle type is required'),
    capacity: z.number().min(1, 'Capacity must be greater than 0'),
  }),
};
