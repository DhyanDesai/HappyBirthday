import { loadState, saveState, resetState } from './state.js';
import { createQuiz } from './quiz.js';

let state = loadState();
let bootTimer;
const screens = {
  intro: document.getElementById('intro-screen'),
  welcome: document.getElementById('welcome-screen'),
  quiz: document.getElementById('quiz-screen'),
  chapter: document.getElementById('chapter-screen')
};
const bootLines = document.getElementById('boot-lines');
const result = document.getElementById('terminal-result');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const quiz = createQuiz({ getState: () => state, saveState });

function renderFirstMemory() {
  const unlocked = state.unlockedMemories.includes(1);
  document.getElementById('memory-reveal').hidden = !unlocked;
  document.getElementById('chapter-aside').hidden = !unlocked;
  document.getElementById('first-clue').hidden = unlocked;
  document.getElementById('card-title').textContent = unlocked ? 'THE FIRST HELLO' : 'A SEALED MEMORY';
  document.getElementById('card-subtitle').textContent = unlocked ? 'TELEGRAM → WHATSAPP' : 'ANSWER THE CLUE TO OPEN';
  document.getElementById('card-status').textContent = unlocked ? 'UNLOCKED' : 'LOCKED';
  document.getElementById('chapter-card').setAttribute('aria-label', unlocked ? 'Memory file one unlocked' : 'Locked memory file');
}

function showStage(stage, persist = true) {
  clearTimeout(bootTimer);
  Object.entries(screens).forEach(([name, screen]) => { screen.hidden = name !== stage; });
  state.currentStage = stage;
  if (persist) saveState(state);
  if (stage === 'quiz') quiz.render();
  if (stage === 'chapter') renderFirstMemory();
  if (stage === 'welcome' && persist) document.getElementById('welcome-footnote').textContent = 'A tiny journey through us, made just for you.';
  document.getElementById('app').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function finishBoot() {
  clearTimeout(bootTimer);
  bootLines.innerHTML = [
    'Loading memories...', 'Loading inside jokes...', 'Loading embarrassing moments...', 'Loading Sweetu...'
  ].map(label => `<p class="boot-line"><span>${label}</span><small>████████████████████</small></p>`).join('');
  result.hidden = false;
  document.getElementById('skip-intro').textContent = 'Continue to your message ↗';
  document.getElementById('skip-intro').dataset.ready = 'true';
}

function runBoot() {
  const labels = ['Loading memories...', 'Loading inside jokes...', 'Loading embarrassing moments...', 'Loading Sweetu...'];
  if (prefersReducedMotion.matches) { finishBoot(); return; }
  let index = 0;
  const next = () => {
    if (index >= labels.length) { bootTimer = setTimeout(finishBoot, 400); return; }
    const line = document.createElement('p');
    line.className = 'boot-line';
    const label = document.createElement('span');
    label.textContent = labels[index];
    const bar = document.createElement('small');
    bar.textContent = '████████████████████';
    line.append(label, bar);
    bootLines.append(line);
    index += 1;
    bootTimer = setTimeout(next, 510);
  };
  next();
}

document.getElementById('skip-intro').addEventListener('click', event => {
  if (event.currentTarget.dataset.ready === 'true') showStage('welcome');
  else finishBoot();
});
document.getElementById('enter-quest').addEventListener('click', () => showStage('quiz'));
document.getElementById('open-first-memory').addEventListener('click', () => showStage('chapter'));
document.querySelectorAll('[data-welcome-choice]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-welcome-choice]').forEach(option => option.classList.toggle('selected', option === button));
    document.getElementById('welcome-feedback').textContent = button.dataset.welcomeChoice === 'normal'
      ? 'Fair. But this friendship was never going to fit into one message.'
      : 'You know me. Of course there are levels.';
  });
});
document.querySelectorAll('[data-clue-answer]').forEach(button => {
  button.addEventListener('click', () => {
    const feedback = document.getElementById('clue-feedback');
    if (button.dataset.clueAnswer !== 'telegram') {
      feedback.textContent = 'Close! That came a little later. Try the other one.';
      button.classList.add('incorrect');
      return;
    }
    feedback.textContent = 'Memory verified. Opening file 01...';
    state.unlockedMemories = [...new Set([...state.unlockedMemories, 1])];
    saveState(state);
    renderFirstMemory();
    document.getElementById('memory-reveal').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  });
});
document.getElementById('reset-progress').addEventListener('click', () => {
  if (!window.confirm('Start the quest over on this device?')) return;
  state = resetState();
  bootLines.replaceChildren();
  result.hidden = true;
  const skip = document.getElementById('skip-intro');
  skip.textContent = 'Skip initialization ↗';
  delete skip.dataset.ready;
  showStage('intro', false);
  runBoot();
});

if (state.currentStage === 'intro') runBoot();
else {
  showStage(state.currentStage, false);
  if (state.currentStage === 'welcome') document.getElementById('welcome-footnote').textContent = 'Welcome back, Sweetu. Your quest is right where you left it.';
}
