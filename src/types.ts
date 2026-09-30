export type UserRole = 'mahasiswa' | 'umum' | 'pegawai';

export interface User {
  id: string;
  nama: string;
  email: string;
  nimNip: string;
  peran: UserRole;
  nomorHp?: string;
  password?: string;
}

export interface RouteOption {
  id: string;
  asal: string;
  tujuan: string;
  namaRute: string;
  harga: number;
  estimasiWaktu: string;
}

export interface Schedule {
  id: string;
  routeId: string;
  jamBerangkat: string;
  jamTiba: string;
  jenisBus: 'Bus Kampus UNSRI';
  platNomor: string;
  totalKursi: number;
  sisaKursi: number;
  harga: number;
  tersedia: boolean;
}

export interface StopPoint {
  id: string;
  namaHalte: string;
  lokasi: 'Indralaya' | 'Palembang';
  estimasiMenitDariBerangkat: number; // offset in minutes
  deskripsi: string;
}

export type SeatStatus = 'tersedia' | 'terisi' | 'dipilih';

export interface BusSeat {
  id: string;
  nomorKursi: string;
  baris: number;
  kolom: 'A' | 'B' | 'C' | 'D';
  status: SeatStatus;
  genderReserved?: 'ikhwan' | 'akhwat' | null;
}

export interface PassengerData {
  nomorKursi: string;
  namaLengkap: string;
  nimNip: string;
  nomorTelepon: string;
}

export type PaymentMethodType = 'tunai' | 'qris';
export type PaymentStatus = 'menunggu_pembayaran' | 'lunas';

export interface Booking {
  id: string;
  kodeBooking: string;
  userId: string;
  userNama: string;
  rute: RouteOption;
  tanggalKeberangkatan: string;
  jadwal: Schedule;
  halteNaik: StopPoint;
  halteTurun: StopPoint;
  kursi: string[];
  penumpang: PassengerData[];
  totalHarga: number;
  metodePembayaran: PaymentMethodType;
  statusPembayaran: PaymentStatus;
  statusPemesanan: 'diterbitkan' | 'selesai' | 'dibatalkan';
  createdAt: string;
  waktuPembayaran?: string;
}

export interface BlackBoxTestCase {
  no: number;
  skenario: string;
  input: string;
  outputDiharapkan: string;
  hasil: 'Berhasil' | 'Gagal' | 'Pending';
  catatan: string;
  kategori: 'Autentikasi' | 'Pencarian & Jadwal' | 'Halte' | 'Kursi' | 'Data & Konfirmasi' | 'Pembayaran';
}
