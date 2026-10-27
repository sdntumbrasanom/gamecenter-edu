import { GameItem } from '../types';

export const DEFAULT_GAMES: GameItem[] = [
  {
    id: 'game-kuis-antariksa',
    title: 'Kuis Bintang Antariksa',
    description: 'Jelajahi galaksi dan kumpulkan energi bintang dengan menjawab soal evaluasi pembelajaran. Tampilan visual modern dengan sound FX ceria.',
    githubUrl: 'https://github.com/edugame-id/kuis-bintang-antariksa',
    playUrl: '/games/kuis-antariksa/index.html',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    phase: 'Semua Fase (A - F)',
    subject: 'Semua Mata Pelajaran',
    supportsCustomQuiz: true,
    quizParamName: 'quiz',
    isBuiltIn: true,
    status: 'ready'
  },
  {
    id: 'game-labirin-harta',
    title: 'Labirin Harta Edukasi',
    description: 'Petualangan RPG mini menyusuri labirin misteri. Buka peti harta karun dengan memecahkan soal kuis kurikulum merdeka!',
    githubUrl: 'https://github.com/edugame-id/labirin-harta-edukasi',
    playUrl: '/games/labirin-harta/index.html',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    phase: 'Fase A & Fase B (SD)',
    subject: 'IPAS & Matematika',
    supportsCustomQuiz: true,
    quizParamName: 'quiz',
    isBuiltIn: true,
    status: 'ready'
  },
  {
    id: 'game-tower-trivia',
    title: 'Menara Juara (Tower Trivia)',
    description: 'Bangun menara setinggi langit dengan menjawab cepat setiap butir pertanyaan yang telah guru buat di spreadsheet.',
    githubUrl: 'https://github.com/edugame-id/tower-trivia-builder',
    playUrl: '/games/kuis-antariksa/index.html',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    phase: 'Fase B & Fase C',
    subject: 'Pendidikan Pancasila & IPS',
    supportsCustomQuiz: true,
    quizParamName: 'quiz',
    isBuiltIn: true,
    status: 'ready'
  },
  {
    id: 'game-runner-edukasi',
    title: 'Petualangan Pulau Belajar',
    description: 'Lari, hindari rintangan, dan lewati pos evaluasi pembelajaran. Cocok untuk asesmen formatif yang menyenangkan.',
    githubUrl: 'https://github.com/edugame-id/island-runner-edu',
    playUrl: '/games/labirin-harta/index.html',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    phase: 'Fase C & Fase D (SMP)',
    subject: 'Bahasa Indonesia & Inggris',
    supportsCustomQuiz: true,
    quizParamName: 'quiz',
    isBuiltIn: true,
    status: 'ready'
  },
  {
    id: 'game-cerdas-tangkas-merdeka',
    title: 'Cerdas Tangkas Merdeka',
    description: 'Kompetisi adu cepat menjawab soal pemahaman konsep. Link repositori game ini siap dimasukkan melalui menu admin.',
    githubUrl: '',
    playUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    phase: 'Semua Fase (A - F)',
    subject: 'IPAS & Informatika',
    supportsCustomQuiz: true,
    quizParamName: 'quiz',
    isBuiltIn: false,
    status: 'pending_link'
  },
  {
    id: 'game-tts-sains-budaya',
    title: 'Teka-Teki Silang Sains & Budaya',
    description: 'Permainan teka-teki silang edukatif bertema nusantara dan sains alam. Link siap diperbarui oleh admin.',
    githubUrl: '',
    playUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    phase: 'Fase B, C & D',
    subject: 'Seni Budaya & IPAS',
    supportsCustomQuiz: true,
    quizParamName: 'quiz',
    isBuiltIn: false,
    status: 'pending_link'
  },
  {
    id: 'game-arena-matematika-kilat',
    title: 'Arena Matematika Kilat',
    description: 'Latihan berhitung cepat operasi bilangan cacah, pecahan, dan logika geometri. Link siap diisi admin misbah.',
    githubUrl: '',
    playUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    phase: 'Fase A, B & C',
    subject: 'Matematika',
    supportsCustomQuiz: true,
    quizParamName: 'quiz',
    isBuiltIn: false,
    status: 'pending_link'
  },
  {
    id: 'game-labirin-kata-cerdas',
    title: 'Labirin Kata & Kosakata Cerdas',
    description: 'Menemukan pasangan kata sinonim, antonim, dan menyusun kalimat narasi bahasa Indonesia. Link siap diisi admin.',
    githubUrl: '',
    playUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    phase: 'Fase A & Fase B',
    subject: 'Bahasa Indonesia',
    supportsCustomQuiz: true,
    quizParamName: 'quiz',
    isBuiltIn: false,
    status: 'pending_link'
  }
];

export const PRESET_THUMBNAILS = [
  {
    title: 'Antariksa & Roket',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Labirin Fantasi',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Arcade Retro',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Pulau Petualangan',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Cyberpunk & Neon',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Alam & Hewan',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Matematika & Rumus',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Buku & Literasi',
    url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80'
  }
];
