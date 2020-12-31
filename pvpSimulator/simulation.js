import { baseMonsterStats } from './baseMonsterStats.js';
import { setTeamData } from './heroes.js';
import { monsterMapping } from './monsters.js';
import { artifacts } from './artifact.js';
import { random, uuid, rng, logCombat, formatNum, speedSort, getAllTargets, getHighestSpeedTargets } from './utilityFunctions.js';


let attHeroes = [null, null, null, null, null, null];
let defHeroes = [null, null, null, null, null, null];
let basicQueue = [];
let activeQueue = [];
let triggerQueue = [];
let roundNum = 0;
let logColor = 0;


function runSim(arrAttHeroes, arrDefHeroes, attMonsterName, defMonsterName, attFrame, defFrame, numSims, domSeed = null) {
	let winCount = 0;
	let orderOfAttack = [];
	let numOfHeroes = 0;
	let result = {};
	let monsterResult = '';
	let someoneWon = '';
	let temp = '';
	let endingRoundSum = 0;
	let currentHero;


	// team setup
	attHeroes = arrAttHeroes;
	defHeroes = arrDefHeroes;

	const attMonster = new monsterMapping[baseMonsterStats[attMonsterName]['className']](attMonsterName, 'att');
	attMonster._allies = attHeroes;
	attMonster._enemies = defHeroes;

	const defMonster = new monsterMapping[baseMonsterStats[defMonsterName]['className']](defMonsterName, 'def');
	defMonster._allies = defHeroes;
	defMonster._enemies = attHeroes;

	setTeamData(attMonsterName, defMonsterName, attFrame, defFrame);

	for (let p = 0; p < 6; p++) {
		attHeroes[p]._allies = attHeroes;
		attHeroes[p]._enemies = defHeroes;
		attHeroes[p]._damageDealt = 0;
		attHeroes[p]._damageHealed = 0;
		attHeroes[p].updateCurrentStats();

		defHeroes[p]._allies = defHeroes;
		defHeroes[p]._enemies = attHeroes;
		defHeroes[p]._damageDealt = 0;
		defHeroes[p]._damageHealed = 0;
		defHeroes[p].updateCurrentStats();
	}


	if (domSeed !== null) {
		rng(domSeed.value);
	} else {
		rng();
	}

	logColor = 0;
	logCombat('', false);


	for (let simIterNum = 1; simIterNum <= numSims; simIterNum++) {
		// @ start of single simulation

		if(numSims == 1) logCombat('<p class =\'logSeg\'>Simulation #' + formatNum(simIterNum) + ' Started.</p>');
		someoneWon = '';
		attMonster._energy = 0;
		defMonster._energy = 0;
		uuid(true);

		// snapshot stats as they are
		numOfHeroes = attHeroes.length;
		for (let i = 0; i < numOfHeroes; i++) {
			if (attHeroes[i]._heroName != 'None') {
				attHeroes[i].snapshotStats();
				attHeroes[i]._buffs = {};
				attHeroes[i]._debuffs = {};
			}
		}

		numOfHeroes = defHeroes.length;
		for (let i = 0; i < numOfHeroes; i++) {
			if (defHeroes[i]._heroName != 'None') {
				defHeroes[i].snapshotStats();
				defHeroes[i]._buffs = {};
				defHeroes[i]._debuffs = {};
			}
		}

		// trigger start of battle abilities
		for (const source of attHeroes) {
			if ((source.isNotSealed() && source._currentStats['totalHP'] > 0) || source._currentStats['revive'] == 1) {
				temp = source.startOfBattle();
				if(numSims == 1 && temp.length > 0) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + temp + '</div>');
				logColor = (logColor + 1) % 2;
			}


			if (source._artifact.includes(' Golden Crown')) {
				temp = source.getBuff(source, 'Golden Crown', 5, { allDamageReduce: artifacts[source._artifact].enhance });
				if(numSims == 1 && temp.length > 0) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + temp + '</div>');
				logColor = (logColor + 1) % 2;
			}


			if (source._artifact.includes(' Snow Heart')) {
				const targets = getHighestSpeedTargets(source, source._enemies, 3);
				const frostChances = [1, 0.66, 0.33];
				let frostIndex = 0;

				temp = `${source.heroDesc()} <span class='skill'>Snow Heart</span> triggered.`;
				for (const target of targets) {
					if (random() < frostChances[frostIndex]) {
						temp += target.getDebuff(source, 'Speed', 1, { speed: artifacts[source._artifact].enhance });
					}

					frostIndex++;
				}

				if(numSims == 1 && temp.length > 0) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + temp + '</div>');
				logColor = (logColor + 1) % 2;
			}
		}


		for (const source of defHeroes) {
			if ((source.isNotSealed() && source._currentStats['totalHP'] > 0) || source._currentStats['revive'] == 1) {
				temp = source.startOfBattle();
				if(numSims == 1 && temp.length > 0) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + temp + '</div>');
				logColor = (logColor + 1) % 2;
			}


			if (source._artifact.includes(' Golden Crown')) {
				temp = source.getBuff(source, 'Golden Crown', 5, { allDamageReduce: artifacts[source._artifact].enhance });
				if(numSims == 1 && temp.length > 0) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + temp + '</div>');
				logColor = (logColor + 1) % 2;
			}


			if (source._artifact.includes(' Snow Heart')) {
				const targets = getHighestSpeedTargets(source, source._enemies, 3);
				const frostChances = [1, 0.66, 0.33];
				let frostIndex = 0;

				temp = `${source.heroDesc()} <span class='skill'>Snow Heart</span> triggered.`;
				for (const target of targets) {
					if (random() < frostChances[frostIndex]) {
						temp += target.getDebuff(source, 'Speed', 1, { speed: artifacts[source._artifact].enhance });
					}

					frostIndex++;
				}

				if(numSims == 1 && temp.length > 0) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + temp + '</div>');
				logColor = (logColor + 1) % 2;
			}
		}

		roundNum = 1;
		while (roundNum < 128) {
			// @ start of round

			// Output detailed combat log only if running a single simulation
			if(numSims == 1) logCombat('<p class=\'logSeg log' + logColor + '\'>Round ' + formatNum(roundNum) + ' Start</p>');
			logColor = (logColor + 1) % 2;


			orderOfAttack = attHeroes.concat(defHeroes);

			while (orderOfAttack.length > 0) {
				// @ start of hero action
				basicQueue = [];
				activeQueue = [];
				triggerQueue = [];


				orderOfAttack.sort(speedSort);
				currentHero = orderOfAttack.shift();

				if (currentHero._currentStats['totalHP'] > 0) {
					if(currentHero.isUnderStandardControl()) {
						if(numSims == 1) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + currentHero.heroDesc() + ' is under control effect, turn skipped.</div>');
					} else {

						let isRussellCharging = false;
						if (currentHero._heroName == 'Russell') {
							if (currentHero._currentStats['isCharging']) {
								isRussellCharging = true;
							}
						}


						// decide on action
						if ((currentHero._currentStats['energy'] >= 100 && !('Silence' in currentHero._debuffs)) || isRussellCharging) {

							// set hero energy to 0
							if (currentHero._heroName != 'Russell') {
								currentHero._currentStats['energySnapshot'] = currentHero._currentStats['energy'];
								currentHero._currentStats['energy'] = 0;
							}

							// do active
							result = currentHero.doActive();
							if(numSims == 1) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + result + '</div>');

							// monster gains energy from hero active
							if (currentHero._attOrDef == 'att') {
								if (attMonster._monsterName != 'None') {
									monsterResult = '<div>' + attMonster.heroDesc() + ' gained ' + formatNum(10) + ' energy. ';
									attMonster._energy += 10;
									monsterResult += 'Energy at ' + formatNum(attMonster._energy) + '.</div>';
									if(numSims == 1) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + monsterResult + '</div>');
								}

							} else if (defMonster._monsterName != 'None') {
								monsterResult = '<div>' + defMonster.heroDesc() + ' gained ' + formatNum(10) + ' energy. ';
								defMonster._energy += 10;
								monsterResult += 'Energy at ' + formatNum(defMonster._energy) + '.</div>';
								if(numSims == 1) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + monsterResult + '</div>');
							}

							// check for Aida's Balance Mark debuffs
							if ('Balance Mark' in currentHero._debuffs) {
								const firstKey = Object.keys(currentHero._debuffs['Balance Mark'])[0];
								triggerQueue.push([currentHero._debuffs['Balance Mark'][firstKey]['source'], 'balanceMark', currentHero, currentHero._debuffs['Balance Mark'][firstKey]['effects']['attackAmount']]);
							}


							triggerQueue.push([currentHero, 'eventSelfActive', activeQueue]);

							for (const h in currentHero._allies) {
								if (currentHero._heroPos != currentHero._allies[h]._heroPos) {
									triggerQueue.push([currentHero._allies[h], 'eventAllyActive', currentHero, activeQueue]);
								}
							}

							for (const h in currentHero._enemies) {
								triggerQueue.push([currentHero._enemies[h], 'eventEnemyActive', currentHero, activeQueue]);
							}


							// get energy after getting hit by active
							temp = '';
							for (let i = 0; i < activeQueue.length; i++) {
								if (activeQueue[i][1]._currentStats['totalHP'] > 0) {
									if (activeQueue[i][2] > 0) {
										if (activeQueue[i][3] == true) {
											// double energy on being critted
											temp += activeQueue[i][1].getEnergy(activeQueue[i][1], 20, true);
										} else {
											temp += activeQueue[i][1].getEnergy(activeQueue[i][1], 10, true);
										}
									}
								}
							}
							if(numSims == 1) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + temp + '</div>');

						} else if ('Horrify' in currentHero._debuffs) {
							if(numSims == 1) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + currentHero.heroDesc() + ' is Horrified, basic attack skipped.</div>');

						} else {
							// do basic
							result = currentHero.doBasic();
							if(numSims == 1) {
								result = '<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + result + '</div>';
								logCombat(result);
							}

							// hero gains 50 energy after doing basic
							temp = currentHero.getEnergy(currentHero, 50, true);
							if(numSims == 1) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + temp + '</div>');


							triggerQueue.push([currentHero, 'eventSelfBasic', basicQueue]);

							for (const h in currentHero._allies) {
								if (currentHero._heroPos != currentHero._allies[h]._heroPos) {
									triggerQueue.push([currentHero._allies[h], 'eventAllyBasic', currentHero, basicQueue]);
								}
							}

							for (const h in currentHero._enemies) {
								triggerQueue.push([currentHero._enemies[h], 'eventEnemyBasic', currentHero, basicQueue]);
							}

							// get energy after getting hit by basic
							temp = '';
							for (let i = 0; i < basicQueue.length; i++) {
								if (basicQueue[i][1]._currentStats['totalHP'] > 0) {
									if (basicQueue[i][2] > 0) {
										if (basicQueue[i][3] == true) {
											// double energy on being critted
											temp += basicQueue[i][1].getEnergy(basicQueue[i][1], 20, true);
										} else {
											temp += basicQueue[i][1].getEnergy(basicQueue[i][1], 10, true);
										}
									}
								}
							}
							if(numSims == 1) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + temp + '</div>');
						}
					}


					// process triggers and events
					temp = processQueue();
					if(numSims == 1 && temp.length > 0) logCombat('<div class=\'log' + logColor + '\'>' + temp + '</div>');
					someoneWon = checkForWin();
					if (someoneWon != '') {break;}

					logColor = (logColor + 1) % 2;
				}
			}

			if (someoneWon != '') {break;}

			// trigger end of round stuff
			if(numSims == 1) logCombat('<p class=\'logSeg log' + logColor + '\'>End of round ' + formatNum(roundNum) + '.</p>');
			logColor = (logColor + 1) % 2;


			// handle monster stuff
			if (attMonster._monsterName != 'None') {
				monsterResult = '<div>' + attMonster.heroDesc() + ' gained ' + formatNum(20) + ' energy. ';
				attMonster._energy += 20;
				monsterResult += 'Energy at ' + formatNum(attMonster._energy) + '.</div>';

				if (attMonster._energy >= 100) {
					monsterResult += attMonster.doActive();
				}

				if(numSims == 1) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + monsterResult + '</div>');
				logColor = (logColor + 1) % 2;
			}

			if (defMonster._monsterName != 'None') {
				monsterResult = '<div>' + defMonster.heroDesc() + ' gained ' + formatNum(20) + ' energy. ';
				defMonster._energy += 20;
				monsterResult += 'Energy at ' + formatNum(defMonster._energy) + '.</div>';

				if (defMonster._energy >= 100) {
					monsterResult += defMonster.doActive();
				}

				if(numSims == 1) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + monsterResult + '</div>');
				logColor = (logColor + 1) % 2;
			}

			temp = processQueue();
			if(numSims == 1 && temp.length > 0) logCombat('<div class=\'log' + logColor + '\'>' + temp + '</div>');
			someoneWon = checkForWin();
			if (someoneWon != '') {break;}


			// handle end of round abilities
			if (roundNum < 127) {
				temp = '';

				for (const source of attHeroes) {
					if (source._currentStats['totalHP'] > 0) {
						temp += source.tickBuffs();
						temp += source.tickDebuffs();
					}
				}

				for (const source of defHeroes) {
					if (source._currentStats['totalHP'] > 0) {
						temp += source.tickBuffs();
						temp += source.tickDebuffs();
					}
				}


				for (const source of attHeroes) {
					if ((source._currentStats['totalHP'] > 0 && source.isNotSealed()) || source._currentStats['revive'] == 1) {
						temp += source.endOfRound(roundNum);
					}


					if (source._artifact.includes(' Golden Crown') && roundNum < 5 && 'Golden Crown' in source._buffs) {
						const buffStack = Object.values(source._buffs['Golden Crown'])[0];
						const buffAmount = artifacts[source._artifact].enhance * (5 - roundNum) * 0.2;

						source._currentStats.allDamageReduce -= buffStack.effects.allDamageReduce;
						source._currentStats.allDamageReduce += buffAmount;
						buffStack.effects.allDamageReduce = buffAmount;
					}


					if (source._currentStats['totalHP'] > 0 && source.isNotSealed()) {
						temp += source.tickEnable3();


						if (source._artifact.includes(' Antlers Cane')) {
							temp += '<div>' + source.heroDesc() + ' gained increased damage from <span class=\'skill\'>' + source._artifact + '</span>.</div>';
							temp += source.getBuff(source, 'All Damage Dealt', 15, { allDamageDealt: artifacts[source._artifact]['enhance'] });
						}


						if (['Radiant Lucky Candy Bar', 'Splendid Lucky Candy Bar'].includes(source._artifact) && source.isUnderControl()) {
							temp += '<div><span class=\'skill\'>' + source._artifact + '</span> triggered.</div>';
							temp += source.getBuff(source, 'Hand of Fate', 1, { allDamageReduce: artifacts[source._artifact]['enhance'] }, true);
						}


						if (source._artifact.includes(' Snow Heart')) {
							const targets = getHighestSpeedTargets(source, source._enemies, 3);
							const frostChances = [1, 0.66, 0.33];
							let frostIndex = 0;

							temp += `<div>${source.heroDesc()} <span class='skill'>${source._artifact}</span> triggered.</div>`;
							for (const target of targets) {
								if (random() < frostChances[frostIndex]) {
									temp += target.getDebuff(source, 'Speed', 1, { speed: artifacts[source._artifact].enhance });
								}

								frostIndex++;
							}
						}
					}
				}

				for (const source of defHeroes) {
					if ((source._currentStats['totalHP'] > 0 && source.isNotSealed()) || source._currentStats['revive'] == 1) {
						temp += source.endOfRound(roundNum);
					}


					if (source._artifact.includes(' Golden Crown') && roundNum < 5 && 'Golden Crown' in source._buffs) {
						const buffStack = Object.values(source._buffs['Golden Crown'])[0];
						const buffAmount = artifacts[source._artifact].enhance * (5 - roundNum) * 0.2;

						source._currentStats.allDamageReduce -= buffStack.effects.allDamageReduce;
						source._currentStats.allDamageReduce += buffAmount;
						buffStack.effects.allDamageReduce = buffAmount;
					}


					if (source._currentStats['totalHP'] > 0 && source.isNotSealed()) {
						temp += source.tickEnable3();


						if (source._artifact.includes(' Antlers Cane')) {
							temp += '<div>' + source.heroDesc() + ' gained increased damage from <span class=\'skill\'>' + source._artifact + '</span>.</div>';
							temp += source.getBuff(source, 'All Damage Dealt', 15, { allDamageDealt: artifacts[source._artifact]['enhance'] });
						}


						if (['Radiant Lucky Candy Bar', 'Splendid Lucky Candy Bar'].includes(source._artifact) && source.isUnderControl()) {
							temp += '<div><span class=\'skill\'>' + source._artifact + '</span> triggered.</div>';
							temp += source.getBuff(source, 'Hand of Fate', 1, { allDamageReduce: artifacts[source._artifact]['enhance'] }, true);
						}


						if (source._artifact.includes(' Snow Heart')) {
							const targets = getHighestSpeedTargets(source, source._enemies, 3);
							const frostChances = [1, 0.66, 0.33];
							let frostIndex = 0;

							temp += `<div>${source.heroDesc()} <span class='skill'>${source._artifact}</span> triggered.</div>`;
							for (const target of targets) {
								if (random() < frostChances[frostIndex]) {
									temp += target.getDebuff(source, 'Speed', 1, { speed: artifacts[source._artifact].enhance });
								}

								frostIndex++;
							}
						}
					}
				}


				if(numSims == 1 && temp.length > 0) logCombat('<div class=\'log' + logColor + '\'><p></p></div><div class=\'log' + logColor + '\'>' + temp + '</div>');
				logColor = (logColor + 1) % 2;


				temp = processQueue();
				if(numSims == 1 && temp.length > 0) logCombat('<div class=\'log' + logColor + '\'>' + temp + '</div>');
				someoneWon = checkForWin();
				if (someoneWon != '') {break;}
			} else {
				break;
			}


			// @ end of round
			roundNum++;
		}

		if (someoneWon == 'att') {
			winCount++;
			if(numSims == 1) logCombat('<p class=\'logSeg\'>Attacker wins!</p>');
		} else if(numSims == 1) {
			logCombat('<p class=\'logSeg\'>Defender wins!</p>');
		}

		endingRoundSum += roundNum;


		numOfHeroes = attHeroes.length;
		for (let i = 0; i < numOfHeroes; i++) {
			if (attHeroes[i]._heroName != 'None') {
				attHeroes[i]._damageDealt += attHeroes[i]._currentStats['damageDealt'];
				attHeroes[i]._currentStats['damageDealt'] = 0;
				attHeroes[i]._damageHealed += attHeroes[i]._currentStats['damageHealed'];
				attHeroes[i]._currentStats['damageHealed'] = 0;
			}
		}

		numOfHeroes = defHeroes.length;
		for (let i = 0; i < numOfHeroes; i++) {
			if (defHeroes[i]._heroName != 'None') {
				defHeroes[i]._damageDealt += defHeroes[i]._currentStats['damageDealt'];
				defHeroes[i]._currentStats['damageDealt'] = 0;
				defHeroes[i]._damageHealed += defHeroes[i]._currentStats['damageHealed'];
				defHeroes[i]._currentStats['damageHealed'] = 0;
			}
		}

		if(numSims == 1) logCombat('<p class=\'logSeg\'>Simulation #' + formatNum(simIterNum) + ' Ended.</p>');

		// @ end of simulation
	}

	logCombat('<p class=\'logSeg\'>Attacker won ' + winCount + ' out of ' + numSims + ' (' + formatNum((winCount / numSims * 100).toFixed(2)) + '%).</p>');
	logCombat('<p class=\'logSeg\'>Average Combat Length: ' + formatNum((endingRoundSum / numSims).toFixed(2)) + ' rounds.</p>');

	// damage summary
	logCombat('<p><div class=\'logSeg\'>Attacker average damage summary.</div>');
	for (let i = 0; i < attHeroes.length; i++) {
		if (attHeroes[i]._heroName != 'None') {
			logCombat('<div><span class=\'att\'>' + attHeroes[i]._heroName + '</span>: ' + formatNum(Math.floor(attHeroes[i]._damageDealt / numSims)) + '</div>');
		}
	}
	if (attMonster._monsterName != 'None') {
		logCombat('<div><span class=\'att\'>' + attMonster._monsterName + '</span>: ' + formatNum(Math.floor(attMonster._currentStats['damageDealt'] / numSims)) + '</div>');
	}
	logCombat('</p>');

	logCombat('<p><div class=\'logSeg\'>Defender average damage summary.</div>');
	for (let i = 0; i < defHeroes.length; i++) {
		if (defHeroes[i]._heroName != 'None') {
			logCombat('<div><span class=\'def\'>' + defHeroes[i]._heroName + '</span>: ' + formatNum(Math.floor(defHeroes[i]._damageDealt / numSims)) + '</div>');
		}
	}
	if (defMonster._monsterName != 'None') {
		logCombat('<div><span class=\'def\'>' + defMonster._monsterName + '</span>: ' + formatNum(Math.floor(defMonster._currentStats['damageDealt'] / numSims)) + '</div>');
	}
	logCombat('</p>');

	// healing and damage prevention summary
	logCombat('<p><div class=\'logSeg\'>Attacker average healing and damage prevention summary.</div>');
	for (let i = 0; i < attHeroes.length; i++) {
		if (attHeroes[i]._heroName != 'None') {
			logCombat('<div><span class=\'att\'>' + attHeroes[i]._heroName + '</span>: ' + formatNum(Math.floor(attHeroes[i]._damageHealed / numSims)) + '</div>');
		}
	}
	if (attMonster._monsterName != 'None') {
		logCombat('<div><span class=\'att\'>' + attMonster._monsterName + '</span>: ' + formatNum(Math.floor(attMonster._currentStats['damageHealed'] / numSims)) + '</div>');
	}
	logCombat('</p>');

	logCombat('<p><div class=\'logSeg\'>Defender average healing and damage prevention summary.</div>');
	for (let i = 0; i < defHeroes.length; i++) {
		if (defHeroes[i]._heroName != 'None') {
			logCombat('<div><span class=\'def\'>' + defHeroes[i]._heroName + '</span>: ' + formatNum(Math.floor(defHeroes[i]._damageHealed / numSims)) + '</div>');
		}
	}
	if (defMonster._monsterName != 'None') {
		logCombat('<div><span class=\'def\'>' + defMonster._monsterName + '</span>: ' + formatNum(Math.floor(defMonster._currentStats['damageHealed'] / numSims)) + '</div>');
	}
	logCombat('</p>');

	return winCount;
}


