/**
 * Date Utilities - TEC Assistant Domain
 */

export const getStartOfDay = (date: Date = new Date()): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const getEndOfDay = (date: Date = new Date()): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

export const isToday = (date: Date): boolean => {
  const today = getStartOfDay(new Date());
  const checkDate = getStartOfDay(date);
  return today.getTime() === checkDate.getTime();
};

export const isYesterday = (date: Date): boolean => {
  const yesterday = getStartOfDay(new Date());
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = getStartOfDay(date);
  return yesterday.getTime() === checkDate.getTime();
};

export const daysBetween = (date1: Date, date2: Date): number => {
  const start = getStartOfDay(date1);
  const end = getStartOfDay(date2);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
