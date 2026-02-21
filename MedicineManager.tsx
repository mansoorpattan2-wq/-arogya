import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pill, Plus, Trash2, Clock, AlertCircle, CheckCircle2, ChevronRight, RefreshCw, Music, Volume2 } from 'lucide-react';

const REMINDER_SOUNDS = [
  { id: 'gentle-chime', label: 'Gentle Chime', icon: '🔔' },
  { id: 'morning-birds', label: 'Morning Birds', icon: '🐦' },
  { id: 'soft-piano', label: 'Soft Piano', icon: '🎹' },
  { id: 'zen-bowl', label: 'Zen Bowl', icon: '🥣' },
  { id: 'nature-stream', label: 'Nature Stream', icon: '🌊' },
];

export default function MedicineManager() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    time: '08:00 AM',
    total_tablets: 30,
    reminder_sound: 'gentle-chime'
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const res = await fetch('/api/medicines');
    const data = await res.json();
    setMedicines(data);
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/medicines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMed)
    });
    setShowAddModal(false);
    setNewMed({
      name: '',
      dosage: '',
      frequency: 'Daily',
      time: '08:00 AM',
      total_tablets: 30,
      reminder_sound: 'gentle-chime'
    });
    fetchMedicines();
  };

  const handleTakeMedicine = async (id: number) => {
    await fetch(`/api/medicines/${id}/take`, { method: 'POST' });
    fetchMedicines();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
    fetchMedicines();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Medicine Manager</h1>
          <p className="text-slate-500 font-medium">Precision tracking for your health regimen.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} />
          Add Prescription
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {medicines.map((med) => (
          <motion.div 
            layout
            key={med.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500 overflow-hidden group"
          >
            <div className="p-8 flex flex-col lg:flex-row gap-10">
              {/* Info Section */}
              <div className="flex-1 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-6">
                    <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-inner">
                      <Pill size={36} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-1">{med.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">{med.dosage}</span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">{med.frequency}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(med.id)}
                    className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scheduled</span>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Clock size={16} className="text-emerald-500" />
                      {med.time}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reminder Sound</span>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Volume2 size={16} className="text-blue-500" />
                      {REMINDER_SOUNDS.find(s => s.id === med.reminder_sound)?.label || 'Default'}
                    </div>
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl border flex flex-col gap-1",
                    med.remaining_tablets < 5 
                      ? "bg-rose-50 border-rose-100 text-rose-600" 
                      : "bg-emerald-50 border-emerald-100 text-emerald-600"
                  )}>
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Inventory</span>
                    <div className="flex items-center gap-2 font-black">
                      <AlertCircle size={16} />
                      {med.remaining_tablets} Tablets Left
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleTakeMedicine(med.id)}
                  disabled={med.remaining_tablets === 0}
                  className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-200"
                >
                  <CheckCircle2 size={24} />
                  Confirm Intake
                </button>
              </div>

              {/* Tablet Sheet Visualization */}
              <div className="w-full lg:w-80 space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Visual Inventory</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black text-emerald-600">{Math.round((med.remaining_tablets / med.total_tablets) * 100)}%</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                  <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: med.total_tablets }).map((_, i) => (
                      <div 
                        key={i}
                        className={cn(
                          "aspect-square rounded-full border-2 transition-all duration-700",
                          i < med.remaining_tablets 
                            ? "bg-white border-emerald-200 shadow-[0_2px_10px_rgba(16,185,129,0.1)] scale-100" 
                            : "bg-slate-200 border-transparent opacity-20 scale-90"
                        )}
                      >
                        {i < med.remaining_tablets && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {med.remaining_tablets < 5 && (
                  <motion.div 
                    animate={{ x: [0, -2, 2, -2, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-2xl border border-rose-100"
                  >
                    <RefreshCw size={20} className="animate-spin-slow" />
                    <span className="text-sm font-black">Low Stock Alert: Order Refill</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {medicines.length === 0 && (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mx-auto mb-8">
              <Pill size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">No Active Prescriptions</h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Add your medications to start your journey towards better health management.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-2xl shadow-emerald-200 hover:scale-105 transition-transform"
            >
              Add Your First Pill
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
              <h2 className="text-3xl font-black text-slate-900 mb-8">New Prescription</h2>
              <form onSubmit={handleAddMedicine} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Medicine Name</label>
                    <input 
                      required
                      type="text"
                      value={newMed.name}
                      onChange={e => setNewMed({...newMed, name: e.target.value})}
                      placeholder="e.g. Metformin"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Dosage</label>
                    <input 
                      required
                      type="text"
                      value={newMed.dosage}
                      onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                      placeholder="e.g. 500mg"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Reminder Time</label>
                    <input 
                      required
                      type="time"
                      value={newMed.time}
                      onChange={e => setNewMed({...newMed, time: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Total Tablets</label>
                    <input 
                      required
                      type="number"
                      value={newMed.total_tablets}
                      onChange={e => setNewMed({...newMed, total_tablets: parseInt(e.target.value)})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Reminder Sound</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {REMINDER_SOUNDS.map(sound => (
                      <button
                        key={sound.id}
                        type="button"
                        onClick={() => setNewMed({...newMed, reminder_sound: sound.id})}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                          newMed.reminder_sound === sound.id 
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                            : "bg-slate-50 border-slate-100 text-slate-400 hover:border-emerald-200"
                        )}
                      >
                        <span className="text-2xl">{sound.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-wider">{sound.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-colors"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                  >
                    Confirm Prescription
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
