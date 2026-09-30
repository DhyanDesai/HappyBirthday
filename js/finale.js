const STEPS = ['game-one', 'mystery-boxes', 'game-two', 'gift', 'key', 'safe', 'letter'];
const phrase = ['Sweetu', 'Softyyy', 'Magic'];

export function createFinale({ getState, saveState, prefersReducedMotion }) {
  let nextHeart = 1;
  let phraseIndex = 0;
  let giftLayer = 0;

  const section = document.getElementById('birthday-finale');
  const scrollToStage = () => section.querySelector('[data-finale-step]:not([hidden])')
    ?.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'center' });

  function setStep(step, scroll = true) {
    const state = getState();
    state.finaleStep = step;
    saveState(state);
    render();
    if (scroll) window.setTimeout(scrollToStage, prefersReducedMotion.matches ? 0 : 180);
  }

  function renderHearts() {
    const area = document.getElementById('heart-game');
    area.replaceChildren();
    [3, 1, 5, 2, 4].forEach(number => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'heart-target';
      button.textContent = number;
      button.setAttribute('aria-label', `Heart number ${number}`);
      button.disabled = number < nextHeart;
      if (number < nextHeart) button.classList.add('collected');
      button.addEventListener('click', () => {
        const feedback = document.getElementById('heart-feedback');
        if (number !== nextHeart) {
          feedback.textContent = `That heart is too excited. Find number ${nextHeart} first!`;
          button.classList.add('oops');
          window.setTimeout(() => button.classList.remove('oops'), 350);
          return;
        }
        nextHeart += 1;
        if (nextHeart > 5) {
          feedback.textContent = 'Heart check passed. Obviously. Opening your choices...';
          window.setTimeout(() => setStep('mystery-boxes'), prefersReducedMotion.matches ? 0 : 650);
          return;
        }
        feedback.textContent = `Perfect. Now find heart number ${nextHeart}.`;
        renderHearts();
      });
      area.append(button);
    });
  }

  function renderPhrase() {
    const answer = document.getElementById('phrase-answer');
    answer.innerHTML = `<span>${phraseIndex > 0 ? phrase[0] : '?'}</span><span>+</span><span>${phraseIndex > 1 ? phrase[1] : '?'}</span><span>=</span><span>${phraseIndex > 2 ? phrase[2] : '?'}</span>`;
    const pieces = document.getElementById('phrase-pieces');
    pieces.replaceChildren();
    ['Magic', 'Sweetu', 'Softyyy'].forEach(word => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = word;
      button.disabled = phrase.slice(0, phraseIndex).includes(word);
      button.addEventListener('click', () => {
        const feedback = document.getElementById('phrase-feedback');
        if (word !== phrase[phraseIndex]) {
          feedback.textContent = phraseIndex === 0 ? 'The birthday girl comes first!' : 'Almost! Think of our equation.';
          return;
        }
        phraseIndex += 1;
        renderPhrase();
        if (phraseIndex === phrase.length) {
          feedback.textContent = 'Sweetu + Softyyy = Magic. Correct forever.';
          window.setTimeout(() => setStep('gift'), prefersReducedMotion.matches ? 0 : 750);
        } else {
          feedback.textContent = phraseIndex === 1 ? 'Now add her Softyyy.' : 'And together they make...?';
        }
      });
      pieces.append(button);
    });
  }

  function renderGift() {
    const area = document.getElementById('nested-gift-area');
    area.replaceChildren();
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `nested-gift gift-layer-${giftLayer + 1}`;
    button.innerHTML = `<span aria-hidden="true">🎁</span><strong>Open me</strong><small>BOX ${giftLayer + 1} OF 4</small>`;
    button.addEventListener('click', () => {
      giftLayer += 1;
      if (giftLayer >= 4) {
        document.getElementById('gift-feedback').textContent = 'No more boxes. The real prize is shining through!';
        window.setTimeout(() => setStep('key'), prefersReducedMotion.matches ? 0 : 500);
        return;
      }
      document.getElementById('gift-feedback').textContent = `A smaller box?! ${4 - giftLayer} more to go.`;
      renderGift();
    });
    area.append(button);
  }

  function launchConfetti() {
    const confetti = document.getElementById('finale-confetti');
    if (confetti.children.length) return;
    const colors = ['#f86b9d', '#ffd166', '#78d5c8', '#9d83e6', '#ffffff'];
    for (let index = 0; index < 56; index += 1) {
      const piece = document.createElement('i');
      piece.style.setProperty('--x', `${(index * 37) % 100}%`);
      piece.style.setProperty('--delay', `${(index % 12) * -0.12}s`);
      piece.style.setProperty('--spin', `${180 + (index % 5) * 90}deg`);
      piece.style.background = colors[index % colors.length];
      confetti.append(piece);
    }
  }

  function render() {
    const state = getState();
    section.hidden = !state.finaleUnlocked;
    if (!state.finaleUnlocked) return;
    const step = STEPS.includes(state.finaleStep) ? state.finaleStep : 'game-one';
    section.querySelectorAll('[data-finale-step]').forEach(panel => { panel.hidden = panel.dataset.finaleStep !== step; });
    if (step === 'game-one') renderHearts();
    if (step === 'game-two') renderPhrase();
    if (step === 'gift') renderGift();
    if (step === 'letter') launchConfetti();
  }

  document.querySelectorAll('[data-mystery-box]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-mystery-box]').forEach(box => { box.disabled = true; });
    button.classList.add('chosen');
    document.getElementById('wrong-choice').hidden = false;
  }));
  document.getElementById('continue-final-game').addEventListener('click', () => setStep('game-two'));
  document.getElementById('finale-door').addEventListener('click', () => setStep('safe'));
  document.getElementById('safe-form').addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('safe-password');
    if (input.value.trim().toLowerCase() !== 'sweetu') {
      document.getElementById('safe-feedback').textContent = 'That did not open it. Read the hint once more, Sweetu ♡';
      input.select();
      return;
    }
    document.getElementById('safe-feedback').textContent = 'Password accepted. The safe is opening...';
    window.setTimeout(() => setStep('letter'), prefersReducedMotion.matches ? 0 : 550);
  });
  document.getElementById('birthday-letter').addEventListener('click', () => {
    const letter = document.getElementById('birthday-letter');
    const message = document.getElementById('letter-message');
    letter.classList.add('opened');
    letter.setAttribute('aria-expanded', 'true');
    message.hidden = false;
    const audio = document.getElementById('birthday-audio');
    audio.play().catch(() => { /* The visible controls provide a playback fallback. */ });
    message.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
  });

  return {
    open() {
      const state = getState();
      state.finaleUnlocked = true;
      if (!STEPS.includes(state.finaleStep)) state.finaleStep = 'game-one';
      saveState(state);
      render();
      section.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    },
    render,
    reset() {
      nextHeart = 1;
      phraseIndex = 0;
      giftLayer = 0;
      document.getElementById('birthday-audio').pause();
      document.getElementById('letter-message').hidden = true;
      document.getElementById('birthday-letter').classList.remove('opened');
      document.getElementById('birthday-letter').setAttribute('aria-expanded', 'false');
      document.getElementById('wrong-choice').hidden = true;
      document.querySelectorAll('[data-mystery-box]').forEach(box => { box.disabled = false; box.classList.remove('chosen'); });
      render();
    }
  };
}
