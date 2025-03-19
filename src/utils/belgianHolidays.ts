export const getBelgianHolidays = (year: number): Date[] => {
  return [
    new Date(year, 0, 1),  // Nouvel An
    new Date(year, 4, 1),  // Fête du Travail
    new Date(year, 6, 21), // Fête Nationale
    new Date(year, 7, 15), // Assomption
    new Date(year, 10, 1), // Toussaint
    new Date(year, 10, 11),// Armistice
    new Date(year, 11, 25) // Noël
  ];
};

export const isHoliday = (date: Date): boolean => {
  const holidays = getBelgianHolidays(date.getFullYear());
  return holidays.some(holiday => 
    holiday.getDate() === date.getDate() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getFullYear() === date.getFullYear()
  );
};

export const isWorkingDay = (date: Date): boolean => {
  const day = date.getDay();
  return day >= 1 && day <= 5 && !isHoliday(date);
};

export const getMorningHours = (): number => {
  return 4;
};

export const getAfternoonHours = (date: Date): number => {
  return date.getDay() === 5 ? 3 : 4; // 3 heures le vendredi après-midi, 4 heures les autres jours
};

export const getWorkingHours = (date: Date): number => {
  return getMorningHours() + getAfternoonHours(date);
};