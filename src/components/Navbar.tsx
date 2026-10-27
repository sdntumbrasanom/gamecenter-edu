import React from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Database, 
  Maximize, 
  Minimize, 
  Lock, 
  ShieldCheck, 
  User, 
  Home, 
  HelpCircle,
  Plus
} from 'lucide-react';
import { TeacherProfile } from '../types';

interface NavbarProps {
  activeTab: 'landing' | 'games' | 'generator' | 'saved';
  setActiveTab: (tab: 'landing' | 'games' | 'generator' | 'saved') => void;
  savedCount: number;
  teacherProfile: TeacherProfile | null;
  isAdminLoggedIn: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenAdmin: () => void;
  onOpenTeacherLogin: () => void;
  onOpenGuide: () => void;
  onOpenAddGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  teacherProfile,
  isAdminLoggedIn,
  isFullscreen,
  onToggleFullscreen,
  onOpenAdmin,
  onOpenTeacherLogin,
  onOpenGuide,
  onOpenAddGame
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo & Back to Landing */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
              title="Kembali ke Beranda Awal"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-white font-game">
                    EduGame<span className="text-indigo-400">Hub</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                    Merdeka
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Home className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  <span className="group-hover:text-indigo-300 transition-colors">Beranda</span>
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'games'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Pilih Game</span>
            </button>

            <button
              onClick={() => {
                if (!teacherProfile?.isLoggedIn) {
                  onOpenTeacherLogin();
                } else {
                  setActiveTab('generator');
                }
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'generator'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Buat Soal</span>
              <span className="hidden lg:inline text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded-full border border-pink-500/30">
                AI C1-C6
              </span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'saved'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Bank Soal</span>
              {savedCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 text-[11px] flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* If Admin logged in, show Tambah Game */}
            {isAdminLoggedIn && (
              <button
                onClick={onOpenAddGame}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all font-game"
                title="Tambah Game Baru (Admin Misbah)"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Tambah Game</span>
              </button>
            )}

            {/* Teacher login status */}
            {teacherProfile?.isLoggedIn ? (
              <button
                onClick={onOpenTeacherLogin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all max-w-[170px]"
                title="Akun Guru yang Digunakan untuk Generate Soal"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">{teacherProfile.email}</span>
              </button>
            ) : (
              <button
                onClick={onOpenTeacherLogin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login Email</span>
              </button>
            )}

            {/* Fullscreen Toggle Symbol */}
            <button
              onClick={onToggleFullscreen}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold border border-slate-700/80 transition-all flex items-center gap-1"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh (Fullscreen)'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4 text-sky-400" /> : <Maximize className="w-4 h-4 text-sky-400" />}
            </button>

            {/* Portal Admin Button */}
            <button
              onClick={onOpenAdmin}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isAdminLoggedIn
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border-slate-700/80'
              }`}
              title="Portal Admin (user: misbah, pass: misbah5758)"
            >
              {isAdminLoggedIn ? <ShieldCheck className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Panduan */}
            <button
              onClick={onOpenGuide}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs border border-slate-700/80 transition-all"
              title="Panduan Guru"
            >
              <HelpCircle className="w-4 h-4 text-sky-400" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
