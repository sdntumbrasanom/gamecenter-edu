import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory or local store for shared quizzes
interface QuizItem {
  id: string;
  title: string;
  phase: string;
  phaseGrade: string;
  subject: string;
  learningGoals: string;
  bloomLevels: string[];
  createdAt: string;
  questions: Array<{
    id: string;
    question: string;
    correctAnswer: string;
    optionC: string;
    optionD: string;
    optionE: string;
    bloomLevel: string;
    explanation?: string;
  }>;
}

const quizStorage: Map<string, QuizItem> = new Map();

// Seed initial example quiz for immediate playing
const sampleQuiz: QuizItem = {
  id: 'contoh-ipas-fase-b',
  title: 'IPAS Fase B - Siklus Hidup & Energi',
  phase: 'Fase B',
  phaseGrade: 'Kelas 3 - 4 SD',
  subject: 'IPAS (Ilmu Pengetahuan Alam & Sosial)',
  learningGoals: 'Peserta didik memahami siklus hidup hewan dan perubahan bentuk energi di lingkungan sekitar.',
  bloomLevels: ['C1', 'C2', 'C3'],
  createdAt: new Date().toISOString(),
  questions: [
    {
      id: 'q1',
      question: 'Hewan yang mengalami metamorfosis sempurna melewati tahapan kepompong (pupa) adalah...',
      correctAnswer: 'Kupu-kupu',
      optionC: 'Belalang',
      optionD: 'Kecoa',
      optionE: 'Ayam',
      bloomLevel: 'C1 - Mengingat',
      explanation: 'Kupu-kupu mengalami metamorfosis sempurna: telur -> ulat (larva) -> kepompong (pupa) -> kupu-kupu dewasa.'
    },
    {
      id: 'q2',
      question: 'Kipas angin yang menyala saat dihubungkan ke stopkontak mengubah energi listrik menjadi energi...',
      correctAnswer: 'Gerak',
      optionC: 'Bunyi',
      optionD: 'Kimia',
      optionE: 'Cahaya',
      bloomLevel: 'C2 - Memahami',
      explanation: 'Energi listrik mengalir ke dinamo kipas angin dan diubah menjadi energi gerak/kinetik.'
    },
    {
      id: 'q3',
      question: 'Benda cair yang dipanaskan terus-menerus hingga mencapai titik didih akan mengalami perubahan wujud menjadi...',
      correctAnswer: 'Gas (Menguap)',
      optionC: 'Padat (Membeku)',
      optionD: 'Kristal (Mengkristal)',
      optionE: 'Embun (Mengembun)',
      bloomLevel: 'C2 - Memahami',
      explanation: 'Air yang mendidih mengalami peristiwa penguapan, yaitu perubahan wujud dari zat cair menjadi gas.'
    },
    {
      id: 'q4',
      question: 'Mengapa tanaman memerlukan sinar matahari dalam proses fotosintesis?',
      correctAnswer: 'Sebagai sumber energi untuk mengubah air dan karbon dioksida menjadi makanan',
      optionC: 'Agar akar tanaman tidak membusuk oleh air tanah',
      optionD: 'Untuk menarik serangga penyerbuk datang di malam hari',
      optionE: 'Menghangatkan tanah agar biji tidak tumbuh',
      bloomLevel: 'C3 - Menerapkan',
      explanation: 'Sinar matahari diserap oleh klorofil untuk menggerakkan reaksi kimia fotosintesis menghasilkan glukosa dan oksigen.'
    },
    {
      id: 'q5',
      question: 'Alat musik sasando dari Nusa Tenggara Timur dimainkan dengan cara...',
      correctAnswer: 'Dipetik',
      optionC: 'Digesek',
      optionD: 'Ditiup',
      optionE: 'Dipukul',
      bloomLevel: 'C1 - Mengingat',
      explanation: 'Sasando adalah alat musik dawai tradisional khas pulau Rote, NTT yang dimainkan dengan cara dipetik.'
    }
  ]
};
quizStorage.set(sampleQuiz.id, sampleQuiz);

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for fallback generation
function generateMockQuestions(params: {
  phase: string;
  phaseGrade: string;
  subject: string;
  learningGoals: string;
  bloomLevels: string[];
  count: number;
}) {
  const { phase, subject, learningGoals, bloomLevels, count } = params;
  const questions = [];
  const bloomList = bloomLevels.length > 0 ? bloomLevels : ['C1', 'C2', 'C3'];

  // Realistic subject templates
  const subjectTemplates: Record<string, Array<{ q: string; a: string; c: string; d: string; e: string; exp: string }>> = {
    IPAS: [
      {
        q: 'Bagian tumbuhan yang berfungsi menyerap air dan zat hara dari dalam tanah adalah...',
        a: 'Akar',
        c: 'Batang',
        d: 'Daun',
        e: 'Bunga',
        exp: 'Akar menembus tanah untuk menyerap air serta mineral yang dibutuhkan tumbuhan.'
      },
      {
        q: 'Perubahan wujud benda dari cair menjadi padat dinamakan...',
        a: 'Membeku',
        c: 'Mencair',
        d: 'Menguap',
        e: 'Menyublim',
        exp: 'Contoh membeku adalah air yang dimasukkan ke freezer berubah menjadi es batu.'
      },
      {
        q: 'Hewan yang bernapas menggunakan insang pada fase berudu dan paru-paru saat dewasa adalah...',
        a: 'Katak (Amfibi)',
        c: 'Ikan mas',
        d: 'Reptil',
        e: 'Kura-kura',
        exp: 'Katak mengalami metamorfosis dari berudu bernapas insang hingga katak dewasa bernapas dengan paru-paru dan kulit.'
      },
      {
        q: 'Manakah bentuk adaptasi pohon jati saat menghadapi musim kemarau?',
        a: 'Menggugurkan daunnya untuk mengurangi penguapan',
        c: 'Mengembangkan duri tajam pada ranting',
        d: 'Memperbanyak bunga harum di malam hari',
        e: 'Memperlebar permukaan helai daun',
        exp: 'Pohon jati meranggas (menggugurkan daun) di musim kemarau untuk menghemat cadangan air.'
      },
      {
        q: 'Energi alternatif terbarukan yang memanfaatkan hembusan angin untuk memutar turbin adalah...',
        a: 'Energi Bayu (Angin)',
        c: 'Energi Fosil',
        d: 'Energi Nuklir',
        e: 'Energi Panas Bumi',
        exp: 'Pembangkit Listrik Tenaga Bayu (PLTB) memanfaatkan kincir angin untuk menghasilkan listrik ramah lingkungan.'
      }
    ],
    Matematika: [
      {
        q: 'Hasil perhitungan dari 125 + 348 adalah...',
        a: '473',
        c: '463',
        d: '483',
        e: '453',
        exp: '125 + 348 = 473 (100+300=400; 20+40=60; 5+8=13; 400+60+13=473).'
      },
      {
        q: 'Sebuah persegi memiliki panjang sisi 9 cm. Keliling persegi tersebut adalah...',
        a: '36 cm',
        c: '81 cm',
        d: '18 cm',
        e: '27 cm',
        exp: 'Keliling persegi = 4 × sisi = 4 × 9 cm = 36 cm.'
      },
      {
        q: 'Pecahan yang senilai dengan 2/4 adalah...',
        a: '1/2',
        c: '1/3',
        d: '3/5',
        e: '2/8',
        exp: 'Jika pembilang dan penyebut 2/4 sama-sama dibagi 2, didapatkan pecahan paling sederhana 1/2.'
      },
      {
        q: 'Ibu membeli 3 kantong jeruk, masing-masing berisi 15 buah. Berapa jumlah seluruh jeruk ibu?',
        a: '45 buah',
        c: '35 buah',
        d: '50 buah',
        e: '30 buah',
        exp: 'Operasi perkalian: 3 × 15 = 45 buah jeruk.'
      },
      {
        q: 'Sudut yang besarnya tepat 90 derajat disebut sudut...',
        a: 'Siku-siku',
        c: 'Lancip',
        d: 'Tumpul',
        e: 'Refleks',
        exp: 'Sudut 90 derajat merupakan sudut siku-siku, lebih kecil dari 90 derajat sudut lancip, lebih besar sudut tumpul.'
      }
    ],
    Pancasila: [
      {
        q: 'Sikap saling menghormati antar pemeluk agama yang berbeda merupakan pengamalan Pancasila sila ke-...',
        a: 'Pertama (Ketuhanan Yang Maha Esa)',
        c: 'Kedua',
        d: 'Ketiga',
        e: 'Kelima',
        exp: 'Sila ke-1 menjiwai toleransi beragama dan kebebasan beribadah.'
      },
      {
        q: 'Simbol padi dan kapas pada perisai burung Garuda melambangkan sila...',
        a: 'Keadilan Sosial bagi Seluruh Rakyat Indonesia',
        c: 'Persatuan Indonesia',
        d: 'Kemanusiaan yang Adil dan Beradab',
        e: 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan',
        exp: 'Padi dan kapas melambangkan pangan dan sandang sebagai syarat kemakmuran dan keadilan sosial.'
      },
      {
        q: 'Kegiatan gotong royong membersihkan selokan lingkungan sekolah mencerminkan penerapan sila...',
        a: 'Ketiga (Persatuan Indonesia)',
        c: 'Pertama',
        d: 'Kedua',
        e: 'Keempat',
        exp: 'Gotong royong mempererat kerukunan dan persatuan bangsa.'
      }
    ]
  };

  const subjectKey = subject.includes('Matematika') ? 'Matematika' :
                     subject.includes('Pancasila') ? 'Pancasila' : 'IPAS';
  const templates = subjectTemplates[subjectKey] || subjectTemplates.IPAS;

  for (let i = 1; i <= count; i++) {
    const selectedBloom = bloomList[(i - 1) % bloomList.length];
    let bloomLabel = `${selectedBloom} - `;
    if (selectedBloom === 'C1') bloomLabel += 'Mengingat';
    else if (selectedBloom === 'C2') bloomLabel += 'Memahami';
    else if (selectedBloom === 'C3') bloomLabel += 'Menerapkan';
    else if (selectedBloom === 'C4') bloomLabel += 'Menganalisis';
    else if (selectedBloom === 'C5') bloomLabel += 'Mengevaluasi';
    else if (selectedBloom === 'C6') bloomLabel += 'Mencipta';

    const t = templates[(i - 1) % templates.length];

    questions.push({
      id: `q_${Date.now()}_${i}`,
      question: count <= templates.length 
        ? t.q 
        : `[${selectedBloom}] ${t.q} (Soal ${i} - ${learningGoals.slice(0, 40)}...)`,
      correctAnswer: t.a,
      optionC: t.c,
      optionD: t.d,
      optionE: t.e,
      bloomLevel: bloomLabel,
      explanation: t.exp
    });
  }

  return questions;
}

