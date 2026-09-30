import React, { useState } from 'react';
import { User } from '../types';
import { Bus, CheckCircle2, AlertCircle, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import unsriCampusPhoto from '../assets/images/unsri_rektorat_indralaya_1790768821933.jpg';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  onRegisterSuccess: (user: User) => void;
  registeredUsers: User[];
  onBypassToDemo?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onRegisterSuccess,
  registeredUsers,
  onBypassToDemo,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state (matching Page 12 screenshot)
  const [loginIdentifier, setLoginIdentifier] = useState('05011182126020');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state (5 data utama)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regNimNip, setRegNimNip] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string | null>(null);

  // Validation: Button enabled only when all fields are filled (as stated in research paper)
  const isLoginFormFilled = loginIdentifier.trim().length > 0 && loginPassword.trim().length > 0;
  const isRegisterFormFilled =
    regName.trim().length > 0 &&
    regEmail.trim().length > 0 &&
    regNimNip.trim().length > 0 &&
    regPassword.trim().length > 0 &&
    regConfirmPassword.trim().length > 0;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const found = registeredUsers.find(
      (u) =>
        u.nimNip.toLowerCase() === loginIdentifier.toLowerCase().trim() ||
        u.email.toLowerCase() === loginIdentifier.toLowerCase().trim() ||
        u.nama.toLowerCase() === loginIdentifier.toLowerCase().trim()
    );

    // Black Box Test Case 4: Validasi login gagal jika password salah
    if (!found || (found.password && found.password !== loginPassword)) {
      setLoginError('Kata sandi tidak valid atau akun tidak terdaftar. Periksa kembali NIM/Email dan password Anda.');
      return;
    }

    // Black Box Test Case 3: Login pengguna berhasil
    onLoginSuccess(found);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setRegisterSuccessMessage(null);

    // Black Box Test Case 2: Validasi kesesuaian password
    if (regPassword !== regConfirmPassword) {
      setRegisterError('Password dan konfirmasi password berbeda');
      return;
    }

    if (regPassword.length < 6) {
      setRegisterError('Kata sandi minimal 6 karakter');
      return;
    }

    const isMahasiswa = regNimNip.length >= 10 && !isNaN(Number(regNimNip.charAt(0)));
    const newUser: User = {
      id: `usr-${Date.now()}`,
      nama: regName.trim(),
      email: regEmail.trim(),
      nimNip: regNimNip.trim(),
      peran: isMahasiswa ? 'mahasiswa' : 'umum',
      password: regPassword,
    };

    onRegisterSuccess(newUser);

    // Black Box Test Case 1: Akun berhasil dibuat dan diarahkan ke login
    setRegisterSuccessMessage('Akun berhasil dibuat! Mengalihkan ke halaman masuk...');
    setTimeout(() => {
      setLoginIdentifier(newUser.nimNip);
      setLoginPassword(newUser.password || '');
      setActiveTab('login');
      setRegisterSuccessMessage(null);
    }, 1500);
  };

  return (
    <div className="py-6 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        {/* University Header Branding with Authentic UNSRI Campus Photo */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm mb-6 bg-slate-900 text-white relative">
          <img
            src={unsriCampusPhoto}
            alt="Gedung Rektorat Universitas Sriwijaya Indralaya"
            className="w-full h-36 object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent flex flex-col justify-end p-4">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded">
                Universitas Sriwijaya
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Badan Pengelola Usaha (BPU) UNSRI
            </h2>
            <p className="text-[11px] text-slate-300">
              Sistem Informasi Manajemen Pemesanan Tiket Bus Kampus
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              activeTab === 'login'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Halaman Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegisterError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              activeTab === 'register'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Halaman Register
          </button>
        </div>

        {/* MAIN CARD CONTAINER MATCHING PAGE 12 SCREENSHOT */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {activeTab === 'login' ? (
            /* 1) HALAMAN LOGIN (Eksak Halaman 12) */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Masuk ke Akun Anda
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Gunakan akun BPU Universitas Sriwijaya Anda untuk memesan tiket bus
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Username / Email / NIM */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Username / Email / NIM
                </label>
                <input
                  type="text"
                  placeholder="contoh: 05011182126020 / nama@student.unsri.ac.id"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Password with "Lihat" toggle matching Page 12 screenshot */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    {showLoginPassword ? 'Sembunyikan' : 'Lihat'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Ingat saya & Lupa password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Ingat saya</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Untuk mereset password, silakan hubungi loket BPU UNSRI atau admin sistem.')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Lupa password?
                </button>
              </div>

              {/* Tombol Masuk: Sesuai keterangan di halaman 12 dokumen, tombol baru aktif saat data terisi */}
              <button
                type="submit"
                disabled={!isLoginFormFilled}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all shadow-xs mt-2 ${
                  isLoginFormFilled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-blue-200 text-white/80 cursor-not-allowed'
                }`}
              >
                Masuk
              </button>

              {/* Quick Fill Sample for Easy Research Testing */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('05011182126020');
                    setLoginPassword('password123');
                    setLoginError(null);
                  }}
                  className="text-xs text-slate-500 hover:text-blue-700 inline-flex items-center gap-1 font-medium cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Isi Akun Sampel (Jacky - 05011182126020)</span>
                </button>
              </div>

              {/* Footer link matching Page 12 screenshot */}
              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setLoginError(null);
                  }}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Daftar di sini
                </button>
              </div>
            </form>
          ) : (
            /* 2) HALAMAN REGISTER (Eksak Halaman 12) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Buat Akun Baru
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Daftar untuk Mulai Pemesanan Tiket Bus Kampus
                </p>
              </div>

              {registerSuccessMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{registerSuccessMessage}</span>
                </div>
              )}

              {registerError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{registerError}</span>
                </div>
              )}

              {/* 1. Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Nama sesuai identitas"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 2. Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="nama@student.unsri.ac.id"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 3. NIM / NIP */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIM / NIP
                </label>
                <input
                  type="text"
                  placeholder="Nomor Induk Mahasiswa / Pegawai"
                  value={regNimNip}
                  onChange={(e) => setRegNimNip(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              {/* 4. Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    {showRegPassword ? 'Sembunyikan' : 'Lihat'}
                  </button>
                </div>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="Minimal 8 karakter"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 5. Konfirmasi Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Konfirmasi Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    {showRegConfirmPassword ? 'Sembunyikan' : 'Lihat'}
                  </button>
                </div>
                <input
                  type={showRegConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:outline-hidden focus:ring-2 ${
                    regConfirmPassword && regPassword !== regConfirmPassword
                      ? 'border-red-400 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                  required
                />
                {regConfirmPassword && regPassword !== regConfirmPassword && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">
                    *Password dan konfirmasi password berbeda
                  </p>
                )}
              </div>

              {/* Tombol Daftar */}
              <button
                type="submit"
                disabled={!isRegisterFormFilled}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all shadow-xs mt-2 ${
                  isRegisterFormFilled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-blue-200 text-white/80 cursor-not-allowed'
                }`}
              >
                Daftar
              </button>

              {/* Footer link matching Page 12 screenshot */}
              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setRegisterError(null);
                  }}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Masuk di sini
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Optional quick bypass for testing the whole booking pipeline without forcing login */}
        {onBypassToDemo && (
          <div className="text-center mt-4">
            <button
              onClick={onBypassToDemo}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Lewati login &amp; langsung coba alur pemesanan tiket (Demo)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
