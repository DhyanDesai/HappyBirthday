import { levelOneQuestions } from '../data/questions.js';

export function createQuiz({ getState, saveState }) {
  const questionView = document.getElementById('quiz-question-view');
  const completeView = document.getElementById('quiz-complete');
  const options = document.getElementById('quiz-options');
  const nextButton = document.getElementById('next-question');
  let currentIndex = 0;

  function showComplete() {
    const state = getState();
    const score = state.quizAnswers.reduce((total, answer, index) => total + Number(answer === levelOneQuestions[index].correctAnswer), 0);
    state.quizScore = score;
    state.completedLevels = [...new Set([...state.completedLevels, 1])];
    saveState(state);
    questionView.hidden = true;
    completeView.hidden = false;
    document.getElementById('quiz-progress').textContent = 'LEVEL COMPLETE';
    document.getElementById('quiz-score-line').textContent = `${score} / ${levelOneQuestions.length} correct. Every answer counts as showing up.`;
  }

  function render() {
    const state = getState();
    if (state.quizAnswers.length >= levelOneQuestions.length || currentIndex >= levelOneQuestions.length) {
      showComplete();
      return;
    }
    questionView.hidden = false;
    completeView.hidden = true;
    const question = levelOneQuestions[currentIndex];
    document.getElementById('quiz-progress').textContent = `QUESTION ${String(currentIndex + 1).padStart(2, '0')} / ${String(levelOneQuestions.length).padStart(2, '0')}`;
    document.getElementById('quiz-number').textContent = `QUESTION ${String(currentIndex + 1).padStart(2, '0')}`;
    document.getElementById('quiz-question').textContent = question.question;
    document.getElementById('quiz-feedback').textContent = '';
    nextButton.hidden = true;
    options.replaceChildren();
    question.options.forEach((label, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
      button.lastElementChild.textContent = label;
      button.addEventListener('click', () => answer(index));
      options.append(button);
    });
  }

  function answer(index) {
    const state = getState();
    if (state.quizAnswers.length !== currentIndex) return;
    const question = levelOneQuestions[currentIndex];
    state.quizAnswers.push(index);
    state.quizScore = state.quizAnswers.reduce((total, answerIndex, questionIndex) => total + Number(answerIndex === levelOneQuestions[questionIndex].correctAnswer), 0);
    saveState(state);
    [...options.children].forEach((button, optionIndex) => {
      button.disabled = true;
      if (optionIndex === question.correctAnswer) button.classList.add('correct');
      else if (optionIndex === index) button.classList.add('incorrect');
    });
    const correct = index === question.correctAnswer;
    document.getElementById('quiz-feedback').textContent = correct ? question.correctMessage : question.incorrectMessage;
    nextButton.textContent = currentIndex === levelOneQuestions.length - 1 ? 'See your results ↗' : 'Next question ↗';
    nextButton.hidden = false;
  }

  nextButton.addEventListener('click', () => { currentIndex += 1; render(); });

  return {
    render() {
      currentIndex = Math.min(getState().quizAnswers.length, levelOneQuestions.length);
      render();
    }
  };
}
