import React, { useState } from 'react';
import { 
  PHASES, 
  SUBJECTS, 
  BLOOM_TAXONOMY, 
  SAMPLE_LEARNING_GOALS 
} from '../data/curriculumData';
import { PhaseType, BloomLevel, QuizDraft } from '../types';
import { Sparkles, BookOpen, Layers, CheckSquare, BrainCircuit, RefreshCw, AlertCircle } from 'lucide-react';
import { SpreadsheetView } from './SpreadsheetView';

import { TeacherProfile } from '../types';

interface QuestionGeneratorProps {
  onSaveQuizToBank: (quiz: QuizDraft) => void;
  onPlayQuizInGame: (quizId: string) => void;
  teacherProfile: TeacherProfile | null;
  onOpenTeacherLogin: () => void;
}

export const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({
  onSaveQuizToBank,
  onPlayQuizInGame,
  teacherProfile,
  onOpenTeacherLogin
}) => {
  // Form State
  const [selectedPhase, setSelectedPhase] = useState<PhaseType>('Fase B');
  const [selectedSubject, setSelectedSubject] = useState<string>('IPAS (Ilmu Pengetahuan Alam & Sosial)');
  const [learningGoals, setLearningGoals] = useState<string>(
    'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan (akar, batang, daun).'
  );
  const [selectedBlooms, setSelectedBlooms] = useState<BloomLevel[]>(['C1', 'C2', 'C3']);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [distractorStyle, setDistractorStyle] = useState<string>('edukatif');
  
  // Generation & Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizDraft | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentPhaseInfo = PHASES.find(p => p.id === selectedPhase) || PHASES[1];

  // Quick preset click
  const handleSelectSampleGoal = (goal: string) => {
    setLearningGoals(goal);
  };

  // Toggle Bloom Level
  const toggleBloom = (code: BloomLevel) => {
    if (selectedBlooms.includes(code)) {
      if (selectedBlooms.length === 1) return; // Keep at least one
      setSelectedBlooms(selectedBlooms.filter(b => b !== code));
    } else {
      setSelectedBlooms([...selectedBlooms, code].sort());
    }
  };

  const handleSelectAllBlooms = () => {
    setSelectedBlooms(['C1', 'C2', 'C3', 'C4', 'C5', 'C6']);
  };

  const handleSelectHotsOnly = () => {
    setSelectedBlooms(['C4', 'C5', 'C6']);
  };

  const handleSelectLotsOnly = () => {
    setSelectedBlooms(['C1', 'C2', 'C3']);
  };

  // Generate Questions via API
  const handleGenerate = async () => {
    if (!learningGoals.trim()) {
      setErrorMsg('Harap masukkan tujuan pembelajaran terlebih dahulu.');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: selectedPhase,
          phaseGrade: currentPhaseInfo.grade,
          subject: selectedSubject,
          learningGoals,
          bloomLevels: selectedBlooms,
          questionCount,
          distractorStyle,
          accessToken: teacherProfile?.accessToken || '',
          projectId: teacherProfile?.projectId || 'gen-lang-client-0622433243',
          location: teacherProfile?.location || 'us-central1',
          customApiKey: teacherProfile?.apiKey || '',
          teacherEmail: teacherProfile?.email || ''
        })
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.questions)) {
        const newQuiz: QuizDraft = {
          id: `quiz-${Date.now()}`,
          title: `Kuis ${selectedSubject.split(' ')[0]} ${selectedPhase} (${selectedBlooms.join(', ')})`,
          phase: selectedPhase,
          phaseGrade: currentPhaseInfo.grade,
          subject: selectedSubject,
          learningGoals,
          bloomLevels: selectedBlooms,
          createdAt: new Date().toISOString(),
          questions: data.questions
        };

        setGeneratedQuiz(newQuiz);
        onSaveQuizToBank(newQuiz);

        // Scroll smoothly to spreadsheet
        setTimeout(() => {
          document.getElementById('spreadsheet-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        throw new Error(data.error || 'Gagal menghasilkan soal');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi gangguan jaringan saat memproses soal.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/20 p-6 sm:p-8">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Generator Soal Kurikulum Merdeka & Taksonomi Bloom
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-game tracking-tight">
            Buat Draf Soal & Ekspor ke Spreadsheet Game
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Pilih fase capaian pembelajaran, tentukan level kognitif C1 hingga C6, lalu sistem akan secara otomatis merumuskan pertanyaan (Kolom A), kunci jawaban benar (Kolom B), dan pengecoh opsional (Kolom C, D, E) untuk evaluasi terpadu.
          </p>
        </div>
      </div>

      {/* Main Generator Form Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
        
        {/* Active Teacher Account Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div>
              <span className="text-slate-400">Akun Guru Aktif: </span>
              <strong className="text-white font-medium">{teacherProfile?.email || 'Belum login'}</strong>
              {teacherProfile?.authMethod === 'oauth_vertex' ? (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  OAuth Token Vertex AI (Tanpa API Key)
                </span>
              ) : teacherProfile?.apiKey ? (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  API Key Pribadi
                </span>
              ) : (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                  Akun Guru Terhubung
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenTeacherLogin}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer shrink-0"
          >
            Atur Akun / Token OAuth
          </button>
        </div>

        {/* Step 1: Pilihan Fase Kurikulum Merdeka */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">1</span>
            <label className="text-base font-bold text-white">
              Pilih Fase Kurikulum Merdeka
            </label>
            <span className="text-xs text-slate-400">(Tingkatan Kelas)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {PHASES.map((phase) => {
              const active = selectedPhase === phase.id;
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => setSelectedPhase(phase.id)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-150 ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 scale-102 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="text-sm font-extrabold">{phase.title}</div>
                  <div className={`text-[11px] mt-0.5 line-clamp-1 ${active ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {phase.grade}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Mata Pelajaran & Jumlah Soal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">2</span>
              <label className="text-base font-bold text-white">
                Mata Pelajaran
              </label>
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {SUBJECTS.map((sub) => (
                <option key={sub} value={sub} className="bg-slate-900 text-white">
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">3</span>
              <label className="text-base font-bold text-white">
                Jumlah Soal
              </label>
              <span className="text-xs text-indigo-400 font-bold ml-auto">{questionCount} Butir</span>
            </div>
            <div className="bg-slate-950 border border-slate-700 rounded-2xl p-3 flex items-center gap-3">
              <input
                type="range"
                min={3}
                max={20}
                step={1}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <span className="text-sm font-extrabold text-white w-8 text-right">{questionCount}</span>
            </div>
          </div>
        </div>

        {/* Step 3: Tujuan Pembelajaran (TP) / Capaian */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">4</span>
              <label className="text-base font-bold text-white">
                Tujuan Pembelajaran (TP) / Materi Pokok
              </label>
            </div>
            <span className="text-xs text-slate-400">Dapat mengetik sendiri atau memilih rekomendasi</span>
          </div>

          <textarea
            value={learningGoals}
            onChange={(e) => setLearningGoals(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all leading-relaxed"
            placeholder="Contoh: Peserta didik dapat menganalisis siklus air dan dampaknya terhadap peristiwa di bumi..."
          />

          {/* Quick preset chips for this phase */}
          <div className="mt-3">
            <div className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Rekomendasi Tujuan Pembelajaran ({selectedPhase}):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(SAMPLE_LEARNING_GOALS[selectedPhase] || []).map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSampleGoal(sample)}
                  className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700/80 transition-all text-left max-w-full"
                >
                  💡 {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: Taksonomi Bloom (C1 s/d C6) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">5</span>
              <label className="text-base font-bold text-white">
                Tingkat Kognitif Taksonomi Bloom (C1 - C6)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllBlooms}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2 py-1 rounded bg-slate-800"
              >
                Pilih Semua (C1-C6)
              </button>
              <button
                type="button"
                onClick={handleSelectLotsOnly}
                className="text-xs text-sky-400 hover:text-sky-300 font-bold px-2 py-1 rounded bg-slate-800"
              >
                LOTS (C1-C3)
              </button>
              <button
                type="button"
                onClick={handleSelectHotsOnly}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded bg-slate-800"
              >
                HOTS (C4-C6)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BLOOM_TAXONOMY.map((b) => {
              const isChecked = selectedBlooms.includes(b.code);
              return (
                <div
                  key={b.code}
                  onClick={() => toggleBloom(b.code)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-slate-800/90 border-indigo-500 shadow-sm ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center ${
                        isChecked ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {b.code}
                      </span>
                      <span className="font-bold text-sm text-white">{b.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      b.category === 'HOTS' 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                        : b.category === 'MOTS'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      {b.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distractor Style Option */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            <strong className="text-slate-300">Format Evaluasi:</strong> Pilihan jawaban salah (Kolom C, D, E) dirancang dengan pengecoh logis agar dapat mendiagnosis miskonsepsi siswa.
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-400">Gaya Pengecoh:</span>
            <select
              value={distractorStyle}
              onChange={(e) => setDistractorStyle(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              <option value="edukatif">Edukatif & Masuk Akal (Rekomendasi)</option>
              <option value="sederhana">Sederhana & Mudah Dibedakan</option>
              <option value="menantang">Menantang (Ketelitian Tinggi)</option>
            </select>
          </div>
        </div>

        {/* Error message if any */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Generate Button CTA */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:from-indigo-500 hover:to-pink-600 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 font-game"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Sedang Merumuskan Soal & Spreadsheet...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generate Draf Soal ke Spreadsheet ✨</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Generated Spreadsheet Result Display */}
      {generatedQuiz && (
        <div id="spreadsheet-section" className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white">
              Hasil Draf Soal Siap Pakai & Disematkan
            </h3>
          </div>

          <SpreadsheetView
            quiz={generatedQuiz}
            onUpdateQuestions={(updated) => {
              const updatedQuiz = { ...generatedQuiz, questions: updated };
              setGeneratedQuiz(updatedQuiz);
              onSaveQuizToBank(updatedQuiz);
            }}
            onSaveQuiz={() => onSaveQuizToBank(generatedQuiz)}
            onPlayInGame={onPlayQuizInGame}
          />
        </div>
      )}

    </div>
  );
};
