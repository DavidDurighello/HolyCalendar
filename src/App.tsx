import { useState } from 'react';
import { Calendar } from './components/Calendar';
import { VacationBalanceComponent } from './components/VacationBalance';
import { VacationDay, VacationBalance } from './types/calendar';
import { getMorningHours, getAfternoonHours } from './utils/belgianHolidays';

function App() {
  const [balance, setBalance] = useState<VacationBalance>({
    totalDays: 20,
    totalHours: 20 * 8,
    usedDays: 0,
    usedHours: 0
  });

  const handleVacationUpdate = (vacations: VacationDay[]) => {
    let totalHours = 0;
    
    vacations.forEach(vacation => {
      if (vacation.morning) totalHours += getMorningHours();
      if (vacation.afternoon) totalHours += getAfternoonHours(vacation.date);
    });

    setBalance({
      ...balance,
      usedDays: totalHours / 8,
      usedHours: totalHours
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">
          Gestion des Congés
        </h1>
        
        <VacationBalanceComponent
          balance={balance}
          onBalanceUpdate={setBalance}
        />
        
        <Calendar
          vacationBalance={balance}
          onVacationUpdate={handleVacationUpdate}
        />
      </div>
    </div>
  );
}

export default App;