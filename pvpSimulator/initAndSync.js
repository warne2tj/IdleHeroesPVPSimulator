import { hero, setTeamData } from './heroes.js';
import { heroMapping } from './heroSubclasses.js';
import { baseHeroStats } from './baseHeroStats.js';
import { baseMonsterStats } from './baseMonsterStats.js';
import { artifacts } from './artifact.js';
import { avatarFrames } from './avatarFrame.js';
import { skins } from './skin.js';
import { stones } from './stone.js';
import { armors, accessories, weapons, shoes } from './equipment.js';
import { runSim } from './simulation.js';

const lsPrefix = 'pvp_';
const attHeroes = [null, null, null, null, null, null];
const defHeroes = [null, null, null, null, null, null];


function initialize() {
	// layout stuff
	let acc = document.getElementsByClassName('colorA');
	for (let i = 0; i < acc.length; i++) {
		acc[i].addEventListener('click', function() {
			/* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
			this.classList.toggle('activeA');

			/* Toggle between hiding and showing the active panel */
			const panel = this.nextElementSibling;
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
			} else {
				panel.style.maxHeight = panel.scrollHeight + 'px';
			}
		});
	}

	acc = document.getElementsByClassName('colorB');
	for (let i = 0; i < acc.length; i++) {
		acc[i].addEventListener('click', function() {
			this.classList.toggle('activeB');

			const panel = this.nextElementSibling;
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
			} else {
				panel.style.maxHeight = panel.scrollHeight + 'px';
			}
		});
	}

	acc = document.getElementsByClassName('colorC');
	for (let i = 0; i < acc.length; i++) {
		acc[i].addEventListener('click', function() {
			this.classList.toggle('activeC');

			const panel = this.nextElementSibling;
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
			} else {
				panel.style.maxHeight = panel.scrollHeight + 'px';
			}
		});
	}

	// When the user scrolls down 20px from the top of the document, show the button
	window.onscroll = function() {
		if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
			document.getElementById('topButton').style.display = 'block';
		} else {
			document.getElementById('topButton').style.display = 'none';
		}
	};


	// populate options
	addOptions(baseHeroStats, 'Name');
	addOptions(weapons, 'Weapon');
	addOptions(accessories, 'Accessory');
	addOptions(armors, 'Armor');
	addOptions(shoes, 'Shoe');
	addOptions(stones, 'Stone');
	addOptions(artifacts, 'Artifact');

	let option;

	for(const x in avatarFrames) {
		option = document.createElement('option');
		option.text = x;
		document.getElementById('attAvatarFrame').add(option);

		option = document.createElement('option');
		option.text = x;
		document.getElementById('defAvatarFrame').add(option);
	}

	for(const x in baseMonsterStats) {
		option = document.createElement('option');
		option.text = x;
		document.getElementById('attMonster').add(option);

		option = document.createElement('option');
		option.text = x;
		document.getElementById('defMonster').add(option);
	}

	// check local storage
	if (typeof (Storage) !== 'undefined') {
		if (localStorage.getItem(lsPrefix + 'numSims') !== null) {
			document.getElementById('numSims').value = localStorage.getItem(lsPrefix + 'numSims');
			document.getElementById('configText').value = localStorage.getItem(lsPrefix + 'configText');
		} else {
			localStorage.setItem(lsPrefix + 'numSims', document.getElementById('numSims').value);
			localStorage.setItem(lsPrefix + 'configText', document.getElementById('configText').value);
		}
	}


	for (const h in attHeroes) {
		attHeroes[h] = new hero('None', h, 'att');
		defHeroes[h] = new hero('None', h, 'def');
	}


	// load default configuration
	loadConfig();
	callSim();
}


function storeLocal(i) {
	if (typeof (Storage) !== 'undefined') {
		localStorage.setItem(lsPrefix + i.id, i.value);
	}
}


