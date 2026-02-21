import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Pill, 
  Calendar, 
  ChevronRight, 
  Activity, 
  Clock,
  AlertCircle,
  ArrowUpRight,
  Stethoscope,
  MessageSquare,
  FileText,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/medicines').then(res => res.json()).then(setMedicines);
    fetch('/api/appointments').then(res => res.json()).then(setAppointments);
  }, []);

  const nextMedicine = medicines[0];
  const nextAppointment = appointments[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, User</h1>
          <p className="text-slate-500">Here's your health overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-600">Health Sync Active</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
            <Activity size={24} />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Heart Rate</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">72</h3>
            <span className="text-sm text-slate-400">bpm</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
            <Activity size={24} />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Blood Pressure</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">120/80</h3>
            <span className="text-sm text-slate-400">mmHg</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
            <Activity size={24} />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Blood Sugar</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">95</h3>
            <span className="text-sm text-slate-400">mg/dL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Medicine */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Next Medicine</h2>
            <Link to="/medicines" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          {nextMedicine ? (
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Pill size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <span className="font-medium">{nextMedicine.time}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{nextMedicine.name}</h3>
                <p className="text-emerald-100 mb-6">{nextMedicine.dosage} • {nextMedicine.frequency}</p>
                <button className="w-full py-3 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-colors">
                  Mark as Taken
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-100 rounded-3xl p-12 text-center">
              <Pill className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium">No medicines scheduled</p>
              <Link to="/medicines" className="mt-4 inline-block text-emerald-600 font-bold">Add Medicine</Link>
            </div>
          )}
        </section>

        {/* Next Appointment */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Upcoming Appointment</h2>
            <Link to="/appointments" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {nextAppointment ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Stethoscope size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{nextAppointment.doctor_name}</h3>
                    <p className="text-slate-500 text-sm">{nextAppointment.hospital_name}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                  Confirmed
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3">
                  <Calendar size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                    <p className="text-sm font-bold text-slate-900">{nextAppointment.appointment_date}</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3">
                  <Clock size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</p>
                    <p className="text-sm font-bold text-slate-900">{nextAppointment.appointment_time}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
              <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium">No upcoming appointments</p>
              <Link to="/doctors" className="mt-4 inline-block text-emerald-600 font-bold">Book Now</Link>
            </div>
          )}
        </section>
      </div>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/ai-assistant" className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors group">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <MessageSquare size={20} />
            </div>
            <p className="font-bold text-slate-900 text-sm">Ask AI</p>
          </Link>
          <Link to="/prescriptions" className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors group">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <FileText size={20} />
            </div>
            <p className="font-bold text-slate-900 text-sm">Vault</p>
          </Link>
          <button className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-rose-200 transition-colors group text-left">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-3 group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <AlertCircle size={20} />
            </div>
            <p className="font-bold text-slate-900 text-sm">Emergency</p>
          </button>
          <Link to="/doctors" className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-amber-200 transition-colors group">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Plus size={20} />
            </div>
            <p className="font-bold text-slate-900 text-sm">Book OP</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
