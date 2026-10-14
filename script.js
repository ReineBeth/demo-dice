const appConfig = {
	general: {
		animation: {
			roll: {
				speed: 1,
			},
			fill: {
				speed: 0.5,
			},
		},
		faces: {
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
			12: '★★★',
		},
		generalControleSettings: {
			logLabel: 'Log',
			dropdown: {
				label: 'Qualité',
				options: ['-', '★', '★★', '★★★', 'S'],
				defaultValue: '-',
			},
			segmentedControl: {
				label: 'Modificateur',
				options: ['+', '=', '-'],
				defaultValue: '=',
			},
		},
		generalActions: {
			exportButtonLabel: 'Exporter les paramètres en CSV',
			importButtonLabel: 'Importer un CSV',
			saveButtonLabel: 'Sauvegarder les paramètres',
			csvFileName: 'demo-dice-parametres.csv',
			localStorageKey: 'demo-dice-paramètres',
		},
	},
	diceGroups: [
		{
			id: 'performance',
			title: 'Performance',
			rollButtonLabel: 'Jet de performance',
			dices: [
				{
					id: 'die-1',
					label: 'Manoeuvrabilité',
					color: '#ff7a00',
					symbolColor: '#111111',
				},
				{
					id: 'die-2',
					label: 'Puissance',
					color: '#2dcc32',
					symbolColor: '#111111',
				},
				{
					id: 'die-3',
					label: 'Robustesse',
					color: '#e7e7e7',
					symbolColor: '#111111',
				},
			],
		},
		{
			id: 'energification',
			title: 'Énergification',
			rollButtonLabel: 'Jet d’Énergification',
			dices: [
				{
					id: 'die-4',
					label: 'Robustesse',
					color: '#16afe8',
					symbolColor: '#111111',
				},
			],
		},
	],
};

const faceContents = appConfig.general.faces;
const faceValues = Object.keys(faceContents).map(Number);
const normalRollDurationMs = 600;
const normalFrameIntervalMs = 140;
const normalFillDurationMs = 220;
const normalFillStaggerMs = 70;
const diceGroupsContainer = document.querySelector('[data-dice-groups]');
const resultTemplate = document.querySelector('#result-template');

function ensureGeneralActionsElements() {
	let section = document.querySelector('.general-actions');

	if (!section) {
		section = document.createElement('section');
		section.className = 'general-actions';
		section.setAttribute('aria-labelledby', 'general-actions-title');
		(document.querySelector('.dice-panel') || document.body).append(
			section,
		);
	}

	let title = document.querySelector('#general-actions-title');
	if (!title) {
		title = document.createElement('h2');
		title.id = 'general-actions-title';
		title.className = 'visually-hidden';
		title.textContent = 'Actions générales';
		section.prepend(title);
	}

	function ensureButton(id, legacyId) {
		const existingButton =
			document.querySelector(`#${id}`) ||
			document.querySelector(`#${legacyId}`);

		if (existingButton) {
			existingButton.id = id;
			return existingButton;
		}

		const button = document.createElement('button');
		button.id = id;
		button.className = 'general-action-button';
		button.type = 'button';
		section.append(button);
		return button;
	}

	const exportButton = ensureButton('export-settings', 'export-paramètres');
	const importButton = ensureButton('import-settings', 'import-paramètres');
	let importInput =
		document.querySelector('#import-settings-file') ||
		document.querySelector('#import-paramètres-file');

	if (!importInput) {
		importInput = document.createElement('input');
		importInput.className = 'visually-hidden';
		importInput.type = 'file';
		importInput.accept = '.csv,text/csv';
		section.append(importInput);
	}
	importInput.id = 'import-settings-file';

	const saveButton = ensureButton('save-settings', 'save-paramètres');
	let status = document.querySelector('#general-actions-status');

	if (!status) {
		status = document.createElement('p');
		status.id = 'general-actions-status';
		status.className = 'general-actions-status';
		status.setAttribute('aria-live', 'polite');
		section.append(status);
	}

	return {
		exportSettingsButton: exportButton,
		importSettingsButton: importButton,
		importSettingsInput: importInput,
		saveSettingsButton: saveButton,
		generalActionsStatus: status,
	};
}