function swapAttDef() {
	createConfig();

	const oConfig = document.getElementById('configText');
	let configString = oConfig.value;

	configString = configString.replace(/"att/g, '@@@');
	configString = configString.replace(/"def/g, '"att');
	configString = configString.replace(/@@@/g, '"def');

	oConfig.value = configString;

	if (typeof (Storage) !== 'undefined') {
		localStorage.setItem(lsPrefix + 'configText', document.getElementById('configText').value);
	}

	loadConfig();
	createConfig();
}


function swapHero() {
	const heroA = document.getElementById('heroA').value;
	const heroB = document.getElementById('heroB').value;

	if (heroA != heroB) {
		createConfig();

		const oConfig = document.getElementById('configText');
		let configString = oConfig.value;
		const reA = new RegExp(heroA, 'g');
		const reB = new RegExp(heroB, 'g');

		configString = configString.replace(reA, '@@@');
		configString = configString.replace(reB, heroA);
		configString = configString.replace(/@@@/g, heroB);

		oConfig.value = configString;

		if (typeof (Storage) !== 'undefined') {
			localStorage.setItem(lsPrefix + 'configText', document.getElementById('configText').value);
		}

		loadConfig();
		createConfig();
	}
}


function copyHero() {
	const heroA = document.getElementById('heroA').value;
	const heroB = document.getElementById('heroB').value;

	if (heroA != heroB) {
		createConfig();

		const oConfig = document.getElementById('configText');
		const jsonConfig = JSON.parse(oConfig.value);

		for (const x in jsonConfig) {
			if (x.substring(0, 8) == heroA) {
				jsonConfig[heroB + x.substring(8)] = jsonConfig[x];
			}
		}

		oConfig.value = JSON.stringify(jsonConfig);

		if (typeof (Storage) !== 'undefined') {
			localStorage.setItem(lsPrefix + 'configText', document.getElementById('configText').value);
		}

		loadConfig();
		createConfig();
	}
}


// When the user clicks on the button, scroll to the top of the document
// eslint-disable-next-line no-unused-vars
function topFunction() {
	// For Safari
	document.body.scrollTop = 0;

	// For Chrome, Firefox, IE and Opera
	document.documentElement.scrollTop = 0;
}


function addOptions(dictItems, strPostfix) {
	let option;

	for(const x in dictItems) {
		for(let i = 0; i < attHeroes.length; i++) {
			option = document.createElement('option');
			option.text = x;
			document.getElementById('attHero' + i + strPostfix).add(option);
		}

		for(let i = 0; i < defHeroes.length; i++) {
			option = document.createElement('option');
			option.text = x;
			document.getElementById('defHero' + i + strPostfix).add(option);
		}
	}
}


function changeHero(heroPos, prefix, skipUpdates = false) {
	let arrToUse = [];
	if (prefix == 'att') {
		arrToUse = attHeroes;
	} else {
		arrToUse = defHeroes;
	}

	const pHeroName = arrToUse[heroPos]._heroName;
	const cHeroName = document.getElementById(prefix + 'Hero' + heroPos + 'Name').value;
	const cHeroSheet = document.getElementById(prefix + 'Hero' + heroPos + 'Sheet');
	const cHeroSkins = document.getElementById(prefix + 'Hero' + heroPos + 'Skin');

	if (cHeroName == pHeroName) {
		// no change, do nothing
	} else {
		console.log('Change Hero ' + heroPos + ': ' + pHeroName + ' to ' + cHeroName);

		cHeroSkins.value = 'None';
		const skinLen = cHeroSkins.options.length - 1;
		for (let i = skinLen; i > 0; i--) {
			cHeroSkins.remove(i);
		}

		if(cHeroName == 'None') {
			arrToUse[heroPos] = new hero('None', heroPos, prefix);
			cHeroSheet.innerHTML = '';
		} else {
			arrToUse[heroPos] = new heroMapping[baseHeroStats[cHeroName]['className']](cHeroName, heroPos, prefix);

			if ([cHeroName] in skins) {
				let option;
				for(const x in skins[cHeroName]) {
					option = document.createElement('option');
					option.text = x;
					cHeroSkins.add(option);
				}
			}
		}

		if (skipUpdates == false) {
			if (prefix == 'att') {
				arrToUse[heroPos]._allies = attHeroes;
				arrToUse[heroPos]._enemies = defHeroes;
				updateAttackers();
			} else {
				arrToUse[heroPos]._allies = defHeroes;
				arrToUse[heroPos]._enemies = attHeroes;
				updateDefenders();
			}
		}
	}
}


function updateHero(heroPos, prefix) {
	const cHeroName = document.getElementById(prefix + 'Hero' + heroPos + 'Name').value;
	const cHeroSheet = document.getElementById(prefix + 'Hero' + heroPos + 'Sheet');
	let arrToUse = [];

	if (cHeroName != 'None') {
		console.log('updateHero ' + heroPos + ': ' + cHeroName);

		if (prefix == 'att') {
			arrToUse = attHeroes;
		} else {
			arrToUse = defHeroes;
		}

		arrToUse[heroPos]._heroLevel = document.getElementById(prefix + 'Hero' + heroPos + 'Level').value;

		arrToUse[heroPos]._weapon = document.getElementById(prefix + 'Hero' + heroPos + 'Weapon').value;
		arrToUse[heroPos]._accessory = document.getElementById(prefix + 'Hero' + heroPos + 'Accessory').value;
		arrToUse[heroPos]._armor = document.getElementById(prefix + 'Hero' + heroPos + 'Armor').value;
		arrToUse[heroPos]._shoe = document.getElementById(prefix + 'Hero' + heroPos + 'Shoe').value;
		arrToUse[heroPos]._stone = document.getElementById(prefix + 'Hero' + heroPos + 'Stone').value;
		arrToUse[heroPos]._artifact = document.getElementById(prefix + 'Hero' + heroPos + 'Artifact').value;
		arrToUse[heroPos]._skin = document.getElementById(prefix + 'Hero' + heroPos + 'Skin').value;

		arrToUse[heroPos]._enable1 = document.getElementById(prefix + 'Hero' + heroPos + 'Enable1').value;
		arrToUse[heroPos]._enable2 = document.getElementById(prefix + 'Hero' + heroPos + 'Enable2').value;
		arrToUse[heroPos]._enable3 = document.getElementById(prefix + 'Hero' + heroPos + 'Enable3').value;
		arrToUse[heroPos]._enable4 = document.getElementById(prefix + 'Hero' + heroPos + 'Enable4').value;
		arrToUse[heroPos]._enable5 = document.getElementById(prefix + 'Hero' + heroPos + 'Enable5').value;

		arrToUse[heroPos].updateCurrentStats();
		cHeroSheet.innerHTML = arrToUse[heroPos].getHeroSheet();
	}
}


function updateAttackers() {
	setTeamData(
		document.getElementById('attMonster').value,
		document.getElementById('defMonster').value,
		document.getElementById('attAvatarFrame').value,
		document.getElementById('defAvatarFrame').value,
	);

	for (let i = 0; i < attHeroes.length; i++) {
		updateHero(i, 'att');
	}
}


function updateDefenders() {
	setTeamData(
		document.getElementById('attMonster').value,
		document.getElementById('defMonster').value,
		document.getElementById('attAvatarFrame').value,
		document.getElementById('defAvatarFrame').value,
	);

	for (let i = 0; i < defHeroes.length; i++) {
		updateHero(i, 'def');
	}
}


function createConfig() {
	const oConfig = document.getElementById('configText');
	oConfig.value = '{\n';

	let arrInputs = document.getElementsByTagName('INPUT');
	for (let e = 0; e < arrInputs.length; e++) {
		const elem = arrInputs[e];

		if ('id' in elem) {
			if (elem.id.substring(0, 3) == 'att' || elem.id.substring(0, 3) == 'def') {
				oConfig.value += '\t"' + elem.id + '": "' + elem.value + '",\n';
			}
		}
	}

	arrInputs = document.getElementsByTagName('SELECT');
	for (let e = 0; e < arrInputs.length; e++) {
		const elem = arrInputs[e];

		if ('id' in elem) {
			if (elem.id.substring(0, 3) == 'att' || elem.id.substring(0, 3) == 'def') {
				if (e == arrInputs.length - 1) {
					oConfig.value += '\t"' + elem.id + '": "' + elem.value + '"\n';
				} else {
					oConfig.value += '\t"' + elem.id + '": "' + elem.value + '",\n';
				}
			}
		}
	}

	oConfig.value += '}';

	if (typeof (Storage) !== 'undefined') {
		localStorage.setItem(lsPrefix + 'configText', document.getElementById('configText').value);
	}

	oConfig.select();
	oConfig.setSelectionRange(0, oConfig.value.length);
	document.execCommand('copy');
}


function loadConfig() {
	const oConfig = document.getElementById('configText');
	const jsonConfig = JSON.parse(oConfig.value);

	for (const x in jsonConfig) {
		if (document.getElementById(x) !== null) {
			document.getElementById(x).value = jsonConfig[x];
		}

		if (x.substring(x.length - 4, x.length) == 'Name') {
			changeHero(Number.parseInt(x.substring(7, 8)), x.substring(0, 3), true);
		}
	}

	updateAttackers();
	updateDefenders();
}


// eslint-disable-next-line no-unused-vars
function genSeed() {
	const dt = new Date();
	document.getElementById('domSeed').value = dt.valueOf().toString();
}


// eslint-disable-next-line no-unused-vars
function callSim() {
	runSim(
		attHeroes,
		defHeroes,
		document.getElementById('attMonster').value,
		document.getElementById('defMonster').value,
		document.getElementById('attAvatarFrame').value,
		document.getElementById('defAvatarFrame').value,
		document.getElementById('numSims').value,
		document.getElementById('domSeed'),
	);
}


window.callSim = callSim;
window.genSeed = genSeed;
window.createConfig = createConfig;
window.loadConfig = loadConfig;
window.initialize = initialize;
window.storeLocal = storeLocal;
window.swapAttDef = swapAttDef;
window.changeHero = changeHero;
window.swapHero = swapHero;
window.copyHero = copyHero;
window.updateAttackers = updateAttackers;
window.updateDefenders = updateDefenders;
window.topFunction = topFunction;
window.updateHero = updateHero;