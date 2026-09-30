import React from 'react';
import { RouteOption, Schedule } from '../types';
import { Calendar, Clock, ArrowRightLeft, CheckCircle2, ShieldCheck, Bus, Info } from 'lucide-react';

interface ScheduleStepProps {
  selectedRoute: RouteOption;
  availableRoutes: RouteOption[];
  onSelectRoute: (route: RouteOption) => void;
  selectedDate: string;
  onChangeDate: (date: string) => void;
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  onSelectSchedule: (schedule: Schedule) => void;
  onNext: () => void;
}

export const ScheduleStep: React.FC<ScheduleStepProps> = ({
  selectedRoute,
  availableRoutes,
  onSelectRoute,
  selectedDate,
  onChangeDate,
  schedules,
  selectedSchedule,
  onSelectSchedule,
  onNext,
}) => {
  const filteredSchedules = schedules.filter((s) => s.routeId === selectedRoute.id);

  const handleCardClick = (sch: Schedule) => {
    onSelectSchedule(sch);
  };

  const swapRoute = () => {
    const other = availableRoutes.find((r) => r.id !== selectedRoute.id);
    if (other) {
      onSelectRoute(other);
    }
  };

  return (
    <div className="space-y-6">
      {/* Route & Subtitle Header matching Page 13 Screenshot */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {selectedRoute.namaRute}
              </h1>
              <button
                onClick={swapRoute}
                title="Tukar Arah Rute"
                className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              {selectedRoute.asal} <span className="text-slate-400">→</span> {selectedRoute.tujuan}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block text-lg font-bold text-blue-700">
              Rp{selectedRoute.harga.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-500 block">/ kursi (Subsidi Kampus)</span>
          </div>
        </div>

        {/* Date Selector */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-700" />
            <label htmlFor="travel-date" className="text-sm font-semibold text-slate-700">
              Tanggal Keberangkatan:
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="travel-date"
              type="date"
              value={selectedDate}
              onChange={(e) => onChangeDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
            />
            <span className="text-xs text-slate-500 hidden sm:inline">
              (Jadwal reguler beroperasi setiap hari)
            </span>
          </div>
        </div>
      </div>

      {/* Step Guide */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Langkah 1/5: Pilih Jadwal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih jam keberangkatan bus kampus yang sesuai dengan jam perkuliahan Anda.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Tersedia: <strong>{filteredSchedules.length} Jadwal</strong>
        </div>
      </div>

      {/* Schedule Cards List */}
      <div className="space-y-3">
        {filteredSchedules.map((sch) => {
          const isSelected = selectedSchedule?.id === sch.id;
          return (
            <div
              key={sch.id}
              onClick={() => handleCardClick(sch)}
              className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-start sm:items-center gap-4">
                {/* Radio Circle Indicator */}
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 sm:mt-0 shrink-0 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                {/* Departure & Arrival Times */}
                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-700" />
                    <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {sch.jamBerangkat}
                    </span>
                    <span className="text-slate-400 text-sm font-medium">—</span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {sch.jamTiba}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 flex-wrap">
                    <span className="font-semibold text-slate-800">{sch.jenisBus}</span>
                    <span>·</span>
                    <span className="text-slate-500">{sch.platNomor}</span>
                    <span>·</span>
                    <span
                      className={`font-medium ${
                        sch.sisaKursi <= 10 ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      Sisa {sch.sisaKursi} kursi
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Selection Status */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-base font-bold text-slate-900">
                    Rp{sch.harga.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(sch);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? 'Terpilih' : 'Pilih'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedSchedule}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-xs ${
            selectedSchedule
              ? 'bg-blue-700 text-white hover:bg-blue-800 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Lanjut ke Pilih Halte
        </button>
      </div>
    </div>
  );
};
