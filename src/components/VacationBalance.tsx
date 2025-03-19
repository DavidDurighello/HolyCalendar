import React from 'react';
import { VacationBalance } from '../types/calendar';

interface VacationBalanceProps {
  balance: VacationBalance;
  onBalanceUpdate: (balance: VacationBalance) => void;
}

export const VacationBalanceComponent: React.FC<VacationBalanceProps> = ({ balance, onBalanceUpdate }) => {
  const handleTotalUpdate = (hours: number) => {
    onBalanceUpdate({
      ...balance,
      totalHours: hours,
      totalDays: hours / 8
    });
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Solde des congés</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heures de congés totales
          </label>
          <input
            type="number"
            value={balance.totalHours}
            onChange={(e) => handleTotalUpdate(Number(e.target.value))}
            className="w-full p-2 border rounded"
            step="0.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heures utilisées
          </label>
          <div className="p-2 bg-gray-100 rounded">
            <span className="block sm:inline">{balance.usedHours.toFixed(1)} heures</span>
            <span className="block sm:inline sm:ml-1">({balance.usedDays.toFixed(1)} jours)</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Solde restant
          </label>
          <div className="p-2 bg-gray-100 rounded">
            <span className="block sm:inline">{(balance.totalHours - balance.usedHours).toFixed(1)} heures</span>
            <span className="block sm:inline sm:ml-1">({(balance.totalDays - balance.usedDays).toFixed(1)} jours)</span>
          </div>
        </div>
      </div>
    </div>
  );
};