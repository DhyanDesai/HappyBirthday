const STORAGE_KEY = 'sweetu-birthday-quest-v1';
const initialState = () => ({ currentStage: 'intro', quizScore: 0, quizAnswers: [], memoryPieces: [], understandingAnswers: [], understandingBuildUpSeen: false, understandingRevealUnlocked: false, promiseOpened: false, unlockedMemories: [], discoveredSecrets: [], completedLevels: [] });
const VALID_STAGES = new Set(['intro', 'welcome', 'quiz', 'chapter']);

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object') return initialState();
    const completedLevels = Array.isArray(saved.completedLevels) ? saved.completedLevels : [];
    const savedStage = VALID_STAGES.has(saved.currentStage) ? saved.currentStage : 'intro';
    return {
      ...initialState(),
      currentStage: savedStage === 'chapter' && !completedLevels.includes(1) ? 'quiz' : savedStage,
      quizScore: Number.isFinite(saved.quizScore) ? saved.quizScore : 0,
      quizAnswers: Array.isArray(saved.quizAnswers) ? saved.quizAnswers.slice(0, 3) : [],
      memoryPieces: Array.isArray(saved.memoryPieces) ? saved.memoryPieces.filter(piece => ['dreams', 'family', 'future'].includes(piece)) : [],
      understandingAnswers: Array.isArray(saved.understandingAnswers) ? saved.understandingAnswers.slice(0, 3) : [],
      understandingBuildUpSeen: saved.understandingBuildUpSeen === true,
      understandingRevealUnlocked: saved.understandingRevealUnlocked === true,
      promiseOpened: saved.promiseOpened === true,
      unlockedMemories: Array.isArray(saved.unlockedMemories) ? saved.unlockedMemories.filter(id => id === 1 || id === 2) : [],
      discoveredSecrets: Array.isArray(saved.discoveredSecrets) ? saved.discoveredSecrets : [],
      completedLevels
    };
  } catch {
    return initialState();
  }
}

export function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Quest still works if storage is unavailable. */ }
}

export function resetState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* Continue with in-memory state. */ }
  return initialState();
}
