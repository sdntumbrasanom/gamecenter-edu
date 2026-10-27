import React, { useState } from 'react';
import { GameItem, QuizDraft } from '../types';
import { 
  Gamepad2, 
  Play, 
  Plus, 
  Search, 
  Sparkles, 
  Github, 
  FileSpreadsheet, 
  Trash2, 
  ExternalLink,
  SlidersHorizontal,
  Home,
  Clock,
  Edit3,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface GameCenterProps {
  games: GameItem[];
  quizzes: QuizDraft[];
  isAdminLoggedIn: boolean;
  onPlayGame: (game: GameItem, quizId?: string) => void;
  onOpenAddGame: () => void;
  onOpenGenerator: () => void;
  onOpenAdmin: () => void;
  onDeleteGame: (gameId: string) => void;
  onBackToLanding: () => void;
}

export const GameCenter: React.FC<GameCenterProps> = ({
  games,
  quizzes,
  isAdminLoggedIn,
  onPlayGame,
  onOpenAddGame,
  onOpenGenerator,
  onOpenAdmin,
  onDeleteGame,
  onBackToLanding
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('Semua');
  const [pendingNoticeGame, setPendingNoticeGame] = useState<GameItem | null>(null);

  const filterOptions = [
    'Semua',
    'Fase A (Kelas 1-2)',
    'Fase B (Kelas 3-4)',
    'Fase C (Kelas 5-6)',
    'Fase D (SMP)',
    'Fase E & F (SMA)'
  ];

  // Filter games based on search and phase
  const filteredGames = games.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (phaseFilter === 'Semua') return matchesSearch;
    const filterKey = phaseFilter.split(' ')[0]; // e.g. "Fase A"
    return matchesSearch && (g.phase.includes(filterKey) || g.phase.includes('Semua'));
  });

  const handleGameCardClick = (game: GameItem) => {
    if (game.status === 'pending_link' || !game.playUrl) {
      if (isAdminLoggedIn) {
        onOpenAdmin();
      } else {
        setPendingNoticeGame(game);
      }
      return;
    }
    onPlayGame(game);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-indigo-400" />
          <span>← Kembali ke Menu Utama</span>
        </button>

        {isAdminLoggedIn && (
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Panel Admin: Kelola & Edit Link Game</span>
          </button>
        )}
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
            <Gamepad2 className="w-4 h-4 text-pink-400" />
            <span>Koleksi Permainan Edukasi Terpadu</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black text-white font-game tracking-tight leading-tight">
            Pusat Game Edukasi (Iframe Embed)
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Semua game beralamat tetap pada website ini. Anda dapat memainkan game yang sudah tersedia, atau admin dapat menambahkan game baru serta memperbarui tautan repositori kapan saja.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-3">
            {isAdminLoggedIn ? (
              <button
                onClick={onOpenAddGame}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all font-game"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Tambah Game Baru (Admin Misbah)</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <span>Masuk Admin untuk Tambah Game (+ misbah)</span>
              </button>
            )}

            <button
              onClick={onOpenGenerator}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs border border-indigo-500/40 transition-all flex items-center gap-1.5 font-game"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Buat Soal Kurikulum Merdeka</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Phase Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setPhaseFilter(opt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                phaseFilter === opt
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama game atau materi..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

      </div>

      {/* Games Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Add New Game Quick Card (Only if admin or shows admin CTA) */}
        <div
          onClick={isAdminLoggedIn ? onOpenAddGame : onOpenAdmin}
          className="border-2 border-dashed border-slate-800 hover:border-amber-500/60 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group bg-slate-950/40 hover:bg-amber-950/10 transition-all min-h-[320px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-800 group-hover:bg-amber-500 text-slate-400 group-hover:text-slate-950 flex items-center justify-center transition-colors mb-4 shadow-inner">
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors font-game">
            Tambah Game Baru
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
            {isAdminLoggedIn 
              ? 'Masukkan link GitHub & gambar, langsung siap dimainkan via iframe.'
              : 'Login sebagai admin (misbah) untuk menambah game karya Anda.'}
          </p>
          <span className="mt-4 px-3 py-1 bg-slate-900 border border-slate-800 text-[11px] font-bold text-amber-400 group-hover:border-amber-500/40 rounded-full">
            {isAdminLoggedIn ? '+ Tambah Game' : '🔒 Login Admin'}
          </span>
        </div>

        {/* Game Cards */}
        {filteredGames.map((game) => {
          const isPending = game.status === 'pending_link' || !game.playUrl;

          return (
            <div
              key={game.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden flex flex-col group transition-all duration-200 hover:-translate-y-1 shadow-xl hover:shadow-2xl"
            >
              {/* Banner Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Badges on Thumbnail */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-950/80 text-white backdrop-blur-md border border-white/10">
                    {game.phase}
                  </span>

                  {isPending ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/80 text-slate-950 backdrop-blur-md flex items-center gap-1 font-sans">
                      <Clock className="w-2.5 h-2.5" />
                      Link Menyusul
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/80 text-white backdrop-blur-md flex items-center gap-1">
                      <FileSpreadsheet className="w-2.5 h-2.5" />
                      Siap Main
                    </span>
                  )}
                </div>

                {/* Admin quick edit / delete button */}
                {isAdminLoggedIn && !game.isBuiltIn && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus game "${game.title}" dari katalog?`)) {
                        onDeleteGame(game.id);
                      }
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg backdrop-blur-sm transition-colors"
                    title="Hapus game ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
                    <span>{game.subject}</span>
                  </div>
                  <h3 className="font-extrabold text-white text-base font-game leading-snug group-hover:text-indigo-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  
                  {/* Play Button */}
                  {isPending ? (
                    <button
                      onClick={() => handleGameCardClick(game)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/30 flex items-center justify-center gap-2 transition-all font-game"
                    >
                      {isAdminLoggedIn ? (
                        <>
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Isi Link Game Sekarang (Admin)</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Link Menyusul (Segera Hadir)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => onPlayGame(game)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all group-hover:scale-101 font-game"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Mainkan Game</span>
                    </button>
                  )}

                  {/* GitHub link / custom quiz info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    {game.githubUrl ? (
                      <a
                        href={game.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white flex items-center gap-1 text-slate-400"
                        title="Buka Repositori GitHub"
                      >
                        <Github className="w-3 h-3" />
                        <span>Repo GitHub</span>
                      </a>
                    ) : (
                      <span className="text-slate-500">Karya Admin Misbah</span>
                    )}

                    {!isPending && quizzes.length > 0 && game.supportsCustomQuiz && (
                      <button
                        onClick={() => onPlayGame(game, quizzes[0].id)}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        title="Mainkan dengan draf soal terakhir Anda"
                      >
                        <span>Gunakan Soal Saya</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* Modal Notice if game is pending link */}
      {pendingNoticeGame && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-white font-game">
              {pendingNoticeGame.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tautan repositori game ini berstatus <strong>"Link Menyusul"</strong> dan sedang dalam proses penyelesaian oleh Admin Misbah. Anda dapat memainkan game lain yang sudah siap main, atau hubungi admin untuk memperbarui link!
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => setPendingNoticeGame(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setPendingNoticeGame(null);
                  onOpenAdmin();
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-game"
              >
                Login Admin (misbah)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
