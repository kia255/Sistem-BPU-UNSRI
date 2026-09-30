import React, { useState } from 'react';
import { RouteOption, Schedule, StopPoint, BusSeat, PassengerData, PaymentMethodType, User } from '../types';
import { UserCheck, QrCode, Banknote, AlertTriangle, ShieldCheck, CheckCircle2, Armchair } from 'lucide-react';

interface SeatAndPassengerStepProps {
  selectedRoute: RouteOption;
  selectedSchedule: Schedule;
  selectedDate: string;
  selectedPickupStop: StopPoint;
  selectedDropoffStop: StopPoint;
  seats: BusSeat[];
  selectedSeatNumbers: string[];
  onToggleSeat: (seatNo: string) => void;
  passengers: PassengerData[];
  onChangePassenger: (index: number, field: keyof PassengerData, value: string) => void;
  paymentMethod: PaymentMethodType | null;
  onSelectPaymentMethod: (method: PaymentMethodType) => void;
  onPrev: () => void;
  onConfirmAndPay: () => void;
  currentUser: User | null;
  onAutoFillCurrentUser: () => void;
}

export const SeatAndPassengerStep: React.FC<SeatAndPassengerStepProps> = ({
  selectedRoute,
  selectedSchedule,
  selectedDate,
  selectedPickupStop,
  selectedDropoffStop,
  seats,
  selectedSeatNumbers,
  onToggleSeat,
  passengers,
  onChangePassenger,
  paymentMethod,
  onSelectPaymentMethod,
  onPrev,
  onConfirmAndPay,
  currentUser,
  onAutoFillCurrentUser,
}) => {
  const [occupiedWarning, setOccupiedWarning] = useState<string | null>(null);

  // Group seats by row (1 to 7)
  const rows = [1, 2, 3, 4, 5, 6, 7];

  const handleSeatClick = (seat: BusSeat) => {
    if (seat.status === 'terisi') {
      // Black Box Test Case 11: Kursi terisi tidak dapat dipilih
      setOccupiedWarning(`Kursi ${seat.nomorKursi} telah terisi dan tidak dapat dipilih.`);
      setTimeout(() => setOccupiedWarning(null), 3000);
      return;
    }
    setOccupiedWarning(null);
    onToggleSeat(seat.nomorKursi);
  };

  // Black Box Test Case 16 Validation:
  // Must have >=1 seat, all passenger fields filled, and a payment method selected
  const isPassengerDataComplete =
    selectedSeatNumbers.length > 0 &&
    passengers.length === selectedSeatNumbers.length &&
    passengers.every(
      (p) =>
        p.namaLengkap.trim().length > 1 &&
        p.nimNip.trim().length > 3 &&
        p.nomorTelepon.trim().length > 8
    );

  const canConfirmAndPay = isPassengerDataComplete && paymentMethod !== null;

  const totalHarga = selectedSeatNumbers.length * selectedRoute.harga;

  return (
    <div className="space-y-6">
      {/* Route & Pricing Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {selectedRoute.namaRute}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {selectedRoute.asal} <span className="text-slate-400">→</span> {selectedRoute.tujuan}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-lg font-bold text-blue-700">
              Rp{selectedRoute.harga.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-500 block">/ kursi</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Langkah 3-5: Pilih Kursi, Data Penumpang & Konfirmasi
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Tentukan nomor kursi pada denah bus, lengkapi identitas penumpang, dan pilih metode pembayaran.
        </p>
      </div>

      {/* 1. SEAT SELECTION SECTION (Denah Bus) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Pilih Kursi</h3>
            <p className="text-xs text-slate-500">
              Konfigurasi 2-2 ({selectedSchedule.jenisBus} · {selectedSchedule.platNomor})
            </p>
          </div>

          {/* Seat Status Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
              <span className="text-slate-600">Tersedia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-blue-600" />
              <span className="text-slate-900 font-semibold">Dipilih</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300 relative">
                <span className="absolute inset-0 flex items-center justify-center text-[9px] text-slate-500 font-bold">
                  ✕
                </span>
              </div>
              <span className="text-slate-400">Terisi</span>
            </div>
          </div>
        </div>

        {/* Warning notification for Occupied Seat click (Test Case 11) */}
        {occupiedWarning && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Validasi Kursi Terisi:</strong> {occupiedWarning}
            </span>
          </div>
        )}

        {/* Bus Cabin Visual Layout */}
        <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-inner">
          {/* Driver & Cabin Front */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-200/80 rounded-md text-slate-700">
              <span>Pintu Depan</span>
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-widest font-mono">
              DEPAN BUS
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-md">
              <Armchair className="w-3.5 h-3.5" />
              <span>Sopir</span>
            </div>
          </div>

          {/* Seat Grid: 7 rows x (A, B - Aisle - C, D) */}
          <div className="space-y-2.5">
            {rows.map((rowNum) => {
              const seatA = seats.find((s) => s.baris === rowNum && s.kolom === 'A');
              const seatB = seats.find((s) => s.baris === rowNum && s.kolom === 'B');
              const seatC = seats.find((s) => s.baris === rowNum && s.kolom === 'C');
              const seatD = seats.find((s) => s.baris === rowNum && s.kolom === 'D');

              const renderSeatButton = (seat?: BusSeat) => {
                if (!seat) return <div className="w-10 h-10" />;
                const isSelected = selectedSeatNumbers.includes(seat.nomorKursi);
                const isOccupied = seat.status === 'terisi';

                return (
                  <button
                    type="button"
                    onClick={() => handleSeatClick(seat)}
                    aria-label={`Kursi ${seat.nomorKursi} ${
                      isOccupied ? 'Terisi' : isSelected ? 'Dipilih' : 'Tersedia'
                    }`}
                    className={`w-10 h-10 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center relative ${
                      isOccupied
                        ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-75'
                        : isSelected
                        ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-300 scale-105'
                        : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer'
                    }`}
                  >
                    <span>{seat.nomorKursi}</span>
                    {isOccupied && (
                      <span className="text-[9px] text-slate-400 leading-none">✕</span>
                    )}
                  </button>
                );
              };

              return (
                <div key={rowNum} className="flex items-center justify-between gap-2">
                  {/* Left Side: A & B */}
                  <div className="flex items-center gap-2">
                    {renderSeatButton(seatA)}
                    {renderSeatButton(seatB)}
                  </div>

                  {/* Aisle */}
                  <div className="flex-1 flex justify-center text-[10px] text-slate-300 font-mono select-none">
                    · {rowNum} ·
                  </div>

                  {/* Right Side: C & D */}
                  <div className="flex items-center gap-2">
                    {renderSeatButton(seatC)}
                    {renderSeatButton(seatD)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cabin Rear */}
          <div className="text-center pt-4 mt-3 border-t border-slate-200 text-[11px] text-slate-400 uppercase tracking-widest font-mono">
            BELAKANG BUS
          </div>
        </div>

        {/* Selected Seats Summary */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-600">
            Kursi Dipilih:{' '}
            {selectedSeatNumbers.length > 0 ? (
              <span className="font-bold text-blue-700">
                {selectedSeatNumbers.join(', ')} ({selectedSeatNumbers.length} kursi)
              </span>
            ) : (
              <span className="text-slate-400 italic">Belum ada kursi dipilih</span>
            )}
          </div>
          {selectedSeatNumbers.length === 0 && (
            <span className="text-xs text-amber-700 font-medium">
              *Klik kursi berstatus putih untuk memilih.
            </span>
          )}
        </div>
      </div>

      {/* 2. PASSENGER DATA FORM SECTION */}
      {selectedSeatNumbers.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Data Penumpang</h3>
              <p className="text-xs text-slate-500">
                Isi identitas penumpang sesuai dengan kartu mahasiswa (KTM) atau KTP/NIP.
              </p>
            </div>
            {currentUser && (
              <button
                type="button"
                onClick={onAutoFillCurrentUser}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Gunakan Data Akun Saya ({currentUser.nama})</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {passengers.map((passenger, index) => (
              <div
                key={passenger.nomorKursi}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      Penumpang {index + 1} - Kursi {passenger.nomorKursi}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                    Kursi {passenger.nomorKursi}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jacky"
                      value={passenger.namaLengkap}
                      onChange={(e) =>
                        onChangePassenger(index, 'namaLengkap', e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      NIM / NIP *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 05011182126020"
                      value={passenger.nimNip}
                      onChange={(e) =>
                        onChangePassenger(index, 'nimNip', e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      No. HP (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 081312728268"
                      value={passenger.nomorTelepon}
                      onChange={(e) =>
                        onChangePassenger(index, 'nomorTelepon', e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white font-mono"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ORDER CONFIRMATION & PAYMENT METHOD SECTION */}
      {selectedSeatNumbers.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Pesanan</h3>
            <p className="text-xs text-slate-500">
              Periksa ringkasan rincian perjalanan sebelum memilih opsi pembayaran.
            </p>
          </div>

          {/* Detailed Summary Card matching Page 14 screenshot */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-sm space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Rute</span>
              <span className="font-semibold text-slate-900">{selectedRoute.namaRute}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Jadwal</span>
              <span className="font-semibold text-slate-900">
                {selectedSchedule.jamBerangkat} - {selectedSchedule.jamTiba} · {selectedDate}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Halte Naik</span>
              <span className="font-semibold text-slate-900">{selectedPickupStop.namaHalte}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Halte Turun</span>
              <span className="font-semibold text-slate-900">{selectedDropoffStop.namaHalte}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Kursi Dipilih</span>
              <span className="font-bold text-blue-700 font-mono">
                {selectedSeatNumbers.join(', ')}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Jumlah Penumpang</span>
              <span className="font-semibold text-slate-900">
                {selectedSeatNumbers.length} Orang
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 text-base">
              <span className="font-bold text-slate-900">Total Harga</span>
              <span className="font-bold text-blue-700 text-lg">
                Rp{totalHarga.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Payment Method Selector matching Page 14 */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Pilih Metode Pembayaran *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cash (Tunai) */}
              <button
                type="button"
                onClick={() => onSelectPaymentMethod('tunai')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'tunai'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    paymentMethod === 'tunai'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">Tunai (Cash)</span>
                    {paymentMethod === 'tunai' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bayar langsung secara tunai di Loket BPU atau kondektur saat naik bus.
                  </p>
                </div>
              </button>

              {/* QRIS */}
              <button
                type="button"
                onClick={() => onSelectPaymentMethod('qris')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'qris'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    paymentMethod === 'qris'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">QRIS (Non-Tunai)</span>
                    {paymentMethod === 'qris' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scan instan dengan mobile banking (BCA, Mandiri, BSI) atau e-wallet (GoPay, Dana, OVO).
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Validation Notice if button disabled */}
          {!canConfirmAndPay && (
            <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Skenario 16 (Black Box):</strong> Tombol &quot;Konfirmasi &amp; Bayar&quot; terkunci
                hingga data semua penumpang ({selectedSeatNumbers.length} kursi) terisi lengkap dan metode
                pembayaran dipilih.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onPrev}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={onConfirmAndPay}
              disabled={!canConfirmAndPay}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all shadow-xs ${
                canConfirmAndPay
                  ? 'bg-blue-700 text-white hover:bg-blue-800 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Konfirmasi &amp; Bayar (Rp{totalHarga.toLocaleString('id-ID')})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
