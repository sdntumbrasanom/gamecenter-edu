/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameItem, QuizDraft, TeacherProfile } from './types';
import { DEFAULT_GAMES } from './data/defaultGames';
import { FloatingHUD } from './components/FloatingHUD';
import { LandingHero } from './components/LandingHero';
import { GameCenter } from './components/GameCenter';
import { QuestionGenerator } from './components/QuestionGenerator';
import { QuizBankModal } from './components/QuizBankModal';
import { GamePlayerModal } from './components/GamePlayerModal';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { SpreadsheetView } from './components/SpreadsheetView';

const STORAGE_GAMES_KEY = 'edugame_hub_custom_games_v2';
const STORAGE_QUIZZES_KEY = 'edugame_hub_quizzes_v2';
const STORAGE_TEACHER_KEY = 'edugame_hub_teacher_profile_v2';

export default function App() {
  // Start on simple 2-button landing page by default
  const [activeTab, setActiveTab] = useState<'landing' | 'games' | 'generator' | 'saved'>('landing');

  // Games state
  const [games, setGames] = useState<GameItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_GAMES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return DEFAULT_GAMES;
  });

  // Quizzes bank state
  const [quizzes, setQuizzes] = useState<QuizDraft[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_QUIZZES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return [];
  });

  // Teacher Profile state (Google Login & Mandatory API Key)
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_TEACHER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return null;
  });

  // Admin session state (user: misbah, pass: misbah5758)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('edugame_admin_auth') === 'true';
  });

  // Browser Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals state
  const [showTeacherLogin, setShowTeacherLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeGameForPlay, setActiveGameForPlay] = useState<GameItem | null>(null);
  const [activeQuizIdForPlay, setActiveQuizIdForPlay] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizDraft | null>(null);

  // Sync with server sample quiz on first load if quizzes is empty
  useEffect(() => {
    if (quizzes.length === 0) {
      fetch('/api/quiz/contoh-ipas-fase-b')
        .then(r => r.json())
        .then(data => {
          if (data && data.questions) {
            setQuizzes([data]);
            setSelectedQuiz(data);
          }
        })
        .catch(() => {});
    } else if (!selectedQuiz && quizzes.length > 0) {
      setSelectedQuiz(quizzes[0]);
    }
  }, []);

  // Save games to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(games));
    } catch (e) {}
  }, [games]);

  // Save quizzes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_QUIZZES_KEY, JSON.stringify(quizzes));
    } catch (e) {}
  }, [quizzes]);

  // Save teacherProfile to localStorage
  useEffect(() => {
    if (teacherProfile) {
      try {
        localStorage.setItem(STORAGE_TEACHER_KEY, JSON.stringify(teacherProfile));
      } catch (e) {}
    }
  }, [teacherProfile]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Hash route detector (e.g. #play=game-id&quiz=quiz-id)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('play=')) {
        const params = new URLSearchParams(hash.replace(/^#/, ''));
        const gameId = params.get('play');
        const quizId = params.get('quiz');
        const targetGame = games.find(g => g.id === gameId);
        if (targetGame) {
          setActiveGameForPlay(targetGame);
          if (quizId) setActiveQuizIdForPlay(quizId);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [games]);

  // Handle Admin
  const handleAdminSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('edugame_admin_auth', 'true');
    setShowAdminPanel(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('edugame_admin_auth');
    setShowAdminPanel(false);
  };

  // Handle Teacher Google Login
  const handleTeacherLoginSuccess = (profile: TeacherProfile) => {
    setTeacherProfile(profile);
    setActiveTab('generator');
  };

  // Click "Buat Soal" from Landing
  const handleSelectBuatSoal = () => {
    // If not logged in with Google (either via OAuth Access Token or API Key), prompt login
    if (!teacherProfile?.isLoggedIn || (!teacherProfile?.accessToken && !teacherProfile?.apiKey)) {
      setShowTeacherLogin(true);
    } else {
      setActiveTab('generator');
    }
  };

  // Add / Update / Delete Game
  const handleAddGame = (newGame: GameItem) => {
    setGames([newGame, ...games]);
  };

  const handleUpdateGame = (updated: GameItem) => {
    setGames(games.map(g => g.id === updated.id ? updated : g));
  };

  const handleDeleteGame = (gameId: string) => {
    setGames(games.filter(g => g.id !== gameId));
  };

  // Quiz Bank Handlers
  const handleSaveQuizToBank = (quiz: QuizDraft) => {
    const exists = quizzes.some(q => q.id === quiz.id);
    let updated: QuizDraft[];
    if (exists) {
      updated = quizzes.map(q => q.id === quiz.id ? quiz : q);
    } else {
      updated = [quiz, ...quizzes];
    }
    setQuizzes(updated);
    setSelectedQuiz(quiz);

    fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quiz)
    }).catch(() => {});
  };

  const handleDeleteQuiz = (quizId: string) => {
    const updated = quizzes.filter(q => q.id !== quizId);
    setQuizzes(updated);
    if (selectedQuiz?.id === quizId) {
      setSelectedQuiz(updated.length > 0 ? updated[0] : null);
    }
  };

  const handlePlayGame = (game: GameItem, quizId?: string) => {
    setActiveGameForPlay(game);
    setActiveQuizIdForPlay(quizId || (quizzes.length > 0 ? quizzes[0].id : null));
  };

  const handlePlayQuizInGame = (quizId: string) => {
    setActiveQuizIdForPlay(quizId);
    if (games.length > 0) {
      setActiveGameForPlay(games[0]);
    } else {
      setActiveTab('games');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      
      {/* GLOBAL BACKGROUND: Kumpulan Banyak Game Transparan (Mosaic Game Collage) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute -inset-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 opacity-25 scale-105 transform -rotate-2">
          {games.concat(games).map((g, idx) => (
            <div 
              key={`${g.id}-${idx}`}
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5"
            >
              <img 
                src={g.imageUrl} 
                alt={g.title} 
                className="w-full h-full object-cover filter brightness-75 saturate-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
            </div>
          ))}
        </div>

        {/* Semi-transparent dark frosted glass overlay */}
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/90" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      {/* FRESH FLOATING HUD (NO CONVENTIONAL WEBPAGE NAVBAR) */}
      <FloatingHUD
        activeTab={activeTab}
        onNavigate={(tab) => {
          if (tab === 'generator' && (!teacherProfile?.isLoggedIn || !teacherProfile?.apiKey)) {
            setShowTeacherLogin(true);
          } else {
            setActiveTab(tab);
          }
        }}
        teacherProfile={teacherProfile}
        isAdminLoggedIn={isAdminLoggedIn}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) setShowAdminPanel(true);
          else setShowAdminLogin(true);
        }}
        onOpenTeacherLogin={() => setShowTeacherLogin(true)}
        onOpenGuide={() => setShowGuideModal(true)}
        onOpenAddGame={() => {
          if (isAdminLoggedIn) setShowAdminPanel(true);
          else setShowAdminLogin(true);
        }}
        savedCount={quizzes.length}
      />

      {/* MAIN VIEW CONTAINER */}
      <main className="relative z-10 flex-1 flex flex-col">
        
        {/* VIEW 1: LANDING SCREEN (HANYA DUA TOMBOL UTAMA DENGAN BACKGROUND TRANSPARAN) */}
        {activeTab === 'landing' && (
          <LandingHero
            games={games}
            teacherProfile={teacherProfile}
            isAdminLoggedIn={isAdminLoggedIn}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onOpenAdmin={() => {
              if (isAdminLoggedIn) setShowAdminPanel(true);
              else setShowAdminLogin(true);
            }}
            onOpenTeacherLogin={() => setShowTeacherLogin(true)}
            onSelectPilihGame={() => setActiveTab('games')}
            onSelectBuatSoal={handleSelectBuatSoal}
          />
        )}

        {/* VIEW 2: PILIH GAME (GAME CENTER) - FRESH APP CONSOLE LOOK */}
        {activeTab === 'games' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 flex-1">
            <GameCenter
              games={games}
              quizzes={quizzes}
              isAdminLoggedIn={isAdminLoggedIn}
              onPlayGame={handlePlayGame}
              onOpenAddGame={() => {
                if (isAdminLoggedIn) setShowAdminPanel(true);
                else setShowAdminLogin(true);
              }}
              onOpenGenerator={() => {
                if (!teacherProfile?.isLoggedIn || !teacherProfile?.apiKey) {
                  setShowTeacherLogin(true);
                } else {
                  setActiveTab('generator');
                }
              }}
              onOpenAdmin={() => {
                if (isAdminLoggedIn) setShowAdminPanel(true);
                else setShowAdminLogin(true);
              }}
              onDeleteGame={handleDeleteGame}
              onBackToLanding={() => setActiveTab('landing')}
            />
          </div>
        )}

        {/* VIEW 3: BUAT SOAL (GENERATOR KURIKULUM MERDEKA) */}
        {activeTab === 'generator' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 flex-1">
            <QuestionGenerator
              onSaveQuizToBank={handleSaveQuizToBank}
              onPlayQuizInGame={handlePlayQuizInGame}
              teacherProfile={teacherProfile}
              onOpenTeacherLogin={() => setShowTeacherLogin(true)}
            />
          </div>
        )}

        {/* VIEW 4: BANK SOAL & SPREADSHEET */}
        {activeTab === 'saved' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 flex-1 space-y-8">
            <QuizBankModal
              quizzes={quizzes}
              onSelectQuiz={(q) => setSelectedQuiz(q)}
              onPlayQuizInGame={handlePlayQuizInGame}
              onDeleteQuiz={handleDeleteQuiz}
              onOpenGenerator={() => {
                if (!teacherProfile?.isLoggedIn || !teacherProfile?.apiKey) {
                  setShowTeacherLogin(true);
                } else {
                  setActiveTab('generator');
                }
              }}
            />

            {selectedQuiz && (
              <div className="pt-4 space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Pratinjau & Edit Spreadsheet Soal Terpilih</span>
                </h3>
                <SpreadsheetView
                  quiz={selectedQuiz}
                  onUpdateQuestions={(updated) => {
                    const updatedQuiz = { ...selectedQuiz, questions: updated };
                    setSelectedQuiz(updatedQuiz);
                    handleSaveQuizToBank(updatedQuiz);
                  }}
                  onSaveQuiz={() => handleSaveQuizToBank(selectedQuiz)}
                  onPlayInGame={handlePlayQuizInGame}
                />
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL: Game Player Iframe */}
      {activeGameForPlay && (
        <GamePlayerModal
          game={activeGameForPlay}
          quizzes={quizzes}
          initialQuizId={activeQuizIdForPlay}
          onClose={() => {
            setActiveGameForPlay(null);
            if (window.location.hash.includes('play=')) {
              window.history.pushState(null, '', window.location.pathname);
            }
          }}
          onOpenGenerator={() => {
            setActiveGameForPlay(null);
            if (!teacherProfile?.isLoggedIn || !teacherProfile?.apiKey) {
              setShowTeacherLogin(true);
            } else {
              setActiveTab('generator');
            }
          }}
        />
      )}

      {/* MODAL: Google Account Login with Mandatory API Key */}
      {showTeacherLogin && (
        <TeacherLoginModal
          currentProfile={teacherProfile}
          onClose={() => setShowTeacherLogin(false)}
          onLoginSuccess={handleTeacherLoginSuccess}
        />
      )}

      {/* MODAL: Admin Login (misbah / misbah5758) */}
      {showAdminLogin && (
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={handleAdminSuccess}
        />
      )}

      {/* MODAL: Admin Panel (Manage & Edit Links) */}
      {showAdminPanel && (
        <AdminPanelModal
          games={games}
          onClose={() => setShowAdminPanel(false)}
          onAddGame={handleAddGame}
          onUpdateGame={handleUpdateGame}
          onDeleteGame={handleDeleteGame}
          onLogoutAdmin={handleAdminLogout}
        />
      )}

      {/* MODAL: Panduan Guru */}
      {showGuideModal && (
        <TeacherGuideModal
          onClose={() => setShowGuideModal(false)}
        />
      )}

    </div>
  );
}
