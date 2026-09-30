import React, { useState, useEffect } from 'react';
import {
  User,
  RouteOption,
  Schedule,
  StopPoint,
  BusSeat,
  PassengerData,
  PaymentMethodType,
  Booking,
} from './types';
import {
  INITIAL_USER,
  ROUTES,
  SCHEDULES,
  STOPS_INDRALAYA,
  STOPS_PALEMBANG,
  generateDefaultSeats,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Breadcrumb } from './components/Breadcrumb';
import { StepProgressBar } from './components/StepProgressBar';
import { ScheduleStep } from './components/ScheduleStep';
import { StopStep } from './components/StopStep';
import { SeatAndPassengerStep } from './components/SeatAndPassengerStep';
import { PaymentModal } from './components/PaymentModal';
import { TicketSuccess } from './components/TicketSuccess';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { MyTicketsModal } from './components/MyTicketsModal';
import { Info } from 'lucide-react';
import unsriCampusPhoto from './assets/images/unsri_rektorat_indralaya_1790768821933.jpg';

export default function App() {
  // View mode: 'booking' or 'auth' (dedicated Login & Register page from Page 12)
  const [viewMode, setViewMode] = useState<'booking' | 'auth'>('booking');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bpu_unsri_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>([
    INITIAL_USER,
    {
      id: 'usr-002',
      nama: 'Dr. Hendra Saputra',
      email: 'hendra@unsri.ac.id',
      nimNip: '198502142010121003',
      peran: 'pegawai',
      password: 'password123',
    },
  ]);

  // Booking Flow State
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(ROUTES[0]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-17');
  const [schedules] = useState<Schedule[]>(SCHEDULES);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(SCHEDULES[1]); // Default 07:00

  // Halte stops
  const [selectedPickupStop, setSelectedPickupStop] = useState<StopPoint | null>(null);
  const [selectedDropoffStop, setSelectedDropoffStop] = useState<StopPoint | null>(null);

  // Seats & Passengers
  const [seats, setSeats] = useState<BusSeat[]>(() => generateDefaultSeats());
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>(['2A']);
  const [passengers, setPassengers] = useState<PassengerData[]>([
    {
      nomorKursi: '2A',
      namaLengkap: INITIAL_USER.nama,
      nimNip: INITIAL_USER.nimNip,
      nomorTelepon: INITIAL_USER.nomorHp || '081312728268',
    },
  ]);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>('qris');

  // Step Progress: 1 = Pilih Jadwal, 2 = Pilih Halte, 3 = Kursi, Data Penumpang & Konfirmasi, 4 = Tiket Diterbitkan
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Bookings list (persisted in localStorage)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bpu_unsri_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Initial sample booking to demonstrate "Tiket Saya"
    return [
      {
        id: 'book-sample-01',
        kodeBooking: 'BPU-UNSRI-20260917-8821',
        userId: INITIAL_USER.id,
        userNama: INITIAL_USER.nama,
        rute: ROUTES[0],
        tanggalKeberangkatan: '2026-09-17',
        jadwal: SCHEDULES[1],
        halteNaik: STOPS_INDRALAYA[0],
        halteTurun: STOPS_PALEMBANG[0],
        kursi: ['2A'],
        penumpang: [
          {
            nomorKursi: '2A',
            namaLengkap: 'Jacky',
            nimNip: '05011182126020',
            nomorTelepon: '081312728268',
          },
        ],
        totalHarga: 15000,
        metodePembayaran: 'qris',
        statusPembayaran: 'lunas',
        statusPemesanan: 'diterbitkan',
        createdAt: '2026-09-17T06:45:00Z',
      },
    ];
  });

  const [activeIssuedBooking, setActiveIssuedBooking] = useState<Booking | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMyTicketsOpen, setIsMyTicketsOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingBookingForPayment, setPendingBookingForPayment] = useState<Booking | null>(null);

  // System notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync bookings to localStorage
  useEffect(() => {
    localStorage.setItem('bpu_unsri_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Sync user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bpu_unsri_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bpu_unsri_user');
    }
  }, [currentUser]);

  // Auto pickup/dropoff stops based on selected route
  const isIndralayaToPalembang = selectedRoute.id === 'route-ind-plg';
  const pickupStops = isIndralayaToPalembang ? STOPS_INDRALAYA : STOPS_PALEMBANG;
  const dropoffStops = isIndralayaToPalembang ? STOPS_PALEMBANG : STOPS_INDRALAYA;

  // Toggle seat selection (Black Box Test Case 10 & 11)
  const handleToggleSeat = (seatNo: string) => {
    if (selectedSeatNumbers.includes(seatNo)) {
      // Deselect
      const updated = selectedSeatNumbers.filter((s) => s !== seatNo);
      setSelectedSeatNumbers(updated);
      setPassengers((prev) => prev.filter((p) => p.nomorKursi !== seatNo));
    } else {
      // Select new seat
      const updated = [...selectedSeatNumbers, seatNo];
      setSelectedSeatNumbers(updated);
      setPassengers((prev) => [
        ...prev,
        {
          nomorKursi: seatNo,
          namaLengkap: prev.length === 0 && currentUser ? currentUser.nama : '',
          nimNip: prev.length === 0 && currentUser ? currentUser.nimNip : '',
          nomorTelepon: prev.length === 0 && currentUser?.nomorHp ? currentUser.nomorHp : '',
        },
      ]);
    }
  };

  const handleChangePassenger = (index: number, field: keyof PassengerData, value: string) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAutoFillCurrentUser = () => {
    if (!currentUser || passengers.length === 0) return;
    setPassengers((prev) => {
      const copy = [...prev];
      copy[0] = {
        ...copy[0],
        namaLengkap: currentUser.nama,
        nimNip: currentUser.nimNip,
        nomorTelepon: currentUser.nomorHp || '081312728268',
      };
      return copy;
    });
    showToast(`Data Penumpang 1 diisi otomatis dengan profil ${currentUser.nama}.`);
  };

  // Confirm & Pay handler (Black Box Test Case 17)
  const handleConfirmAndPay = () => {
    if (!selectedSchedule || !selectedPickupStop || !selectedDropoffStop || !paymentMethod) return;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      kodeBooking: `BPU-UNSRI-${selectedDate.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser?.id || 'guest',
      userNama: currentUser?.nama || passengers[0]?.namaLengkap || 'Tamu',
      rute: selectedRoute,
      tanggalKeberangkatan: selectedDate,
      jadwal: selectedSchedule,
      halteNaik: selectedPickupStop,
      halteTurun: selectedDropoffStop,
      kursi: selectedSeatNumbers,
      penumpang: passengers,
      totalHarga: selectedSeatNumbers.length * selectedRoute.harga,
      metodePembayaran: paymentMethod,
      statusPembayaran: paymentMethod === 'qris' ? 'menunggu_pembayaran' : 'menunggu_pembayaran',
      statusPemesanan: 'diterbitkan',
      createdAt: new Date().toISOString(),
    };

    if (paymentMethod === 'qris') {
      // Open QRIS payment modal (Skenario 15)
      setPendingBookingForPayment(newBooking);
      setIsPaymentModalOpen(true);
    } else {
      // Cash payment (Skenario 14 & 17)
      setBookings((prev) => [newBooking, ...prev]);
      setActiveIssuedBooking(newBooking);
      setCurrentStep(4);
      showToast('Tiket bus berhasil diterbitkan! Silakan bayar tunai di loket.');
    }
  };

  const handleQRISPaymentSuccess = (bookingId: string) => {
    if (!pendingBookingForPayment) return;
    const paidBooking: Booking = {
      ...pendingBookingForPayment,
      statusPembayaran: 'lunas',
      waktuPembayaran: new Date().toISOString(),
    };
    setBookings((prev) => [paidBooking, ...prev]);
    setActiveIssuedBooking(paidBooking);
    setIsPaymentModalOpen(false);
    setCurrentStep(4);
    showToast('Pembayaran QRIS Berhasil! E-Ticket resmi telah diterbitkan.');
  };



  const handleLogout = () => {
    setCurrentUser(null);
    setViewMode('auth');
    setCurrentStep(1);
    showToast('Sesi pengguna berhasil diakhiri (Logout).');
  };

  const handleResetBookingFlow = () => {
    setSelectedSchedule(SCHEDULES[1]);
    setSelectedPickupStop(null);
    setSelectedDropoffStop(null);
    setSelectedSeatNumbers(['2A']);
    setPassengers([
      {
        nomorKursi: '2A',
        namaLengkap: currentUser ? currentUser.nama : '',
        nimNip: currentUser ? currentUser.nimNip : '',
        nomorTelepon: currentUser?.nomorHp || '081312728268',
      },
    ]);
    setPaymentMethod('qris');
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-fadeIn">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Top Bar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setViewMode('auth')}
        onLogout={handleLogout}
        onOpenMyTickets={() => setIsMyTicketsOpen(true)}
        ticketCount={bookings.length}
        onGoHome={() => {
          setViewMode('booking');
          setCurrentStep(1);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {viewMode === 'auth' ? (
          /* DEDICATED HALAMAN LOGIN & REGISTER (Halaman 12 PDF) */
          <AuthPage
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setViewMode('booking');
              showToast(`Selamat datang, ${user.nama} (${user.nimNip})!`);
            }}
            onRegisterSuccess={(newUser) => {
              setRegisteredUsers((prev) => [...prev, newUser]);
              showToast(`Akun baru atas nama ${newUser.nama} berhasil didaftarkan.`);
            }}
            registeredUsers={registeredUsers}
            onBypassToDemo={() => setViewMode('booking')}
          />
        ) : (
          /* ALUR PEMESANAN TIKET BUS (Langkah 1 - 5) */
          <>
            {/* Breadcrumb Navigation matching Page 13 */}
            <Breadcrumb
              routeName={selectedRoute.namaRute}
              onGoHome={() => setCurrentStep(1)}
            />

            {/* Hero Visual Card (Only shown on Step 1 to introduce the UNSRI bus service) */}
            {currentStep === 1 && (
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 text-white min-h-[170px] sm:min-h-[210px] flex items-end">
                <img
                  src={unsriCampusPhoto}
                  alt="Gedung Kantor Pusat Administrasi Rektorat Universitas Sriwijaya (UNSRI) Indralaya"
                  className="absolute inset-0 w-full h-full object-cover opacity-65"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                <div className="relative p-5 sm:p-6 z-10">
                  <span className="text-amber-400 font-bold tracking-wider text-xs uppercase block mb-1">
                    Layanan Transportasi Antar Kampus
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Pemesanan Tiket Bus Kampus BPU UNSRI
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
                    Menghubungkan Kampus Indralaya dan Kampus Palembang dengan armada Bus Kampus UNSRI yang nyaman,
                    jadwal teratur, dan pembayaran praktis Tunai atau QRIS.
                  </p>
                </div>
              </div>
            )}

        {/* Step Progress Bar (1 to 5) */}
        {currentStep !== 4 && (
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <StepProgressBar
              currentStep={currentStep}
              onStepClick={(step) => {
                if (step === 1) setCurrentStep(1);
                if (step === 2 && selectedSchedule) setCurrentStep(2);
                if (step === 3 && selectedPickupStop && selectedDropoffStop) setCurrentStep(3);
              }}
            />
          </div>
        )}

        {/* VIEW ROUTING */}
        {currentStep === 1 && (
          <ScheduleStep
            selectedRoute={selectedRoute}
            availableRoutes={ROUTES}
            onSelectRoute={(route) => {
              setSelectedRoute(route);
              setSelectedPickupStop(null);
              setSelectedDropoffStop(null);
            }}
            selectedDate={selectedDate}
            onChangeDate={setSelectedDate}
            schedules={schedules}
            selectedSchedule={selectedSchedule}
            onSelectSchedule={(sch) => {
              setSelectedSchedule(sch);
              showToast(`Jadwal ${sch.jamBerangkat} - ${sch.jamTiba} dipilih.`);
            }}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && selectedSchedule && (
          <StopStep
            selectedRoute={selectedRoute}
            selectedSchedule={selectedSchedule}
            selectedDate={selectedDate}
            pickupStops={pickupStops}
            dropoffStops={dropoffStops}
            selectedPickupStop={selectedPickupStop}
            selectedDropoffStop={selectedDropoffStop}
            onSelectPickupStop={setSelectedPickupStop}
            onSelectDropoffStop={setSelectedDropoffStop}
            onPrev={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
            onModifySchedule={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && selectedSchedule && selectedPickupStop && selectedDropoffStop && (
          <SeatAndPassengerStep
            selectedRoute={selectedRoute}
            selectedSchedule={selectedSchedule}
            selectedDate={selectedDate}
            selectedPickupStop={selectedPickupStop}
            selectedDropoffStop={selectedDropoffStop}
            seats={seats}
            selectedSeatNumbers={selectedSeatNumbers}
            onToggleSeat={handleToggleSeat}
            passengers={passengers}
            onChangePassenger={handleChangePassenger}
            paymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
            onPrev={() => setCurrentStep(2)}
            onConfirmAndPay={handleConfirmAndPay}
            currentUser={currentUser}
            onAutoFillCurrentUser={handleAutoFillCurrentUser}
          />
        )}

        {currentStep === 4 && activeIssuedBooking && (
          <TicketSuccess
            booking={activeIssuedBooking}
            onBookAnother={handleResetBookingFlow}
            onViewMyTickets={() => setIsMyTicketsOpen(true)}
          />
        )}
          </>
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Berhasil masuk sebagai ${user.nama} (${user.nimNip}).`);
        }}
        onRegisterSuccess={(newUser) => {
          setRegisteredUsers((prev) => [...prev, newUser]);
          showToast(`Akun baru atas nama ${newUser.nama} berhasil didaftarkan.`);
        }}
        registeredUsers={registeredUsers}
      />

      <MyTicketsModal
        isOpen={isMyTicketsOpen}
        onClose={() => setIsMyTicketsOpen(false)}
        bookings={bookings}
        onSelectBooking={(b) => {
          setActiveIssuedBooking(b);
          setCurrentStep(4);
        }}
      />

      {pendingBookingForPayment && (
        <PaymentModal
          booking={pendingBookingForPayment}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handleQRISPaymentSuccess}
        />
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-700">Badan Pengelola Usaha (BPU) Universitas Sriwijaya</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Gedung Rektorat UNSRI Indralaya, Ogan Ilir, Sumatera Selatan
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Layanan Pemesanan Tiket Bus Kampus</span>
            <span>·</span>
            <span>Pembayaran Tunai &amp; QRIS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
