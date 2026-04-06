import React from 'react';
import { Activity } from 'lucide-react';

interface Alert {
  service: string;
  cost: number;
  description: string;
}

interface Investigation {
  id: string;
  status: string;
  alert: Alert;
  created_at: string;
  savings_score: number;
}

interface Props {
  investigations: Investigation[];
  onSelect: (inv: Investigation) => void;
  selectedId?: string;
}

export const CommandCenter: React.FC<Props> = ({ investigations, onSelect, selectedId }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-full">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Activity className="text-blue-400" /> Command Center Feed
      </h2>
      <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
        {investigations.map((inv) => (
          <div 
            key={inv.id} 
            onClick={() => onSelect(inv)}
            className={`p-4 rounded-md border cursor-pointer transition-colors ${
              selectedId === inv.id 
                ? 'bg-gray-700 border-blue-500' 
                : 'bg-gray-750 border-gray-600 hover:bg-gray-700'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-blue-300">{inv.alert.service}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                inv.status === 'resolved' ? 'bg-green-900/50 text-green-400' :
                inv.status === 'in_progress' ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-gray-700 text-gray-300'
              }`}>
                {inv.status}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{inv.alert.description}</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Alert Cost: ${inv.alert.cost.toFixed(2)}</span>
              <span className="text-green-400 font-medium">Est. Savings: ${inv.savings_score.toFixed(2)}</span>
            </div>
          </div>
        ))}
        {investigations.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No active investigations
          </div>
        )}
      </div>
    </div>
  );
};
