import React, { useState } from 'react';
import { GameItem } from '../types';
import { PRESET_THUMBNAILS } from '../data/defaultGames';
import { X, Plus, Github, Image as ImageIcon, Sparkles, AlertCircle, Check } from 'lucide-react';

interface AddGameModalProps {
  onClose: () => void;
  onAddGame: (game: GameItem) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({ onClose, onAddGame }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_THUMBNAILS[0].url);
  const [phase, setPhase] = useState('Semua Fase (A - F)');
  const [subject, setSubject] = useState('Semua Mata Pelajaran');
  const [supportsCustomQuiz, setSupportsCustomQuiz] = useState(true);
  const [quizParamName, setQuizParamName] = useState('quiz');
  const [errorMsg, setErrorMsg] = useState('');

  // Helper to convert GitHub repo url to GitHub Pages URL if applicable
  const convertToPlayUrl = (inputUrl: string): string => {
    let clean = inputUrl.trim();
    if (!clean) return '';

    // If it's a standard GitHub repo URL: https://github.com/username/repo
    const ghRepoMatch = clean.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/i);
    if (ghRepoMatch) {
      const username = ghRepoMatch[1];
      const repo = ghRepoMatch[2].replace(/\.git$/, '');
      return `https://${username}.github.io/${repo}/`;
    }

    return clean;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Judul game wajib diisi.');
      return;
    }
    if (!githubUrl.trim()) {
      setErrorMsg('Alamat GitHub / Web Game wajib diisi.');
      return;
    }

    const playUrl = convertToPlayUrl(githubUrl);

    const newGame: GameItem = {
      id: `custom-game-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Game edukasi interaktif untuk asesmen pembelajaran Kurikulum Merdeka.',
      githubUrl: githubUrl.trim(),
      playUrl: playUrl,
      imageUrl: imageUrl.trim() || PRESET_THUMBNAILS[0].url,
      phase,
      subject,
      supportsCustomQuiz,
      quizParamName: quizParamName.trim() || 'quiz',
      isBuiltIn: false
    };

    onAddGame(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-game">
              Tambah Pilihan Game Baru
            </h2>
            <p className="text-xs text-slate-400">
              Masukkan alamat GitHub dan gambar, otomatis bisa dimainkan rapi di iframe.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Judul Game */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Judul Game *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Petualangan Kuis Matematika Fase B"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Alamat GitHub / Web URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Alamat GitHub / Web Game *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Github className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/nama-game atau https://username.github.io/game"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              ✨ Jika memasukkan link repo GitHub (<code className="text-indigo-300">github.com/user/repo</code>), sistem akan otomatis mengonversi ke link GitHub Pages (<code className="text-emerald-300">user.github.io/repo/</code>).
            </div>
          </div>

          {/* Gambar Banner / Thumbnail */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Alamat Gambar / Banner Game *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <ImageIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... URL gambar banner game"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            {/* Preset Thumbnail Quick Select */}
            <div className="mt-2.5">
              <div className="text-[11px] text-slate-400 mb-1.5">Atau pilih dari koleksi banner bawaan:</div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_THUMBNAILS.map((t, idx) => {
                  const isSelected = imageUrl === t.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => setImageUrl(t.url)}
                      className={`relative aspect-video rounded-lg overflow-hidden border cursor-pointer group transition-all ${
                        isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={t.url} alt={t.title} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Deskripsi Singkat */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan cara bermain atau materi yang dicakup dalam game ini..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Fase & Mata Pelajaran */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Fase
              </label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="Semua Fase (A - F)">Semua Fase (A - F)</option>
                <option value="Fase A (Kelas 1-2)">Fase A (Kelas 1-2)</option>
                <option value="Fase B (Kelas 3-4)">Fase B (Kelas 3-4)</option>
                <option value="Fase C (Kelas 5-6)">Fase C (Kelas 5-6)</option>
                <option value="Fase D (SMP)">Fase D (SMP)</option>
                <option value="Fase E & F (SMA/SMK)">Fase E & F (SMA/SMK)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Mata Pelajaran
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="Semua Mata Pelajaran">Semua Mata Pelajaran</option>
                <option value="IPAS">IPAS</option>
                <option value="Matematika">Matematika</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                <option value="Bahasa Inggris">Bahasa Inggris</option>
              </select>
            </div>
          </div>

          {/* Toggle Support Custom Quiz */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={supportsCustomQuiz}
                onChange={(e) => setSupportsCustomQuiz(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-500"
              />
              <span className="text-xs font-bold text-white">
                Game Mendukung Kustom Soal (Disematkan Spreadsheet)
              </span>
            </label>

            {supportsCustomQuiz && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-6">
                <span>Nama Parameter Query:</span>
                <input
                  type="text"
                  value={quizParamName}
                  onChange={(e) => setQuizParamName(e.target.value)}
                  className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-indigo-300 font-mono"
                  placeholder="quiz"
                />
                <span className="text-[11px] text-slate-500">(contoh: ?quiz=... atau ?sheet=...)</span>
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-500 hover:to-pink-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 font-game"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan & Pasang Game ke Portal</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
