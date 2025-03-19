import React, { useState } from 'react';
import { format, startOfYear, endOfYear, eachMonthOfInterval, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { VacationDay, VacationBalance } from '../types/calendar';
import { isWorkingDay, getMorningHours, getAfternoonHours } from '../utils/belgianHolidays';

interface CalendarProps {
  vacationBalance: VacationBalance;
  onVacationUpdate: (vacations: VacationDay[]) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ onVacationUpdate }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [vacations, setVacations] = useState<VacationDay[]>([]);

  const months = eachMonthOfInterval({
    start: startOfYear(new Date(selectedYear, 0)),
    end: endOfYear(new Date(selectedYear, 0))
  });

  const toggleVacation = (date: Date, period: 'morning' | 'afternoon') => {
    const existingVacation = vacations.find(v => 
      v.date.getDate() === date.getDate() &&
      v.date.getMonth() === date.getMonth() &&
      v.date.getFullYear() === date.getFullYear()
    );

    let updatedVacations: VacationDay[];

    if (existingVacation) {
      if (period === 'morning') {
        existingVacation.morning = !existingVacation.morning;
      } else {
        existingVacation.afternoon = !existingVacation.afternoon;
      }

      if (!existingVacation.morning && !existingVacation.afternoon) {
        updatedVacations = vacations.filter(v => v !== existingVacation);
      } else {
        updatedVacations = [...vacations];
      }
    } else {
      const newVacation: VacationDay = {
        date,
        morning: period === 'morning',
        afternoon: period === 'afternoon'
      };
      updatedVacations = [...vacations, newVacation];
    }

    setVacations(updatedVacations);
    onVacationUpdate(updatedVacations);
  };

  const renderDay = (date: Date) => {
    if (!isWorkingDay(date)) {
      return (
        <div className="min-h-[4.5rem] sm:min-h-[5rem] md:min-h-[5.5rem] lg:min-h-[6rem] bg-gray-100 p-1">
          <span className="text-gray-400 text-xs sm:text-sm">{format(date, 'd')}</span>
        </div>
      );
    }

    const vacation = vacations.find(v => 
      v.date.getDate() === date.getDate() &&
      v.date.getMonth() === date.getMonth() &&
      v.date.getFullYear() === date.getFullYear()
    );

    const morningHours = getMorningHours();
    const afternoonHours = getAfternoonHours(date);

    return (
      <div className="min-h-[4.5rem] sm:min-h-[5rem] md:min-h-[5.5rem] lg:min-h-[6rem] border p-1">
        <div className="text-xs sm:text-sm">{format(date, 'd')}</div>
        <div className="flex flex-col gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
          <button
            className={`text-[0.65rem] sm:text-xs p-0.5 sm:p-1 rounded ${
              vacation?.morning ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
            onClick={() => toggleVacation(date, 'morning')}
          >
            {window.innerWidth < 640 ? `M (${morningHours}h)` : `Matin (${morningHours}h)`}
          </button>
          <button
            className={`text-[0.65rem] sm:text-xs p-0.5 sm:p-1 rounded ${
              vacation?.afternoon ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
            onClick={() => toggleVacation(date, 'afternoon')}
          >
            {window.innerWidth < 640 ? `AM (${afternoonHours}h)` : `Après-midi (${afternoonHours}h)`}
          </button>
          {(vacation?.morning || vacation?.afternoon) && (
            <div className="text-[0.65rem] sm:text-xs mt-0.5 sm:mt-1 text-blue-600">
              {(vacation.morning ? morningHours : 0) + (vacation.afternoon ? afternoonHours : 0)}h
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">Calendrier {selectedYear}</h2>
        <div className="flex gap-2 sm:gap-4">
          <button
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded text-sm sm:text-base"
            onClick={() => setSelectedYear(selectedYear - 1)}
          >
            ←
          </button>
          <button
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded text-sm sm:text-base"
            onClick={() => setSelectedYear(selectedYear + 1)}
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
        {months.map(month => (
          <div key={month.toString()} className="border rounded-lg overflow-hidden">
            <div className="bg-blue-500 text-white p-1.5 sm:p-2">
              <h3 className="text-base sm:text-lg font-semibold">
                {format(month, 'MMMM yyyy', { locale: fr })}
              </h3>
            </div>
            <div className="grid grid-cols-7 text-center text-xs sm:text-sm py-0.5 sm:py-1">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="font-semibold">
                  {window.innerWidth < 640 ? day.charAt(0) : day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
            {/* Jours vides pour aligner correctement le début du mois */}
            {Array.from({ length: startOfMonth(month).getDay() -1 }).map((_, i) => (
              <div key={`empty-${i}`} className="opacity-0">.</div>
            ))}

            {/* Jours du mois */}
            {eachDayOfInterval({
              start: startOfMonth(month),
              end: endOfMonth(month),
            }).map((date) => (
              <div key={date.toString()}>
                {renderDay(date)}
              </div>
            ))}
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};