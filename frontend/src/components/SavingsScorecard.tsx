import React from 'react';
import { TrendingDown, DollarSign, Zap } from 'lucide-react';

interface Props {
  totalSavings: number;
  activeInvestigations: number;
  resolvedIncidents: number;
}

export const SavingsScorecard: React.FC<Props> = ({ 
  totalSavings, 
  activeInvestigations, 
  resolvedIncidents 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 flex items-center">
        <div className="p-3 bg-green-900/30 rounded-full mr-4">
          <DollarSign className="text-green-400" size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-1">Total Estimated ROI</p>
          <h3 className="text-2xl font-bold text-white">${totalSavings.toFixed(2)}</h3>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 flex items-center">
        <div className="p-3 bg-blue-900/30 rounded-full mr-4">
          <ActivityIcon className="text-blue-400" size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-1">Active Investigations</p>
          <h3 className="text-2xl font-bold text-white">{activeInvestigations}</h3>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 flex items-center">
        <div className="p-3 bg-purple-900/30 rounded-full mr-4">
          <Zap className="text-purple-400" size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-1">Resolved Incidents</p>
          <h3 className="text-2xl font-bold text-white">{resolvedIncidents}</h3>
        </div>
      </div>
    </div>
  );
};

// Quick mock of ActivityIcon since Activity was used
const ActivityIcon = ({className, size}: any) => <TrendingDown className={className} size={size} />