const {
	exportSettingsButton,
	importSettingsButton,
	importSettingsInput,
	saveSettingsButton,
	generalActionsStatus,
} = ensureGeneralActionsElements();

function createManeuverControls(dieConfig) {
	const controlsConfig = appConfig.general.generalControleSettings;
	const dropdownConfig = controlsConfig.dropdown;
	const segmentedConfig = controlsConfig.segmentedControl;
	const section = document.createElement('section');
	const heading = document.createElement('h2');
	const ratingField = document.createElement('label');
	const dropdownLabel = document.createElement('span');
	const maneuverRating = document.createElement('select');
	const operatorField = document.createElement('fieldset');
	const operatorLegend = document.createElement('legend');
	const segmentedControl = document.createElement('div');
	const headingId = `${dieConfig.id}-maneuver-title`;
	const dropdownId = `${dieConfig.id}-maneuver-rating`;
	const operatorName = `${dieConfig.id}-maneuver-operator`;

	section.className = 'maneuver-control';
	section.setAttribute('aria-labelledby', headingId);
	heading.id = headingId;
	heading.textContent = dieConfig.label;
	ratingField.className = 'rating-field';
	ratingField.htmlFor = dropdownId;
	dropdownLabel.textContent = dropdownConfig.label;
	maneuverRating.id = dropdownId;
	maneuverRating.name = dropdownId;
	maneuverRating.append(
		...dropdownConfig.options.map((value) => {
			const option = document.createElement('option');
			option.value = value;
			option.textContent = value;
			option.selected = value === dropdownConfig.defaultValue;
			return option;
		}),
	);
	ratingField.append(dropdownLabel, maneuverRating);

	operatorField.className = 'operator-field';
	operatorLegend.textContent = segmentedConfig.label;
	segmentedControl.className = 'segmented-control';
	segmentedControl.append(
		...segmentedConfig.options.map((value) => {
			const label = document.createElement('label');
			const input = document.createElement('input');
			const visibleLabel = document.createElement('span');

			input.type = 'radio';
			input.name = operatorName;
			input.value = value;
			input.checked = value === segmentedConfig.defaultValue;
			visibleLabel.textContent = value;
			label.append(input, visibleLabel);
			return label;
		}),
	);
	operatorField.append(operatorLegend, segmentedControl);
	section.append(heading, ratingField, operatorField);

	return { section, maneuverRating };
}

function createDie(dieConfig, diceStage) {
	const container = document.createElement('div');
	const controls = createManeuverControls(dieConfig);
	const die = document.createElement('div');
	const dieFace = document.createElement('span');
	const result = resultTemplate.content.firstElementChild.cloneNode(true);
	const logSection = document.createElement('section');
	const logTitle = document.createElement('h3');
	const log = document.createElement('div');
	const logTitleId = `${dieConfig.id}-log-title`;

	container.className = 'die-container';
	die.className = 'die';
	die.id = dieConfig.id;
	die.role = 'img';
	die.setAttribute('aria-label', 'Dé prêt à être lancé');
	die.style.setProperty('--die-color', dieConfig.color);
	die.style.setProperty(
		'--die-symbol-color',
		dieConfig.symbolColor || '#ffffff',
	);
	dieFace.className = 'die-face';
	dieFace.setAttribute('aria-hidden', 'true');
	result.id = `${dieConfig.id}-result`;
	result.classList.add('visually-hidden');
	logSection.className = 'die-log-section';
	logSection.setAttribute('aria-labelledby', logTitleId);
	logTitle.id = logTitleId;
	logTitle.className = 'visually-hidden';
	logTitle.textContent = appConfig.general.generalControleSettings.logLabel;
	log.className = 'die-log';
	log.textContent = 'Aucun lancer pour le moment.';
	logSection.append(logTitle, log);

	die.append(dieFace);
	container.append(controls.section, die, result, logSection);
	diceStage.append(container);

	return {
		config: dieConfig,
		container,
		die,
		dieFace,
		result,
		log,
		maneuverRating: controls.maneuverRating,
	};
}

