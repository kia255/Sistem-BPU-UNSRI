import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  routeName: string;
  onGoHome?: () => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ routeName, onGoHome }) => {
  return (
    <nav className="flex items-center text-xs sm:text-sm text-slate-500 py-3 overflow-x-auto whitespace-nowrap">
      <button
        onClick={onGoHome}
        className="hover:text-blue-700 transition-colors cursor-pointer"
      >
        Beranda
      </button>
      <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
      <span className="hover:text-blue-700 cursor-pointer" onClick={onGoHome}>
        Tiket Bus
      </span>
      <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
      <span className="text-slate-700 font-medium">{routeName}</span>
      <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
      <span className="text-blue-700 font-semibold">Pesan Tiket Bus</span>
    </nav>
  );
};
