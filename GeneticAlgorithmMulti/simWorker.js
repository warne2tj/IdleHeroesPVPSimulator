import { classGearMapping } from '../pvpSimulator/equipment.js';
import { baseHeroStats } from '../pvpSimulator/baseHeroStats.js';
import { heroMapping } from '../pvpSimulator/heroSubclasses.js';
import { runSim } from '../pvpSimulator/simulation.js';
import { numGenes, dnaLength } from '../pvpSimulator/utilityFunctions.js';


const heroLevel = 350;
const heroVoidLevel = 4;
const attFrame = 'Royal Amethyst +9';
const defFrame = 'Royal Amethyst +9';
let allAttTeams = {};
let allDefTeams = {};
let wid;
let numSims;

self.onmessage = handleCall;

function handleCall(e) {
	/* array containing:
    0: action to take
    1: attack team id
    2: defense team id
    3: worker id, optional
    4: number of simulations, optional
    5: jsonConfig, optional
  */

	if (e.data[0] == 'init') {
		wid = e.data[3];
		numSims = e.data[4];

		// load all teams
		const jsonConfig = e.data[5];
		let teamIndex = 0;
		let team;
		let tHero;

		allAttTeams = {};
		allDefTeams = {};

		for (const t in jsonConfig) {
			// add team as attacker
			allAttTeams[teamIndex] = {};
			allAttTeams[teamIndex]['pet'] = jsonConfig[t][dnaLength - 1];
			team = [];

			for (let p = 0; p < dnaLength - 1; p += numGenes) {
				tHero = new heroMapping[baseHeroStats[jsonConfig[t][p]]['className']](jsonConfig[t][p], Math.floor(p / numGenes), 'att');

				tHero._heroLevel = heroLevel;
				tHero._voidLevel = heroVoidLevel;
				tHero._skin = jsonConfig[t][p + 1];
				tHero._stone = jsonConfig[t][p + 3];
				tHero._artifact = jsonConfig[t][p + 4];
				tHero._enable1 = jsonConfig[t][p + 5];
				tHero._enable2 = jsonConfig[t][p + 6];
				tHero._enable3 = jsonConfig[t][p + 7];
				tHero._enable4 = jsonConfig[t][p + 8];
				tHero._enable5 = jsonConfig[t][p + 9];
				tHero._voidEnable1 = jsonConfig[t][p + 10];
				tHero._voidEnable2 = jsonConfig[t][p + 11];
				tHero._voidEnable3 = jsonConfig[t][p + 12];

				if (jsonConfig[t][p + 2] == 'Class Gear') {
					tHero._weapon = classGearMapping[tHero._heroClass]['weapon'];
					tHero._armor = classGearMapping[tHero._heroClass]['armor'];
					tHero._shoe = classGearMapping[tHero._heroClass]['shoe'];
					tHero._accessory = classGearMapping[tHero._heroClass]['accessory'];

				} else if (jsonConfig[t][p + 2] == 'Split HP') {
					tHero._weapon = '6* Thorny Flame Whip';
					tHero._armor = classGearMapping[tHero._heroClass]['armor'];
					tHero._shoe = classGearMapping[tHero._heroClass]['shoe'];
					tHero._accessory = '6* Flame Necklace';

				} else if (jsonConfig[t][p + 2] == 'Split Attack') {
					tHero._weapon = classGearMapping[tHero._heroClass]['weapon'];
					tHero._armor = '6* Flame Armor';
					tHero._shoe = '6* Flame Boots';
					tHero._accessory = '6* Flame Necklace';

				} else if (jsonConfig[t][p + 2] == 'No Armor') {
					tHero._weapon = classGearMapping[tHero._heroClass]['weapon'];
					tHero._armor = 'None';
					tHero._shoe = classGearMapping[tHero._heroClass]['shoe'];
					tHero._accessory = classGearMapping[tHero._heroClass]['accessory'];
				}

				team.push(tHero);
			}

			allAttTeams[teamIndex]['team'] = team;


			// add team as defender
			allDefTeams[teamIndex] = {};
			allDefTeams[teamIndex]['pet'] = jsonConfig[t][dnaLength - 1];
			team = [];

			for (let p = 0; p < dnaLength - 1; p += numGenes) {
				tHero = new heroMapping[baseHeroStats[jsonConfig[t][p]]['className']](jsonConfig[t][p], Math.floor(p / numGenes), 'def');

				tHero._heroLevel = heroLevel;
				tHero._voidLevel = heroVoidLevel;
				tHero._skin = jsonConfig[t][p + 1];
				tHero._stone = jsonConfig[t][p + 3];
				tHero._artifact = jsonConfig[t][p + 4];
				tHero._enable1 = jsonConfig[t][p + 5];
				tHero._enable2 = jsonConfig[t][p + 6];
				tHero._enable3 = jsonConfig[t][p + 7];
				tHero._enable4 = jsonConfig[t][p + 8];
				tHero._enable5 = jsonConfig[t][p + 9];
				tHero._voidEnable1 = jsonConfig[t][p + 10];
				tHero._voidEnable2 = jsonConfig[t][p + 11];
				tHero._voidEnable3 = jsonConfig[t][p + 12];

				if (jsonConfig[t][p + 2] == 'Class Gear') {
					tHero._weapon = classGearMapping[tHero._heroClass]['weapon'];
					tHero._armor = classGearMapping[tHero._heroClass]['armor'];
					tHero._shoe = classGearMapping[tHero._heroClass]['shoe'];
					tHero._accessory = classGearMapping[tHero._heroClass]['accessory'];

				} else if (jsonConfig[t][p + 2] == 'Split HP') {
					tHero._weapon = '6* Thorny Flame Whip';
					tHero._armor = classGearMapping[tHero._heroClass]['armor'];
					tHero._shoe = classGearMapping[tHero._heroClass]['shoe'];
					tHero._accessory = '6* Flame Necklace';

				} else if (jsonConfig[t][p + 2] == 'Split Attack') {
					tHero._weapon = classGearMapping[tHero._heroClass]['weapon'];
					tHero._armor = '6* Flame Armor';
					tHero._shoe = '6* Flame Boots';
					tHero._accessory = '6* Flame Necklace';

				} else if (jsonConfig[t][p + 2] == 'No Armor') {
					tHero._weapon = classGearMapping[tHero._heroClass]['weapon'];
					tHero._armor = 'None';
					tHero._shoe = classGearMapping[tHero._heroClass]['shoe'];
					tHero._accessory = classGearMapping[tHero._heroClass]['accessory'];
				}

				team.push(tHero);
			}

			allDefTeams[teamIndex]['team'] = team;

			teamIndex++;
		}
	}


	const attHeroes = allAttTeams[e.data[1]]['team'];
	const defHeroes = allDefTeams[e.data[2]]['team'];
	const attMonsterName = allAttTeams[e.data[1]]['pet'];
	const defMonsterName = allDefTeams[e.data[2]]['pet'];
	const numWins = runSim(attHeroes, defHeroes, attMonsterName, defMonsterName, attFrame, defFrame, numSims);
	postMessage([wid, e.data[1], e.data[2], numWins]);
}