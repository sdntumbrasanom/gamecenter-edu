import React from 'react';
import { GameItem, TeacherProfile } from '../types';
import { 
  Gamepad2, 
  Sparkles, 
  Maximize, 
  Minimize, 
  Lock, 
  ShieldCheck, 
  User, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface LandingHeroProps {
  games: GameItem[];
  teacherProfile: TeacherProfile | null;
  isAdminLoggedIn: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenAdmin: () => void;
  onOpenTeacherLogin: () => void;
  onSelectPilihGame: () => void;
  onSelectBuatSoal: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  games,
  teacherProfile,
  isAdminLoggedIn,
  isFullscreen,
  onToggleFullscreen,
  onOpenAdmin,
  onOpenTeacherLogin,
  onSelectPilihGame,
  onSelectBuatSoal
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      
      {/* BACKGROUND: Kumpulan Banyak Game Transparan (Mosaic Game Collage) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        
        {/* Animated Diagonal Mosaic Grid of Game Thumbnails */}
        <div className="absolute -inset-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 opacity-35 scale-105 transform -rotate-2">
          {games.concat(games).map((g, idx) => (
            <div 
              key={`${g.id}-${idx}`}
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <img 
                src={g.imageUrl} 
                alt={g.title} 
                className="w-full h-full object-cover filter brightness-90 saturate-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-[10px] font-bold text-white truncate drop-shadow">
                {g.title}
              </div>
            </div>
          ))}
        </div>

        {/* Semi-transparent dark frosted glass overlay */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80" />
        
        {/* Ambient neon radial glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-[120px]" />
      </div>

      {/* SPACER FOR TOP FLOATING HUD */}
      <div className="h-16 sm:h-20" />

      {/* CENTER HERO: DUA TOMBOL UTAMA */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center flex flex-col items-center justify-center my-auto">
        
        {/* Curated Merdeka Chip */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-bold mb-6 backdrop-blur-md shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Kurikulum Merdeka • Taksonomi Bloom C1-C6 • Iframe Terpadu</span>
        </div>

        {/* Big Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-game tracking-tight leading-tight max-w-3xl">
          Rumah Permainan Edukasi & Bank Soal Interaktif
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Silakan pilih tujuan belajar Anda. Mainkan ragam permainan edukasi atau rumuskan draf soal asesmen pembelajaran ke dalam spreadsheet evaluasi.
        </p>

        {/* HANYA DUA TOMBOL UTAMA BESAR */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
          
          {/* TOMBOL 1: PILIH GAME (GAME CENTER) */}
          <button
            onClick={onSelectPilihGame}
            className="group relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 hover:from-indigo-500 hover:to-indigo-800 border-2 border-indigo-400/40 text-white shadow-2xl shadow-indigo-600/30 transition-all duration-200 hover:scale-103 active:scale-98 flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center mb-4 transition-colors">
              <Gamepad2 className="w-9 h-9 text-pink-300 group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-game tracking-wide">
              PILIH GAME
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-1.5 font-medium leading-snug">
              Jelajahi koleksi permainan edukatif dan mainkan langsung di portal ini.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-200 group-hover:text-white uppercase tracking-wider">
              <span>Buka Game Center</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* TOMBOL 2: BUAT SOAL (GENERATOR KURIKULUM MERDEKA) */}
          <button
            onClick={onSelectBuatSoal}
            className="group relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-950 hover:from-pink-500 hover:to-purple-800 border-2 border-pink-400/40 text-white shadow-2xl shadow-pink-600/30 transition-all duration-200 hover:scale-103 active:scale-98 flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center mb-4 transition-colors">
              <Sparkles className="w-9 h-9 text-amber-300 group-hover:rotate-12 transition-transform" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-game tracking-wide">
              BUAT SOAL
            </h2>
            <p className="text-xs sm:text-sm text-pink-100/90 mt-1.5 font-medium leading-snug">
              Rumuskan soal otomatis Fase A-F, Bloom C1-C6 ke format spreadsheet.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-pink-200 group-hover:text-white uppercase tracking-wider">
              <span>Mulai Buat Soal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>

      </div>

      {/* BOTTOM TICKER / STATS INFO */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-white/5 pt-4">
        <div className="flex items-center gap-4">
          <span>🎮 <strong>{games.length}</strong> Permainan Edukasi</span>
          <span>•</span>
          <span>📊 Spreadsheet Evaluasi Kolom A-E</span>
          <span>•</span>
          <span>🔑 Admin: <strong>misbah</strong></span>
        </div>
        <div className="text-slate-500">
          Alamat portal tetap seragam via teknologi iframe embed
        </div>
      </div>

    </div>
  );
};
