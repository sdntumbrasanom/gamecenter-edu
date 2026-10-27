import React, { useState, useRef, useEffect } from 'react';
import { GameItem, QuizDraft } from '../types';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Share2, 
  Check, 
  ExternalLink, 
  Sparkles, 
  FileSpreadsheet,
  Tv,
  HelpCircle
} from 'lucide-react';

interface GamePlayerModalProps {
  game: GameItem;
  quizzes: QuizDraft[];
  initialQuizId?: string | null;
  onClose: () => void;
  onOpenGenerator: () => void;
}

export const GamePlayerModal: React.FC<GamePlayerModalProps> = ({
  game,
  quizzes,
  initialQuizId,
  onClose,
  onOpenGenerator
}) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>(
    initialQuizId || (quizzes.length > 0 ? quizzes[0].id : '')
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | 'full'>('16:9');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Selected Quiz object
  const currentQuiz = quizzes.find(q => q.id === selectedQuizId);

  // Construct iframe URL with quiz parameter
  const getConstructedGameUrl = () => {
    let base = game.playUrl;
    
    // If game supports custom quiz and a quiz is selected
    if (game.supportsCustomQuiz && selectedQuizId) {
      const paramName = game.quizParamName || 'quiz';
      const separator = base.includes('?') ? '&' : '?';
      const quizEndpoint = `${window.location.origin}/api/quiz/${selectedQuizId}`;
      base = `${base}${separator}${paramName}=${encodeURIComponent(quizEndpoint)}`;
    }
    
    return base;
  };

  const gameUrl = getConstructedGameUrl();

  // Send quiz data via postMessage whenever iframe loads or quiz changes
  const handleIframeLoad = () => {
    if (currentQuiz && iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'SET_QUIZ_DATA',
            quizId: currentQuiz.id,
            title: currentQuiz.title,
            questions: currentQuiz.questions
          },
          '*'
        );
      } catch (e) {
        // cross-origin restriction is normal for external sites
      }
    }
  };

  // Fullscreen handlers
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Reload iframe
  const handleReload = () => {
    setIframeKey(k => k + 1);
  };

  // Copy shareable link that automatically loads this portal with game and quiz
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#play=${game.id}${selectedQuizId ? `&quiz=${selectedQuizId}` : ''}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-center items-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Game Window Container */}
      <div 
        ref={containerRef}
        className="w-full max-w-6xl h-full max-h-[96vh] flex flex-col bg-slate-950 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
      >
        
        {/* Top Header Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 select-none">
          
          {/* Left: Game Title & Badges */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl">🎮</span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-extrabold text-white truncate font-game flex items-center gap-2">
                <span>{game.title}</span>
                {game.isBuiltIn && (
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-sans">
                    Resmi
                  </span>
                )}
              </h2>
              <div className="text-[11px] text-slate-400 truncate hidden sm:block">
                Tetap berjalan di portal ini ({window.location.host})
              </div>
            </div>
          </div>

          {/* Center: Inject / Select Quiz Spreadsheet */}
          <div className="flex items-center gap-2 flex-1 max-w-md justify-center">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs w-full max-w-xs">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
              <select
                value={selectedQuizId}
                onChange={(e) => {
                  setSelectedQuizId(e.target.value);
                  setIframeKey(k => k + 1);
                }}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none w-full truncate cursor-pointer"
                title="Pilih kumpulan soal untuk dimainkan dalam game ini"
              >
                {quizzes.length === 0 && (
                  <option value="">Belum ada draf soal (Gunakan default)</option>
                )}
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id} className="bg-slate-900 text-white">
                    {q.title} ({q.questions.length} soal)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onOpenGenerator}
              className="p-1.5 text-xs bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl border border-indigo-500/40 transition-colors flex items-center gap-1 shrink-0"
              title="Buat soal baru dengan AI"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Buat Baru</span>
            </button>
          </div>

          {/* Right Toolbar: Aspect ratio, Reload, Fullscreen, Share, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Aspect ratio switcher */}
            <div className="hidden sm:flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-[11px] font-bold text-slate-400">
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`px-2 py-0.5 rounded-lg ${aspectRatio === '16:9' ? 'bg-slate-800 text-white' : 'hover:text-white'}`}
              >
                16:9
              </button>
              <button
                onClick={() => setAspectRatio('4:3')}
                className={`px-2 py-0.5 rounded-lg ${aspectRatio === '4:3' ? 'bg-slate-800 text-white' : 'hover:text-white'}`}
              >
                4:3
              </button>
              <button
                onClick={() => setAspectRatio('full')}
                className={`px-2 py-0.5 rounded-lg ${aspectRatio === 'full' ? 'bg-slate-800 text-white' : 'hover:text-white'}`}
              >
                Full
              </button>
            </div>

            {/* Reload button */}
            <button
              onClick={handleReload}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Muat Ulang Game (Restart)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Share link with quiz attached */}
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition-colors"
              title="Salin Link Game & Soal untuk Murid"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close modal */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors ml-1"
              title="Tutup Game"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* Active Quiz Notice Banner */}
        {currentQuiz && (
          <div className="bg-emerald-950/40 border-b border-emerald-800/30 px-4 py-1.5 flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-emerald-400">✅ Soal Aktif:</span>
              <span className="truncate">{currentQuiz.title} — {currentQuiz.questions.length} butir ({currentQuiz.phase})</span>
            </div>
            <div className="text-[11px] text-emerald-400/80 hidden md:block shrink-0">
              Format: Kolom A (Tanya), B (Benar), C,D,E (Pengecoh)
            </div>
          </div>
        )}

        {/* Center Game Iframe Frame */}
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden relative">
          
          <div 
            className={`w-full h-full flex items-center justify-center transition-all ${
              aspectRatio === '16:9' 
                ? 'max-w-full max-h-full aspect-video' 
                : aspectRatio === '4:3' 
                ? 'max-w-4xl aspect-[4/3]' 
                : 'w-full h-full'
            }`}
          >
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={gameUrl}
              title={game.title}
              onLoad={handleIframeLoad}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              className="w-full h-full border-0 bg-slate-900 rounded-b-2xl"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          </div>

        </div>

        {/* Bottom Game Bar: Info & External link if needed */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Alamat Asal:</span>
            <a 
              href={game.playUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-400 hover:text-indigo-400 flex items-center gap-1 font-mono truncate max-w-xs sm:max-w-md"
            >
              <span>{game.playUrl}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            Tekan <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">Esc</kbd> atau klik tombol X untuk kembali
          </div>
        </div>

      </div>

    </div>
  );
};
