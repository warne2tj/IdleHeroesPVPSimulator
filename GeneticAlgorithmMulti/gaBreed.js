import { baseHeroStats } from '../pvpSimulator/baseHeroStats.js';
import { baseMonsterStats } from '../pvpSimulator/baseMonsterStats.js';
import { seededHeroes } from './seededHeroes.js';
import { skins } from '../pvpSimulator/skin.js';
import { stones } from '../pvpSimulator/stone.js';


const heroNames = Object.keys(baseHeroStats).slice(1);
const stoneNames = Object.keys(stones).slice(1);
const monsterNames = Object.keys(baseMonsterStats).slice(1);
const artifactNames = ['Antlers Cane', 'Demon Bell', 'Staff Punisher of Immortal', 'Magic Stone Sword', 'Augustus Magic Ball',
	'The Kiss of Ghost', 'Lucky Candy Bar', 'Wildfire Torch', 'Golden Crown', 'Ruyi Scepter', 'Snow Heart'];
const equipments = ['Class Gear', 'Split HP', 'Split Attack', 'No Armor'];
const enables1 = ['Vitality', 'Mightiness', 'Growth'];
const enables2 = ['Shelter', 'LethalFightback', 'Vitality2'];
const enables3 = ['Resilience', 'SharedFate', 'Purify'];
const enables4 = ['Vitality', 'Mightiness', 'Growth'];
const enables5 = ['BalancedStrike', 'UnbendingWill'];
const voidEnables = ['armorPercent', 'armorBreak', 'precision', 'block', 'controlImmune', 'damageReduce', 'crit', 'critDamage', 'holyDamage', 'skillDamage'];


const artifactLevel = 'Splendid ';
const numEnhancedArtifacts = 6;
const numGenes = 13;
const dnaLength = numGenes * 6;
let isSeeded = true;
const lsPrefix = 'ga_';


function getHero(heroName) {
	const skinNames = Object.keys(skins[heroName]);
	const legendarySkins = [];
	const sHero = seededHeroes[heroName];
	let shuffleVoidEnables;

	if (baseHeroStats[heroName].heroFaction == 'Transcendence') {
		shuffleVoidEnables = shuffle(voidEnables).slice(0, 3);
	} else {
		shuffleVoidEnables = ['None', 'None', 'None'];
	}


	for (const s in skinNames) {
		if (skinNames[s].substring(0, 9) == 'Legendary') {
			legendarySkins.push(skinNames[s]);
		}
	}


	let value = '  "' + heroName + '", ';
	value += '"' + legendarySkins[Math.floor(Math.random() * legendarySkins.length)] + '", ';

	if (isSeeded && heroName in seededHeroes) {
		value += '"' + sHero.allowedEquipments[Math.floor(Math.random() * sHero.allowedEquipments.length)] + '", ';
		value += '"' + sHero.allowedStones[Math.floor(Math.random() * sHero.allowedStones.length)] + '", ';
		value += '"' + artifactLevel + sHero.allowedArtifacts[Math.floor(Math.random() * sHero.allowedArtifacts.length)] + '", ';
		value += sHero.allowedEnables[Math.floor(Math.random() * sHero.allowedEnables.length)] + ', ';

		value += '"' + shuffleVoidEnables[0] + '", ';
		value += '"' + shuffleVoidEnables[1] + '", ';
		value += '"' + shuffleVoidEnables[2] + '",\n';

	} else {
		value += '"' + equipments[Math.floor(Math.random() * equipments.length)] + '", ';
		value += '"' + stoneNames[Math.floor(Math.random() * stoneNames.length)] + '", ';
		value += '"' + artifactLevel + artifactNames[Math.floor(Math.random() * artifactNames.length)] + '", ';

		value += '"' + enables1[Math.floor(Math.random() * enables1.length)] + '", ';
		value += '"' + enables2[Math.floor(Math.random() * enables2.length)] + '", ';
		value += '"' + enables3[Math.floor(Math.random() * enables3.length)] + '", ';
		value += '"' + enables4[Math.floor(Math.random() * enables4.length)] + '", ';
		value += '"' + enables5[Math.floor(Math.random() * enables5.length)] + '",';

		value += '"' + shuffleVoidEnables[0] + '", ';
		value += '"' + shuffleVoidEnables[1] + '", ';
		value += '"' + shuffleVoidEnables[2] + '",\n';

	}

	return value;
}