function createDiceGroup(groupConfig) {
	const section = document.createElement('section');
	const title = document.createElement('h2');
	const diceStage = document.createElement('div');
	const rollButton = document.createElement('button');
	const titleId = `${groupConfig.id}-title`;

	section.className = 'dice-group';
	section.dataset.diceCount = groupConfig.dices.length;
	section.setAttribute('aria-labelledby', titleId);
	title.className = 'dice-group-title';
	title.id = titleId;
	title.textContent = groupConfig.title;
	diceStage.className = 'dice-stage';
	rollButton.className = 'roll-button';
	rollButton.type = 'button';
	rollButton.textContent = groupConfig.rollButtonLabel;
	section.append(title, diceStage, rollButton);
	diceGroupsContainer.append(section);

	const diceStates = groupConfig.dices.map((dieConfig) =>
		createDie(dieConfig, diceStage),
	);
	const groupState = {
		config: groupConfig,
		section,
		diceStates,
		rollButton,
		isRolling: false,
	};

	rollButton.addEventListener('click', () => rollDice(groupState));
	return groupState;
}

function getRandomFace() {
	return faceValues[Math.floor(Math.random() * faceValues.length)];
}

function getSelectedModifier(diceState) {
	return diceState.container.querySelector('input[type="radio"]:checked')
		.value;
}

function getControlSelection(diceState) {
	return {
		level: diceState.maneuverRating.value,
		modifier: getSelectedModifier(diceState),
	};
}

function getSelectedStars(selection) {
	const selectedValue = selection.level;
	const baseStars =
		selectedValue === 'S'
			? 3
			: selectedValue === '-'
				? 0
				: selectedValue.length;
	const modifier = selection.modifier;

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
	return element;
}

function renderSymbols(dieFace, symbols) {
	dieFace.replaceChildren();
	symbols.forEach((symbol, index) => {
		dieFace.append(createSymbol(symbol, index));
	});
}

function updateLog(diceState, faceValue, selection) {
	const { log, result } = diceState;
	const controlsConfig = appConfig.general.generalControleSettings;
	const originalFace = faceContents[faceValue] || 'vide';
	const resultValue = result.textContent.replace('Résultat : ', '');
	const faceLine = document.createElement('p');
	const qualityLine = document.createElement('p');
	const modifierLine = document.createElement('p');
	const resultLine = document.createElement('p');
	const resultLabel = document.createElement('strong');

	faceLine.className = 'die-log-line';
	qualityLine.className = 'die-log-line';
	modifierLine.className = 'die-log-line';
	resultLine.className = 'die-log-line die-log-result';
	faceLine.textContent = `Face ${faceValue} : ${originalFace}`;
	qualityLine.textContent = `${controlsConfig.dropdown.label} : ${selection.level}`;
	modifierLine.textContent = `${controlsConfig.segmentedControl.label} : ${selection.modifier}`;
	resultLabel.textContent = 'Résultat';
	resultLine.append(resultLabel, ` : ${resultValue}`);
	log.replaceChildren(faceLine, qualityLine, modifierLine, resultLine);
}

function getResultText(value) {
	return value === '!' ? 'Résultat : !' : `Résultat : ${value}`;
}

function resolveSpecialFace(diceState) {
	const { die, dieFace, result } = diceState;

	renderSymbols(dieFace, ['★', '★', '★']);
	die.setAttribute('aria-label', 'Face 3 étoiles');
	result.textContent = getResultText(3);
}

function replaceCircleWithStar(symbol) {
	const glyph = document.createElement('span');
	glyph.className = 'die-glyph';
	glyph.textContent = '★';
	symbol.replaceChildren(glyph);
	symbol.classList.remove('die-circle', 'is-filling');
}

