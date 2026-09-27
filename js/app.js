import { loadState, saveState, resetState } from './state.js';
import { createQuiz } from './quiz.js';
import { understandingMoments } from '../data/understandings.js';

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
const understandingTotal = 3;
let understandingIndex = Math.max(0, Math.min(state.understandingAnswers.length - 1, understandingMoments.length - 1));
let buildUpIndex = 0;

function renderFirstMemory() {
  const unlocked = state.unlockedMemories.includes(1);
  const secondUnlocked = state.unlockedMemories.includes(2);
  document.getElementById('memory-reveal').hidden = !unlocked;
  document.getElementById('chapter-aside').hidden = !unlocked;
  document.getElementById('first-clue').hidden = unlocked;
  document.getElementById('card-title').textContent = unlocked ? 'THE FIRST HELLO' : 'A SEALED MEMORY';
  document.getElementById('card-subtitle').textContent = unlocked ? 'TELEGRAM → WHATSAPP' : 'ANSWER THE CLUE TO OPEN';
  document.getElementById('card-status').textContent = unlocked ? 'UNLOCKED' : 'LOCKED';
  document.getElementById('chapter-card').setAttribute('aria-label', unlocked ? 'Memory file one unlocked' : 'Locked memory file');
  document.getElementById('conversation-task').hidden = !unlocked || secondUnlocked;
  document.getElementById('memory-two').hidden = !secondUnlocked;
  document.getElementById('understanding-intro').hidden = !secondUnlocked;
  document.getElementById('understanding-game').hidden = !secondUnlocked;
  if (secondUnlocked) renderUnderstandingMoment();
  document.querySelectorAll('[data-memory-piece]').forEach(button => {
    const collected = state.memoryPieces.includes(button.dataset.memoryPiece);
    button.classList.toggle('collected', collected);
    button.disabled = collected;
  });
  document.getElementById('task-counter').textContent = `${state.memoryPieces.length} / 3 pieces collected`;
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
document.getElementById('continue-to-memory-two').addEventListener('click', () => {
  document.getElementById(state.unlockedMemories.includes(2) ? 'memory-two' : 'conversation-task')
    .scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
});
document.getElementById('continue-to-understanding').addEventListener('click', () => {
  document.getElementById('understanding-intro')
    .scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
});
function renderUnderstandingMoment() {
  const moment = understandingMoments[understandingIndex];
  const savedAnswer = state.understandingAnswers[understandingIndex];
  const remainingTotal = understandingTotal - moment.number;
  document.getElementById('moment-progress-label').textContent = `MOMENT ${String(moment.number).padStart(2, '0')} / ${String(understandingTotal).padStart(2, '0')}`;
  const progressDots = document.getElementById('moment-progress-dots');
  progressDots.textContent = Array.from({ length: understandingTotal }, (_, index) => index <= understandingIndex ? '●' : '○').join(' ');
  progressDots.setAttribute('aria-label', `Moment ${moment.number} of ${understandingTotal}`);
  const showBuildUp = moment.special && !state.understandingBuildUpSeen && savedAnswer === undefined;
  document.getElementById('special-build-up').hidden = !showBuildUp;
  const situationCard = document.getElementById('situation-card');
  situationCard.hidden = showBuildUp;
  situationCard.classList.toggle('final-situation', Boolean(moment.special));
  document.getElementById('understanding-reveal').classList.toggle('final-understanding', Boolean(moment.special));
  if (showBuildUp) renderBuildUpBeat();
  document.getElementById('understanding-game-title').textContent = moment.title;
  document.getElementById('understanding-situation').textContent = moment.situation;
  document.getElementById('understanding-question').textContent = moment.question;
  document.getElementById('understanding-lesson').textContent = moment.understanding;
  document.getElementById('understanding-original').textContent = moment.originalWords;
  document.getElementById('understanding-reveal-title').textContent = moment.revealTitle || 'Space was never distance.';
  const closing = document.getElementById('understanding-closing');
  closing.textContent = moment.closingNote || '';
  closing.hidden = !moment.closingNote;
  document.getElementById('understanding-footnote').textContent = moment.playfulNote || 'You changed the way I understood friendship—and that made our bond more beautiful.';
  document.getElementById('moment-saved-copy').innerHTML = moment.number === understandingTotal
    ? '<strong>All three understandings are safe.</strong><br />One promise is waiting beyond this moment.'
    : `<strong>Moment ${moment.number} is safe.</strong><br />${remainingTotal} more ${remainingTotal === 1 ? 'understanding' : 'understandings'} will join it.`;
  const options = document.getElementById('understanding-options');
  options.replaceChildren();
  moment.options.forEach((label, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'understanding-option';
    button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span><span></span>`;
    button.lastElementChild.textContent = label;
    if (savedAnswer !== undefined) {
      button.disabled = true;
      if (index === moment.correctAnswer) button.classList.add('correct');
      else if (index === savedAnswer) button.classList.add('incorrect');
    }
    button.addEventListener('click', () => answerUnderstandingMoment(index));
    options.append(button);
  });
  document.getElementById('understanding-feedback').textContent = savedAnswer === undefined ? 'Choose the understanding that became ours.' : savedAnswer === moment.correctAnswer ? moment.correctMessage : moment.incorrectMessage;
  document.getElementById('understanding-reveal').hidden = savedAnswer === undefined;
  document.getElementById('next-understanding-moment').hidden = savedAnswer === undefined || understandingIndex >= understandingMoments.length - 1;
}

function renderBuildUpBeat() {
  const moment = understandingMoments[understandingIndex];
  const beat = moment.buildUp[buildUpIndex];
  document.getElementById('build-label').textContent = beat.label;
  document.getElementById('build-title').textContent = beat.title;
  document.getElementById('build-text').textContent = beat.text;
  document.getElementById('build-progress').textContent = moment.buildUp.map((_, index) => index <= buildUpIndex ? '●' : '○').join('  ');
  document.getElementById('continue-build-up').innerHTML = buildUpIndex === moment.buildUp.length - 1
    ? 'See what we understood <span aria-hidden="true">↓</span>'
    : 'Continue <span aria-hidden="true">→</span>';
}

function answerUnderstandingMoment(answerIndex) {
  if (state.understandingAnswers[understandingIndex] !== undefined) return;
  state.understandingAnswers[understandingIndex] = answerIndex;
  saveState(state);
  renderUnderstandingMoment();
  window.setTimeout(() => {
    document.getElementById('understanding-reveal').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
  }, prefersReducedMotion.matches ? 0 : 400);
}

document.getElementById('start-understanding-game').addEventListener('click', () => {
  renderUnderstandingMoment();
  document.getElementById('understanding-game').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
});
document.getElementById('next-understanding-moment').addEventListener('click', () => {
  if (understandingIndex >= understandingMoments.length - 1) return;
  understandingIndex += 1;
  renderUnderstandingMoment();
  document.getElementById('understanding-game').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
});
document.getElementById('continue-build-up').addEventListener('click', () => {
  const moment = understandingMoments[understandingIndex];
  if (!moment.buildUp) return;
  if (buildUpIndex < moment.buildUp.length - 1) {
    buildUpIndex += 1;
    renderBuildUpBeat();
    return;
  }
  state.understandingBuildUpSeen = true;
  saveState(state);
  renderUnderstandingMoment();
  document.getElementById('situation-card').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
});
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
document.querySelectorAll('[data-memory-piece]').forEach(button => {
  button.addEventListener('click', () => {
    const piece = button.dataset.memoryPiece;
    if (state.memoryPieces.includes(piece)) return;
    state.memoryPieces.push(piece);
    button.classList.add('collected');
    button.disabled = true;
    const remaining = 3 - state.memoryPieces.length;
    const feedback = document.getElementById('task-feedback');
    const pieceLabels = { dreams: 'Dreams', family: 'Family', future: 'Our futures' };
    feedback.textContent = remaining ? `${pieceLabels[piece]} collected! ${remaining} more to catch.` : 'That is all of them. Putting the memory together...';
    if (!remaining) state.unlockedMemories = [...new Set([...state.unlockedMemories, 2])];
    saveState(state);
    document.getElementById('task-counter').textContent = `${state.memoryPieces.length} / 3 pieces collected`;
    if (!remaining) {
      window.setTimeout(() => {
        renderFirstMemory();
        document.getElementById('memory-two').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
      }, prefersReducedMotion.matches ? 0 : 650);
    }
  });
});
document.getElementById('reset-progress').addEventListener('click', () => {
  if (!window.confirm('Start the quest over on this device?')) return;
  state = resetState();
  understandingIndex = 0;
  buildUpIndex = 0;
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
