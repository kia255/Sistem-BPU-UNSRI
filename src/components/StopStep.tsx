import React from 'react';
import { RouteOption, Schedule, StopPoint } from '../types';
import { MapPin, Navigation, Clock, AlertCircle } from 'lucide-react';

interface StopStepProps {
  selectedRoute: RouteOption;
  selectedSchedule: Schedule;
  selectedDate: string;
  pickupStops: StopPoint[];
  dropoffStops: StopPoint[];
  selectedPickupStop: StopPoint | null;
  selectedDropoffStop: StopPoint | null;
  onSelectPickupStop: (stop: StopPoint) => void;
  onSelectDropoffStop: (stop: StopPoint) => void;
  onPrev: () => void;
  onNext: () => void;
  onModifySchedule: () => void;
}

export const StopStep: React.FC<StopStepProps> = ({
  selectedRoute,
  selectedSchedule,
  selectedDate,
  pickupStops,
  dropoffStops,
  selectedPickupStop,
  selectedDropoffStop,
  onSelectPickupStop,
  onSelectDropoffStop,
  onPrev,
  onNext,
  onModifySchedule,
}) => {
  // Helper to compute estimated bus arrival time at a stop
  const calculateEstimatedTime = (offsetMinutes: number): string => {
    const [hStr, mStr] = selectedSchedule.jamBerangkat.split(':');
    const startHour = parseInt(hStr, 10);
    const startMin = parseInt(mStr, 10);
    const totalMinutes = startHour * 60 + startMin + offsetMinutes;
    const finalHour = Math.floor(totalMinutes / 60) % 24;
    const finalMin = totalMinutes % 60;
    return `${String(finalHour).padStart(2, '0')}:${String(finalMin).padStart(2, '0')}`;
  };

  // Black Box Test Case 9 Validation: Both pickup AND dropoff must be selected
  const canProceed = Boolean(selectedPickupStop && selectedDropoffStop);

  return (
    <div className="space-y-6">
      {/* Route Header Banner */}
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

      {/* Step Guide Title */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Langkah 2/5: Pilih Halte
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Tentukan titik halte penjemputan (naik) dan halte penurunan (turun) bus kampus.
        </p>
      </div>

      {/* Halte Naik (Pickup) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
            1
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Halte Naik ({selectedRoute.asal.replace('Kampus ', '')})
          </h3>
        </div>

        <div className="space-y-2.5">
          {pickupStops.map((stop) => {
            const isSelected = selectedPickupStop?.id === stop.id;
            const eta = calculateEstimatedTime(stop.estimasiMenitDariBerangkat);

            return (
              <label
                key={stop.id}
                onClick={() => onSelectPickupStop(stop)}
                className={`flex items-start justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="pickupStop"
                    checked={isSelected}
                    onChange={() => onSelectPickupStop(stop)}
                    className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      {stop.namaHalte}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {stop.deskripsi}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    Tiba bus: {eta}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Halte Turun (Dropoff) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
            2
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Halte Turun ({selectedRoute.tujuan.replace('Kampus ', '')})
          </h3>
        </div>

        <div className="space-y-2.5">
          {dropoffStops.map((stop) => {
            const isSelected = selectedDropoffStop?.id === stop.id;
            const eta = calculateEstimatedTime(stop.estimasiMenitDariBerangkat);

            return (
              <label
                key={stop.id}
                onClick={() => onSelectDropoffStop(stop)}
                className={`flex items-start justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="dropoffStop"
                    checked={isSelected}
                    onChange={() => onSelectDropoffStop(stop)}
                    className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      {stop.namaHalte}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {stop.deskripsi}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    Tiba bus: {eta}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Validation Message if only one or none selected */}
      {!canProceed && (
        <div className="flex items-center gap-2 p-3 text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {(!selectedPickupStop && !selectedDropoffStop)
              ? 'Silakan tentukan Halte Naik dan Halte Turun untuk melanjutkan.'
              : !selectedPickupStop
              ? 'Harap pilih Halte Naik terlebih dahulu.'
              : 'Harap pilih Halte Turun terlebih dahulu (Skenario 9: Tombol Selanjutnya tidak aktif sebelum kedua halte dipilih).'}
          </span>
        </div>
      )}

      {/* Bottom Floating/Dock Summary matching Page 13 screenshot */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Jadwal Keberangkatan Terpilih:</div>
            <div className="text-sm font-bold text-slate-900">
              {selectedSchedule.jamBerangkat} - {selectedSchedule.jamTiba} · {selectedDate}
            </div>
            <div className="text-xs text-slate-500">
              {selectedSchedule.jenisBus} ({selectedSchedule.platNomor})
            </div>
          </div>
          <button
            type="button"
            onClick={onModifySchedule}
            className="ml-2 text-xs font-semibold text-blue-700 hover:text-blue-900 underline cursor-pointer"
          >
            Ubah Jadwal
          </button>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={onPrev}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed}
            className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
              canProceed
                ? 'bg-blue-700 text-white hover:bg-blue-800 cursor-pointer shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
};