function animateCircleToStar(symbol, index, animationSpeed) {
	if (animationSpeed === 0) {
		replaceCircleWithStar(symbol);
		return Promise.resolve();
	}

	const duration = normalFillDurationMs / animationSpeed;
	const delay = (normalFillStaggerMs * index) / animationSpeed;
	symbol.replaceChildren();
	symbol.style.setProperty('--fill-duration', `${duration}ms`);
	symbol.style.setProperty('--fill-delay', `${delay}ms`);
	symbol.classList.add('is-filling');

	return new Promise((resolve) => {
		window.setTimeout(() => {
			replaceCircleWithStar(symbol);
			symbol.style.removeProperty('--fill-duration');
			symbol.style.removeProperty('--fill-delay');
			resolve();
		}, duration + delay);
	});
}

async function resolveFace(diceState, faceValue, selection) {
	const { die, dieFace, result } = diceState;
	const rawFace = faceContents[faceValue];

	if (rawFace === '!') {
		renderSymbols(dieFace, ['!']);
		die.setAttribute('aria-label', 'Face !');
		result.textContent = getResultText('!');
		return;
	}

	renderSymbols(dieFace, [...rawFace]);

	if (selection.level === '-' && selection.modifier === '-') {
		renderSymbols(dieFace, []);
		die.setAttribute('aria-label', `Face ${faceValue} devenue vide`);
		result.textContent = getResultText(0);
		return;
	}

	if (rawFace === '' && selection.level === 'S') {
		resolveSpecialFace(diceState);
		return;
	}

	const selectedStars = getSelectedStars(selection);
	const emptySymbols = [...dieFace.querySelectorAll('.die-circle')];
	const symbolsToFill = emptySymbols.slice(0, selectedStars);
	const fillAnimationSpeed = getAnimationSpeed('fill');

	await Promise.all(
		symbolsToFill.map((symbol, index) =>
			animateCircleToStar(symbol, index, fillAnimationSpeed),
		),
	);

	const remainingEmptySymbols = [...dieFace.querySelectorAll('.die-circle')];

	if (remainingEmptySymbols.length > 0) {
		die.setAttribute('aria-label', `Face ${faceValue} : résultat 0`);
		result.textContent = getResultText(0);
		return;
	}

	const totalStars = [...dieFace.querySelectorAll('.die-symbol')].filter(
		(symbol) => symbol.textContent === '★',
	).length;
	die.setAttribute(
		'aria-label',
		`Face ${faceValue} : ${totalStars} étoile${totalStars > 1 ? 's' : ''}`,
	);
	result.textContent = getResultText(totalStars);
}

async function rollSingleDie(diceState) {
	const faceValue = getRandomFace();
	const selection = getControlSelection(diceState);

	await resolveFace(diceState, faceValue, selection);
	updateLog(diceState, faceValue, selection);
}

function getAnimationSpeed(animationName) {
	const configuredSpeed = Number(
		appConfig.general.animation?.[animationName]?.speed,
	);
	return Number.isFinite(configuredSpeed) && configuredSpeed > 0
		? configuredSpeed
		: 0;
}

function shouldAnimateRoll(animationSpeed) {
	return animationSpeed > 0;
}

function renderRollingFace(diceState) {
	const temporaryFace = faceContents[getRandomFace()];
	renderSymbols(diceState.dieFace, [...temporaryFace]);
}

function waitForRollAnimation(groupState, animationSpeed) {
	const duration = normalRollDurationMs / animationSpeed;
	const frameInterval = Math.max(32, normalFrameIntervalMs / animationSpeed);

	groupState.diceStates.forEach((diceState) => {
		diceState.die.style.setProperty('--roll-duration', `${duration}ms`);
		diceState.die.classList.add('is-rolling');
		renderRollingFace(diceState);
	});

	return new Promise((resolve) => {
		const frameTimer = window.setInterval(() => {
			groupState.diceStates.forEach(renderRollingFace);
		}, frameInterval);

		window.setTimeout(() => {
			window.clearInterval(frameTimer);
			resolve();
		}, duration);
	});
}

