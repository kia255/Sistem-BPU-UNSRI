import React from 'react';
import { Booking } from '../types';
import { X, Ticket, Calendar, Clock, MapPin, ArrowRight, Printer, CheckCircle, Clock3 } from 'lucide-react';

interface MyTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
}

export const MyTicketsModal: React.FC<MyTicketsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onSelectBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Riwayat Tiket Saya</h3>
              <p className="text-xs text-slate-500">
                Daftar tiket bus kampus UNSRI yang telah Anda pesan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Bookings */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">Belum Ada Tiket Dipesan</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Silakan lakukan pemesanan tiket bus kampus UNSRI pada halaman utama.
              </p>
            </div>
          ) : (
            bookings.map((b) => {
              const isLunas = b.statusPembayaran === 'lunas';
              return (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/20 transition-all shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {b.kodeBooking}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-600 font-medium">
                        {b.tanggalKeberangkatan}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 self-start sm:self-auto ${
                        isLunas
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isLunas ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>Lunas (QRIS)</span>
                        </>
                      ) : (
                        <>
                          <Clock3 className="w-3 h-3" />
                          <span>Tunai di Loket</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-semibold">
                        Rute Perjalanan
                      </span>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
                        <span>{b.rute.asal}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                        <span>{b.rute.tujuan}</span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {b.jadwal.jamBerangkat} - {b.jadwal.jamTiba} · {b.jadwal.jenisBus}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-semibold">
                        Halte &amp; Kursi
                      </span>
                      <div className="text-slate-700 font-medium mt-0.5">
                        Naik: <strong>{b.halteNaik.namaHalte}</strong>
                      </div>
                      <div className="text-slate-700 font-medium">
                        Turun: <strong>{b.halteTurun.namaHalte}</strong>
                      </div>
                      <div className="text-blue-700 font-bold mt-1 font-mono">
                        Kursi: {b.kursi.join(', ')} ({b.penumpang.length} Penumpang)
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-slate-400">Total: </span>
                      <span className="font-bold text-slate-900 text-sm">
                        Rp{b.totalHarga.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectBooking(b);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Lihat Tiket Digital</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