function createRandomTeams(seeded) {
	const oConfig = document.getElementById('configText');
	const numCreate = parseInt(document.getElementById('numCreate').value);
	let arrEnhArtifacts = [1, 2, 3, 4, 5, 6];

	isSeeded = seeded;


	oConfig.value = '{\n';
	for(let i = 0; i < numCreate; i++) {
		const arrTranscendence = [];
		arrEnhArtifacts = shuffle(arrEnhArtifacts);
		const tempEnhArtifacts = arrEnhArtifacts.slice(0, numEnhancedArtifacts);

		oConfig.value += '"' + i + '": [\n';

		for (let h = 1; h <= 6; h++) {
			let heroName = '';

			do {
				heroName = heroNames[Math.floor(Math.random() * heroNames.length)];

				if (baseHeroStats[heroName].heroFaction == 'Transcendence') {
					if (arrTranscendence.includes(heroName)) {
						heroName = '';
					} else {
						arrTranscendence.push(heroName);
					}
				}
			} while (heroName == '');


			let strHero = getHero(heroName);

			if (!(tempEnhArtifacts.includes(h))) {
				strHero = strHero.replace(artifactLevel, '');
			}

			oConfig.value += strHero;
		}

		oConfig.value += '  "' + monsterNames[Math.floor(Math.random() * monsterNames.length)] + '"\n';

		if (i < (numCreate - 1)) {
			oConfig.value += '],\n';
		} else {
			oConfig.value += ']\n';
		}
	}

	oConfig.value += '}';
}


function evolve(allTeams, teamKeys) {
	const oConfig = document.getElementById('configText');
	let t = 0;
	let dna1;
	let dnaString1;
	let child = [];
	const mutationRate = 0.01;
	const swapRate = 0.10;

	const numCreate = teamKeys.length;
	const i10p = Math.floor(numCreate * 0.1);
	const i90p = Math.floor(numCreate * 0.9);

	// speciation
	const arrTeams = [];
	const heroCount = {};
	let teamDNA;
	let tempTeam;
	let similarityScore;
	let speciesCount;

	for (const i in baseHeroStats) {
		heroCount[i] = 0;
	}


	oConfig.value = '{\n';

	// clone top 10%
	for (t = 0; t < i10p; t++) {
		dna1 = allTeams[teamKeys[t]]['dna'];
		dnaString1 = '"' + t + '": [\n';

		for (let h = 0; h < 6; h++) {
			dnaString1 += ' ';

			for (let g = 0; g < numGenes; g++) {
				dnaString1 += ' "' + dna1[h * numGenes + g] + '",';
			}

			dnaString1 += '\n';
		}


		tempTeam = Object.assign({}, heroCount);
		for (let g = 0; g < dnaLength; g += numGenes) {
			tempTeam[dna1[g]]++;
		}
		arrTeams.push(tempTeam);


		dnaString1 += '  "' + dna1[dnaLength] + '"\n],\n';
		oConfig.value += dnaString1;
	}


	// breed
	while (t < numCreate) {
		child = breed(allTeams, teamKeys, 0, i90p, mutationRate * (Math.floor(t / 10) + 1), swapRate * (Math.floor(t / 10) + 1));

		teamDNA = child[0];
		tempTeam = Object.assign({}, heroCount);
		speciesCount = 0;

		for (let g = 0; g < dnaLength; g += numGenes) {
			tempTeam[teamDNA[g]]++;
		}

		for (const x in arrTeams) {
			similarityScore = 0;

			for (const h in arrTeams[x]) {
				if (arrTeams[x][h] > 0 && tempTeam[h] > 0) {
					if (arrTeams[x][h] > tempTeam[h]) {
						similarityScore += tempTeam[h];
					} else {
						similarityScore += arrTeams[x][h];
					}
				}
			}

			if (similarityScore / 6 >= 0.5) {
				speciesCount++;
			}
		}

		if (speciesCount < i10p) {
			if (t == numCreate - 1) {
				oConfig.value += '"' + t + '": [' + child[1] + '\n]\n';
			} else {
				oConfig.value += '"' + t + '": [' + child[1] + '\n],\n';
			}

			arrTeams.push(tempTeam);
			t++;
		}
	}

	oConfig.value += '}';

	if (typeof (Storage) !== 'undefined') {
		localStorage.setItem(lsPrefix + 'configText', document.getElementById('configText').value);
	}
}


