import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressBarProps {
  currentStep: number; // 1 to 5
  onStepClick?: (step: number) => void;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, label: 'Pilih Jadwal' },
    { number: 2, label: 'Pilih Halte' },
    { number: 3, label: 'Pilih Kursi' },
    { number: 4, label: 'Data Penumpang' },
    { number: 5, label: 'Konfirmasi' },
  ];

  return (
    <div className="w-full py-4 my-2">
      <div className="flex items-center justify-between relative max-w-2xl mx-auto px-4">
        {/* Progress connecting line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
        <div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-0.5 bg-blue-600 transition-all duration-300 z-0"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 88}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isAccessible = step.number <= currentStep;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center relative z-10"
            >
              <button
                type="button"
                onClick={() => {
                  if (isAccessible && onStepClick) {
                    onStepClick(step.number);
                  }
                }}
                disabled={!isAccessible}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                    : isCompleted
                    ? 'bg-blue-700 text-white cursor-pointer'
                    : 'bg-white text-slate-400 border-2 border-slate-300 cursor-not-allowed'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
              </button>
              <span
                className={`mt-1.5 text-xs text-center font-medium max-w-[80px] leading-tight ${
                  isCurrent
                    ? 'text-blue-700 font-semibold'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
