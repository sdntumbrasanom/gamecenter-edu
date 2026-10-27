import React from 'react';
import { X, BookOpen, Layers, FileSpreadsheet, Gamepad2, CheckCircle2, ExternalLink } from 'lucide-react';

interface TeacherGuideModalProps {
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-game">
              Panduan Guru & Alur Kerja Terpadu
            </h2>
            <p className="text-xs text-slate-400">
              Integrasi Kurikulum Merdeka, Google Sheets, dan Game Center Iframe
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-400 text-sm">
              <span className="w-6 h-6 rounded-lg bg-indigo-600/30 flex items-center justify-center text-xs">1</span>
              <span>Buat Soal Berdasarkan Fase & Taksonomi Bloom</span>
            </div>
            <p className="leading-relaxed text-slate-400 pl-8">
              Pilih Fase yang sesuai dengan jenjang siswa (<strong>Fase A</strong> untuk kelas 1-2 SD, <strong>Fase B</strong> untuk kelas 3-4 SD, <strong>Fase C</strong> kelas 5-6 SD, <strong>Fase D</strong> untuk SMP, dst.). Pilih tingkat Taksonomi Bloom mulai dari <strong>C1 (Mengingat)</strong> hingga <strong>C6 (Mencipta)</strong> untuk menguji kompetensi LOTS, MOTS, maupun HOTS.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <span className="w-6 h-6 rounded-lg bg-emerald-600/30 flex items-center justify-center text-xs">2</span>
              <span>Struktur Draf Spreadsheet Evaluasi</span>
            </div>
            <p className="leading-relaxed text-slate-400 pl-8">
              Sistem akan memformat butir soal secara otomatis menjadi tabel spreadsheet:
            </p>
            <div className="pl-8 grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-indigo-400 font-bold block">Kolom A</span> Pertanyaan
              </div>
              <div className="p-2 bg-emerald-950/40 rounded-lg border border-emerald-800/40">
                <span className="text-emerald-400 font-bold block">Kolom B</span> Jawaban Benar
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold block">Kolom C</span> Pengecoh 1
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold block">Kolom D</span> Pengecoh 2
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold block">Kolom E</span> Pengecoh 3
              </div>
            </div>
            <p className="leading-relaxed text-slate-400 pl-8 text-xs pt-1">
              Pilihan C, D, dan E sengaja disusun dengan pengecoh logis guna mendeteksi pemahaman dan miskonsepsi siswa.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sky-400 text-sm">
              <span className="w-6 h-6 rounded-lg bg-sky-600/30 flex items-center justify-center text-xs">3</span>
              <span>Integrasi ke Google Sheets & Link Online</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-8">
              <li>
                <strong>Opsi A (1-Klik Salin):</strong> Klik tombol <em>"Salin ke Google Sheets"</em>, lalu buka Google Sheets dan tekan <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Ctrl+V</kbd> di sel A1. Seluruh kolom A sampai E akan langsung terisi rapi.
              </li>
              <li>
                <strong>Opsi B (Link Langsung):</strong> Klik tombol <em>"Salin Link Soal"</em> untuk mendapatkan URL publik (format JSON/CSV) yang bisa disematkan langsung ke game center.
              </li>
              <li>
                <strong>Opsi C (Publikasi Google Sheets):</strong> Jika mengedit di Google Sheets, Anda dapat membagikannya: <code className="text-sky-300">File &gt; Bagikan &gt; Publikasikan ke web &gt; Pilih CSV &gt; Salin tautan</code>.
              </li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-pink-400 text-sm">
              <span className="w-6 h-6 rounded-lg bg-pink-600/30 flex items-center justify-center text-xs">4</span>
              <span>Menyematkan Soal ke Game & Menambah Game GitHub</span>
            </div>
            <p className="leading-relaxed text-slate-400 pl-8">
              Buka menu <strong>Pilih Game</strong>, lalu klik <strong>Mainkan Game</strong>. Pada bilah atas jendela game, pilih kuis Anda. Game akan seketika memuat butir soal yang telah dibuat ke dalam petualangan permainan murid! Jika ingin menambah game karya sendiri, cukup klik <strong>Tambah Game</strong> dan masukkan link repositori GitHub serta banner gambar.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm font-game shadow-md transition-colors"
          >
            Mengerti, Siap Membuat Soal & Game 👍
          </button>
        </div>

      </div>
    </div>
  );
};
