import React from 'react';
import { QuizDraft } from '../types';
import { Database, Play, Share2, Copy, Check, Trash2, FileSpreadsheet, Plus, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface QuizBankModalProps {
  quizzes: QuizDraft[];
  onSelectQuiz: (quiz: QuizDraft) => void;
  onPlayQuizInGame: (quizId: string) => void;
  onDeleteQuiz: (quizId: string) => void;
  onOpenGenerator: () => void;
  onClose?: () => void;
}

export const QuizBankModal: React.FC<QuizBankModalProps> = ({
  quizzes,
  onSelectQuiz,
  onPlayQuizInGame,
  onDeleteQuiz,
  onOpenGenerator
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/api/quiz/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-black text-white font-game">
              Bank & Riwayat Draf Soal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Daftar kumpulan soal Kurikulum Merdeka yang siap disematkan pada game center atau diekspor ke Google Sheets.
          </p>
        </div>

        <button
          onClick={onOpenGenerator}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto font-game"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Draf Soal Baru</span>
        </button>
      </div>

      {/* Empty State */}
      {quizzes.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Belum Ada Soal Tersimpan</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gunakan menu <strong>Buat Soal</strong> untuk memilih fase (A-F), mata pelajaran, dan tingkat Taksonomi Bloom (C1-C6). Sistem akan otomatis membuat spreadsheet untuk Anda.
          </p>
          <button
            onClick={onOpenGenerator}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs font-game hover:bg-indigo-500 transition-colors"
          >
            Mulai Buat Soal Sekarang ✨
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => onSelectQuiz(quiz)}
              className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-5 flex flex-col justify-between group transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {quiz.phase} ({quiz.phaseGrade})
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {quiz.questions.length} Soal
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-base group-hover:text-indigo-300 transition-colors font-game line-clamp-1">
                  {quiz.title}
                </h3>
                <div className="text-xs text-slate-400 mt-1 line-clamp-1 font-medium">
                  {quiz.subject}
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {quiz.learningGoals}
                </p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {quiz.bloomLevels.map((b) => (
                    <span key={b} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayQuizInGame(quiz.id);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition-colors shadow-sm"
                  title="Mainkan game dengan soal ini"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Mainkan</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleCopyLink(quiz.id, e)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Salin Link Soal"
                  >
                    {copiedId === quiz.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus kuis "${quiz.title}"?`)) {
                        onDeleteQuiz(quiz.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Hapus draf ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