async function rollDice(groupState) {
	if (groupState.isRolling) {
		return;
	}

	const rollAnimationSpeed = getAnimationSpeed('roll');

	groupState.isRolling = true;
	groupState.rollButton.disabled = true;
	groupState.section.setAttribute('aria-busy', 'true');

	try {
		if (shouldAnimateRoll(rollAnimationSpeed)) {
			await waitForRollAnimation(groupState, rollAnimationSpeed);
		}

		groupState.diceStates.forEach((diceState) => {
			diceState.die.classList.remove('is-rolling');
		});
		await Promise.all(groupState.diceStates.map(rollSingleDie));
	} finally {
		groupState.diceStates.forEach((diceState) => {
			diceState.die.classList.remove('is-rolling');
		});
		groupState.rollButton.disabled = false;
		groupState.section.removeAttribute('aria-busy');
		groupState.isRolling = false;
	}
}

function getAllDiceRecords() {
	return diceGroupStates.flatMap((groupState) =>
		groupState.diceStates.map((diceState) => ({
			groupConfig: groupState.config,
			diceState,
		})),
	);
}

function getCurrentSettings() {
	return getAllDiceRecords().map(({ groupConfig, diceState }) => ({
		groupId: groupConfig.id,
		groupTitle: groupConfig.title,
		dieId: diceState.config.id,
		dieLabel: diceState.config.label,
		dropdownValue: diceState.maneuverRating.value,
		segmentedValue: getSelectedModifier(diceState),
	}));
}

function applySettings(settings) {
	const diceById = new Map(
		getAllDiceRecords().map(({ diceState }) => [
			diceState.config.id,
			diceState,
		]),
	);
	let appliedCount = 0;

	for (const setting of settings) {
		const diceState = diceById.get(setting.dieId);

		if (!diceState) {
			continue;
		}

		const dropdownOption = [...diceState.maneuverRating.options].find(
			(option) => option.value === setting.dropdownValue,
		);
		const segmentedOption = [
			...diceState.container.querySelectorAll('input[type="radio"]'),
		].find((input) => input.value === setting.segmentedValue);

		if (!dropdownOption || !segmentedOption) {
			continue;
		}

		diceState.maneuverRating.value = setting.dropdownValue;
		segmentedOption.checked = true;
		appliedCount += 1;
	}

	return appliedCount;
}

function escapeCsvCell(value) {
	return `"${String(value).replaceAll('"', '""')}"`;
}

function createSettingsCsv() {
	const headers = [
		'group_id',
		'group_title',
		'die_id',
		'die_label',
		'dropdown_value',
		'segmented_value',
	];
	const rows = getCurrentSettings().map((setting) => [
		setting.groupId,
		setting.groupTitle,
		setting.dieId,
		setting.dieLabel,
		setting.dropdownValue,
		setting.segmentedValue,
	]);

	return [headers, ...rows]
		.map((row) => row.map(escapeCsvCell).join(','))
		.join('\r\n');
}

function parseCsv(csvText) {
	const rows = [];
	let row = [];
	let cell = '';
	let isQuoted = false;

	for (let index = 0; index < csvText.length; index += 1) {
		const character = csvText[index];

		if (isQuoted) {
			if (character === '"' && csvText[index + 1] === '"') {
				cell += '"';
				index += 1;
			} else if (character === '"') {
				isQuoted = false;
			} else {
				cell += character;
			}
			continue;
		}

		if (character === '"') {
			isQuoted = true;
		} else if (character === ',') {
			row.push(cell);
			cell = '';
		} else if (character === '\n' || character === '\r') {
			row.push(cell);
			rows.push(row);
			row = [];
			cell = '';
			if (character === '\r' && csvText[index + 1] === '\n') {
				index += 1;
			}
		} else {
			cell += character;
		}
	}

	if (cell !== '' || row.length > 0) {
		row.push(cell);
		rows.push(row);
	}

	return rows.filter((csvRow) => csvRow.some((value) => value !== ''));
}