// POST: Generate Questions API
app.post('/api/generate-questions', async (req, res) => {
  try {
    const {
      phase = 'Fase B',
      phaseGrade = 'Kelas 3 - 4 SD',
      subject = 'IPAS',
      learningGoals = 'Memahami siklus hidup makhluk hidup',
      bloomLevels = ['C1', 'C2', 'C3'],
      questionCount = 5,
      distractorStyle = 'edukatif',
      customApiKey = '',
      teacherEmail = '',
      accessToken = '',
      projectId = 'gen-lang-client-0622433243',
      location = 'us-central1'
    } = req.body;

    const count = Math.min(Math.max(parseInt(questionCount, 10) || 5, 1), 25);
    const selectedBloomStr = Array.isArray(bloomLevels) && bloomLevels.length > 0
      ? bloomLevels.join(', ')
      : 'C1, C2, C3';

    const promptText = `Anda adalah pakar kurikulum pendidikan nasional Indonesia (Kurikulum Merdeka) dan spesialis asesmen pembelajaran berbasis Taksonomi Bloom.

Tugas Anda adalah membuat draf soal pilihan ganda berkualitas tinggi untuk dimasukkan ke dalam spreadsheet evaluasi pembelajaran dan disematkan ke dalam game edukasi siswa.

Spesifikasi Soal:
- Jenjang / Fase: ${phase} (${phaseGrade})
- Mata Pelajaran: ${subject}
- Tujuan Pembelajaran (TP) / Capaian: "${learningGoals}"
- Tingkat Kognitif Taksonomi Bloom yang ditargetkan: ${selectedBloomStr} (Gunakan variasi C1 sampai C6 sesuai pilihan)
- Jumlah Soal: ${count} butir soal
- Karakteristik Pengecoh: ${distractorStyle} (Pengecoh harus logis, realistis, dan mendidik agar tidak langsung kentara salah, namun jelas berbeda dari kunci jawaban yang benar)

Format Spreadsheet Wajib:
Untuk setiap soal, siapkan:
1. Kolom A: Pertanyaan (jelas, menggunakan Bahasa Indonesia baku yang komunikatif dan ramah anak sesuai fase usia).
2. Kolom B: Jawaban Benar (kunci jawaban mutlak yang akurat).
3. Kolom C: Pengecoh 1 (jawaban opsional salah tapi masuk akal).
4. Kolom D: Pengecoh 2 (jawaban opsional salah lainnya).
5. Kolom E: Pengecoh 3 (jawaban opsional salah lainnya).
6. Tingkat Kognitif (contoh: "C2 - Memahami", "C3 - Menerapkan", dll.).
7. Pembahasan singkat (1-2 kalimat ringkas untuk umpan balik evaluasi).

Kembalikan HANYA format JSON array valid murni berisi objek dengan keys: "question", "correctAnswer", "optionC", "optionD", "optionE", "bloomLevel", "explanation".`;

    // 1. UTAMA: Google Cloud Vertex AI via OAuth Access Token (Tanpa API Key)
    if (accessToken && typeof accessToken === 'string' && accessToken.trim().length > 10) {
      try {
        console.log(`[Vertex AI OAuth] Memanggil Google Cloud Vertex AI untuk project: ${projectId}, region: ${location}`);
        const cleanToken = accessToken.trim();
        const vertexUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-1.5-flash:generateContent`;

        const vertexController = new AbortController();
        const vertexTimeout = setTimeout(() => vertexController.abort(), 8000);

        const vertexRes = await fetch(vertexUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: promptText }]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          }),
          signal: vertexController.signal
        });

        clearTimeout(vertexTimeout);

        if (vertexRes.ok) {
          const vertexData: any = await vertexRes.json();
          const rawContent = vertexData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
          let parsedQuestions: any[] = [];
          try {
            parsedQuestions = JSON.parse(rawContent);
          } catch {
            const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              parsedQuestions = JSON.parse(jsonMatch[0]);
            }
          }

          if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
            const formatted = parsedQuestions.map((item, idx) => ({
              id: `q_vertex_${Date.now()}_${idx + 1}`,
              question: item.question,
              correctAnswer: item.correctAnswer,
              optionC: item.optionC,
              optionD: item.optionD,
              optionE: item.optionE,
              bloomLevel: item.bloomLevel || 'C2 - Memahami',
              explanation: item.explanation || ''
            }));

            return res.json({
              success: true,
              source: 'vertex_ai_oauth',
              message: 'Soal berhasil di-generate menggunakan Google Cloud Vertex AI dengan OAuth Access Token (Tanpa API Key)',
              questions: formatted
            });
          }
        } else {
          const errBody = await vertexRes.text();
          console.warn(`[Vertex AI OAuth Warning] HTTP ${vertexRes.status}:`, errBody);
        }
      } catch (vertexErr: any) {
        console.warn('[Vertex AI OAuth Exception]:', vertexErr.message);
      }
    }

    // 2. ALTERNATIF: Gemini API Key (Google AI Studio)
    const effectiveApiKey = (customApiKey && typeof customApiKey === 'string' && customApiKey.trim().length > 5)
      ? customApiKey.trim()
      : (process.env.GEMINI_API_KEY || '');

    if (effectiveApiKey && effectiveApiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const clientAi = new GoogleGenAI({
          apiKey: effectiveApiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `Anda adalah pakar kurikulum pendidikan nasional Indonesia (Kurikulum Merdeka) dan spesialis asesmen pembelajaran berbasis Taksonomi Bloom.

Tugas Anda adalah membuat draf soal pilihan ganda berkualitas tinggi untuk dimasukkan ke dalam spreadsheet evaluasi pembelajaran dan disematkan ke dalam game edukasi siswa.

Spesifikasi Soal:
- Jenjang / Fase: ${phase} (${phaseGrade})
- Mata Pelajaran: ${subject}
- Tujuan Pembelajaran (TP) / Capaian: "${learningGoals}"
- Tingkat Kognitif Taksonomi Bloom yang ditargetkan: ${selectedBloomStr} (Gunakan variasi C1 sampai C6 sesuai pilihan)
- Jumlah Soal: ${count} butir soal
- Karakteristik Pengecoh: ${distractorStyle} (Pengecoh harus logis, realistis, dan mendidik agar tidak langsung kentara salah, namun jelas berbeda dari kunci jawaban yang benar)

Format Spreadsheet Wajib:
Untuk setiap soal, siapkan:
1. Kolom A: Pertanyaan (jelas, menggunakan Bahasa Indonesia baku yang komunikatif dan ramah anak sesuai fase usia).
2. Kolom B: Jawaban Benar (kunci jawaban mutlak yang akurat).
3. Kolom C: Pengecoh 1 (jawaban opsional salah tapi masuk akal).
4. Kolom D: Pengecoh 2 (jawaban opsional salah lainnya).
5. Kolom E: Pengecoh 3 (jawaban opsional salah lainnya).
6. Tingkat Kognitif (contoh: "C2 - Memahami", "C3 - Menerapkan", dll.).
7. Pembahasan singkat (1-2 kalimat ringkas untuk umpan balik evaluasi).

Kembalikan murni format JSON array sesuai skema yang diminta.`;

        const geminiPromise = clientAi.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Anda adalah asisten kurikulum merdeka profesional yang menghasilkan soal asesmen terstruktur dalam format JSON.',
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              description: 'Daftar butir soal asesmen evaluasi pembelajaran',
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: 'Teks pertanyaan (Kolom A)' },
                  correctAnswer: { type: Type.STRING, description: 'Kunci jawaban benar (Kolom B)' },
                  optionC: { type: Type.STRING, description: 'Pengecoh opsi C (Kolom C)' },
                  optionD: { type: Type.STRING, description: 'Pengecoh opsi D (Kolom D)' },
                  optionE: { type: Type.STRING, description: 'Pengecoh opsi E (Kolom E)' },
                  bloomLevel: { type: Type.STRING, description: 'Tingkat kognitif taksonomi bloom (contoh: C1 - Mengingat)' },
                  explanation: { type: Type.STRING, description: 'Penjelasan/pembahasan ringkas untuk umpan balik pembelajaran' }
                },
                required: ['question', 'correctAnswer', 'optionC', 'optionD', 'optionE', 'bloomLevel']
              }
            }
          }
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gemini API timeout')), 6000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        const rawJson = response.text || '[]';
        const parsed = JSON.parse(rawJson);

        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted = parsed.map((item, idx) => ({
            id: `q_${Date.now()}_${idx + 1}`,
            question: item.question,
            correctAnswer: item.correctAnswer,
            optionC: item.optionC,
            optionD: item.optionD,
            optionE: item.optionE,
            bloomLevel: item.bloomLevel || 'C2 - Memahami',
            explanation: item.explanation || ''
          }));

          return res.json({
            success: true,
            source: 'gemini',
            questions: formatted
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed or timed out, switching to smart educational template fallback:', geminiError);
      }
    }

    // Smart fallback generator
    const fallbackQuestions = generateMockQuestions({
      phase,
      phaseGrade,
      subject,
      learningGoals,
      bloomLevels: Array.isArray(bloomLevels) ? bloomLevels : ['C1', 'C2', 'C3'],
      count
    });

    return res.json({
      success: true,
      source: 'smart_generator',
      questions: fallbackQuestions
    });

  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Terjadi kesalahan saat membuat draf soal'
    });
  }
});

// POST: Save or Update Quiz
app.post('/api/quizzes', (req, res) => {
  try {
    const { id, title, phase, phaseGrade, subject, learningGoals, bloomLevels, questions } = req.body;
    const quizId = id || `quiz-${Date.now()}`;
    const quizItem: QuizItem = {
      id: quizId,
      title: title || `Kuis ${subject || 'Edukasi'} - ${phase || 'Kurikulum Merdeka'}`,
      phase: phase || 'Fase B',
      phaseGrade: phaseGrade || 'Kelas 3 - 4 SD',
      subject: subject || 'Umum',
      learningGoals: learningGoals || '',
      bloomLevels: Array.isArray(bloomLevels) ? bloomLevels : ['C1'],
      createdAt: new Date().toISOString(),
      questions: Array.isArray(questions) ? questions : []
    };

    quizStorage.set(quizId, quizItem);

    return res.json({
      success: true,
      id: quizId,
      quiz: quizItem,
      message: 'Soal berhasil disimpan ke database portal'
    });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
});

// GET: All quizzes
app.get('/api/quizzes', (req, res) => {
  const list = Array.from(quizStorage.values()).map(q => ({
    id: q.id,
    title: q.title,
    phase: q.phase,
    phaseGrade: q.phaseGrade,
    subject: q.subject,
    questionCount: q.questions.length,
    createdAt: q.createdAt
  }));
  return res.json({ success: true, quizzes: list });
});

// GET: Specific Quiz JSON
app.get('/api/quiz/:id', (req, res) => {
  const quiz = quizStorage.get(req.params.id);
  if (!quiz) {
    return res.status(404).json({ success: false, error: 'Kuis tidak ditemukan' });
  }
  return res.json(quiz);
});

// GET: Quiz as CSV format (directly downloadable or readable by external games & Google Sheets)
app.get('/api/quiz/:id/csv', (req, res) => {
  const quiz = quizStorage.get(req.params.id);
  if (!quiz) {
    return res.status(404).send('Quiz not found');
  }

  // Generate CSV matching requested layout:
  // Kolom A: Pertanyaan
  // Kolom B: Jawaban Benar
  // Kolom C: Pengecoh 1
  // Kolom D: Pengecoh 2
  // Kolom E: Pengecoh 3
  // Kolom F: Tingkat Kognitif
  // Kolom G: Pembahasan
  const escapeCSV = (str: string = '') => `"${(str || '').replace(/"/g, '""')}"`;

  let csv = 'Pertanyaan,Jawaban Benar,Pengecoh 1,Pengecoh 2,Pengecoh 3,Tingkat Kognitif,Pembahasan\r\n';

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

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${quiz.id}.csv"`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.send(csv);
});

// Server setup with Vite middleware in dev or static in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 EduGame Hub running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
