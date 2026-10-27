import { PhaseInfo, BloomDetail, PhaseType } from '../types';

export const PHASES: PhaseInfo[] = [
  {
    id: 'Fase A',
    title: 'Fase A',
    grade: 'Kelas 1 & 2 SD',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'Fase B',
    title: 'Fase B',
    grade: 'Kelas 3 & 4 SD',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
  },
  {
    id: 'Fase C',
    title: 'Fase C',
    grade: 'Kelas 5 & 6 SD',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
  },
  {
    id: 'Fase D',
    title: 'Fase D',
    grade: 'Kelas 7, 8, & 9 SMP',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  {
    id: 'Fase E',
    title: 'Fase E',
    grade: 'Kelas 10 SMA/SMK',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  {
    id: 'Fase F',
    title: 'Fase F',
    grade: 'Kelas 11 & 12 SMA/SMK',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  },
  {
    id: 'Fondasi',
    title: 'Fase Fondasi',
    grade: 'PAUD / TK',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
  }
];

export const SUBJECTS = [
  'IPAS (Ilmu Pengetahuan Alam & Sosial)',
  'Matematika',
  'Bahasa Indonesia',
  'Pendidikan Pancasila',
  'Bahasa Inggris',
  'Informatika',
  'Seni Budaya & Prakarya',
  'Pendidikan Agama & Budi Pekerti',
  'PJOK (Olahraga & Kesehatan)'
];

export const BLOOM_TAXONOMY: BloomDetail[] = [
  {
    code: 'C1',
    name: 'Mengingat',
    category: 'LOTS',
    desc: 'Mengingat kembali fakta, istilah, konsep dasar, dan jawaban sederhana (Menyebutkan, Mengidentifikasi, Menghafal).',
    color: 'border-blue-500/40 bg-blue-500/10 text-blue-300'
  },
  {
    code: 'C2',
    name: 'Memahami',
    category: 'LOTS',
    desc: 'Menjelaskan ide, meringkas materi, mengklasifikasikan informasi, dan menafsirkan arti (Menjelaskan, Membandingkan).',
    color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
  },
  {
    code: 'C3',
    name: 'Menerapkan',
    category: 'MOTS',
    desc: 'Menggunakan informasi atau rumus untuk memecahkan persoalan baru dalam situasi nyata (Menghitung, Mempraktikkan).',
    color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
  },
  {
    code: 'C4',
    name: 'Menganalisis',
    category: 'HOTS',
    desc: 'Memecah informasi menjadi bagian-bagian, menemukan pola, sebab-akibat, dan relasi logis (Menelaah, Membedakan).',
    color: 'border-amber-500/40 bg-amber-500/10 text-amber-300'
  },
  {
    code: 'C5',
    name: 'Mengevaluasi',
    category: 'HOTS',
    desc: 'Membuat penilaian berdasarkan kriteria, mengkritisi kesimpulan, dan memilih solusi terbaik (Menilai, Memutuskan).',
    color: 'border-purple-500/40 bg-purple-500/10 text-purple-300'
  },
  {
    code: 'C6',
    name: 'Mencipta',
    category: 'HOTS',
    desc: 'Menggabungkan elemen menjadi pola baru, merumuskan hipotesis, dan merancang solusi alternatif kreatif.',
    color: 'border-rose-500/40 bg-rose-500/10 text-rose-300'
  }
];

export const SAMPLE_LEARNING_GOALS: Record<PhaseType, string[]> = {
  'Fase A': [
    'Peserta didik dapat membilang, membaca, dan menulis bilangan cacah sampai dengan 50.',
    'Peserta didik dapat mengidentifikasi aturan yang berlaku di rumah dan di sekolah.',
    'Peserta didik mampu mengenal dan menceritakan kembali tokoh dalam teks narasi pendek.',
    'Peserta didik mengamati dan menyebutkan bagian-bagian tubuh tumbuhan di sekitar sekolah.'
  ],
  'Fase B': [
    'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan (akar, batang, daun).',
    'Peserta didik memahami konsep perkalian dan pembagian bilangan cacah sampai 100 serta penerapannya sehari-hari.',
    'Peserta didik dapat mengidentifikasi siklus hidup serangga dan hewan di lingkungan sekitar.',
    'Peserta didik memahami makna nilai-nilai Pancasila dalam kehidupan bermasyarakat dan gotong royong.'
  ],
  'Fase C': [
    'Peserta didik menyelidiki bagaimana organ pencernaan manusia bekerja dan hubungannya dengan pola hidup sehat.',
    'Peserta didik menyelesaikan masalah yang berkaitan dengan operasi pecahan dan desimal dalam kehidupan nyata.',
    'Peserta didik menganalisis letak geografis Indonesia dan dampaknya terhadap keragaman budaya.',
    'Peserta didik mengidentifikasi sifat-sifat cahaya dan pemanfaatannya dalam teknologi periskop dan lup.'
  ],
  'Fase D': [
    'Peserta didik menganalisis interaksi antar makhluk hidup dan lingkungannya dalam jaring-jaring makanan dan ekosistem.',
    'Peserta didik menyelesaikan persamaan linear satu variabel dan menggunakannya untuk pemodelan kasus sehari-hari.',
    'Peserta didik menelaah struktur dan kaidah kebahasaan teks laporan hasil observasi (LHO).',
    'Peserta didik memahami prinsip kerja sistem komputer dasar, algoritma sederhana, dan pemikiran komputasional.'
  ],
  'Fase E': [
    'Peserta didik menganalisis fenomena perubahan iklim global serta merumuskan aksi mitigasi lingkungan.',
    'Peserta didik menggunakan konsep barisan dan deret geometri dalam perhitungan pertumbuhan dan bunga majemuk.',
    'Peserta didik mengevaluasi gagasan dan fakta dalam teks eksposisi dan artikel ilmiah populer.'
  ],
  'Fase F': [
    'Peserta didik mengaplikasikan prinsip kinetika kimia dan laju reaksi dalam proses industri berkelanjutan.',
    'Peserta didik memecahkan persoalan kalkulus diferensial untuk menentukan nilai optimum dalam konteks ekonomi dan teknik.',
    'Peserta didik merancang program sederhana berbasis logika kecerdasan buatan dan analisis data.'
  ],
  'Fondasi': [
    'Anak mampu mengenal lambang bilangan 1 sampai 10 dan mencocokkan dengan jumlah benda.',
    'Anak mengenal emosi diri dan menunjukkan perilaku saling tolong menolong dengan teman.'
  ]
};
