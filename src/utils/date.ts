export const dateToHoursAndMinutes = (date: Date | string): string => {
  if (typeof date == 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleString('no-NB', { minute: '2-digit', hour: '2-digit' });
};
