const faceContents = {
  1: '!',
  2: '',
  3: '',
  4: '○',
  5: '★',
  6: '○○',
  7: '★○',
  8: '★★',
  9: '○○○',
  10: '★○○',
  11: '★★○',
  12: '★★★'
};

const die = document.querySelector('#die');
const dieFace = document.querySelector('#die-face');
const result = document.querySelector('#result');
const rollButton = document.querySelector('#roll-button');
const maneuverRating = document.querySelector('#maneuver-rating');
const rollDuration = 720;
const facePauseDuration = 420;
const fillDuration = 1200;
const filledPauseDuration = 260;
const drainDuration = 800;
const specialPauseDuration = 1400;
const specialStarDuration = 260;

function getRandomFace() {
  return Math.floor(Math.random() * 12) + 1;
}

function getFaceDescription(faceValue) {
  const content = faceContents[faceValue] || 'vide';
  return `Face ${faceValue} : ${content}`;
}

function renderFace(faceValue) {
  dieFace.textContent = faceContents[faceValue];
  die.setAttribute('aria-label', getFaceDescription(faceValue));
  result.textContent = `Résultat : ${faceValue}`;
}

function getSelectedStars() {
  const selectedValue = maneuverRating.value;

  if (selectedValue === 'S') {
    return null;
  }

  const baseStars = selectedValue === '-' ? 0 : selectedValue.length;
  const modifier = document.querySelector('input[name="maneuver-operator"]:checked').value;

  if (modifier === '+') {
    return baseStars + 1;
  }

  if (modifier === '-') {
    return Math.max(0, baseStars - 1);
  }

  return baseStars;
}

function createSymbol(symbol, index) {
  const element = document.createElement('span');
  element.className = symbol === '○' ? 'die-symbol die-circle' : 'die-symbol';
  element.dataset.index = index;
  element.setAttribute('aria-hidden', 'true');

  if (symbol.codePointAt(0) === 9675) {
    return element;
  }

  const glyph = document.createElement('span');
  glyph.className = 'die-glyph';
  glyph.textContent = symbol;
  element.append(glyph);

  if (symbol === '○') {
    const wave = document.createElement('span');
    wave.className = 'die-wave';
    wave.setAttribute('aria-hidden', 'true');
    element.append(wave);
  }

  return element;
}

function renderSymbols(symbols) {
  dieFace.replaceChildren();
  symbols.forEach((symbol, index) => {
    dieFace.append(createSymbol(symbol, index));
  });
}

function setDieLabel(label) {
  die.setAttribute('aria-label', label);
}

function getResultText(value) {
  return value === '!' ? 'Résultat : !' : `Résultat : ${value}`;
}

