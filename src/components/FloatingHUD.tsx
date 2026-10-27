import React from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Database, 
  Maximize, 
  Minimize, 
  Lock, 
  ShieldCheck, 
  Home, 
  HelpCircle,
  Plus
} from 'lucide-react';
import { TeacherProfile } from '../types';

interface FloatingHUDProps {
  activeTab: 'landing' | 'games' | 'generator' | 'saved';
  onNavigate: (tab: 'landing' | 'games' | 'generator' | 'saved') => void;
  teacherProfile: TeacherProfile | null;
  isAdminLoggedIn: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenAdmin: () => void;
  onOpenTeacherLogin: () => void;
  onOpenGuide: () => void;
  onOpenAddGame: () => void;
  savedCount: number;
}

export const FloatingHUD: React.FC<FloatingHUDProps> = ({
  activeTab,
  onNavigate,
  teacherProfile,
  isAdminLoggedIn,
  isFullscreen,
  onToggleFullscreen,
  onOpenAdmin,
  onOpenTeacherLogin,
  onOpenGuide,
  onOpenAddGame,
  savedCount
}) => {
  return (
    <div className="fixed top-3 inset-x-0 z-40 pointer-events-none px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left Floating Dock: Brand / Quick Back */}
        <div className="pointer-events-auto flex items-center gap-2">
          {activeTab === 'landing' ? (
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/40">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/30">
                <Gamepad2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-black tracking-tight text-white font-game hidden sm:inline">
                EduGame<span className="text-indigo-400">Hub</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                Merdeka
              </span>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-white/10 shadow-xl shadow-black/40 backdrop-blur-xl transition-all hover:scale-103 group font-game text-xs sm:text-sm font-bold"
            >
              <Home className="w-4 h-4 text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>← Beranda Utama</span>
            </button>
          )}

          {/* Quick tab switchers if already inside an active workspace */}
          {activeTab !== 'landing' && (
            <div className="hidden sm:flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-xl">
              <button
                onClick={() => onNavigate('games')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'games'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎮 Pilih Game
              </button>
              <button
                onClick={() => {
                  if (!teacherProfile?.isLoggedIn) onOpenTeacherLogin();
                  else onNavigate('generator');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'generator'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📝 Buat Soal
              </button>
              {savedCount > 0 && (
                <button
                  onClick={() => onNavigate('saved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    activeTab === 'saved'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Database className="w-3 h-3" />
                  <span>Bank ({savedCount})</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Floating Dock: Google Login status, Fullscreen, Admin */}
        <div className="pointer-events-auto flex items-center gap-2">
          
          {/* Admin Tambah Game Button if Admin is logged in */}
          {isAdminLoggedIn && (
            <button
              onClick={onOpenAddGame}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30 transition-all hover:scale-102 font-game"
              title="Tambah Game Baru"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Tambah Game</span>
            </button>
          )}

          {/* Teacher Google Account Badge */}
          {teacherProfile?.isLoggedIn ? (
            <button
              onClick={onOpenTeacherLogin}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-200 shadow-xl backdrop-blur-xl transition-all"
              title="Akun Google & API Key Anda"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="truncate max-w-[120px] sm:max-w-[170px] font-medium text-[11px] text-emerald-300">
                {teacherProfile.email}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenTeacherLogin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-white/10 text-xs font-bold text-white shadow-xl backdrop-blur-xl transition-all"
              title="Masuk dengan Akun Google"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="hidden sm:inline">Akun Google</span>
            </button>
          )}

          {/* Fullscreen Symbol Button */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white shadow-xl backdrop-blur-xl transition-all flex items-center gap-1.5"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh (Fullscreen)'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-sky-400" /> : <Maximize className="w-4 h-4 text-sky-400" />}
            <span className="hidden md:inline text-xs font-semibold">{isFullscreen ? 'Kecilkan' : 'Layar Penuh'}</span>
          </button>

          {/* Portal Admin Button */}
          <button
            onClick={onOpenAdmin}
            className={`px-3 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xl backdrop-blur-xl ${
              isAdminLoggedIn
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-900/85 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border-white/10 hover:border-amber-500/40'
            }`}
            title="Portal Admin (user: misbah, pass: misbah5758)"
          >
            {isAdminLoggedIn ? <ShieldCheck className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline">{isAdminLoggedIn ? 'Admin Misbah' : 'Portal Admin'}</span>
          </button>

          {/* Panduan Modal Button */}
          <button
            onClick={onOpenGuide}
            className="p-2 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white shadow-xl backdrop-blur-xl transition-all"
            title="Panduan Guru"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
          </button>

        </div>

      </div>
    </div>
  );
};