// process all triggers and events
function processQueue() {
	let result = '';
	let temp = '';
	let copyQueue;

	while (triggerQueue.length > 0) {
		copyQueue = triggerQueue.slice();
		triggerQueue = [];

		copyQueue.sort(function(a, b) {
			if (a[0]._attOrDef == 'att' && b[0]._attOrDef == 'def') {
				return -1;
			} else if (a[0]._attOrDef == 'def' && b[0]._attOrDef == 'att') {
				return 1;
			} else if (a[0]._heroPos < b[0]._heroPos) {
				return -1;
			} else {
				return 1;
			}
		});

		for (const i in copyQueue) {
			temp = copyQueue[i][0].handleTrigger(copyQueue[i]);
			if (temp.length > 0) { result += '<div class=\'log' + logColor + '\'><p></p>' + temp + '</div>'; }


			// enhanced artifact triggers
			if (copyQueue[i][0].isNotSealed() && copyQueue[i][0]._currentStats['totalHP'] > 0) {
				if (copyQueue[i][1] == 'eventGotCC' && ['Radiant Lucky Candy Bar', 'Splendid Lucky Candy Bar'].includes(copyQueue[i][0]._artifact)) {
					temp = copyQueue[i][0].getBuff(copyQueue[i][0], 'Hand of Fate', 1, { allDamageReduce: artifacts[copyQueue[i][0]._artifact]['enhance'] }, true);
					result += '<div class=\'log' + logColor + '\'><p></p>' + temp + '</div>';
				}


				if (['eventSelfBasic', 'eventSelfActive'].includes(copyQueue[i][1]) && copyQueue[i][0]._artifact.includes(' The Kiss of Ghost')) {
					let damageDone = 0;
					for (const e in copyQueue[i][2]) {
						damageDone += copyQueue[i][2][e][2];
					}

					const healAmount = copyQueue[i][0].calcHeal(copyQueue[i][0], artifacts[copyQueue[i][0]._artifact]['enhance'] * damageDone);
					temp = '<div><span class=\'skill\'>' + copyQueue[i][0]._artifact + '</span> triggered heal.</div>';
					temp += copyQueue[i][0].getHeal(copyQueue[i][0], healAmount);

					result += '<div class=\'log' + logColor + '\'><p></p>' + temp + '</div>';
				}


				if (copyQueue[i][1] == 'eventSelfActive' && copyQueue[i][0]._artifact.includes(' Demon Bell')) {
					const targets = getAllTargets(copyQueue[i][0], copyQueue[i][0]._allies);
					let energyGain = 10;
					temp = '<div><span class=\'skill\'>' + copyQueue[i][0]._artifact + '</span> triggered energy gain.</div>';

					if (copyQueue[i][0]._artifact == 'Splendid Demon Bell') energyGain += 10;

					if (random() < artifacts[copyQueue[i][0]._artifact]['enhance']) {
						energyGain += 10;
					}

					for (const t in targets) {
						temp += targets[t].getEnergy(copyQueue[t][0], energyGain, true);
					}

					result += '<div class=\'log' + logColor + '\'><p></p>' + temp + '</div>';
				}


				if (['eventSelfBasic', 'eventSelfActive'].includes(copyQueue[i][1]) && copyQueue[i][0]._artifact.includes(' Staff Punisher of Immortal')) {
					let damageResult = '';
					let didCrit = false;
					let damageAmount = 0;
					temp = '';

					for (const e in copyQueue[i][2]) {
						if (copyQueue[i][2][e][3] == true && copyQueue[i][2][e][1]._currentStats['totalHP'] > 0) {
							didCrit = true;

							damageAmount = copyQueue[i][2][e][1]._stats['totalHP'] * artifacts[copyQueue[i][0]._artifact]['enhance'];
							if (damageAmount > copyQueue[i][0]._currentStats['totalAttack'] * 25) { damageAmount = copyQueue[i][0]._currentStats['totalAttack'] * 25; }

							damageResult = copyQueue[i][0].calcDamage(copyQueue[i][2][e][1], damageAmount, 'passive', 'true');
							temp += copyQueue[i][2][e][1].takeDamage(copyQueue[i][0], copyQueue[i][0]._artifact, damageResult);
						}
					}

					if (didCrit) {
						temp = '<div><span class=\'skill\'>' + copyQueue[i][0]._artifact + '</span> triggered on crit.</div>' + temp;
						result += '<div class=\'log' + logColor + '\'><p></p>' + temp + '</div>';
					}
				}
			}
		}
	}

	return result;
}


function checkForWin() {
	let attAlive = 0;
	let defAlive = 0;
	let numOfHeroes = 0;

	numOfHeroes = attHeroes.length;
	for (let i = 0; i < numOfHeroes; i++) {
		if (attHeroes[i]._currentStats['totalHP'] > 0 || (attHeroes[i]._currentStats['revive'] == 1 && attHeroes[i]._heroName != 'Carrie')) {
			attAlive++;
		}
	}

	numOfHeroes = defHeroes.length;
	for (let i = 0; i < numOfHeroes; i++) {
		if (defHeroes[i]._currentStats['totalHP'] > 0 || (defHeroes[i]._currentStats['revive'] == 1 && defHeroes[i]._heroName != 'Carrie')) {
			defAlive++;
		}
	}

	if (attAlive == 0 && defAlive >= 0) {
		return 'def';
	} else if (attAlive > 0 && defAlive == 0) {
		return 'att';
	} else {
		return '';
	}
}

export { attHeroes, defHeroes, basicQueue, activeQueue, triggerQueue, roundNum, runSim };