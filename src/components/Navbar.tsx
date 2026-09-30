import React from 'react';
import { User } from '../types';
import { Bus, User as UserIcon, LogOut, Ticket } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenMyTickets: () => void;
  ticketCount: number;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenMyTickets,
  ticketCount,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
            {/* University Crest / Bus Icon Badge */}
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-900 shadow-sm font-bold border border-amber-600">
              <Bus className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  Badan Pengelola Usaha
                </span>
                <span className="hidden sm:inline-block text-xs font-semibold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                  UNSRI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-none">
                Universitas Sriwijaya · Layanan Bus Kampus
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={onGoHome}
              className="hover:text-blue-700 transition-colors text-slate-900 font-semibold"
            >
              Beranda
            </button>
            <button
              onClick={onGoHome}
              className="hover:text-blue-700 transition-colors"
            >
              Pesan Tiket
            </button>
            <button
              onClick={onOpenMyTickets}
              className="hover:text-blue-700 transition-colors flex items-center gap-1.5 relative"
            >
              <Ticket className="w-4 h-4 text-slate-500" />
              <span>Tiket Saya</span>
              {ticketCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                  {ticketCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenAuth}
              className="hover:text-blue-700 transition-colors flex items-center gap-1.5"
            >
              <span>Halaman Login &amp; Register</span>
            </button>
          </nav>

          {/* User Auth Zone */}
          <div className="flex items-center gap-2 sm:gap-3">

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenMyTickets}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Ticket className="w-3.5 h-3.5 text-slate-600" />
                  <span>{ticketCount} Tiket</span>
                </button>
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {currentUser.nama.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">
                      {currentUser.nama}
                    </p>
                    <p className="text-slate-500 font-mono text-[11px] leading-tight">
                      {currentUser.nimNip}
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    title="Keluar (Logout)"
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span>Masuk / Daftar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
