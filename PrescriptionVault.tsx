import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Stethoscope, MapPin, Clock, Search, Star, ChevronRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/doctors').then(res => res.json()).then(setDoctors);
  }, []);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
    doc.hospital.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Find Specialists</h1>
        <p className="text-slate-500">Book appointments with top-rated doctors in your area.</p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Search by name, specialty, or hospital..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <motion.div 
            key={doc.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden relative">
                    <img 
                      src={`https://picsum.photos/seed/${doc.id}/200/200`} 
                      alt={doc.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 right-1">
                      <ShieldCheck size={16} className="text-emerald-500 fill-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{doc.name}</h3>
                    <p className="text-emerald-600 font-semibold text-sm">{doc.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-600">4.9 (120+ Reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-500">
                  <MapPin size={18} className="text-slate-400" />
                  <span className="text-sm font-medium">{doc.hospital}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Clock size={18} className="text-slate-400" />
                  <span className="text-sm font-medium">{doc.timings}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consultation Fee</p>
                  <p className="text-lg font-bold text-slate-900">₹{doc.fee}</p>
                </div>
                <button 
                  onClick={() => navigate('/appointments', { state: { doctor: doc } })}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2"
                >
                  Book Now
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