function breed(allTeams, teamKeys, start, end, mutationRate, posSwapRate) {
	const child1 = [];
	const arrTranscendence = [];
	let skinNames, legendarySkins;


	const parentA = Math.floor(Math.pow(Math.random(), 1.2) * (end - start)) + start;
	const dna1 = allTeams[teamKeys[parentA]]['dna'];

	const parentB = Math.floor(Math.pow(Math.random(), 1.2) * (end - start)) + start;
	const dna2 = allTeams[teamKeys[parentB]]['dna'];


	// randomly pick one of the heroes from the 2 teams
	for (let h = 0; h < 6; h++) {
		let chosenDna;

		if (Math.random() < 0.50) {
			chosenDna = dna1;
		} else {
			chosenDna = dna2;
		}

		const chosenHero = chosenDna[h * numGenes];

		if (baseHeroStats[chosenHero].heroFaction == 'Transcendence') {
			if (arrTranscendence.includes(chosenHero)) {
				const heroPositions = shuffle([0, 1, 2, 3, 4, 5]);

				for (let rndPos = 0; rndPos < 6; rndPos++) {
					const diffHeroPos = heroPositions[rndPos];
					const diffHeroName = chosenDna[diffHeroPos * numGenes];
					const diffHero = baseHeroStats[diffHeroName];

					if (diffHero.heroFaction != 'Transcendence' || (diffHero.heroFaction == 'Transcendence' && !arrTranscendence.includes(diffHeroName))) {
						if (diffHero.heroFaction == 'Transcendence') arrTranscendence.push(diffHeroName);

						for (let g = 0; g < numGenes; g++) {
							child1.push(chosenDna[diffHeroPos * numGenes + g]);
						}
						break;
					}
				}

			} else {
				arrTranscendence.push(chosenHero);

				for (let g = 0; g < numGenes; g++) {
					child1.push(chosenDna[h * numGenes + g]);
				}
			}

		} else {
			for (let g = 0; g < numGenes; g++) {
				child1.push(chosenDna[h * numGenes + g]);
			}
		}
	}

	// randomly pick one of the pets
	if (Math.random() < 0.50) {
		child1.push(dna1[dnaLength]);
	} else {
		child1.push(dna2[dnaLength]);
	}


	// mutate child 1 genes
	let currentHeroName, currentHero, newHeroName, newHero;

	for (let g = 0; g < dnaLength; g++) {
		if (g % numGenes == 0) {
			currentHeroName = child1[g];
			currentHero = baseHeroStats[currentHeroName];
		}


		if (Math.random() < mutationRate) {
			switch(g % numGenes) {
			case 0:
				newHeroName = heroNames[Math.floor(Math.random() * heroNames.length)];
				if (arrTranscendence.includes(newHeroName)) break;

				newHero = baseHeroStats[newHeroName];
				if (newHero.heroFaction == 'Transcendence') arrTranscendence.push(newHeroName);

				skinNames = Object.keys(skins[child1[g]]);
				legendarySkins = [];
				for (const s in skinNames) {
					if (skinNames[s].substring(0, 9) == 'Legendary') {
						legendarySkins.push(skinNames[s]);
					}
				}


				child1[g] = newHeroName;
				child1[g + 1] = legendarySkins[Math.floor(Math.random() * legendarySkins.length)];

				if (currentHero.heroFaction == 'Transcendence') {
					if (newHero.heroFaction == 'Transcendence') {
						const index = arrTranscendence.indexOf(currentHeroName);
						if (index > -1) arrTranscendence.splice(index, 1);
					}

					if (newHero.heroFaction != 'Transcendence') {
						child1[g + 10] = 'None';
						child1[g + 11] = 'None';
						child1[g + 12] = 'None';
					}
				} else if (currentHero.heroFaction != 'Transcendence' && newHero.heroFaction == 'Transcendence') {
					child1[g + 10] = voidEnables[Math.floor(Math.random() * voidEnables.length)];
					child1[g + 11] = voidEnables[Math.floor(Math.random() * voidEnables.length)];
					child1[g + 12] = voidEnables[Math.floor(Math.random() * voidEnables.length)];
				}

				currentHero = newHero;
				break;

			case 1:
				skinNames = Object.keys(skins[child1[g - 1]]);
				legendarySkins = [];
				for (const s in skinNames) {
					if (skinNames[s].substring(0, 9) == 'Legendary') {
						legendarySkins.push(skinNames[s]);
					}
				}

				child1[g] = legendarySkins[Math.floor(Math.random() * legendarySkins.length)];
				break;

			case 2:
				child1[g] = equipments[Math.floor(Math.random() * equipments.length)];
				break;

			case 3:
				child1[g] = stoneNames[Math.floor(Math.random() * stoneNames.length)];
				break;

			case 4:
				child1[g] = artifactLevel + artifactNames[Math.floor(Math.random() * artifactNames.length)];
				break;

			case 5:
				child1[g] = enables1[Math.floor(Math.random() * enables1.length)];
				break;

			case 6:
				child1[g] = enables2[Math.floor(Math.random() * enables2.length)];
				break;

			case 7:
				child1[g] = enables3[Math.floor(Math.random() * enables3.length)];
				break;

			case 8:
				child1[g] = enables4[Math.floor(Math.random() * enables4.length)];
				break;

			case 9:
				child1[g] = enables5[Math.floor(Math.random() * enables5.length)];
				break;

			case 10:
				if (currentHero.heroFaction == 'Transcendence') child1[g] = voidEnables[Math.floor(Math.random() * voidEnables.length)];
				break;

			case 11:
				if (currentHero.heroFaction == 'Transcendence') child1[g] = voidEnables[Math.floor(Math.random() * voidEnables.length)];
				break;

			case 12:
				if (currentHero.heroFaction == 'Transcendence') child1[g] = voidEnables[Math.floor(Math.random() * voidEnables.length)];
				break;
			}
		}
	}

	// mutate child 1 pet
	if (Math.random() < posSwapRate) {
		child1[dnaLength] = monsterNames[Math.floor(Math.random() * monsterNames.length)];
	}

	// swap hero positions
	if (Math.random() < posSwapRate) {
		const swap1 = Math.floor(Math.random() * 6);
		const swap2 = Math.floor(Math.random() * 6);

		if (swap1 != swap2) {
			for (let g = 0; g < numGenes; g++) {
				const tempGene = child1[swap1 * numGenes + g];
				child1[swap1 * numGenes + g] = child1[swap2 * numGenes + g];
				child1[swap2 * numGenes + g] = tempGene;
			}
		}
	}


	// check for seeded
	if (isSeeded) {
		for (let i = 0; i < 6; i++) {
			const g = i * numGenes;

			if (child1[g] in seededHeroes) {
				const sHero = seededHeroes[child1[g]];

				if (sHero.allowedEquipments.indexOf(child1[g + 2]) < 0) {
					child1[g + 2] = sHero.allowedEquipments[Math.floor(Math.random() * sHero.allowedEquipments.length)];
				}

				if (sHero.allowedStones.indexOf(child1[g + 3]) < 0) {
					child1[g + 3] = sHero.allowedStones[Math.floor(Math.random() * sHero.allowedStones.length)];
				}

				if (sHero.allowedArtifacts.indexOf(child1[g + 4]) < 0) {
					child1[g + 4] = artifactLevel + sHero.allowedArtifacts[Math.floor(Math.random() * sHero.allowedArtifacts.length)];
				}

				let strEnables = '"' + child1.slice(g + 5, g + 10).join('", "') + '"';
				if (sHero.allowedEnables.indexOf(strEnables) < 0) {
					strEnables = sHero.allowedEnables[Math.floor(Math.random() * sHero.allowedEnables.length)];
					strEnables = strEnables.replace(/"/g, '');
					const arrEnables = strEnables.split(', ');

					for (let j = 5; j < 10; j++) {
						child1[g + j] = arrEnables[j - 5];
					}
				}
			}
		}
	}


	// limit enhanced artifacts
	let arrPotentialArtifacts = [];
	for (let h = 0; h < 6; h++) {
		const g = h * numGenes + 4;

		if (child1[g].includes(artifactLevel)) {
			arrPotentialArtifacts.push(g);
		}
	}

	if (arrPotentialArtifacts.length > numEnhancedArtifacts) {
		arrPotentialArtifacts = shuffle(arrPotentialArtifacts);
		for (let a = numEnhancedArtifacts; a < arrPotentialArtifacts.length; a++) {
			child1[arrPotentialArtifacts[a]] = child1[arrPotentialArtifacts[a]].replace(artifactLevel, '');
		}
	}


	// output child genes
	let dnaString1 = '';

	for (let h = 0; h < 6; h++) {
		dnaString1 += '\n ';

		for (let g = 0; g < numGenes; g++) {
			dnaString1 += ' "' + child1[h * numGenes + g] + '",';
		}
	}

	dnaString1 += '\n  "' + child1[dnaLength] + '"';


	return [child1, dnaString1];
}


function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex !== 0) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}


export { createRandomTeams, evolve, heroNames, numGenes, dnaLength };