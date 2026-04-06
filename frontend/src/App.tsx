import React, { useEffect, useState } from 'react';
import { CommandCenter } from './components/CommandCenter';
import { ThoughtTrace } from './components/ThoughtTrace';
import { SavingsScorecard } from './components/SavingsScorecard';
import { getInvestigations, triggerAlert } from './services/api';
import { Shield } from 'lucide-react';

function App() {
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [selectedInv, setSelectedInv] = useState<any | null>(null);

  const fetchInvestigations = async () => {
    try {
      const data = await getInvestigations();
      setInvestigations(data);
      if (selectedInv) {
        const updated = data.find((inv: any) => inv.id === selectedInv.id);
        if (updated) setSelectedInv(updated);
      }
    } catch (e) {
      console.error("Failed to fetch investigations", e);
    }
  };

  useEffect(() => {
    fetchInvestigations();
    const interval = setInterval(fetchInvestigations, 5000); // Polling for real-time feel
    return () => clearInterval(interval);
  }, [selectedInv]);

  const handleSimulateAlert = async () => {
    try {
      await triggerAlert({
        account_id: "acc-123",
        service: "Cloud SQL",
        cost: 1500.00,
        threshold_exceeded: true,
        description: "Unusual IOPS spike detected in us-central1"
      });
      fetchInvestigations();
    } catch (e) {
      console.error("Simulation failed", e);
    }
  };

  const totalSavings = investigations.reduce((acc, inv) => acc + (inv.savings_score || 0), 0);
  const active = investigations.filter(i => i.status !== 'resolved').length;
  const resolved = investigations.filter(i => i.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      <header className="mb-8 flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Shield className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Argus AI
            </h1>
            <p className="text-sm text-gray-400">Agentic FinOps Platform</p>
          </div>
        </div>
        <button 
          onClick={handleSimulateAlert}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors shadow-lg shadow-red-600/20"
        >
          Simulate Billing Alert
        </button>
      </header>

      <main className="max-w-7xl mx-auto">
        <SavingsScorecard 
          totalSavings={totalSavings}
          activeInvestigations={active}
          resolvedIncidents={resolved}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
          <div className="lg:col-span-1 border border-gray-800 rounded-lg overflow-hidden flex flex-col">
            <CommandCenter 
              investigations={investigations}
              onSelect={setSelectedInv}
              selectedId={selectedInv?.id}
            />
          </div>
          
          <div className="lg:col-span-2 border border-gray-800 rounded-lg overflow-hidden flex flex-col">
            <ThoughtTrace traces={selectedInv?.thought_traces || []} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
