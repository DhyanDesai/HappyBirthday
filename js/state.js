const STORAGE_KEY = 'sweetu-birthday-quest-v1';
const INITIAL_STATE = Object.freeze({ currentStage: 'intro', quizScore: 0, quizAnswers: [], unlockedMemories: [], discoveredSecrets: [], completedLevels: [] });
const VALID_STAGES = new Set(['intro', 'welcome', 'quiz', 'chapter']);

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object') return { ...INITIAL_STATE };
    const completedLevels = Array.isArray(saved.completedLevels) ? saved.completedLevels : [];
    const savedStage = VALID_STAGES.has(saved.currentStage) ? saved.currentStage : 'intro';
    return {
      ...INITIAL_STATE,
      currentStage: savedStage === 'chapter' && !completedLevels.includes(1) ? 'quiz' : savedStage,
      quizScore: Number.isFinite(saved.quizScore) ? saved.quizScore : 0,
      quizAnswers: Array.isArray(saved.quizAnswers) ? saved.quizAnswers.slice(0, 3) : [],
      unlockedMemories: Array.isArray(saved.unlockedMemories) ? saved.unlockedMemories.filter(id => id === 1) : [],
      discoveredSecrets: Array.isArray(saved.discoveredSecrets) ? saved.discoveredSecrets : [],
      completedLevels
    };
  } catch {
    return { ...INITIAL_STATE };
  }
}

export function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Quest still works if storage is unavailable. */ }
}

export function resetState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* Continue with in-memory state. */ }
  return { ...INITIAL_STATE };
}