function wait(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

async function resolveFace(faceValue) {
  const rawFace = faceContents[faceValue];
  const symbols = [...rawFace];

  if (rawFace === '!') {
    renderSymbols(symbols);
    setDieLabel('Face !');
    result.textContent = getResultText('!');
    return;
  }

  if (rawFace === '' && maneuverRating.value === 'S') {
    renderSymbols(['S']);
    dieFace.querySelector('.die-symbol').classList.add('is-special-letter');
    setDieLabel('Face S');
    result.textContent = 'Résolution : S';
    await wait(specialPauseDuration);

    renderSymbols(['★', '★', '★']);
    dieFace.querySelectorAll('.die-symbol').forEach((symbol, index) => {
      symbol.classList.add('is-special-star');
      symbol.style.animationDelay = `${index * specialStarDuration}ms`;
    });
    await wait(specialStarDuration * 3);
    setDieLabel('Face 3 étoiles');
    result.textContent = getResultText(3);
    return;
  }

  renderSymbols(symbols);
  const selectedStars = getSelectedStars() ?? 0;
  const emptySymbols = [...dieFace.querySelectorAll('.die-symbol')]
    .filter((symbol) => symbol.textContent === '○');
  const symbolsToFill = emptySymbols.slice(0, selectedStars);

  for (const symbol of symbolsToFill) {
    symbol.classList.add('is-filling');
    await wait(fillDuration);
    await wait(filledPauseDuration);
    symbol.textContent = '★';
    symbol.classList.remove('is-filling');
  }

  const renderedSymbols = [...dieFace.querySelectorAll('.die-symbol')];
  const hasEmptySymbol = renderedSymbols.some((symbol) => symbol.textContent === '○');
  const totalStars = renderedSymbols.filter((symbol) => symbol.textContent === '★').length;
  const resolvedValue = hasEmptySymbol ? 0 : totalStars;

  setDieLabel(`Face ${faceValue} : ${resolvedValue} étoile${resolvedValue > 1 ? 's' : ''}`);
  result.textContent = getResultText(resolvedValue);
}

async function resolveSpecialFace() {
  renderSymbols(['S']);
  dieFace.querySelector('.die-symbol').classList.add('is-special-letter');
  setDieLabel('Face S');
  result.textContent = 'Resolution : S';
  await wait(specialPauseDuration);

  renderSymbols([...faceContents[5], ...faceContents[5], ...faceContents[5]]);
  dieFace.querySelectorAll('.die-symbol').forEach((symbol, index) => {
    symbol.classList.add('is-special-star');
    symbol.style.animationDelay = `${index * specialStarDuration}ms`;
  });
  await wait(specialStarDuration * 3);
  setDieLabel('Face 3 etoiles');
  result.textContent = getResultText(3);
}

async function resolveFaceWithFillingAnimation(faceValue) {
  const rawFace = faceContents[faceValue];

  if (rawFace === '!') {
    renderSymbols(['!']);
    setDieLabel('Face !');
    result.textContent = getResultText('!');
    return;
  }

  renderSymbols([...rawFace]);
  await wait(facePauseDuration);

  if (rawFace === '' && maneuverRating.value === 'S') {
    await resolveSpecialFace();
    return;
  }

  if (rawFace === '' && maneuverRating.value === 'S') {
    renderSymbols(['★', '★', '★']);
    dieFace.querySelectorAll('.die-symbol').forEach((symbol, index) => {
      symbol.classList.add('is-filling');
      symbol.style.animationDelay = `${index * fillDuration}ms`;
    });
    await wait(fillDuration * 3);
    setDieLabel('Face 3 étoiles');
    result.textContent = getResultText(3);
    return;
  }

  const selectedStars = getSelectedStars() ?? 0;
  const emptySymbols = [...dieFace.querySelectorAll('.die-circle')];
  const symbolsToFill = emptySymbols.slice(0, selectedStars);

  for (const symbol of symbolsToFill) {
    symbol.classList.add('is-filling');
    await wait(fillDuration);
    symbol.textContent = '★';
    symbol.classList.remove('die-circle', 'is-filling');
    symbol.classList.add('die-new-star');
  }

  const remainingEmptySymbols = [...dieFace.querySelectorAll('.die-circle')];

  if (remainingEmptySymbols.length > 0) {
    const newStars = [...dieFace.querySelectorAll('.die-new-star')];

    for (const symbol of newStars.reverse()) {
      const wave = document.createElement('span');
      wave.className = 'die-wave';
      wave.setAttribute('aria-hidden', 'true');
      symbol.append(wave);
      symbol.classList.add('is-draining');
      await wait(drainDuration);
      symbol.textContent = '○';
      symbol.classList.remove('die-new-star', 'is-draining');
      symbol.classList.add('die-circle');
      symbol.textContent = '';
    }

    setDieLabel(`Face ${faceValue} : résultat 0`);
    result.textContent = getResultText(0);
    return;
  }

  const totalStars = [...dieFace.querySelectorAll('.die-symbol')]
    .filter((symbol) => symbol.textContent === '★').length;
  setDieLabel(`Face ${faceValue} : ${totalStars} étoile${totalStars > 1 ? 's' : ''}`);
  result.textContent = getResultText(totalStars);
}

async function finishRoll(faceValue) {
  await resolveFaceWithFillingAnimation(faceValue);
  die.classList.remove('is-rolling');
  rollButton.disabled = false;
}

function rollDie() {
  if (rollButton.disabled) {
    return;
  }

  const faceValue = getRandomFace();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reducedMotion ? 20 : rollDuration;

  rollButton.disabled = true;
  result.textContent = 'Le dé roule…';
  die.setAttribute('aria-label', 'Le dé roule');
  die.classList.remove('is-rolling');
  void die.offsetWidth;
  die.classList.add('is-rolling');

  window.setTimeout(() => finishRoll(faceValue), duration);
}

rollButton.addEventListener('click', rollDie);
