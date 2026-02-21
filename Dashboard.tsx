/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Pill, 
  Stethoscope, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Plus, 
  Bell,
  Settings,
  Menu,
  X,
  ChevronRight,
  Clock,
  MapPin,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Components
import Dashboard from './components/Dashboard';
import MedicineManager from './components/MedicineManager';
import DoctorDirectory from './components/DoctorDirectory';
import AppointmentBooking from './components/AppointmentBooking';
import PrescriptionVault from './components/PrescriptionVault';
import HealthAI from './components/HealthAI';

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/medicines', icon: Pill, label: 'Medicines' },
    { path: '/doctors', icon: Stethoscope, label: 'Doctors' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/prescriptions', icon: FileText, label: 'Vault' },
    { path: '/ai-assistant', icon: MessageSquare, label: 'Health AI' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white rounded-full shadow-lg border border-emerald-100 text-emerald-600"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-emerald-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Pill size={24} />
              </div>
              <h1 className="text-xl font-bold text-emerald-900 tracking-tight">Arogya Mantra</h1>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                      isActive 
                        ? "bg-emerald-50 text-emerald-600 font-medium" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
                    )}
                  >
                    <item.icon size={20} className={cn(
                      "transition-colors",
                      isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"
                    )} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-emerald-50">
            <div className="bg-emerald-50 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center">
                  <Bell size={16} className="text-emerald-700" />
                </div>
                <span className="text-sm font-semibold text-emerald-900">Health Tip</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Stay hydrated! Drinking 8 glasses of water daily helps maintain energy levels.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex">
        <Navigation />
        
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/medicines" element={<MedicineManager />} />
              <Route path="/doctors" element={<DoctorDirectory />} />
              <Route path="/appointments" element={<AppointmentBooking />} />
              <Route path="/prescriptions" element={<PrescriptionVault />} />
              <Route path="/ai-assistant" element={<HealthAI />} />
            </Routes>
          </div>
        </main>

        {/* Global Reminder Overlay (Mock) */}
        <ReminderOverlay />
      </div>
    </Router>
  );
}

const ReminderOverlay = () => {
  const [show, setShow] = useState(false);
  const [medicine, setMedicine] = useState<any>(null);

  useEffect(() => {
    // Check for reminders every minute
    const checkReminders = async () => {
      const res = await fetch('/api/medicines');
      const medicines = await res.json();
      
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });

      const dueMed = medicines.find((m: any) => m.time === currentTime && m.remaining_tablets > 0);
      
      if (dueMed) {
        setMedicine(dueMed);
        setShow(true);
        // Simulate sound
        playNotificationSound(dueMed.reminder_sound);
      }
    };

    const interval = setInterval(checkReminders, 60000);
    
    // Initial check for demo
    setTimeout(async () => {
      const res = await fetch('/api/medicines');
      const medicines = await res.json();
      if (medicines.length > 0) {
        setMedicine(medicines[0]);
        setShow(true);
        playNotificationSound(medicines[0].reminder_sound);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const playNotificationSound = (soundId: string) => {
    console.log(`Playing sound: ${soundId}`);
    // In a real app, we would play an audio file.
    // As a cool hackathon feature, let's use Speech Synthesis to announce it!
    const msg = new SpeechSynthesisUtterance();
    msg.text = `Reminder: Time to take your ${medicine?.name || 'medicine'}.`;
    msg.rate = 0.9;
    msg.pitch = 1.1;
    window.speechSynthesis.speak(msg);
  };

  if (!show || !medicine) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 100 }}
        className="fixed bottom-8 right-8 z-50 w-96 bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-emerald-100 p-8 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 animate-bounce">
              <Bell size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Health Alert</h3>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Scheduled Dose</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full">
            <Volume2 size={14} />
            <span className="text-[10px] font-black uppercase tracking-wider">
              {medicine.reminder_sound.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
              <Pill size={24} />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900">{medicine.name}</h4>
              <p className="text-sm font-bold text-slate-400">{medicine.dosage}</p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-600">{medicine.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-400" />
              <span className="text-sm font-bold text-rose-500">{medicine.remaining_tablets} Left</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setShow(false)}
            className="py-4 px-6 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95"
          >
            Mark Taken
          </button>
          <button 
            onClick={() => {
              setShow(false);
              setTimeout(() => setShow(true), 300000); // Snooze for 5 mins
            }}
            className="py-4 px-6 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all active:scale-95"
          >
            Snooze
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
