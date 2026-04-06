import React from 'react';
import { BrainCircuit, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface Trace {
  agent_name: string;
  thought: string;
  timestamp: string;
}

interface Props {
  traces: Trace[];
}

export const ThoughtTrace: React.FC<Props> = ({ traces }) => {
  const getIcon = (agent: string) => {
    switch (agent) {
      case 'AuditorAgent': return <ShieldAlert size={18} className="text-yellow-400" />;
      case 'PolicyAgent': return <CheckCircle2 size={18} className="text-green-400" />;
      case 'ExecutionAgent': return <Cpu size={18} className="text-red-400" />;
      default: return <BrainCircuit size={18} className="text-purple-400" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-full">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <BrainCircuit className="text-purple-400" /> Agent Thought Trace
      </h2>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-600 before:to-transparent">
        {traces.map((trace, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-800 bg-gray-700 text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              {getIcon(trace.agent_name)}
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-750 p-4 rounded border border-gray-700 shadow">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-slate-200">{trace.agent_name}</div>
                <time className="text-xs font-medium text-slate-500">
                  {new Date(trace.timestamp).toLocaleTimeString()}
                </time>
              </div>
              <div className="text-slate-400 text-sm">
                {trace.thought}
              </div>
            </div>
          </div>
        ))}
        {traces.length === 0 && (
          <div className="text-center text-gray-500 relative z-10 bg-gray-800 py-4">
            Select an investigation to view agent reasoning.
          </div>
        )}
      </div>
    </div>
  );
};
