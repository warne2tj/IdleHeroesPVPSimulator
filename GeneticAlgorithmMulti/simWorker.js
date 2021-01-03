/*
self.importScripts('../pvpSimulator/artifact.js');
self.importScripts('../pvpSimulator/avatarFrame.js');
self.importScripts('../pvpSimulator/equipment.js');
self.importScripts('../pvpSimulator/guildTech.js');
self.importScripts('../pvpSimulator/skin.js');
self.importScripts('../pvpSimulator/stone.js');
self.importScripts('../pvpSimulator/utilityFunctions.js');
self.importScripts('../pvpSimulator/heroes.js');
self.importScripts('../pvpSimulator/heroSubclasses.js');
self.importScripts('../pvpSimulator/baseHeroStats.js');
self.importScripts('../pvpSimulator/monsters.js');
self.importScripts('../pvpSimulator/baseMonsterStats.js');
self.importScripts('../pvpSimulator/simulation.js');
*/
import { classGearMapping } from '../pvpSimulator/equipment.js';
import { baseHeroStats } from '../pvpSimulator/baseHeroStats.js';
import { heroMapping } from '../pvpSimulator/heroSubclasses.js';
import { runSim } from '../pvpSimulator/simulation.js';
import { numGenes, dnaLength } from './gaBreed.js';


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
			allAttTeams[teamIndex]['pet'] = jsonConfig[t][dnaLength];
			team = [];

			for (let p = 0; p < dnaLength; p += numGenes) {
				tHero = new heroMapping[baseHeroStats[jsonConfig[t][p]]['className']](jsonConfig[t][p], Math.floor(p / 10), 'att');

				tHero._heroLevel = 350;
				tHero._voidLevel = 4;
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
			allDefTeams[teamIndex]['pet'] = jsonConfig[t][dnaLength];
			team = [];

			for (let p = 0; p < dnaLength; p += numGenes) {
				tHero = new heroMapping[baseHeroStats[jsonConfig[t][p]]['className']](jsonConfig[t][p], Math.floor(p / 10), 'def');

				tHero._heroLevel = 350;
				tHero._voidLevel = 4;
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

	const numWins = runSim(allAttTeams[e.data[1]]['team'], allDefTeams[e.data[2]]['team'], allAttTeams[e.data[1]]['pet'], allDefTeams[e.data[2]]['pet'], attFrame, defFrame, numSims);
	postMessage([wid, e.data[1], e.data[2], numWins]);
}