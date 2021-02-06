import { baseHeroStats } from './baseHeroStats.js';
import { baseMonsterStats } from './baseMonsterStats.js';
import { artifacts } from './artifact.js';
import { avatarFrames } from './avatarFrame.js';
import { skins } from './skin.js';
import { stones } from './stone.js';
import { armors, accessories, weapons, shoes, setBonus } from './equipment.js';
import { guildTech } from './guildTech.js';
import { triggerQueue, activeQueue, basicQueue, roundNum } from './simulation.js';
import { random, getAllTargets, translate, isDot, isMonster, formatNum, isControlEffect, uuid, isDispellable, isAttribute } from './utilityFunctions.js';


const voidPurpleNodes = {
	'None': { },
	'armorPercent': { armorPercent: 0.08 },
	'armorBreak': { armorBreak: 0.08 },
	'precision': { precision: 0.06 },
	'block': { block: 0.07 },
	'controlImmune': { controlImmune: 0.035 },
	'damageReduce': { damageReduce: 0.035 },
	'crit': { crit: 0.035 },
	'critDamage': { critDamage: 0.06 },
	'holyDamage': { holyDamage: 0.03 },
	'skillDamage': { skillDamage: 0.10 },
};


let attMonsterName, defMonsterName, attFrame, defFrame;

