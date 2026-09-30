import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { X, CheckCircle2, ShieldAlert, Sparkles, Clock, Copy, Check } from 'lucide-react';

interface PaymentModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (bookingId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  booking,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 mins
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const copyNmid = () => {
    navigator.clipboard.writeText('ID1020088219921');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(booking.id);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider text-base">QRIS</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
              Standar Pembayaran Nasional
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <div className="mb-3">
            <h3 className="font-bold text-lg text-slate-900">
              BPU UNIVERSITAS SRIWIJAYA
            </h3>
            <p className="text-xs text-slate-500 font-mono">NMID: ID1020088219921</p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold mb-4 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Sisa Waktu Pembayaran: {timeFormatted}</span>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-4 rounded-xl border-2 border-dashed border-slate-300 inline-block shadow-xs my-1 relative">
            <svg
              className="w-48 h-48 mx-auto"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* QR Pattern visual simulation with UNSRI styling */}
              <rect width="100" height="100" fill="white" />
              {/* Outer corner markers */}
              <rect x="5" y="5" width="26" height="26" rx="2" fill="black" />
              <rect x="8" y="8" width="20" height="20" rx="1" fill="white" />
              <rect x="11" y="11" width="14" height="14" rx="1" fill="black" />

              <rect x="69" y="5" width="26" height="26" rx="2" fill="black" />
              <rect x="72" y="8" width="20" height="20" rx="1" fill="white" />
              <rect x="75" y="11" width="14" height="14" rx="1" fill="black" />

              <rect x="5" y="69" width="26" height="26" rx="2" fill="black" />
              <rect x="8" y="72" width="20" height="20" rx="1" fill="white" />
              <rect x="11" y="75" width="14" height="14" rx="1" fill="black" />

              {/* Data pixel simulation */}
              <rect x="36" y="8" width="5" height="5" fill="black" />
              <rect x="46" y="8" width="5" height="5" fill="black" />
              <rect x="56" y="8" width="5" height="5" fill="black" />
              <rect x="36" y="18" width="5" height="5" fill="black" />
              <rect x="56" y="18" width="5" height="5" fill="black" />
              <rect x="8" y="36" width="5" height="5" fill="black" />
              <rect x="18" y="36" width="5" height="5" fill="black" />
              <rect x="28" y="36" width="5" height="5" fill="black" />
              <rect x="36" y="36" width="5" height="5" fill="black" />
              <rect x="46" y="36" width="5" height="5" fill="black" />
              <rect x="56" y="36" width="5" height="5" fill="black" />
              <rect x="66" y="36" width="5" height="5" fill="black" />
              <rect x="76" y="36" width="5" height="5" fill="black" />
              <rect x="86" y="36" width="5" height="5" fill="black" />

              <rect x="36" y="46" width="28" height="28" fill="#1e3a8a" rx="4" />
              <circle cx="50" cy="60" r="10" fill="#f59e0b" />
              <text
                x="50"
                y="63"
                fontSize="7"
                fontWeight="bold"
                textAnchor="middle"
                fill="#1e3a8a"
              >
                UNSRI
              </text>

              <rect x="8" y="46" width="5" height="5" fill="black" />
              <rect x="18" y="56" width="5" height="5" fill="black" />
              <rect x="69" y="69" width="5" height="5" fill="black" />
              <rect x="79" y="69" width="5" height="5" fill="black" />
              <rect x="89" y="79" width="5" height="5" fill="black" />
              <rect x="69" y="89" width="5" height="5" fill="black" />
              <rect x="79" y="89" width="5" height="5" fill="black" />
            </svg>
          </div>

          <div className="mt-3">
            <span className="text-xs text-slate-500">Nominal Pembayaran</span>
            <div className="text-2xl font-extrabold text-blue-700">
              Rp{booking.totalHarga.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {booking.kursi.length} Kursi ({booking.kursi.join(', ')}) · {booking.rute.namaRute}
            </p>
          </div>

          {/* Supported Apps Badges */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 flex-wrap text-[11px] text-slate-500">
            <span className="px-2 py-0.5 bg-slate-100 rounded font-medium">BCA</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded font-medium">Mandiri</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded font-medium">BSI</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded font-medium">GoPay</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded font-medium">OVO</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded font-medium">DANA</span>
          </div>

          {/* Quick Simulation Action for Research Prototype */}
          <div className="mt-5 space-y-2">
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <span>Memproses Konfirmasi Pembayaran...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulasi Bayar QRIS Berhasil</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
            >
              Tutup &amp; Bayar Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
