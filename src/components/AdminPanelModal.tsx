import React, { useState } from 'react';
import { GameItem } from '../types';
import { PRESET_THUMBNAILS } from '../data/defaultGames';
import { 
  X, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  ExternalLink, 
  Github, 
  Image as ImageIcon,
  LogOut,
  AlertCircle,
  Check
} from 'lucide-react';

interface AdminPanelModalProps {
  games: GameItem[];
  onClose: () => void;
  onAddGame: (game: GameItem) => void;
  onUpdateGame: (game: GameItem) => void;
  onDeleteGame: (gameId: string) => void;
  onLogoutAdmin: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  games,
  onClose,
  onAddGame,
  onUpdateGame,
  onDeleteGame,
  onLogoutAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');

  // Form State for Add Game
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_THUMBNAILS[0].url);
  const [phase, setPhase] = useState('Semua Fase (A - F)');
  const [subject, setSubject] = useState('Semua Mata Pelajaran');
  const [isPendingLink, setIsPendingLink] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Editing state for existing games
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');

  // Convert github repo url to pages if applicable
  const convertToPlayUrl = (inputUrl: string): string => {
    let clean = inputUrl.trim();
    if (!clean) return '';
    const ghRepoMatch = clean.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/i);
    if (ghRepoMatch) {
      const username = ghRepoMatch[1];
      const repo = ghRepoMatch[2].replace(/\.git$/, '');
      return `https://${username}.github.io/${repo}/`;
    }
    return clean;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Judul game wajib diisi.');
      return;
    }

    const finalPlayUrl = isPendingLink ? '' : convertToPlayUrl(githubUrl);

    const newGame: GameItem = {
      id: `admin-game-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Game edukasi kurikulum merdeka karya Admin Misbah.',
      githubUrl: isPendingLink ? '' : githubUrl.trim(),
      playUrl: finalPlayUrl,
      imageUrl: imageUrl.trim() || PRESET_THUMBNAILS[0].url,
      phase,
      subject,
      supportsCustomQuiz: true,
      quizParamName: 'quiz',
      isBuiltIn: false,
      status: isPendingLink ? 'pending_link' : 'ready'
    };

    onAddGame(newGame);
    setTitle('');
    setDescription('');
    setGithubUrl('');
    setIsPendingLink(false);
    setSuccessMsg('Game baru berhasil ditambahkan ke katalog!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveEdit = (game: GameItem) => {
    const finalUrl = convertToPlayUrl(editUrl);
    const updated: GameItem = {
      ...game,
      githubUrl: editUrl.trim(),
      playUrl: finalUrl,
      status: finalUrl ? 'ready' : 'pending_link'
    };
    onUpdateGame(updated);
    setEditingGameId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white font-game">
                  Portal Admin EduGame
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  misbah
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kelola koleksi permainan & perbarui link game Anda di sini
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onLogoutAdmin();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-300 text-xs font-bold transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Admin</span>
          </button>
        </div>

        {/* Tabs: Tambah Game & Kelola Game */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'add'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Game Baru</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'manage'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Daftar & Edit Link ({games.length})</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: FORM TAMBAH GAME */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Judul Game *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Petualangan Matematika Seru"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Target Fase & Jenjang
                </label>
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Semua Fase (A - F)">Semua Fase (A - F)</option>
                  <option value="Fase A (Kelas 1-2 SD)">Fase A (Kelas 1-2 SD)</option>
                  <option value="Fase B (Kelas 3-4 SD)">Fase B (Kelas 3-4 SD)</option>
                  <option value="Fase C (Kelas 5-6 SD)">Fase C (Kelas 5-6 SD)</option>
                  <option value="Fase D (Kelas 7-9 SMP)">Fase D (Kelas 7-9 SMP)</option>
                  <option value="Fase E & F (SMA/SMK)">Fase E & F (SMA/SMK)</option>
                </select>
              </div>
            </div>

            {/* Link GitHub / Web URL with option "Link Menyusul" */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Alamat GitHub / Web Game
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-400 font-semibold">
                  <input
                    type="checkbox"
                    checked={isPendingLink}
                    onChange={(e) => setIsPendingLink(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 accent-amber-500"
                  />
                  <span>Link Menyusul (Isi Nanti)</span>
                </label>
              </div>

              {!isPendingLink ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Github className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required={!isPendingLink}
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/misbah/... atau https://misbah.github.io/game"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  ⚠️ Status disetel: <strong>Link Menyusul</strong>. Game akan tampil di katalog dengan badge persiapan dan link bisa diperbarui kapan saja di tab daftar game.
                </div>
              )}
            </div>

            {/* Banner Gambar */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Alamat Gambar / Banner Game *
              </label>
              <div className="relative mb-2">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... URL gambar banner"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Preset Thumbnails */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {PRESET_THUMBNAILS.map((t, idx) => {
                  const isSelected = imageUrl === t.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => setImageUrl(t.url)}
                      className={`relative aspect-video rounded-lg overflow-hidden border cursor-pointer transition-all ${
                        isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                      title={t.title}
                    >
                      <img src={t.url} alt={t.title} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Deskripsi Singkat
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Petunjuk permainan atau tema materi kurikulum merdeka..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 font-game"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Tambah Game ke Portal Sekarang</span>
            </button>

          </form>
        )}

        {/* TAB 2: DAFTAR & EDIT LINK GAME */}
        {activeTab === 'manage' && (
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {games.map((g) => {
              const isEditing = editingGameId === g.id;
              const isPending = g.status === 'pending_link' || !g.playUrl;

              return (
                <div
                  key={g.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={g.imageUrl}
                      alt={g.title}
                      className="w-14 h-10 object-cover rounded-xl shrink-0 border border-slate-800"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm font-game truncate">
                          {g.title}
                        </span>
                        {isPending ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                            Link Menyusul
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                            Siap Main
                          </span>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            placeholder="Masukkan link GitHub / Web game di sini..."
                            className="w-full bg-slate-900 border border-amber-500/60 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveEdit(g)}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shrink-0"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Simpan</span>
                          </button>
                          <button
                            onClick={() => setEditingGameId(null)}
                            className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                          {g.playUrl || 'Belum ada link (Klik tombol edit link di kanan)'}
                        </div>
                      )}
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingGameId(g.id);
                          setEditUrl(g.githubUrl || g.playUrl || '');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Edit link game"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit Link</span>
                      </button>

                      {!g.isBuiltIn && (
                        <button
                          onClick={() => {
                            if (confirm(`Hapus game "${g.title}"?`)) {
                              onDeleteGame(g.id);
                            }
                          }}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Hapus game"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