// base hero class, extend this class for each hero
class hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		this._heroName = sHeroName;
		this._heroPos = iHeroPos;
		this._attOrDef = attOrDef;
		this._heroFaction = baseHeroStats[sHeroName]['heroFaction'];
		this._heroClass = baseHeroStats[sHeroName]['heroClass'];
		this._starLevel = 0;
		this._heroLevel = 0;
		this._voidLevel = 0;

		this._stats = {};
		this._currentStats = {};
		this._attackMultipliers = {};
		this._hpMultipliers = {};
		this._armorMultipliers = {};

		this._stats['revive'] = 0;

		// set equipment
		this._stone = 'None';
		this._artifact = 'None';
		this._weapon = 'None';
		this._armor = 'None';
		this._shoe = 'None';
		this._accessory = 'None';
		this._skin = 'None';

		// set enables
		this._enable1 = 'None';
		this._enable2 = 'None';
		this._enable3 = 'None';
		this._enable4 = 'None';
		this._enable5 = 'None';
		this._voidEnable1 = 'None';
		this._voidEnable2 = 'None';
		this._voidEnable3 = 'None';

		// dictionary to track buffs and debuffs during combat
		this._buffs = {};
		this._debuffs = {};

		this._allies = [];
		this._enemies = [];

		this._damageDealt = 0;
		this._damageHealed = 0;
		this._rng = random();
	}


	// Update current stats based on user selections.
	updateCurrentStats() {
		const arrLimits = [this._heroClass, this._heroFaction];
		let keySet = '';

		if (this._heroLevel > 310) {
			this._starLevel = 15;
		} else if (this._heroLevel > 290) {
			this._starLevel = 14;
		} else if (this._heroLevel > 270) {
			this._starLevel = 13;
		} else if (this._heroLevel > 260) {
			this._starLevel = 12;
		} else if (this._heroLevel > 250) {
			this._starLevel = 11;
		} else {
			this._starLevel = 10;
		}

		// start with base stats
		const baseStats = baseHeroStats[this._heroName]['stats'];
		this._stats['hp'] = Math.floor((baseStats['baseHP'] + (this._heroLevel - 1) * baseStats['growHP']) * 2.2);
		this._stats['attack'] = Math.floor((baseStats['baseAttack'] + (this._heroLevel - 1) * baseStats['growAttack']) * 2.2);
		this._stats['armor'] = Math.floor(baseStats['baseArmor'] + (this._heroLevel - 1) * baseStats['growArmor']);
		this._stats['speed'] = Math.floor((baseStats['baseSpeed'] + (this._heroLevel - 1) * baseStats['growSpeed']) * 1.6);

		this._stats['fixedAttack'] = 0;
		this._stats['fixedHP'] = 0;
		this._stats['totalHP'] = this._stats['hp'];
		this._stats['totalAttack'] = this._stats['attack'];
		this._stats['totalArmor'] = this._stats['armor'];
		this._stats['energy'] = 50;
		this._stats['skillDamage'] = 0.0;
		this._stats['precision'] = 0.0;
		this._stats['block'] = 0.0;
		this._stats['crit'] = 0.0;
		this._stats['critDamage'] = 0.0;
		this._stats['armorBreak'] = 0.0;
		this._stats['controlImmune'] = 0.0;
		this._stats['damageReduce'] = 0.0;
		this._stats['holyDamage'] = 0.0;
		this._stats['warriorReduce'] = 0.0;
		this._stats['mageReduce'] = 0.0;
		this._stats['rangerReduce'] = 0.0;
		this._stats['assassinReduce'] = 0.0;
		this._stats['priestReduce'] = 0.0;
		this._stats['freezeImmune'] = 0.0;
		this._stats['petrifyImmune'] = 0.0;
		this._stats['stunImmune'] = 0.0;
		this._stats['twineImmune'] = 0.0;
		this._stats['critDamageReduce'] = 0.0;
		this._stats['unbendingWillTriggered'] = 0;
		this._stats['unbendingWillStacks'] = 0;
		this._stats['effectBeingHealed'] = 0.0;
		this._stats['healEffect'] = 0.0;
		this._stats['dotReduce'] = 0.0;
		this._stats['controlPrecision'] = 0.0;
		this._stats['damageAgainstBurning'] = 0.0;
		this._stats['damageAgainstBleeding'] = 0.0;
		this._stats['damageAgainstPoisoned'] = 0.0;
		this._stats['damageAgainstFrozen'] = 0.0;
		this._stats['damageAgainstStun'] = 0.0;
		this._stats['damageAgainstWarrior'] = 0.0;
		this._stats['damageAgainstMage'] = 0.0;
		this._stats['damageAgainstRanger'] = 0.0;
		this._stats['damageAgainstAssassin'] = 0.0;
		this._stats['damageAgainstPriest'] = 0.0;
		this._stats['allDamageReduce'] = 0.0;
		this._stats['allDamageTaken'] = 0.0;
		this._stats['allDamageDealt'] = 0.0;
		this._stats['controlImmunePen'] = 0.0;
		this._stats['firstCC'] = '';
		this._stats['dodge'] = 0.0;
		this._stats['Seal of LightImmune'] = 0.0;
		this._stats['ShapeshiftImmune'] = 0.0;
		this._stats['TauntImmune'] = 0.0;
		this._stats['DazzleImmune'] = 0.0;
		this._stats['HorrifyImmune'] = 0.0;
		this._stats['SilenceImmune'] = 0.0;
		this._stats['burnDamageTaken'] = 0.0;

		this._attackMultipliers = {};
		this._hpMultipliers = {};
		this._armorMultipliers = {};


		// apply enable bonus
		if (this._starLevel > 10) {
			this.applyStatChange({ hpPercent: (this._starLevel - 10) * 0.14, attackPercent: (this._starLevel - 10) * 0.1 }, 'enableBonuses');
		}


		// apply enables
		if (this._starLevel >= 11) {
			switch(this._enable1) {
			case 'Vitality':
				this.applyStatChange({ hpPercent: 0.12 }, 'enable1');
				break;

			case 'Mightiness':
				this.applyStatChange({ attackPercent: 0.08 }, 'enable1');
				break;

			case 'Growth':
				this.applyStatChange({ hpPercent: 0.05, attackPercent: 0.03, speed: 20 }, 'enable1');
				break;
			}
		}

		if (this._starLevel >= 12) {
			switch(this._enable2) {
			case 'Shelter':
				this.applyStatChange({ critDamageReduce: 0.15 }, 'enable2');
				break;

			case 'Vitality2':
				this.applyStatChange({ effectBeingHealed: 0.15 }, 'enable2');
				break;
			}
		}

		if (this._starLevel >= 14) {
			switch(this._enable4) {
			case 'Vitality':
				this.applyStatChange({ hpPercent: 0.12 }, 'enable4');
				break;

			case 'Mightiness':
				this.applyStatChange({ attackPercent: 0.08 }, 'enable4');
				break;

			case 'Growth':
				this.applyStatChange({ hpPercent: 0.05, attackPercent: 0.03, speed: 20 }, 'enable4');
				break;
			}
		}


		// apply equipment and set bonus
		const sets = {};

		this.applyStatChange(weapons[this._weapon]['stats'], 'weapon');
		keySet = weapons[this._weapon]['set'];
		if (keySet != '') {
			if (keySet in sets) {
				sets[keySet] += 1;
			} else {
				sets[keySet] = 1;
			}
		}
		if (arrLimits.includes(weapons[this._weapon]['limit'])) {
			this.applyStatChange(weapons[this._weapon]['limitStats'], 'weaponLimit');
		}

		this.applyStatChange(armors[this._armor]['stats'], 'armor');
		keySet = armors[this._armor]['set'];
		if (keySet != '') {
			if (keySet in sets) {
				sets[keySet] += 1;
			} else {
				sets[keySet] = 1;
			}
		}
		if (arrLimits.includes(armors[this._armor]['limit'])) {
			this.applyStatChange(armors[this._armor]['limitStats'], 'armorLimit');
		}

		this.applyStatChange(shoes[this._shoe]['stats'], 'shoe');
		keySet = shoes[this._shoe]['set'];
		if (keySet != '') {
			if (keySet in sets) {
				sets[keySet] += 1;
			} else {
				sets[keySet] = 1;
			}
		}
		if (arrLimits.includes(shoes[this._shoe]['limit'])) {
			this.applyStatChange(shoes[this._shoe]['limitStats'], 'shoeLimit');
		}

		this.applyStatChange(accessories[this._accessory]['stats'], 'accessory');
		keySet = accessories[this._accessory]['set'];
		if (keySet != '') {
			if (keySet in sets) {
				sets[keySet] += 1;
			} else {
				sets[keySet] = 1;
			}
		}
		if (arrLimits.includes(accessories[this._accessory]['limit'])) {
			this.applyStatChange(accessories[this._accessory]['limitStats'], 'accessoryLimit');
		}


		// Set bonus multipliers seem to be applied in a specific order?
		for (const x in setBonus) {
			if (x in sets) {
				if (sets[x] >= 2) {
					this.applyStatChange(setBonus[x][2], 'Two piece ' + x);
				}
				if (sets[x] >= 3) {
					this.applyStatChange(setBonus[x][3], 'Three piece ' + x);
				}
				if (sets[x] >= 4) {
					this.applyStatChange(setBonus[x][4], 'Four piece ' + x);
				}
			}
		}


		// skin
		if (this._skin != 'None') {
			this.applyStatChange(skins[this._heroName][this._skin], 'skin');
		}


		// get and apply guild tech
		const techLevels = [60, 50, 40, 30, 20, 20, 20, 20, 30, 30, 30, 30, 20, 20, 20, 20];
		const tech = guildTech[this._heroClass];
		let tindex = 0;

		for (const techName in tech) {
			let techLevel;

			if (typeof document !== 'undefined') {
				techLevel = document.getElementById(this._attOrDef + 'Tech' + this._heroClass + techName).value;
			} else {
				techLevel = techLevels[tindex];
				tindex++;
			}

			for (const statToBuff in tech[techName]) {
				const techStatsToBuff = {};
				const buffAmount = tech[techName][statToBuff] * techLevel;
				techStatsToBuff[statToBuff] = buffAmount;
				this.applyStatChange(techStatsToBuff, techName);
			}
		}


		// apply passives that give stats, does nothing unless overridden in subclass
		this.passiveStats();


		// artifact
		this.applyStatChange(artifacts[this._artifact]['stats'], 'artifact');
		if (arrLimits.includes(artifacts[this._artifact]['limit'])) {
			this.applyStatChange(artifacts[this._artifact]['limitStats'], 'artifactLimit');
		}


		// stone
		this.applyStatChange(stones[this._stone], 'stone');


		// avatar frame
		let sAvatarFrame;

		if (this._attOrDef == 'att') {
			sAvatarFrame = attFrame;
		} else {
			sAvatarFrame = defFrame;
		}

		this.applyStatChange(avatarFrames[sAvatarFrame], 'avatarFrame');


		// monster
		let monsterName;

		if (this._attOrDef == 'att') {
			monsterName = attMonsterName;
		} else {
			monsterName = defMonsterName;
		}

		this.applyStatChange(baseMonsterStats[monsterName]['stats'], 'monster');


		// celestial island statues
		let statuePrefix = this._attOrDef;
		if (['Light', 'Forest', 'Fortress'].includes(this._heroFaction)) {
			statuePrefix += 'Holy';
		} else {
			statuePrefix += 'Evil';
		}

		const statueStats = {};

		if (typeof document !== 'undefined') {
			statueStats['speed'] = 2 * document.getElementById(statuePrefix + 'speed').value;
			statueStats['hpPercent'] = 0.01 * document.getElementById(statuePrefix + 'hpPercent').value;
			statueStats['attackPercent'] = 0.005 * document.getElementById(statuePrefix + 'attackPercent').value;
		} else {
			statueStats['speed'] = 2 * 30;
			statueStats['hpPercent'] = 0.01 * 30;
			statueStats['attackPercent'] = 0.005 * 30;
		}

		this.applyStatChange(statueStats, 'statue');


		// aura
		const arrIdentical = {
			0: { hpPercent: 0, attackPercent: 0 },
			1: { hpPercent: 0.02, attackPercent: 0.015 },
			2: { hpPercent: 0.05, attackPercent: 0.035 },
			3: { hpPercent: 0.08, attackPercent: 0.055 },
			4: { hpPercent: 0.11, attackPercent: 0.075 },
			5: { hpPercent: 0.14, attackPercent: 0.095 },
			6: { hpPercent: 0.18, attackPercent: 0.12 },
		};

		const factionCount = {
			Shadow: 0,
			Fortress: 0,
			Abyss: 0,
			Forest: 0,
			Dark: 0,
			Light: 0,
			Transcendence: 0,
		};

		let heroCount = 0;

		for (let x = 0; x < this._allies.length; x++) {
			if (this._allies[x] !== null) {
				if (this._allies[x]._heroFaction != '') {
					factionCount[this._allies[x]._heroFaction] += 1;
					heroCount++;
				}
			}
		}

		let factionHPBonus = 0;
		let factionAttackBonus = 0;
		if (heroCount == 6) {
			for (const x in factionCount) {
				factionHPBonus += arrIdentical[factionCount[x]]['hpPercent'];
				factionAttackBonus += arrIdentical[factionCount[x]]['attackPercent'];
			}

			this.applyStatChange({ hpPercent: factionHPBonus, attackPercent: factionAttackBonus }, 'factionAura');

			const addBonuses = {
				damageReduce: 0.02 * (factionCount['Shadow'] + factionCount['Fortress'] + factionCount['Abyss'] + factionCount['Forest']) + 0.015 * factionCount['Transcendence'],
				controlImmune: 0.04 * (factionCount['Light'] + factionCount['Dark']) + 0.03 * factionCount['Transcendence'],
			};
			this.applyStatChange(addBonuses, 'auraAdditionalBonuses');
		}


		// apply void enable stat buffs
		if (this._heroLevel >= 310 && baseHeroStats[this._heroName].voidEnabled) {
			if (this._heroFaction == 'Transcendence') {
				// not implemented yet
				if (this._voidLevel >= 4) {
					this.applyStatChange({ hp: 659400 }, 'void4Node1');
					this.applyStatChange({ attack: 15600 }, 'void4Node2');
					this.applyStatChange({ speed: 100 }, 'void4Node3');

				}

				if (this._voidLevel >= 3) {
					this.applyStatChange({ hp: 412215 }, 'void3Node1');
					this.applyStatChange({ attack: 9750 }, 'void3Node2');
					this.applyStatChange(voidPurpleNodes[this._voidEnable3], 'void3Node3');

				}

				if (this._voidLevel >= 2) {
					this.applyStatChange({ hp: 329700 }, 'void2Node1');
					this.applyStatChange({ attack: 7800 }, 'void2Node2');
					this.applyStatChange(voidPurpleNodes[this._voidEnable2], 'void2Node3');

				}

				if (this._voidLevel >= 1) {
					this.applyStatChange({ hp: 247275 }, 'void1Node1');
					this.applyStatChange({ attack: 5850 }, 'void1Node2');
					this.applyStatChange(voidPurpleNodes[this._voidEnable1], 'void1Node3');
				}

			} else {
				if (this._voidLevel >= 4) {
					this.applyStatChange({ hp: 330600 }, 'void4Node1');
					this.applyStatChange({ attack: 7200 }, 'void4Node2');
					this.applyStatChange({ speed: 100 }, 'void4Node3');

				}

				if (this._voidLevel >= 3) {
					this.applyStatChange({ hp: 206625 }, 'void3Node1');
					this.applyStatChange({ attack: 4500 }, 'void3Node2');
					this.applyStatChange({ hp: 132240, attack: 2400 }, 'void3Node3');

				}

				if (this._voidLevel >= 2) {
					this.applyStatChange({ hp: 165300 }, 'void2Node1');
					this.applyStatChange({ attack: 3600 }, 'void2Node2');
					this.applyStatChange({ hp: 110200, attack: 2000 }, 'void2Node3');

				}

				if (this._voidLevel >= 1) {
					this.applyStatChange({ hp: 123975 }, 'void1Node1');
					this.applyStatChange({ attack: 2700 }, 'void1Node2');
					this.applyStatChange({ hp: 88160, attack: 1600 }, 'void1Node3');
				}
			}
		}


		this._stats['totalHP'] = this.calcHP();
		this._stats['totalAttack'] = this.calcAttack();
		this._stats['totalArmor'] = this.calcArmor();
	}


	applyStatChange(arrStats, strSource) {
		for (const strStatName in arrStats) {
			if (strStatName == 'attackPercent' || strStatName == 'attackPercent2') {
				this._attackMultipliers[strSource + ':' + strStatName] = 1 + arrStats[strStatName];
			} else if (strStatName == 'hpPercent' || strStatName == 'hpPercent2') {
				this._hpMultipliers[strSource + ':' + strStatName] = 1 + arrStats[strStatName];
			} else if (strStatName == 'armorPercent') {
				this._armorMultipliers[strSource + ':' + strStatName] = 1 + arrStats[strStatName];
			} else {
				this._stats[strStatName] += arrStats[strStatName];
			}
		}
	}


	calcAttack() {
		let att = this._stats['attack'];
		for (const x in this._attackMultipliers) {
			att = Math.floor(att * this._attackMultipliers[x]);
		}

		att += this._stats['fixedAttack'];

		return att;
	}


	calcHP() {
		let ehp = this._stats['hp'];
		for (const x in this._hpMultipliers) {
			ehp = Math.floor(ehp * this._hpMultipliers[x]);
		}

		ehp += this._stats['fixedHP'];

		return ehp;
	}


	calcArmor() {
		let armor = this._stats['armor'];
		for (const x in this._armorMultipliers) {
			armor = Math.floor(armor * this._armorMultipliers[x]);
		}

		return armor;
	}


	// Get hero stats for display.
	getHeroSheet() {
		console.log('Get stats summary for ' + this._heroName);
		let heroSheet = '';

		const arrIntStats = [
			'hp', 'attack', 'speed', 'armor',
			'totalHP', 'totalAttack', 'totalArmor',
			'unbendingWillTriggered', 'unbendingWillStacks',
			'revive', 'fixedAttack', 'fixedHP', 'energy', 'isCharging',
		];

		const arrStrStats = ['firstCC'];

		heroSheet += 'Level ' + this._heroLevel + ' ' + this._heroName + '<br/>';
		heroSheet += this._starLevel + '* ' + this._heroFaction + ' ' + this._heroClass + '<br/>';

		for (const statName in this._stats) {
			if (arrIntStats.includes(statName)) {
				heroSheet += '<br/>' + translate[statName] + ': ' + this._stats[statName].toLocaleString();
			} else if (arrStrStats.includes(statName)) {
				heroSheet += '<br/>' + translate[statName] + ': ' + this._stats[statName];
			} else {
				heroSheet += '<br/>' + translate[statName] + ': ' + (this._stats[statName] * 100).toFixed() + '%';
			}
		}

		return heroSheet;
	}

	heroDesc() {
		if (this._heroName == 'None') {
			return '';
		} else {
			const pos1 = parseInt(this._heroPos) + 1;
			return '<span class=\'' + this._attOrDef + '\'>' + this._heroName + '-' + pos1 + ' (' + this._currentStats['totalHP'].toLocaleString() + ' hp, ' + this._currentStats['totalAttack'].toLocaleString() + ' attack, ' + this._currentStats['energy'] + ' energy)</span>';
		}
	}


	// Snapshot stats for combat
	snapshotStats() {
		this._currentStats = Object.assign({}, this._stats);
		this._currentStats['damageDealt'] = 0;
		this._currentStats['damageHealed'] = 0;
	}


	// utility functions for combat

	hasStatus(strStatus) {
		if (this._currentStats['totalHP'] <= 0) { return false; }

		if (strStatus in this._debuffs) { return true; }
		if (strStatus in this._buffs) { return true; }
		return false;

		/*
    var result = false;

    for (let [b, ob] of Object.entries(this._debuffs)) {
      if (b == strStatus) {
        return true;
      } else {
        for (let s of Object.values(ob)) {
          for (let e of Object.keys(s["effects"])) {
            if (e == strStatus) { return true; }
          }
        }
      }
    }


    for (let [b, ob] of Object.entries(this._buffs)) {
      if (b == strStatus) {
        return true;
      } else {
        for (let s of Object.values(ob)) {
          for (let e of Object.keys(s["effects"])) {
            if (e == strStatus) { return true; }
          }
        }
      }
    }

    return result;
    */
	}


	isUnderStandardControl() {
		if (this._currentStats['totalHP'] <= 0) { return false; }

		if (this.hasStatus('petrify') || this.hasStatus('stun') || this.hasStatus('twine') || this.hasStatus('freeze') || this.hasStatus('Shapeshift')) {
			return true;
		} else {
			return false;
		}
	}


	isNotSealed() {
		if (this._currentStats['totalHP'] <= 0) { return false; }

		if ('Seal of Light' in this._debuffs || 'Shapeshift' in this._debuffs) {
			return false;
		} else {
			return true;
		}
	}


	// can further extend this to account for new mechanics by adding parameters to the end
	// supply a default value so as to not break other calls to this function
	calcDamage(target, attackDamage, damageSource, damageType, skillDamage = 1, canCrit = 1, dotRounds = 0, canBlock = 1, armorReduces = 1) {

		// Get damage related stats
		let critChance = canCrit * this._currentStats['crit'];
		let critDamage = 2 * this._currentStats['critDamage'] + 1.5;
		let precision = this._currentStats['precision'];
		let precisionDamageIncrease = 1;
		let holyDamageIncrease = this._currentStats['holyDamage'] * 0.7;
		let damageAgainstBurning = 1;
		let damageAgainstBleeding = 1;
		let damageAgainstPoisoned = 1;
		let damageAgainstFrozen = 1;
		let damageAgainstStun = 1;
		let damageAgainstClass = 1;
		let allDamageDealt = 1 + this._currentStats['allDamageDealt'];
		let armorBreak = this._currentStats['armorBreak'];
		let allDamageTaken = 1 + target._currentStats['allDamageTaken'];

		// mitigation stats
		let critDamageReduce = target._currentStats['critDamageReduce'];
		let classDamageReduce = target._currentStats[this._heroClass.toLowerCase() + 'Reduce'];
		let damageReduce = target._currentStats['damageReduce'];
		let allDamageReduce = target._currentStats['allDamageReduce'];
		let burnDamageTaken = 1 + target._currentStats['burnDamageTaken'];
		let dotReduce = 0;
		let armorMitigation = armorReduces * ((1 - armorBreak) * target._currentStats['totalArmor'] / (180 + 20 * (target._heroLevel)));


		// faction advantage
		const factionA = this._heroFaction;
		const factionB = target._heroFaction;

		if (
			(factionA == 'Abyss' && factionB == 'Forest') ||
      (factionA == 'Forest' && factionB == 'Shadow') ||
      (factionA == 'Shadow' && factionB == 'Fortress') ||
      (factionA == 'Fortress' && factionB == 'Abyss') ||
      (factionA == 'Dark' && factionB == 'Light') ||
      (factionA == 'Light' && factionB == 'Dark')
		) {
			damageReduce -= 0.3;
			precision += 0.15;
		}
		precisionDamageIncrease = 1 + precision * 0.3;


		// caps and min
		if (critDamage > 4.5) { critDamage = 4.5; }
		if (critChance < 0) { critChance = 0; }
		if (critDamageReduce > 1) { critDamageReduce = 1; }
		if (precision < 0) { precision = 0; }
		if (precisionDamageIncrease < 1) { precisionDamageIncrease = 1; }
		if (precisionDamageIncrease > 1.45) { precisionDamageIncrease = 1.45; }
		if (armorBreak > 1) { armorBreak = 1; }
		if (damageReduce > 0.75) { damageReduce = 0.75; }
		if (damageReduce < 0) { damageReduce = 0; }
		if (allDamageReduce < 0) { allDamageReduce = 0; }
		if (allDamageReduce > 0.75) { allDamageReduce = 0.75; }
		if (allDamageTaken < 0) { allDamageReduce = 0; }

		let blockChance = canBlock * (target._currentStats['block'] - precision);
		if (blockChance < 0) { blockChance = 0; }


		// status modifiers
		if (target.hasStatus('Burn') || target.hasStatus('Burn True')) {
			damageAgainstBurning += this._currentStats['damageAgainstBurning'];
		}

		if (target.hasStatus('Bleed') || target.hasStatus('Bleed True')) {
			damageAgainstBleeding += this._currentStats['damageAgainstBleeding'];
		}

		if (target.hasStatus('Poison') || target.hasStatus('Poison True')) {
			damageAgainstPoisoned += this._currentStats['damageAgainstPoisoned'];
		}

		if (target.hasStatus('freeze')) {
			damageAgainstFrozen += this._currentStats['damageAgainstFrozen'];
		}

		if (target.hasStatus('stun')) {
			damageAgainstStun += this._currentStats['damageAgainstStun'];
		}

		if (isDot(damageType)) {
			dotReduce = target._currentStats['dotReduce'];
		}

		damageAgainstClass += this._currentStats['damageAgainst' + target._heroClass];


		// damage source and damage type overrides
		if (damageSource == 'active') {
			if (isDot(damageType)) {
				skillDamage += (this._currentStats['skillDamage'] + ((this._currentStats['energySnapshot'] - 100) / 100)) / (dotRounds + 1);
			} else if (!(['energy', 'true'].includes(damageType))) {
				skillDamage += this._currentStats['skillDamage'] + ((this._currentStats['energySnapshot'] - 100) / 100);
			}
		} else if (isDot(damageType) && !(['burnTrue', 'bleedTrue', 'poisonTrue'].includes(damageType))) {
			skillDamage += this._currentStats['skillDamage'] / (dotRounds + 1);
		}

		if (['passive', 'mark'].includes(damageSource) || isDot(damageType)) {
			critChance = 0;
			blockChance = 0;
		}

		if (['energy', 'true', 'burnTrue', 'bleedTrue', 'poisonTrue'].includes(damageType)) {
			precisionDamageIncrease = 1;
			damageAgainstBurning = 1;
			damageAgainstBleeding = 1;
			damageAgainstPoisoned = 1;
			damageAgainstFrozen = 1;
			damageAgainstStun = 1;
			allDamageDealt = 1;
			holyDamageIncrease = 0;
			armorMitigation = 0;
			damageReduce = 0;
			classDamageReduce = 0;
			allDamageTaken = 1;
			critChance = 0;
			blockChance = 0;
			burnDamageTaken = 1;
		}

		if (canCrit == 2) {
			critChance = 1;
		}


		// calculate damage
		attackDamage = attackDamage * skillDamage * precisionDamageIncrease * damageAgainstBurning * damageAgainstBleeding * damageAgainstPoisoned * damageAgainstFrozen * damageAgainstStun * damageAgainstClass * allDamageDealt;
		attackDamage = attackDamage * (1 - allDamageReduce) * (1 - damageReduce) * (1 - armorMitigation + holyDamageIncrease) * (1 - classDamageReduce) * (1 - dotReduce) * allDamageTaken * burnDamageTaken;

		let blocked = false;
		let critted = false;
		const blockRoll = random();
		const critRoll = random();

		if (critRoll < critChance && blockRoll < blockChance) {
			// blocked crit
			attackDamage = attackDamage * 0.56 * (1 - critDamageReduce) * critDamage;
			blocked = true;
			critted = true;
		} else if (critRoll < critChance) {
			// crit
			attackDamage = attackDamage * (1 - critDamageReduce) * critDamage;
			critted = true;
		} else if (blockRoll < blockChance) {
			// blocked normal
			attackDamage = attackDamage * 0.7;
			blocked = true;
		} else {
			// normal
		}


		if (roundNum > 15) {
			attackDamage = attackDamage * (1.15 ** (roundNum - 15));
		}


		// min damage in case of negative stats
		if (attackDamage < 1) attackDamage = 1;


		return {
			'damageAmount': Math.floor(attackDamage),
			'critted': critted,
			'blocked': blocked,
			'damageSource': damageSource,
			'damageType': damageType,
		};
	}


	calcHeal(target, healAmount) {
		const healEffect = this._currentStats['healEffect'] + 1;
		return Math.floor(healAmount * healEffect);
	}


	getHeal(source, amountHealed) {
		if (this._currentStats['totalHP'] <= 0) { return ''; }

		let result = '';
		let effectBeingHealed = 1 + this._currentStats['effectBeingHealed'];
		if (effectBeingHealed < 0) { effectBeingHealed = 0; }

		amountHealed = Math.floor(amountHealed * effectBeingHealed);

		if (!(isMonster(source)) && 'Healing Curse' in this._debuffs) {
			const debuffKey = Object.keys(this._debuffs['Healing Curse'])[0];
			const debuffStack = this._debuffs['Healing Curse'][debuffKey];

			result += '<div>Heal from ' + source.heroDesc() + ' blocked by <span class=\'skill\'>Healing Curse</span>.</div>';
			result += this.removeDebuff('Healing Curse', debuffKey);

			triggerQueue.push([debuffStack['source'], 'addHurt', this, amountHealed, 'Healing Curse']);

		} else {

			result = '<div>' + source.heroDesc() + ' healed ';

			// prevent overheal
			const maxHP = this.getMaxHealableHP();

			if (this._currentStats['totalHP'] + amountHealed > maxHP) {
				this._currentStats['totalHP'] = maxHP;
			} else {
				this._currentStats['totalHP'] += amountHealed;
			}


			source._currentStats['damageHealed'] += amountHealed;

			if (this.heroDesc() == source.heroDesc()) {
				result += ' themself for ' + formatNum(amountHealed) + '.</div>';
			} else {
				result += this.heroDesc() + ' for ' + formatNum(amountHealed) + '.</div>';
			}
		}

		return result;
	}


	getMaxHealableHP() {
		const maxHP = this._stats.totalHP;
		let soulCorruption = 0;

		if ('Soul Corruption' in this._debuffs) {
			for (const stack of Object.values(this._debuffs['Soul Corruption'])) {
				soulCorruption += stack.effects.corruptedHP;
			}
		}

		return Math.floor(maxHP * (1 - soulCorruption));
	}


	getEnergy(source, amount, bypassCurseOfDecay = false) {
		if (this._currentStats['totalHP'] <= 0) { return ''; }

		let result = '';

		if ('Curse of Decay' in this._debuffs && !bypassCurseOfDecay) {
			const curseKeys = Object.keys(this._debuffs['Curse of Decay']);
			const curseKey = curseKeys[0];
			const stack = this._debuffs['Curse of Decay'][curseKey];
			result += '<div><span class="skill">Curse of Decay</span> prevented energy gain.</div>';
			result += this.removeDebuff('Curse of Decay', curseKey);
			triggerQueue.push([stack.source, 'curseOfDecay', this, stack.effects.attackAmount, 'Curse of Decay']);

		} else {
			if (this.heroDesc() == source.heroDesc()) {
				result = '<div>' + this.heroDesc() + ' gained ' + formatNum(amount) + ' energy. Energy at ';
			} else {
				result = '<div>' + source.heroDesc() + ' gave ' + this.heroDesc() + ' ' + formatNum(amount) + ' energy. Energy at ';
			}

			this._currentStats['energy'] += amount;
			result += formatNum(this._currentStats['energy']) + '.</div>';

			if ('Devouring Mark' in this._debuffs && this._currentStats['energy'] >= 100) {
				for (const s in this._debuffs['Devouring Mark']) {
					triggerQueue.push([this._debuffs['Devouring Mark'][s]['source'], 'devouringMark', this, this._debuffs['Devouring Mark'][s]['effects']['attackAmount'], this._currentStats['energy']]);
				}

				result += this.removeDebuff('Devouring Mark');
			}
		}

		return result;
	}


	loseEnergy(source, amount) {
		if (this._currentStats['totalHP'] <= 0) { return ''; }

		let result = '';

		result = '<div>' + source.heroDesc() + ' drained from ' + this.heroDesc() + ' ' + formatNum(amount) + ' energy. Energy at ';

		if (this._currentStats['energy'] < amount) {
			this._currentStats['energy'] = 0;
		} else {
			this._currentStats['energy'] -= amount;
		}

		result += formatNum(this._currentStats['energy']) + '.</div>';

		return result;
	}


	calcCombatAttack() {
		let fixedAttackAmount = this._stats.fixedAttack;
		let att = this._stats.attack;

		for (const b of Object.values(this._buffs)) {
			for (const s of Object.values(b)) {
				for (const [e, oe] of Object.entries(s.effects)) {
					if (e == 'attack') {
						att += oe;
					} else if (e == 'fixedAttack') {
						fixedAttackAmount += oe;
					}
				}
			}
		}

		for (const b of Object.values(this._debuffs)) {
			for (const s of Object.values(b)) {
				for (const [e, oe] of Object.entries(s.effects)) {
					if (e == 'attack') {
						att -= oe;
					} else if (e == 'fixedAttack') {
						fixedAttackAmount -= oe;
					}
				}
			}
		}

		if (att < 0) att = 0;

		// apply percent buffs and debuffs
		for (const x in this._attackMultipliers) {
			att = Math.floor(att * this._attackMultipliers[x]);
		}

		for (const b of Object.values(this._buffs)) {
			for (const s of Object.values(b)) {
				for (const [e, oe] of Object.entries(s.effects)) {
					if (e == 'attackPercent') {
						att = Math.floor(att * (1 + oe));
					}
				}
			}
		}

		for (const b of Object.values(this._debuffs)) {
			for (const s of Object.values(b)) {
				for (const [e, oe] of Object.entries(s.effects)) {
					if (e == 'attackPercent') {
						att = Math.floor(att * (1 - oe));
					}
				}
			}
		}


		att += fixedAttackAmount;
		if (att < 0) att = 0;
		return att;
	}


	calcCombatArmor() {
		let armr = this._currentStats.armor;

		for (const x in this._armorMultipliers) {
			armr = Math.floor(armr * this._armorMultipliers[x]);
		}

		// apply buffs
		for (const b of Object.values(this._debuffs)) {
			for (const s of Object.values(b)) {
				for (const [e, oe] of Object.entries(s.effects)) {
					if (e == 'armorPercent') {
						armr = Math.floor(armr * (1 + oe));
					}
				}
			}
		}

		// apply debuffs
		for (const b of Object.values(this._debuffs)) {
			for (const s of Object.values(b)) {
				for (const [e, oe] of Object.entries(s.effects)) {
					if (e == 'armorPercent') {
						armr = Math.floor(armr * (1 - oe));
					}
				}
			}
		}

		return armr;
	}


	getBuff(source, buffName, duration, effects = {}, unstackable = false) {
		if (this._currentStats['totalHP'] <= 0) { return ''; }

		let result = '';
		let healResult = '';

		if (duration > 15) {
			result += '<div>' + this.heroDesc() + ' gained buff <span class=\'skill\'>' + buffName + '</span>.';
		} else if (duration == 1) {
			result += '<div>' + this.heroDesc() + ' gained buff <span class=\'skill\'>' + buffName + '</span> for ' + formatNum(1) + ' round.';
		} else {
			result += '<div>' + this.heroDesc() + ' gained buff <span class=\'skill\'>' + buffName + '</span> for ' + formatNum(duration) + ' rounds.';
		}


		if (isAttribute(buffName, effects) && 'Curse of Decay' in this._debuffs) {
			const curseKeys = Object.keys(this._debuffs['Curse of Decay']);
			const curseKey = curseKeys[0];
			const stack = this._debuffs['Curse of Decay'][curseKey];
			result += `'<div><span class='skill'>Curse of Decay</span> prevented buff <span class='skill'>${buffName}</span>.</div>`;
			result += this.removeDebuff('Curse of Decay', curseKey);
			triggerQueue.push([stack.source, 'curseOfDecay', this, stack.effects.attackAmount, 'Curse of Decay']);

		} else if (unstackable && buffName in this._buffs) {
			const stackObj = Object.values(this._buffs[buffName])[0];
			stackObj['duration'] = duration;

		} else {
			const keyAt = uuid();
			if (buffName in this._buffs) {
				this._buffs[buffName][keyAt] = { 'source': source, 'duration': duration, 'effects': effects };
			} else {
				this._buffs[buffName] = {};
				this._buffs[buffName][keyAt] = { 'source': source, 'duration': duration, 'effects': effects };
			}


			for (const strStatName in effects) {
				result += ' ' + translate[strStatName] + ': ' + formatNum(effects[strStatName]) + '.';

				if (strStatName == 'attackPercent') {
					this._currentStats['totalAttack'] = this.calcCombatAttack();

				} else if (strStatName == 'armorPercent') {
					this._currentStats['totalArmor'] = this.calcCombatArmor();

				} else if (strStatName == 'heal') {
					healResult = this.getHeal(source, effects[strStatName]);

				} else if (strStatName == 'attackAmount') {
					// ignore, used for snapshotting attack

				} else {
					this._currentStats[strStatName] += effects[strStatName];

					if (strStatName == 'attack' || strStatName == 'fixedAttack') {
						this._currentStats['totalAttack'] = this.calcCombatAttack();
					} else if (strStatName == 'armor') {
						this._currentStats['totalArmor'] = this.calcCombatArmor();
					}
				}
			}
		}

		return result + '</div>' + healResult;
	}


	getDebuff(source, debuffName, duration, effects = {}, bypassControlImmune = false, damageSource = 'passive', ccChance = 1, unstackable = false) {
		if (this._currentStats['totalHP'] <= 0) { return ''; }

		let damageResult = {};
		const strDamageResult = '';
		let result = '';
		let controlImmune;
		let controlImmunePen;
		const isControl = isControlEffect(debuffName, effects);
		let rollCCHit;
		let rollCCPen;


		if (isControl) {
			controlImmune = this._currentStats['controlImmune'];
			controlImmunePen = source._currentStats['controlImmunePen'];
			controlImmune -= controlImmunePen;
			if (controlImmune < 0) { controlImmune = 0; }

			if ((debuffName + 'Immune') in this._currentStats) {
				controlImmune = 1 - (1 - controlImmune) * (1 - this._currentStats[debuffName + 'Immune']);
			}

			ccChance = ccChance * (1 + source._currentStats['controlPrecision']);
			rollCCHit = random();
			rollCCPen = random();
		}

		if (isControl && rollCCHit >= ccChance) {
			// failed CC roll
		} else if (isControl && rollCCPen < controlImmune && !(bypassControlImmune)) {
			result += '<div>' + this.heroDesc() + ' resisted debuff <span class=\'skill\'>' + debuffName + '</span>.</div>';
		} else if (
			isControl &&
      (rollCCPen >= controlImmune || bypassControlImmune) &&
      this._artifact.includes(' Lucky Candy Bar') &&
      (this._currentStats['firstCC'] == '' || this._currentStats['firstCC'] == debuffName)
		) {
			this._currentStats['firstCC'] = debuffName;
			result += '<div>' + this.heroDesc() + ' resisted debuff <span class=\'skill\'>' + debuffName + '</span> using <span class=\'skill\'>' + this._artifact + '</span>.</div>';
		} else {
			if (duration == 1) {
				result += '<div>' + this.heroDesc() + ' gained debuff <span class=\'skill\'>' + debuffName + '</span> for ' + formatNum(1) + ' round.';
			} else {
				result += '<div>' + this.heroDesc() + ' gained debuff <span class=\'skill\'>' + debuffName + '</span> for ' + formatNum(duration) + ' rounds.';
			}


			if (unstackable && debuffName in this._debuffs) {
				const stackObj = Object.values(this._debuffs[debuffName])[0];
				stackObj['duration'] = duration;

				if (debuffName == 'Shapeshift') {
					stackObj['effects']['stacks'] = effects['stacks'];
				}

			} else {
				const keyAt = uuid();
				if (debuffName in this._debuffs) {
					this._debuffs[debuffName][keyAt] = { 'source': source, 'duration': duration, 'effects': effects };
				} else {
					this._debuffs[debuffName] = {};
					this._debuffs[debuffName][keyAt] = { 'source': source, 'duration': duration, 'effects': effects };
				}


				// process effects
				for (const strStatName in effects) {
					result += ' ' + translate[strStatName] + ': ' + formatNum(effects[strStatName]) + '.';

					if (strStatName == 'attackPercent') {
						this._currentStats['totalAttack'] = this.calcCombatAttack();

					} else if (strStatName == 'armorPercent') {
						this._currentStats['totalArmor'] = this.calcCombatArmor();

					} else if (isDot(strStatName)) {
						if (this._currentStats['totalHP'] > 0) {
							damageResult = {
								damageAmount: effects[strStatName],
								damageSource: damageSource,
								damageType: strStatName,
								critted: false,
								blocked: false,
							};
							result += '<div>' + this.takeDamage(source, 'Debuff ' + debuffName, damageResult) + '</div>';
						}

					} else if (['rounds', 'stacks', 'attackAmount', 'damageAmount'].includes(strStatName)) {
						// ignore, used to track other stuff

					} else {
						this._currentStats[strStatName] -= effects[strStatName];

						if (strStatName == 'attack' || strStatName == 'fixedAttack') {
							this._currentStats['totalAttack'] = this.calcCombatAttack();
						} else if (strStatName == 'armor') {
							this._currentStats['totalArmor'] = this.calcCombatArmor();
						} else if (['dodge', 'crit', 'block'].includes(strStatName)) {
							if (this._currentStats[strStatName] < 0) {
								this._currentStats[strStatName] = 0;
							}
						}
					}
				}

				if (isControl) {
					triggerQueue.push([this, 'eventGotCC', source, debuffName, keyAt]);
				}

				result += '</div>';


				// handle special debuffs
				if (debuffName == 'Devouring Mark' && this._currentStats['energy'] >= 100) {
					triggerQueue.push([source, 'devouringMark', this, effects['attackAmount'], this._currentStats['energy']]);
					result += this.removeDebuff('Devouring Mark');

				} else if (debuffName == 'Power of Light' && Object.keys(this._debuffs[debuffName]).length >= 2) {
					result += this.removeDebuff('Power of Light');
					result += this.getDebuff(source, 'Seal of Light', 2);

				} else if (debuffName == 'twine') {
					for (const h in source._allies) {
						if (source._allies[h]._heroName == 'Oberon') {
							triggerQueue.push([source._allies[h], 'eventTwine']);
						}
					}
				} else if (debuffName == 'Horrify') {
					for (const h in this._enemies) {
						triggerQueue.push([this._enemies[h], 'enemyHorrified']);
					}
				}
			}
		}

		return result + strDamageResult;
	}


	removeBuff(strBuffName, stack = '') {
		let result = '';

		if (strBuffName in this._buffs) {
			result += '<div>' + this.heroDesc() + ' lost buff <span class=\'skill\'>' + strBuffName + '</span>.';

			// for each stack
			for (const s in this._buffs[strBuffName]) {
				// remove the effects
				if (stack == '' || stack == s) {
					for (const strStatName in this._buffs[strBuffName][s]['effects']) {
						result += ' ' + translate[strStatName] + ': ' + formatNum(this._buffs[strBuffName][s]['effects'][strStatName]) + '.';

						if (strStatName == 'attackPercent') {
							this._currentStats['totalAttack'] = this.calcCombatAttack();

						} else if (strStatName == 'armorPercent') {
							this._currentStats['totalArmor'] = this.calcCombatArmor();

						} else if(['heal', 'attackAmount'].includes(strStatName)) {
							// do nothing

						} else {
							this._currentStats[strStatName] -= this._buffs[strBuffName][s]['effects'][strStatName];

							if (strStatName == 'attack' || strStatName == 'fixedAttack') {
								this._currentStats['totalAttack'] = this.calcCombatAttack();
							} else if (strStatName == 'armor') {
								this._currentStats['totalArmor'] = this.calcCombatArmor();
							}
						}
					}

					delete this._buffs[strBuffName][s];
				}
			}

			if (Object.keys(this._buffs[strBuffName]).length == 0) {
				delete this._buffs[strBuffName];
			}

			result += '</div>';
		}

		return result;
	}


	removeDebuff(strDebuffName, stack = '') {
		let result = '';

		if (strDebuffName in this._debuffs) {
			result += '<div>' + this.heroDesc() + ' lost debuff <span class=\'skill\'>' + strDebuffName + '</span>.';

			// for each stack
			for (const s in this._debuffs[strDebuffName]) {
				// remove the effects
				if (stack == '' || stack == s) {
					for (const strStatName in this._debuffs[strDebuffName][s]['effects']) {
						result += ' ' + translate[strStatName] + ': ' + formatNum(this._debuffs[strDebuffName][s]['effects'][strStatName]) + '.';

						if (strStatName == 'attackPercent') {
							this._currentStats['totalAttack'] = this.calcCombatAttack();

						} else if (strStatName == 'armorPercent') {
							this._currentStats['totalArmor'] = this.calcCombatArmor();

						} else if (['rounds', 'stacks', 'attackAmount', 'damageAmount'].includes(strStatName)) {
							// do nothing, used to track other stuff

						} else if (isDot(strStatName)) {
							// do nothing

						} else {
							this._currentStats[strStatName] += this._debuffs[strDebuffName][s]['effects'][strStatName];

							if (strStatName == 'attack' || strStatName == 'fixedAttack') {
								this._currentStats['totalAttack'] = this.calcCombatAttack();
							} else if (strStatName == 'armor') {
								this._currentStats['totalArmor'] = this.calcCombatArmor();
							}
						}
					}

					delete this._debuffs[strDebuffName][s];
				}
			}

			if (Object.keys(this._debuffs[strDebuffName]).length == 0) {
				delete this._debuffs[strDebuffName];
			}

			result += '</div>';
		}

		return result;
	}


	tickBuffs() {
		let result = '';
		let stacksLeft = 0;

		if (this._currentStats['totalHP'] > 0) {
			// for each buff name
			for (const b in this._buffs) {
				stacksLeft = 0;

				// for each stack
				for (const s in this._buffs[b]) {
					if (this._currentStats['totalHP'] > 0) {
						this._buffs[b][s]['duration'] -= 1;

						if (this._buffs[b][s]['duration'] == 0) {
							result += '<div>' + this.heroDesc() + ' stack of buff (<span class=\'skill\'>' + b + '</span>) ended.</div>';

							// remove the effects
							for (const strStatName in this._buffs[b][s]['effects']) {
								if (strStatName == 'attackPercent') {
									this._currentStats['totalAttack'] = this.calcCombatAttack();

								} else if (strStatName == 'armorPercent') {
									this._currentStats['totalArmor'] = this.calcCombatArmor();

								} else if (['heal', 'attackAmount'].includes(strStatName)) {
									// do nothing
								} else {
									this._currentStats[strStatName] -= this._buffs[b][s]['effects'][strStatName];

									if (strStatName == 'attack' || strStatName == 'fixedAttack') {
										this._currentStats['totalAttack'] = this.calcCombatAttack();
									} else if (strStatName == 'armor') {
										this._currentStats['totalArmor'] = this.calcCombatArmor();
									}
								}
							}

							delete this._buffs[b][s];
						} else {
							stacksLeft++;

							for (const strStatName in this._buffs[b][s]['effects']) {
								if (strStatName == 'heal') {
									result += '<div>' + this.heroDesc() + ' stack of buff <span class=\'skill\'>' + b + '</span> ticked.</div>';
									result += '<div>' + this.getHeal(this._buffs[b][s]['source'], this._buffs[b][s]['effects'][strStatName]) + '</div>';
								}
							}
						}
					}
				}

				if (stacksLeft == 0 && this._currentStats['totalHP'] > 0) {
					delete this._buffs[b];
				}
			}
		}

		return result;
	}


	tickDebuffs() {
		let result = '';
		let damageResult = {};
		let stacksLeft = 0;

		if (this._currentStats['totalHP'] > 0) {
			// for each buff name
			for (const b in this._debuffs) {
				stacksLeft = 0;

				// for each stack
				for (const s in this._debuffs[b]) {
					if (this._currentStats['totalHP'] > 0) {
						this._debuffs[b][s]['duration'] -= 1;

						if (this._debuffs[b][s]['duration'] == 0) {
							result += '<div>' + this.heroDesc() + ' stack of debuff (<span class=\'skill\'>' + b + '</span>) ended.</div>';

							if (b == 'Sow Seeds') {
								result += this.getDebuff(this._debuffs[b][s]['source'], 'twine', this._debuffs[b][s]['effects']['rounds']);

							} else if (b == 'Black Hole Mark') {
								if (this._currentStats['totalHP'] > 0) {
									const bhMark = this._debuffs[b][s];
									let damageAmount = bhMark['effects']['damageAmount'];

									if (damageAmount > bhMark['effects']['attackAmount']) {damageAmount = bhMark['effects']['attackAmount']; }
									damageResult = bhMark['source'].calcDamage(this, damageAmount, 'mark', 'true');
									result += '<div>' + this.takeDamage(bhMark['source'], 'Black Hole Mark', damageResult) + '</div>';
								}

							} else if (b == 'Round Mark') {
								if (this._currentStats['totalHP'] > 0) {
									const roundMark = this._debuffs[b][s];
									damageResult = roundMark['effects']['attackAmount'];

									result += '<div>' + this.takeDamage(roundMark['source'], 'Round Mark', damageResult) + '</div>';
								}

							} else {
								// remove the effects
								for (const strStatName in this._debuffs[b][s]['effects']) {
									if (strStatName == 'attackPercent') {
										this._currentStats['totalAttack'] = this.calcCombatAttack();

									} else if (strStatName == 'armorPercent') {
										this._currentStats['totalArmor'] = this.calcCombatArmor();

									} else if (['rounds', 'stacks', 'attackAmount', 'damageAmount'].includes(strStatName)) {
										// do nothing, used to track stuff

									} else if (isDot(strStatName)) {
										if (this._currentStats['totalHP'] > 0) {
											damageResult = {
												damageAmount: this._debuffs[b][s]['effects'][strStatName],
												damageSource: 'passive',
												damageType: strStatName,
												critted: false,
												blocked: false,
											};

											result += '<div>' + this.heroDesc() + ' stack of debuff <span class=\'skill\'>' + b + '</span> ticked.</div>';
											result += '<div>' + this.takeDamage(this._debuffs[b][s]['source'], 'Debuff ' + b, damageResult) + '</div>';
										}

									} else {
										this._currentStats[strStatName] += this._debuffs[b][s]['effects'][strStatName];

										if (strStatName == 'attack' || strStatName == 'fixedAttack') {
											this._currentStats['totalAttack'] = this.calcCombatAttack();
										} else if (strStatName == 'armor') {
											this._currentStats['totalArmor'] = this.calcCombatArmor();
										}
									}
								}
							}

							delete this._debuffs[b][s];
						} else {
							stacksLeft++;

							for (const strStatName in this._debuffs[b][s]['effects']) {
								if (isDot(strStatName)) {
									if (this._currentStats['totalHP'] > 0) {
										damageResult = {
											damageAmount: this._debuffs[b][s]['effects'][strStatName],
											damageSource: 'passive',
											damageType: strStatName,
											critted: false,
											blocked: false,
										};

										result += '<div>' + this.heroDesc() + ' stack of debuff <span class=\'skill\'>' + b + '</span> ticked.</div>';
										result += '<div>' + this.takeDamage(this._debuffs[b][s]['source'], 'Debuff ' + b, damageResult) + '</div>';
									}

									if (this._debuffs[b][s]['duration'] == 1) {
										// last dot ticked
										result += '<div>' + this.heroDesc() + ' stack of debuff (<span class=\'skill\'>' + b + '</span>) ended.</div>';
										delete this._debuffs[b][s];
										stacksLeft--;
										break;
									}
								}
							}

							if (b == 'Revenging Wraith') {
								const debuffStack = this._debuffs[b][s];
								let hpDamagePercent = 0.30;
								if (debuffStack.source._voidLevel >= 3) hpDamagePercent = 0.35;


								let damageAmount = Math.floor(this._stats.totalHP * hpDamagePercent);
								if (damageAmount > debuffStack.effects.attackAmount * 25) damageAmount = debuffStack.effects.attackAmount * 25;

								damageResult = debuffStack.source.calcDamage(this, damageAmount, 'passive', 'true');
								result += this.takeDamage(debuffStack.source, 'Revenging Wraith', damageResult);
							}
						}
					}
				}

				if (stacksLeft == 0 && this._currentStats['totalHP'] > 0) {
					delete this._debuffs[b];
				}
			}
		}

		return result;
	}


	tickEnable3() {
		let result = '';

		if (this._enable3 == 'Resilience') {
			const healAmount = this.calcHeal(this, 0.15 * (this._stats['totalHP'] - this._currentStats['totalHP']));

			if (healAmount > 0) {
				result += '<div>' + this.heroDesc() + ' Resilience triggered.</div>';
				result += this.getHeal(this, healAmount);
			}

		} else if (this._enable3 == 'SharedFate') {
			let numLiving = 0;

			for (const h in this._allies) {
				if (this._allies[h]._currentStats['totalHP'] > 0) { numLiving++; }
			}

			for (const h in this._enemies) {
				if (this._enemies[h]._currentStats['totalHP'] > 0) { numLiving++; }
			}


			const attBuff = numLiving * 0.012;
			if (numLiving > 0) {
				result += '<div>' + this.heroDesc() + ' gained Shared Fate. Increased attack by ' + formatNum(attBuff * 100) + '%.</div>';
				this.getBuff(this, 'Attack Percent', 1, { attackPercent: attBuff });
			}

		} else if (this._enable3 == 'Purify') {
			const listDebuffs = [];

			for (const d in this._debuffs) {
				const firstStack = Object.values(this._debuffs[d])[0];

				if (isDispellable(d) && (isDot(d) || isAttribute(d, firstStack) || d.includes('Mark') || isControlEffect(d))) {
					listDebuffs.push(d);
				}
			}

			const rng = Math.floor(random() * listDebuffs.length);

			if (listDebuffs.length > 0) {
				result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Purify</span> removed debuff.</div>';
				result += this.removeDebuff(listDebuffs[rng]);
			}
		}

		return result;
	}


	// a bunch of functions for override by hero subclasses as needed to trigger special abilities.
	// usually you'll want to check that the hero is still alive before triggering their effect

	passiveStats() { return {}; }
	eventSelfBasic() { return ''; }
	eventAllyBasic() { return ''; }
	eventEnemyBasic() { return ''; }
	eventAllyActive() { return ''; }
	eventEnemyActive() { return ''; }
	eventSelfDied() { return ''; }
	eventAllyDied() { return ''; }
	eventEnemyDied() { return ''; }
	eventGotCC() { return ''; }
	startOfBattle() { return ''; }
	endOfRound() { return ''; }
	eventHPlte50() { return ''; }
	eventHPlte30() { return ''; }


	handleTrigger(trigger) {
		if (trigger[1] == 'addHurt' && this._currentStats['totalHP'] > 0) {
			if (trigger[2]._currentStats['totalHP'] > 0) {
				const damageResult = { damageAmount: trigger[3], critted: false, blocked: false, damageSource: 'passive', damageType: 'true' };
				return trigger[2].takeDamage(this, trigger[4], damageResult);
			}

		} else if (trigger[1] == 'curseOfDecay' && this._currentStats['totalHP'] > 0) {
			if (trigger[2]._currentStats['totalHP'] > 0) {
				const damageResult = this.calcDamage(trigger[2], trigger[3], 'passive', 'normal');
				return trigger[2].takeDamage(this, trigger[4], damageResult);
			}

		} else if (trigger[1] == 'getHP' && this._currentStats['totalHP'] > 0) {
			return this.getHP(trigger[2], Math.floor(trigger[3]));

		} else if (trigger[1] == 'getHeal' && this._currentStats['totalHP'] > 0) {
			return this.getHeal(trigger[2], Math.floor(trigger[3]));

		} else if (['eventSelfBasic', 'eventSelfActive'].includes(trigger[1]) && 'Bloodthirsty' in this._buffs && this._currentStats['totalHP'] > 0) {
			return this.eventBloodthirsty(trigger[2]);

		} else if (trigger[1] == 'eventSelfDied' && 'Revenging Wraith' in this._debuffs) {
			return this.eventRevengingWraith();

		}

		return '';
	}


	takeDamage(source, strAttackDesc, damageResult, bypassAll = false) {
		if (Number.isNaN(damageResult.damageAmount)) throw new Error('Damage amount is not a number');
		if (damageResult.damageAmount < 0) throw new Error('Damage amount less than 0');
		if (this._currentStats['totalHP'] <= 0) return '';

		let result = '';
		let bypassModifiers = bypassAll;
		let dotAmount = 0;
		const beforeHP = this._currentStats['totalHP'];
		const isWildfire = strAttackDesc == 'Debuff Wildfire Torch Dot' ? true : false;

		damageResult['damageAmount'] = Math.floor(damageResult['damageAmount']);
		if (isWildfire || isMonster(source) || strAttackDesc.includes('Curse')) bypassModifiers = true;


		strAttackDesc = '<span class=\'skill\'>' + strAttackDesc + '</span>';
		result = '<div>' + source.heroDesc() + ' used ' + strAttackDesc + ' against ' + this.heroDesc() + '.</div>';


		// enhanced MSS
		if (this._artifact.includes(' Magic Stone Sword') && !bypassModifiers) {
			const maxDamage = Math.floor(this._stats.totalHP * artifacts[this._artifact].enhance);
			if (damageResult.damageAmount > maxDamage) {
				result += '<div><span class=\'skill\'>' + this._artifact + '</span> prevented some damage.</div>';
				damageResult.damageAmount = maxDamage;
			}
		}


		// enhanced AMB
		if (this._artifact.includes(' Augustus Magic Ball') && !bypassModifiers) {
			const damMit = Math.floor(this._currentStats.totalAttack * artifacts[this._artifact].enhance);

			if (damageResult.damageAmount > 1) {
				result += '<div><span class=\'skill\'>' + this._artifact + '</span> prevented some damage.</div>';

				if (damageResult.damageAmount <= damMit) {
					damageResult.damageAmount = 1;
				} else {
					damageResult.damageAmount -= damMit;
				}
			}
		}


		// enhanced Wildfire Torch
		if (this._artifact.includes(' Wildfire Torch') && !bypassModifiers && ['basic', 'active'].includes(damageResult['damageSource']) && damageResult['damageAmount'] > 5) {
			dotAmount = Math.floor(damageResult['damageAmount'] * artifacts[this._artifact].enhance * 0.20);
			damageResult['damageAmount'] = Math.floor(damageResult['damageAmount'] * (1 - artifacts[this._artifact].enhance));
			result += '<div><span class=\'skill\'>' + this._artifact + '</span> converted damage to dot.</div>';
		}


		// Inosuke's Swordwind Shield
		if ('Swordwind Shield' in this._buffs && !bypassModifiers && ['basic', 'active', 'passive'].includes(damageResult['damageSource']) && !['true', 'bleedTrue', 'burnTrue', 'poisonTrue'].includes(damageResult.damageType)) {
			const buffStack = Object.values(this._buffs['Swordwind Shield'])[0];
			let damagePrevented = 0;

			if (damageResult.damageAmount > buffStack.effects.attackAmount) {
				damagePrevented = buffStack.effects.attackAmount;
				damageResult.damageAmount -= damagePrevented;
				result += this.removeBuff('Swordwind Shield');
			} else {
				damagePrevented = Math.floor(damageResult.damageAmount);
				damageResult.damageAmount = 0;
			}

			this._currentStats.damageHealed += damagePrevented;
			result += `<div><span class='skill'>Swordwind Shield</span> prevented <span class='num'>${formatNum(damagePrevented)}</span> damage.</div>`;
		}


		// amenra shields
		if ('Guardian Shadow' in this._buffs && !bypassModifiers && ['active', 'basic'].includes(damageResult['damageSource']) && damageResult['damageAmount'] > 0) {
			const keyDelete = Object.keys(this._buffs['Guardian Shadow']);

			result += '<div>Damage prevented by <span class=\'skill\'>Guardian Shadow</span>.</div>';
			this._buffs['Guardian Shadow'][keyDelete[0]]['source']._currentStats['damageHealed'] += damageResult['damageAmount'];
			triggerQueue.push([this, 'getHP', this._buffs['Guardian Shadow'][keyDelete[0]]['source'], damageResult['damageAmount']]);

			damageResult['damageAmount'] = 0;
			damageResult['critted'] = false;
			damageResult['blocked'] = false;

			result += this.removeBuff('Guardian Shadow', keyDelete[0]);
		}


		if (this._currentStats['unbendingWillStacks'] > 0 && (!bypassModifiers || isMonster(source)) && damageResult['damageSource'] != 'mark') {
			this._currentStats['unbendingWillStacks'] -= 1;
			this._currentStats['damageHealed'] += damageResult['damageAmount'];
			result += '<div>' + formatNum(damageResult['damageAmount']) + ' damage prevented by <span class=\'skill\'>Unbending Will</span>.</div>';

			if (this._currentStats['unbendingWillStacks'] == 0) {
				result += '<div><span class=\'skill\'>Unbending Will</span> ended.</div>';
			}

		} else if (this._currentStats['totalHP'] <= damageResult['damageAmount']) {
			// hero would die, check for unbending will
			if (this._enable5 == 'UnbendingWill' && this._currentStats['unbendingWillTriggered'] == 0 && (!bypassModifiers || isMonster(source)) && damageResult['damageSource'] != 'mark') {
				this._currentStats['unbendingWillTriggered'] = 1;
				this._currentStats['unbendingWillStacks'] = 3;
				this._currentStats['damageHealed'] += damageResult['damageAmount'];
				result += '<div>' + formatNum(damageResult['damageAmount']) + ' damage prevented by <span class=\'skill\'>Unbending Will</span>.</div>';

			} else {
				// hero died
				this._currentStats['totalHP'] = this._currentStats['totalHP'] - damageResult['damageAmount'];
				source._currentStats['damageDealt'] += damageResult['damageAmount'];

				if (damageResult['critted'] == true && damageResult['blocked'] == true) {
					result += '<div>Blocked crit ' + strAttackDesc + ' dealt ' + formatNum(damageResult['damageAmount']) + ' damage.</div>';
				} else if (damageResult['critted'] == true && damageResult['blocked'] == false) {
					result += '<div>Crit ' + strAttackDesc + ' dealt ' + formatNum(damageResult['damageAmount']) + ' damage.</div>';
				} else if (damageResult['critted'] == false && damageResult['blocked'] == true) {
					result += '<div>Blocked ' + strAttackDesc + ' dealt ' + formatNum(damageResult['damageAmount']) + ' damage.</div>';
				} else {
					result += '<div>' + strAttackDesc + ' dealt ' + formatNum(damageResult['damageAmount']) + ' damage.</div>';
				}

				result += '<div>Enemy health dropped from ' + formatNum(beforeHP) + ' to ' + formatNum(0) + '.</div><div>' + this.heroDesc() + ' died.</div>';

				triggerQueue.push([this, 'eventSelfDied', source, this]);

				for (const h in this._allies) {
					if (this._heroPos != this._allies[h]._heroPos) {
						triggerQueue.push([this._allies[h], 'eventAllyDied', source, this]);
					}
				}

				for (const h in this._enemies) {
					triggerQueue.push([this._enemies[h], 'eventEnemyDied', source, this]);
				}
			}

		} else {
			this._currentStats['totalHP'] = this._currentStats['totalHP'] - damageResult['damageAmount'];
			source._currentStats['damageDealt'] += damageResult['damageAmount'];

			if (damageResult['critted'] == true && damageResult['blocked'] == true) {
				result += '<div>Blocked crit ' + strAttackDesc + ' dealt ' + formatNum(damageResult['damageAmount']) + ' damage.</div>';
			} else if (damageResult['critted'] == true && damageResult['blocked'] == false) {
				result += '<div>Crit ' + strAttackDesc + ' dealt ' + formatNum(damageResult['damageAmount']) + ' damage.</div>';
			} else if (damageResult['critted'] == false && damageResult['blocked'] == true) {
				result += '<div>Blocked ' + strAttackDesc + ' dealt ' + formatNum(damageResult['damageAmount']) + ' damage.</div>';
			} else {
				result += '<div>' + strAttackDesc + ' dealt ' + formatNum(damageResult['damageAmount']) + ' damage.</div>';
			}

			result += '<div>Enemy health dropped from ' + formatNum(beforeHP) + ' to ' + formatNum(this._currentStats['totalHP']) + '.</div>';
		}


		// apply Wildfire Torch debuff
		if (dotAmount > 0) {
			result += this.getDebuff(source, 'Wildfire Torch Dot', 4, { dot: dotAmount });
		}


		// E2 Lethal Fightback
		if (
			source._enable2 == 'LethalFightback' &&
      source._currentStats['totalHP'] < this._currentStats['totalHP'] &&
      damageResult['damageType'] != 'true' &&
      !(isDot(damageResult['damageType'])) &&
      ['active', 'basic'].includes(damageResult['damageSource'])
		) {
			triggerQueue.push([source, 'addHurt', this, damageResult['damageAmount'] * 0.12, 'Lethal Fightback']);
		}


		// E5 balanced strike
		if (['active', 'basic'].includes(damageResult['damageSource']) && source._enable5 == 'BalancedStrike') {
			if (damageResult['critted'] == true) {
				const healAmount = source.calcHeal(source, 0.15 * (damageResult['damageAmount']));
				result += '<div><span class=\'skill\'>Balanced Strike</span> triggered heal on crit.</div>';
				triggerQueue.push([source, 'getHeal', source, healAmount]);
			} else if (!(isDot(damageResult['damageType'])) && damageResult['damageType'] != 'true') {
				triggerQueue.push([source, 'addHurt', this, damageResult['damageAmount'] * 0.30, 'Balanced Strike']);
			}
		}


		// Asmodel crit mark
		if (damageResult['critted'] && 'Crit Mark' in this._debuffs) {
			for (const s in this._debuffs['Crit Mark']) {
				triggerQueue.push([this._debuffs['Crit Mark'][s]['source'], 'critMark', this, this._debuffs['Crit Mark'][s]['effects']['attackAmount']]);
			}

			result += this.removeDebuff('Crit Mark');
		}


		// Sherlock shapeshift
		if (this._currentStats['totalHP'] > 0 && 'Shapeshift' in this._debuffs && damageResult['damageAmount'] > 0 && ['active', 'basic'].includes(damageResult['damageSource'])) {
			const shapeshiftKey = Object.keys(this._debuffs['Shapeshift'])[0];
			if (this._debuffs['Shapeshift'][shapeshiftKey]['effects']['stacks'] > 1) {
				this._debuffs['Shapeshift'][shapeshiftKey]['effects']['stacks']--;
			} else {
				result += this.removeDebuff('Shapeshift', shapeshiftKey);
			}
		}


		// Drake black hole mark
		if ('Black Hole Mark' in this._debuffs && ['active', 'basic'].includes(damageResult.damageSource)) {
			const key = Object.keys(this._debuffs['Black Hole Mark'])[0];
			const stack = this._debuffs['Black Hole Mark'][key];

			let damagePercent = 0.60;
			if (stack.source._voidLevel >= 4) damagePercent = 0.70;

			stack.effects.damageAmount += Math.floor(damagePercent * damageResult.damageAmount);
		}


		// HP threshhold triggers
		const beforePercent = beforeHP / this._stats['totalHP'];
		const afterPercent = this._currentStats['totalHP'] / this._stats['totalHP'];

		if (this._currentStats['totalHP'] > 0 && beforePercent > 0.50 && afterPercent <= 0.50) {
			triggerQueue.push([this, 'eventHPlte50']);
		}

		if (this._currentStats['totalHP'] > 0 && beforePercent > 0.30 && afterPercent <= 0.30) {
			triggerQueue.push([this, 'eventHPlte30']);

			if ('Rescue Mark' in this._buffs) {
				for (const s in this._buffs['Rescue Mark']) {
					triggerQueue.push([this, 'getHeal', this._buffs['Rescue Mark'][s]['source'], this._buffs['Rescue Mark'][s]['effects']['attackAmount']]);
				}

				result += this.removeBuff('Rescue Mark');
			}
		}


		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getAllTargets(this, this._enemies, 1);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'basic', 'normal');
				result += targets[i].takeDamage(this, 'Basic Attack', damageResult);
				basicQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		const targets = getAllTargets(this, this._enemies, 2);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 1.5);
				result += targets[i].takeDamage(this, 'Active Template', damageResult);
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	getTargetLock(source) {
		if (random() < this._currentStats['dodge']) {
			return '<div>' + source.heroDesc() + ' attack against ' + this.heroDesc() + ' was dodged.</div>';
		} else {
			return '';
		}
	}


	isUnderControl() {
		for (const d in this._debuffs) {
			if (isControlEffect(d)) {
				return true;
			}
		}

		return false;
	}


	getHP(source, amountHealed) {
		if (this._currentStats['totalHP'] <= 0) { return ''; }

		let result = '';
		result = '<div>' + source.heroDesc() + ' healed ';

		// prevent overheal
		const maxHP = this.getMaxHealableHP();

		if (this._currentStats['totalHP'] + amountHealed > maxHP) {
			this._currentStats['totalHP'] = maxHP;
		} else {
			this._currentStats['totalHP'] += amountHealed;
		}

		source._currentStats['damageHealed'] += amountHealed;

		if (this.heroDesc() == source.heroDesc()) {
			result += ' themself for ' + formatNum(amountHealed) + '.</div>';
		} else {
			result += this.heroDesc() + ' for ' + formatNum(amountHealed) + '.</div>';
		}

		return result;
	}


	eventBloodthirsty(targets) {
		let result = '';
		const buffStack = Object.values(this._buffs['Bloodthirsty'])[0];
		let damageResult = {};
		let hpDamage = 0;
		let maxDamage = 15 * this._currentStats['totalAttack'];

		let hpDamagePercent = 0.20;
		let healPercent = 0.30;

		if (buffStack.source._voidLevel >= 4) {
			hpDamagePercent = 0.25;
			healPercent = 0.40;
		}

		for (const i in targets) {
			hpDamage = hpDamagePercent * (targets[i][1]._stats['totalHP'] - targets[i][1]._currentStats['totalHP']);
			maxDamage = 15 * this._currentStats['totalAttack'];
			if (hpDamage > maxDamage) { hpDamage = maxDamage; }

			damageResult = this.calcDamage(targets[i][1], hpDamage, 'passive', 'true');
			result += targets[i][1].takeDamage(this, 'Bloodthirsty', damageResult);

			const healAmount = this.calcHeal(this, healPercent * damageResult['damageAmount']);
			result += this.getHeal(this, healAmount);
		}

		return result;
	}


	eventRevengingWraith() {
		let result = '';

		for (const debuffStack of Object.values(this._debuffs['Revenging Wraith'])) {
			const targets = getAllTargets(this, this._allies);
			let hpDamagePercent = 0.30;
			if (debuffStack.source._voidLevel >= 3) hpDamagePercent = 0.35;

			for (const t of targets) {
				let damageAmount = Math.floor(t._stats.totalHP * hpDamagePercent);
				const maxDamage = debuffStack.effects.attackAmount * 25;
				if (damageAmount > maxDamage) damageAmount = maxDamage;

				const damageResult = debuffStack.source.calcDamage(t, damageAmount, 'passive', 'true');
				result += t.takeDamage(debuffStack.source, 'Revenging Wraith', damageResult);
			}
		}

		return result;
	}
}


function setTeamData(strAttMonsterName, strDefMonsterName, strAttFrame, strDefFrame) {
	attMonsterName = strAttMonsterName;
	defMonsterName = strDefMonsterName;
	attFrame = strAttFrame;
	defFrame = strDefFrame;
}


export { hero, setTeamData, voidPurpleNodes };