function getSettingsFromCsv(csvText) {
	const rows = parseCsv(csvText);

	if (rows.length < 2) {
		throw new Error('Le CSV ne contient aucun setting.');
	}

	const headers = rows[0].map((header, index) =>
		(index === 0 ? header.replace(/^\uFEFF/, '') : header).trim(),
	);
	const dieIdIndex = headers.indexOf('die_id');
	const dropdownIndex = headers.indexOf('dropdown_value');
	const segmentedIndex = headers.indexOf('segmented_value');

	if (dieIdIndex < 0 || dropdownIndex < 0 || segmentedIndex < 0) {
		throw new Error(
			'Le CSV doit contenir die_id, dropdown_value et segmented_value.',
		);
	}

	return rows.slice(1).map((csvRow) => ({
		dieId: csvRow[dieIdIndex],
		dropdownValue: csvRow[dropdownIndex],
		segmentedValue: csvRow[segmentedIndex],
	}));
}

function setGeneralActionsStatus(message, isError = false) {
	generalActionsStatus.textContent = message;
	generalActionsStatus.classList.toggle('is-error', isError);
}

function exportSettings() {
	const actionsConfig = appConfig.general.generalActions;
	const csvBlob = new Blob([`\uFEFF${createSettingsCsv()}`], {
		type: 'text/csv;charset=utf-8',
	});
	const downloadUrl = URL.createObjectURL(csvBlob);
	const downloadLink = document.createElement('a');

	downloadLink.href = downloadUrl;
	downloadLink.download = actionsConfig.csvFileName;
	document.body.append(downloadLink);
	downloadLink.click();
	downloadLink.remove();
	URL.revokeObjectURL(downloadUrl);
	setGeneralActionsStatus('CSV exporté.');
}

async function importSettings(file) {
	try {
		const settings = getSettingsFromCsv(await file.text());
		const appliedCount = applySettings(settings);

		if (appliedCount === 0) {
			throw new Error('Aucun dé compatible trouvé dans le CSV.');
		}

		setGeneralActionsStatus(
			`${appliedCount} dé(s) mis à jour depuis le CSV.`,
		);
	} catch (error) {
		setGeneralActionsStatus(error.message, true);
	}
}

function saveSettingsLocally() {
	const storageKey = appConfig.general.generalActions.localStorageKey;

	try {
		localStorage.setItem(storageKey, JSON.stringify(getCurrentSettings()));
		setGeneralActionsStatus('Paramètres sauvegardés localement.');
	} catch {
		setGeneralActionsStatus('La sauvegarde locale est indisponible.', true);
	}
}

function loadLocalSettings() {
	const storageKey = appConfig.general.generalActions.localStorageKey;

	try {
		const savedSettings = localStorage.getItem(storageKey);

		if (!savedSettings) {
			return;
		}

		const appliedCount = applySettings(JSON.parse(savedSettings));
		if (appliedCount > 0) {
			setGeneralActionsStatus('Paramètres locaux restaurés.');
		}
	} catch {
		setGeneralActionsStatus(
			'Les paramètres locaux n’ont pas pu être restaurés.',
			true,
		);
	}
}

function configureGeneralActions() {
	const actionsConfig = appConfig.general.generalActions;

	exportSettingsButton.textContent = actionsConfig.exportButtonLabel;
	importSettingsButton.textContent = actionsConfig.importButtonLabel;
	saveSettingsButton.textContent = actionsConfig.saveButtonLabel;
	exportSettingsButton.addEventListener('click', exportSettings);
	importSettingsButton.addEventListener('click', () => {
		importSettingsInput.value = '';
		importSettingsInput.click();
	});
	importSettingsInput.addEventListener('change', () => {
		const [file] = importSettingsInput.files;
		if (file) {
			importSettings(file);
		}
	});
	saveSettingsButton.addEventListener('click', saveSettingsLocally);
}

const diceGroupStates = appConfig.diceGroups.map(createDiceGroup);
configureGeneralActions();
loadLocalSettings();
