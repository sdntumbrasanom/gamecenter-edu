import React, { useState } from 'react';
import { QuestionRow, QuizDraft } from '../types';
import { 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Plus, 
  Trash2, 
  Share2, 
  ExternalLink,
  Save,
  HelpCircle
} from 'lucide-react';

interface SpreadsheetViewProps {
  quiz: QuizDraft;
  onUpdateQuestions: (updated: QuestionRow[]) => void;
  onSaveQuiz: () => void;
  onPlayInGame: (quizId: string) => void;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  quiz,
  onUpdateQuestions,
  onSaveQuiz,
  onPlayInGame
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSheet, setCopiedSheet] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cell editing handlers
  const handleCellChange = (rowIndex: number, field: keyof QuestionRow, value: string) => {
    const updated = [...quiz.questions];
    updated[rowIndex] = {
      ...updated[rowIndex],
      [field]: value
    };
    onUpdateQuestions(updated);
  };

  const handleAddRow = () => {
    const newRow: QuestionRow = {
      id: `q_custom_${Date.now()}`,
      question: 'Tuliskan butir pertanyaan baru di sini...',
      correctAnswer: 'Kunci jawaban benar',
      optionC: 'Pilihan pengecoh 1',
      optionD: 'Pilihan pengecoh 2',
      optionE: 'Pilihan pengecoh 3',
      bloomLevel: 'C2 - Memahami',
      explanation: 'Pembahasan materi terkait kompetensi pembelajaran.'
    };
    onUpdateQuestions([...quiz.questions, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    if (quiz.questions.length <= 1) return;
    const updated = quiz.questions.filter((_, i) => i !== index);
    onUpdateQuestions(updated);
  };

  // Copy shareable link for game iframe integration
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/api/quiz/${quiz.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Copy as tab-separated values for Google Sheets (Kolom A-E)
  const handleCopyForGoogleSheets = () => {
    let tsv = "Pertanyaan\tJawaban Benar\tPengecoh 1\tPengecoh 2\tPengecoh 3\tTingkat Kognitif\tPembahasan\n";
    quiz.questions.forEach(q => {
      tsv += `${q.question}\t${q.correctAnswer}\t${q.optionC}\t${q.optionD}\t${q.optionE}\t${q.bloomLevel}\t${q.explanation || ''}\n`;
    });
    navigator.clipboard.writeText(tsv);
    setCopiedSheet(true);
    setTimeout(() => setCopiedSheet(false), 2500);
  };

  // Download CSV
  const handleDownloadCSV = () => {
    const escapeCSV = (str: string = '') => `"${(str || '').replace(/"/g, '""')}"`;
    let csv = '\uFEFFPertanyaan,Jawaban Benar,Pengecoh 1,Pengecoh 2,Pengecoh 3,Tingkat Kognitif,Pembahasan\r\n';
    quiz.questions.forEach(q => {
      csv += [
        escapeCSV(q.question),
        escapeCSV(q.correctAnswer),
        escapeCSV(q.optionC),
        escapeCSV(q.optionD),
        escapeCSV(q.optionE),
        escapeCSV(q.bloomLevel),
        escapeCSV(q.explanation || '')
      ].join(',') + '\r\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Draf_Soal_${quiz.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${quiz.phase}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveClick = () => {
    onSaveQuiz();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-6">
      
      {/* Header Info & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-3 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Draf Spreadsheet Soal
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full">
              {quiz.phase} ({quiz.phaseGrade})
            </span>
            <span className="px-2.5 py-1 text-xs font-medium bg-slate-800 text-slate-300 rounded-full">
              {quiz.questions.length} Butir Soal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-game tracking-tight">
            {quiz.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl line-clamp-2">
            <strong className="text-slate-300">Tujuan Pembelajaran:</strong> {quiz.learningGoals}
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => onPlayInGame(quiz.id)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-500/20 transition-all hover:scale-102"
            title="Mainkan game dengan soal ini langsung di iframe"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Mainkan di Game</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-indigo-600/20"
            title="Salin link API / JSON untuk disematkan pada game center"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link Soal'}</span>
          </button>

          <button
            onClick={handleCopyForGoogleSheets}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all"
            title="Salin tabel yang pas untuk di-paste langsung ke Google Sheets (Kolom A-E)"
          >
            {copiedSheet ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSheet ? 'Format Tersalin!' : 'Salin ke Google Sheets'}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition-all"
            title="Unduh file .CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={handleSaveClick}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition-all"
            title="Simpan ke Bank Soal"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-sky-400" />}
            <span className="hidden sm:inline">{saveSuccess ? 'Tersimpan' : 'Simpan'}</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Quick Tip Banner */}
      <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-200">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">📊</span>
          <div>
            <strong className="text-white">Format Standar Spreadsheet Evaluasi:</strong> Kolom A (Pertanyaan), Kolom B (Jawaban Benar), Kolom C, D, E (Pengecoh). Anda dapat mengklik dan mengedit teks sel di bawah ini secara langsung!
          </div>
        </div>
        <a 
          href="https://sheets.new" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold underline shrink-0"
        >
          <span>Buka Google Sheets Baru</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Interactive Spreadsheet Table */}
      <div className="relative overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 shadow-inner">
        <table className="w-full text-left text-sm border-collapse min-w-[960px]">
          
          {/* Table Header: Columns A, B, C, D, E, F, G */}
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800 text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              <th className="py-3 px-3 w-12 text-center text-slate-500 border-r border-slate-800">#</th>
              
              <th className="py-3 px-4 min-w-[280px] border-r border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-[11px]">
                    A
                  </span>
                  <span className="text-slate-200">Pertanyaan (Question)</span>
                </div>
              </th>

              <th className="py-3 px-4 min-w-[200px] border-r border-slate-800 bg-emerald-950/20">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 flex items-center justify-center font-bold text-[11px]">
                    B
                  </span>
                  <span className="text-emerald-300 font-bold">Jawaban Benar (Kunci)</span>
                </div>
              </th>

              <th className="py-3 px-4 min-w-[170px] border-r border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-[11px]">
                    C
                  </span>
                  <span className="text-slate-300">Pengecoh 1</span>
                </div>
              </th>

              <th className="py-3 px-4 min-w-[170px] border-r border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-[11px]">
                    D
                  </span>
                  <span className="text-slate-300">Pengecoh 2</span>
                </div>
              </th>

              <th className="py-3 px-4 min-w-[170px] border-r border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-[11px]">
                    E
                  </span>
                  <span className="text-slate-300">Pengecoh 3</span>
                </div>
              </th>

              <th className="py-3 px-3 w-36 border-r border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold text-[11px]">
                    F
                  </span>
                  <span className="text-purple-300">Bloom</span>
                </div>
              </th>

              <th className="py-3 px-3 w-14 text-center">Aksi</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/80">
            {quiz.questions.map((q, idx) => (
              <tr key={q.id || idx} className="hover:bg-slate-900/60 transition-colors group">
                
                {/* Row Index */}
                <td className="py-2.5 px-3 text-center text-xs font-bold text-slate-500 bg-slate-950/40 border-r border-slate-800">
                  {idx + 1}
                </td>

                {/* Kolom A: Pertanyaan */}
                <td className="p-2 border-r border-slate-800 spreadsheet-cell">
                  <textarea
                    value={q.question}
                    onChange={(e) => handleCellChange(idx, 'question', e.target.value)}
                    rows={2}
                    className="w-full bg-transparent text-slate-100 text-sm focus:outline-none focus:bg-slate-900/90 p-1.5 rounded resize-y"
                    placeholder="Tuliskan pertanyaan..."
                  />
                  {q.explanation && (
                    <div className="text-[11px] text-slate-400 mt-1 italic flex items-center gap-1">
                      <span>💡 {q.explanation}</span>
                    </div>
                  )}
                </td>

                {/* Kolom B: Jawaban Benar */}
                <td className="p-2 border-r border-slate-800 bg-emerald-950/10 spreadsheet-cell">
                  <textarea
                    value={q.correctAnswer}
                    onChange={(e) => handleCellChange(idx, 'correctAnswer', e.target.value)}
                    rows={2}
                    className="w-full bg-transparent text-emerald-200 font-semibold text-sm focus:outline-none focus:bg-emerald-950/30 p-1.5 rounded resize-y"
                    placeholder="Kunci jawaban benar..."
                  />
                </td>

                {/* Kolom C: Pengecoh 1 */}
                <td className="p-2 border-r border-slate-800 spreadsheet-cell">
                  <textarea
                    value={q.optionC}
                    onChange={(e) => handleCellChange(idx, 'optionC', e.target.value)}
                    rows={2}
                    className="w-full bg-transparent text-slate-300 text-sm focus:outline-none focus:bg-slate-900/90 p-1.5 rounded resize-y"
                    placeholder="Pilihan pengecoh 1..."
                  />
                </td>

                {/* Kolom D: Pengecoh 2 */}
                <td className="p-2 border-r border-slate-800 spreadsheet-cell">
                  <textarea
                    value={q.optionD}
                    onChange={(e) => handleCellChange(idx, 'optionD', e.target.value)}
                    rows={2}
                    className="w-full bg-transparent text-slate-300 text-sm focus:outline-none focus:bg-slate-900/90 p-1.5 rounded resize-y"
                    placeholder="Pilihan pengecoh 2..."
                  />
                </td>

                {/* Kolom E: Pengecoh 3 */}
                <td className="p-2 border-r border-slate-800 spreadsheet-cell">
                  <textarea
                    value={q.optionE}
                    onChange={(e) => handleCellChange(idx, 'optionE', e.target.value)}
                    rows={2}
                    className="w-full bg-transparent text-slate-300 text-sm focus:outline-none focus:bg-slate-900/90 p-1.5 rounded resize-y"
                    placeholder="Pilihan pengecoh 3..."
                  />
                </td>

                {/* Kolom F: Bloom */}
                <td className="p-2 border-r border-slate-800">
                  <input
                    type="text"
                    value={q.bloomLevel}
                    onChange={(e) => handleCellChange(idx, 'bloomLevel', e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-purple-300 p-1 rounded focus:bg-slate-900 focus:outline-none"
                  />
                </td>

                {/* Delete Row Button */}
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDeleteRow(idx)}
                    disabled={quiz.questions.length <= 1}
                    className="p-1.5 text-slate-500 hover:text-rose-400 disabled:opacity-30 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Hapus baris ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Bar: Add row & summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={handleAddRow}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white rounded-xl text-xs sm:text-sm font-bold border border-slate-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Baris Soal Baru</span>
        </button>

        <div className="text-xs text-slate-400 text-center sm:text-right">
          Total: <strong className="text-white">{quiz.questions.length}</strong> butir soal siap dievaluasi & disematkan ke game.
        </div>
      </div>

    </div>
  );
};
