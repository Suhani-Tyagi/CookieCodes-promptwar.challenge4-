import React, { useState } from 'react';
import StorylineSimulator from './StorylineSimulator.jsx';
import { 
  VolunteerDashboard, 
  OperationsDashboard, 
  SecurityDashboard, 
  MedicalDashboard, 
  AdminDashboard 
} from './RoleDashboards.jsx';

export default function ControlRoomView() {
  const [activeConsole, setActiveConsole] = useState('operations');

  const consoles = [
    { id: 'operations', label: 'Operations Command' },
    { id: 'security', label: 'Security Force' },
    { id: 'medical', label: 'First Aid & Medical' },
    { id: 'volunteer', label: 'Volunteer Duty' },
    { id: 'admin', label: 'System Diagnostics' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <StorylineSimulator />

      <div className="flex flex-wrap bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-1 gap-1 text-[10px] font-black w-fit">
        {consoles.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveConsole(c.id)}
            className={`px-4 py-2 rounded-lg transition-all uppercase tracking-wider ${
              activeConsole === c.id 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="transition-all duration-300">
        {activeConsole === 'operations' && <OperationsDashboard />}
        {activeConsole === 'security' && <SecurityDashboard />}
        {activeConsole === 'medical' && <MedicalDashboard />}
        {activeConsole === 'volunteer' && <VolunteerDashboard />}
        {activeConsole === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
}
