import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, CreditCard, CheckCircle2, ChevronLeft, Stethoscope, MapPin } from 'lucide-react';

export default function AppointmentBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDoctor = location.state?.doctor;

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
  });

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleBooking = async () => {
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctor_name: selectedDoctor.name,
        hospital_name: selectedDoctor.hospital,
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
        fee: selectedDoctor.fee
      })
    });
    setStep(3);
  };

  if (!selectedDoctor) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
        <Stethoscope className="mx-auto text-slate-200 mb-6" size={64} />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Doctor Selected</h2>
        <p className="text-slate-500 mb-8">Please select a doctor from the directory to book an appointment.</p>
        <button 
          onClick={() => navigate('/doctors')}
          className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold"
        >
          Go to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Book Appointment</h1>
      </header>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 px-1">
        {[1, 2, 3].map((s) => (
          <div 
            key={s}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              step >= s ? "bg-emerald-500" : "bg-slate-200"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex gap-4">
              <img 
                src={`https://picsum.photos/seed/${selectedDoctor.id}/200/200`} 
                alt={selectedDoctor.name} 
                className="w-20 h-20 rounded-2xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedDoctor.name}</h3>
                <p className="text-emerald-600 font-semibold">{selectedDoctor.specialty}</p>
                <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                  <MapPin size={14} />
                  <span>{selectedDoctor.hospital}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Calendar size={20} className="text-emerald-500" />
                Select Date
              </h3>
              <input 
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={bookingData.date}
                onChange={e => setBookingData({...bookingData, date: e.target.value})}
                className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Clock size={20} className="text-emerald-500" />
                Select Time Slot
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map(slot => (
                  <button 
                    key={slot}
                    onClick={() => setBookingData({...bookingData, time: slot})}
                    className={cn(
                      "py-3 rounded-xl font-bold text-sm transition-all",
                      bookingData.time === slot 
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                        : "bg-white border border-slate-100 text-slate-600 hover:border-emerald-200"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={!bookingData.date || !bookingData.time}
              onClick={() => setStep(2)}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-xl shadow-emerald-100"
            >
              Continue to Payment
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Payment Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-slate-500">
                  <span>Consultation Fee</span>
                  <span className="font-bold text-slate-900">₹{selectedDoctor.fee}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Service Tax (5%)</span>
                  <span className="font-bold text-slate-900">₹{selectedDoctor.fee * 0.05}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl font-bold text-emerald-600">₹{selectedDoctor.fee * 1.05}</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select Payment Method</p>
                <div className="space-y-3">
                  <button className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-emerald-500 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-emerald-600" />
                      <span className="font-bold text-slate-900">UPI / GPay / PhonePe</span>
                    </div>
                    <CheckCircle2 size={20} className="text-emerald-500" />
                  </button>
                  <button className="w-full p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-3 text-slate-400">
                    <CreditCard />
                    <span className="font-bold">Credit / Debit Card</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-white text-slate-600 rounded-2xl font-bold border border-slate-100"
              >
                Back
              </button>
              <button 
                onClick={handleBooking}
                className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-100"
              >
                Pay & Confirm
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xl"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
            <p className="text-slate-500 mb-8">Your appointment with {selectedDoctor.name} is scheduled for {bookingData.date} at {bookingData.time}.</p>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Booking ID</span>
                <span className="font-bold text-slate-900">#AM-98231</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Payment Status</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Paid</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
