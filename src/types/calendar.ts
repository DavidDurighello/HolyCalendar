export interface VacationDay {
  date: Date;
  morning: boolean;
  afternoon: boolean;
}

export interface VacationBalance {
  totalDays: number;
  totalHours: number;
  usedDays: number;
  usedHours: number;
}