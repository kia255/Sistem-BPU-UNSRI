import React, { useRef } from 'react';
import { Booking } from '../types';
import { CheckCircle, Printer, ArrowRight, Bus, MapPin, Calendar, Clock, Ticket, User, Download, ShieldCheck } from 'lucide-react';

interface TicketSuccessProps {
  booking: Booking;
  onBookAnother: () => void;
  onViewMyTickets: () => void;
}

export const TicketSuccess: React.FC<TicketSuccessProps> = ({
  booking,
  onBookAnother,
  onViewMyTickets,
}) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isLunas = booking.statusPembayaran === 'lunas';

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-2">
      {/* Top Banner Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center shadow-xs">
        <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
          <CheckCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Pemesanan Tiket Bus Berhasil Diterbitkan!
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
          {isLunas
            ? 'Pembayaran via QRIS telah terverifikasi. Tunjukkan E-Ticket ini kepada petugas bus kampus UNSRI.'
            : 'Pesanan tersimpan dengan metode pembayaran TUNAI. Harap tunjukkan kode booking ini saat membayar di loket atau bus.'}
        </p>
      </div>

      {/* Official Boarding Pass Ticket Card */}
      <div
        ref={ticketRef}
        className="bg-white border-2 border-slate-300 rounded-2xl overflow-hidden shadow-md print:shadow-none print:border-black"
      >
        {/* Ticket Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b-4 border-amber-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                E-TICKET RESMI
              </div>
              <h3 className="text-base font-bold tracking-tight">
                BPU UNIVERSITAS SRIWIJAYA
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-mono">Kode Booking</span>
            <span className="text-sm sm:text-base font-extrabold text-amber-400 font-mono tracking-wider">
              {booking.kodeBooking}
            </span>
          </div>
        </div>

        {/* Route Banner */}
        <div className="bg-blue-50/70 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-500">Rute Perjalanan</span>
            <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{booking.rute.asal}</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
              <span>{booking.rute.tujuan}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isLunas
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {isLunas ? 'LUNAS (QRIS)' : 'BELUM DIBAYAR (TUNAI)'}
            </span>
          </div>
        </div>

        {/* Journey Details Grid */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 uppercase font-semibold">Tanggal Keberangkatan</span>
            <div className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{booking.tanggalKeberangkatan}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 uppercase font-semibold">Waktu &amp; Armada</span>
            <div className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>
                {booking.jadwal.jamBerangkat} - {booking.jadwal.jamTiba} · {booking.jadwal.jenisBus}
              </span>
            </div>
            <div className="text-slate-500 font-mono mt-0.5">{booking.jadwal.platNomor}</div>
          </div>

          <div>
            <span className="text-slate-400 uppercase font-semibold">Halte Naik (Jemput)</span>
            <div className="text-sm font-bold text-slate-800 mt-0.5 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{booking.halteNaik.namaHalte}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 uppercase font-semibold">Halte Turun (Tujuan)</span>
            <div className="text-sm font-bold text-slate-800 mt-0.5 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{booking.halteTurun.namaHalte}</span>
            </div>
          </div>
        </div>

        {/* Passenger & Seats List */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/40">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Daftar Penumpang ({booking.penumpang.length} Orang)
          </div>

          <div className="space-y-2">
            {booking.penumpang.map((p, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">{p.namaLengkap}</div>
                  <div className="text-slate-500 font-mono">
                    NIM/NIP: {p.nimNip} · HP: {p.nomorTelepon}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Kursi</span>
                  <span className="text-sm font-extrabold text-blue-700 font-mono px-2.5 py-1 bg-blue-50 rounded border border-blue-200">
                    {p.nomorKursi}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Total & QR Code for Conductor Validation */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Pembayaran</span>
            <div className="text-xl font-extrabold text-slate-900">
              Rp{booking.totalHarga.toLocaleString('id-ID')}
            </div>
            <span className="text-xs text-slate-500">
              Metode: {booking.metodePembayaran === 'qris' ? 'QRIS (Lunas)' : 'Tunai di Loket'}
            </span>
          </div>

          {/* Validation QR Code Stamp */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <svg
              className="w-16 h-16"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              <rect x="5" y="5" width="24" height="24" rx="2" fill="black" />
              <rect x="8" y="8" width="18" height="18" rx="1" fill="white" />
              <rect x="11" y="11" width="12" height="12" rx="1" fill="black" />
              <rect x="71" y="5" width="24" height="24" rx="2" fill="black" />
              <rect x="74" y="8" width="18" height="18" rx="1" fill="white" />
              <rect x="77" y="11" width="12" height="12" rx="1" fill="black" />
              <rect x="5" y="71" width="24" height="24" rx="2" fill="black" />
              <rect x="8" y="74" width="18" height="18" rx="1" fill="white" />
              <rect x="11" y="77" width="12" height="12" rx="1" fill="black" />
              <rect x="35" y="10" width="8" height="8" fill="black" />
              <rect x="50" y="10" width="8" height="8" fill="black" />
              <rect x="40" y="40" width="20" height="20" fill="#1e3a8a" rx="3" />
              <circle cx="50" cy="50" r="6" fill="#f59e0b" />
              <rect x="70" y="70" width="15" height="15" fill="black" />
            </svg>
            <div className="text-[11px] text-slate-500">
              <span className="font-bold text-slate-800 block">Boarding Pass QR</span>
              <span>Scan saat naik bus UNSRI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Download E-Ticket</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onViewMyTickets}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>Tiket Saya</span>
          </button>
          <button
            type="button"
            onClick={onBookAnother}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Pesan Tiket Lain</span>
          </button>
        </div>
      </div>
    </div>
  );
};
