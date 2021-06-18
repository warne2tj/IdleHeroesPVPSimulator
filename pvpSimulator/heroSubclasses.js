import { hero } from './heroes.js';
import { triggerQueue, activeQueue, basicQueue } from './simulation.js';
import {
	random, formatNum, isDot, isMonster, isControlEffect, isDispellable, isAttribute, getMostSacredEmblemTargets,
	isFrontLine, isBackLine, getBackTargets, getHighestAttackTargets, getNearestTargets, getFrontTargets,
	getAllTargets, getHighestHPTargets, getLowestHPTargets, getLowestHPPercentTargets, getRandomTargets, getSanctionTargets, getHighestCritTargets,
	getUncontrolledEnemies
} from './utilityFunctions.js';


class StarWingJahra extends hero {
		handleTrigger(trigger) {
			let result = super.handleTrigger(trigger);

			if (['eventAllyActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
				result += this.eventAllyActive();
			} else if (trigger[1] == 'eventFreeze' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
				result += this.eventFreeze();
			} else if (trigger[1] == 'eventPetrify' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
				result += this.eventPetrify();
			}

			return result;
		}

		eventFreeze(){
			let healPerecent = 2;
			if (this._voidLevel >= 3){
				healPercent = 2.5;
			}
			let healAmount = this._currentStats['totalAttack'] * healPercent;
			healAmount = this.calcHeal(this, healAmount);
			result += this.getHeal(this, healAmount);
			let healthRestoreString = "<div><span class=\'skill\'>Apocalypse Vision</span> restored " + formatNum(healAmount) + "health.</div>";
			result += healthRestoreString;

		}

		eventPetrify(){
			let energyRestored = 10;
			if (this._voidLevel >= 3){
				energyRestored = 15;
			}
			result += this.getEnergy(this, energyRestored)
			result += '<div><span class=\'skill\'>Apocalypse Vision</span> restored energy.</div>';
		}

		eventAllyActive() {
			let result = '';
			let percentControlPrecision = 0.06;
			let percentControlImmunePen = 0.03;
			let energyAmount = 15

			if (this._voidLevel >= 2){
				percentControlPercision = 0.08;
				percentControlImmunePen = 0.04;
				energyAmount = 20;
			}

			result += this.getBuff(this, 'Focus', 126, { controlPrecision: percentControlPrecision, controlImmunePen: percentControlImmunePen })
			result += this.getEnergy(this, energyAmount);

			return result;
		}

		applyPetrifyFreeze(target, ccChance){
			if (target._currentStats['totalHP'] > 0){
				if (target._currentStats['totalHP'] >= (targets[i]._stats['totalHP'] / 2.0)) {
					result += target.getDebuff(this, 'Petrify - Rock Lock', 2, {}, false, '', ccChance);
				} else {
					result += target.getDebuff(this, 'Freeze - Cold Chill', 2, {}, false, '', ccChance);
				}
			}
		}

		doBasic() {
			let result = '';
			let damageResult = {};
			const targets = getLowestHPTargets(this, this._enemies, 1);
			const targets2 = getHighestAttackTargets(this, this._enemies, 1);

			let damagePercent = 8
			let percentHPDamage = 0.30
			let attackStealPercent = 0.30
			let hpDamage = 0

			if (this._voidLevel >= 1){
				damagePercent = 10
				percentHPDamage = 0.40
				attackStealPercent = 0.35
			}

			let targetLock;

			if (targets.length > 0) {
				targetLock = targets[0].getTargetLock(this);
				result += targetLock;

				if (targetLock == '') {

					hpDamage = hpDamagePercent * (targets[0]._stats['totalHP'] - targets[i]._currentStats['totalHP']);
					if (hpDamage > this._currentStats['totalAttack'] * 15) { hpDamage = this._currentStats['totalAttack'] * 15; }
					hpDamageResult = this.calcDamage(targets[0], hpDamage, 'active', 'true');
					result += targets[i].takeDamage(this, 'Astral Touch HP', hpDamageResult);


					if (targets[0]._currentStats['totalHP'] > 0) {
						damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
						result += targets[0].takeDamage(this, 'Basic Attack', damageResult);
					}


					basicQueue.push([this, targets[0], damageResult['damageAmount'], damageResult['critted']]);
				}
			}

			if (targets2.length > 0){
				if (targets2[0]._currentStats['totalHP'] > 0) {
					damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
					result += targets2[0].takeDamage(this, 'Basic Attack', damageResult);
				}

				if (targets2[0]._currentStats['totalHP'] > 0) {
					let stolenAttack = targets2[0]._currentStats['currentAttack'] * attackStealPercent;
					result += '<div><span class=\'skill\'>Astral Touch</span> stole target\'s attack.</div>';

					result += this.getBuff(this, 'Astral Touch', 2, { fixedAttack: stolenAttack });
					result += targets[0].getDebuff(this, 'Astral Touch', 2, { fixedAttack: stolenAttack });
				}
			}

			return result;
		}

		doActive() {
			let result = '';
			let damageResult = {};
			let targets = getAllTargets(this, this._enemies);
			let targetLock;

			let damagePercent = 16;
			let ccChance = 0.25;
			let overspillHeal = 0.03;
			if (this._voidLevel >= 4) {
				damagePercent = 20;
				ccChance = 0.3;
				overspillHeal = 0.04;
			}

			for (const i in targets) {
				targetLock = targets[i].getTargetLock(this);
				result += targetLock;

				if (targetLock == '') {
					damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
					result += targets[i].takeDamage(this, 'Star Stream', damageResult);

					this.applyPetrifyFreeze(targets[i], ccChance)

					activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
				}


			}

			if (this._currentStats['energy'] >= 150){
				let energyOverspill = this._currentStats['energy'] - 150;
				let healAmount = energyOverspill * this._stats['totalHP'] * overspillHeal;

				healAmount = this.calcHeal(this, healAmount);
				results += this.getHeal(this, healAmount)
				let healthRestoreString = "<div><span class=\'skill\'>Star Stream</span> restored " + formatNum(healAmount) + " health.</div>";
				result += healthRestoreString;

				targets = getUncontrolledEnemies(this, this._enemies, 6);
				for (const t of targets){
					this.applyPetrifyFreeze(targets[t], ccChance)
				}

			}

			this.removeBuff('Focus');

			return result;

		}

}

class Gloria extends hero {
	passiveStats(){
		if (this._voidLevel >= 1){
			this.applyStatChange({ hpPercent: 0.4, attackPercent: 0.2, controlImmune: 0.3, speed: 40}, 'PassiveStats')
		} else {
			this.applyStatChange({ hpPercent: 0.5, attackPercent: 0.3, controlImmune: 0.3, speed: 60}, 'PassiveStats')
		}
	}

	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);
		if (['eventEnemyActive', 'eventEnemyBasic'].includes(trigger[1]) && this._currentStats.totalHP > 0 && this.isNotSealed()) {
			result += this.eventEnemyActive();
		}

		return result;
	}

	eventEnemyActive(){
		const targets = getRandomTargets(this, this._enemies, 3);
		let markDamagePercent = 0.34
		if (this._voidLevel >= 3){
			markDamagePercent = 0.4
		}

		for (const i in targets){
			if (targets[i]._currentStats['totalHP'] > 0) {
				result += targets[i].getDebuff(this, 'Magic Bubble', 127, { attackAmount: this._currentStats['totalAttack'], damagePercent: markDamagePercent });
			}
		}
	}

	doBasic() {
		let result = '';
		let targets;
		let targetLock
		let numTargets = 1;
		let damagePercent = 3.6;
		let critReduce = 0.2;
		if (this._voidLevel >= 2) {
			damagePercent = 4.2;
			critReduce = 0.25;
		}

		for (let i = 1; i <= numTargets; i++) {
			targets = getHighestCritTargets(this, this._enemies, 1)
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
				result += targets[0].getDebuff(this, 'Raging Waves', 2, { crit: critReduce });
				result += targets[0].takeDamage(this, 'Basic Attack', damageResult);


				basicQueue.push([this, targets[0], damageResult['damageAmount'], damageResult['critted']]);

			}

		}

		return result;
	}

	doActive() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 4);
		let targetLock;

		let damagePercent = 6;
		let markDamagePercent = 1.2
		if (this._voidLevel >= 4) {
			damagePercent = 8;
			markDamagePercent = 1.44
		}
		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Rushing Waves', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					result += targets[i].getDebuff(this, 'Magic Bubble', 127, { attackAmount: this._currentStats['totalAttack'], damagePercent: markDamagePercent });
				}

				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}

	devouringMark(target, attackAmount, energyAmount) {
		let result = '';
		let damageResult = {};

		let damagePercent = 0.10;
		if (this._voidLevel >= 4) damagePercent = 0.14;


		// attack % per energy damage seems to be true damage
		damageResult = this.calcDamage(target, attackAmount * damagePercent * energyAmount, 'mark', 'energy');
		result = target.takeDamage(this, 'Devouring Mark', damageResult);

		if (target._currentStats['totalHP'] > 0) {
			result += '<div>Energy set to ' + formatNum(0) + '.</div>';
			target._currentStats['energy'] = 0;
		}

		return result;
	}

	magicBubble(target, attackAmount, damagePercent){
				let result = '';
				let damageResult = {};


	}

}
class Aida extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.5, holyDamage: 1.6, damageReduce: 0.3, speed: 100 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.4, holyDamage: 1.0, damageReduce: 0.3, speed: 80 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'balanceMark') {
			if (trigger[2]._currentStats['totalHP'] > 0) {
				result += this.balanceMark(trigger[2], trigger[3]);
			}
		}

		return result;
	}


	balanceMark(target, attackAmount) {
		let result = '';
		let hpDamagePercent = 0.25;
		if (this._voidLevel >= 4) hpDamagePercent = 0.30;
		let damageAmount = target._stats['totalHP'] * hpDamagePercent;

		if (damageAmount > attackAmount * 30) {
			damageAmount = attackAmount * 30;
		}

		const damageResult = this.calcDamage(target, damageAmount, 'mark', 'true');
		result += target.takeDamage(this, 'Balance Mark', damageResult);

		return result;
	}


	endOfRound() {
		let result = super.endOfRound();
		let healAmount = 0;
		let damageResult = {};
		const targets = getAllTargets(this, this._enemies);

		let damagePercent = 3;
		let healDebuff = 0.10;
		let healPercent = 0.15;

		if (this._voidLevel >= 3) {
			damagePercent = 4;
			healDebuff = 0.15;
			healPercent = 0.20;
		}

		for (const i in targets) {
			damageResult = this.calcDamage(this, targets[i]._currentStats['totalAttack'] * damagePercent, 'passive', 'true');
			result += targets[i].takeDamage(this, 'Final Verdict', damageResult);
			result += targets[i].getDebuff(this, 'Effect Being Healed', 127, { effectBeingHealed: healDebuff });
		}

		healAmount = this.calcHeal(this, this._stats['totalHP'] * healPercent);
		result += this.getHeal(this, healAmount);

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		let additionalDamageResult = { damageAmount: 0 };
		const targets = getHighestHPTargets(this, this._enemies, 1);
		let additionalDamage = 0;
		let healAmount = 0;
		let targetLock;

		let damagePercent = 1.2;
		let hpDamagePercent = 0.20;
		let healPercent = 0.35;

		if (this._voidLevel >= 2) {
			damagePercent = 1.6;
			hpDamagePercent = 0.25;
			healPercent = 0.40;
		}

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
				result = targets[i].takeDamage(this, 'Basic Attack', damageResult);


				if (targets[i]._currentStats['totalHP'] > 0) {
					additionalDamage = targets[i]._stats['totalHP'] * hpDamagePercent;
					if (additionalDamage > this._currentStats['totalAttack'] * 15) {
						additionalDamage = this._currentStats['totalAttack'] * 15;
					}

					additionalDamageResult = this.calcDamage(targets[i], additionalDamage, 'basic', 'true');
					result += targets[i].takeDamage(this, 'Fury of Justice', additionalDamageResult);
				}

				basicQueue.push([this, targets[i], damageResult['damageAmount'] + additionalDamageResult['damageAmount'], damageResult['critted']]);
			}
		}


		if (damageResult['damageAmount'] + additionalDamageResult['damageAmount'] > 0) {
			healAmount = this.calcHeal(this, (damageResult['damageAmount'] + additionalDamageResult['damageAmount']) * healPercent);
			result += this.getHeal(this, healAmount);
		}

		return result;

	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getRandomTargets(this, this._enemies, 4);
		let targetLock;

		let damagePercent = 2.68;
		if (this._voidLevel >= 4) damagePercent = 3.76;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent, 1, 0, 1, 0);
				result += targets[i].takeDamage(this, 'Order Restore', damageResult);
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		targets = getAllTargets(this, this._enemies);
		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				result += targets[i].getDebuff(this, 'Balance Mark', 3, { attackAmount: this._currentStats['totalAttack'] });
			}
		}

		return result;

	}
}


class AmenRa extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.3, attackPercent: 0.35, damageReduce: 0.25 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.2, attackPercent: 0.25, damageReduce: 0.25 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventAllyActive', 'eventSelfActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventAllyActive();
		}

		return result;
	}


	eventAllyActive() {
		let result = '';
		let damageResult = {};
		let targets;

		let damagePercent = 2;
		if (this._voidLevel >= 2) damagePercent = 3;

		for (let i = 1; i <= 3; i++) {
			targets = getRandomTargets(this, this._enemies, 1);

			if (targets.length > 0) {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'] * damagePercent, 'passive', 'normal');
				result += targets[0].takeDamage(this, 'Terrible Feast', damageResult);
			}
		}

		return result;
	}


	getDebuff(source, debuffName, duration, effects = {}, bypassControlImmune = false, damageSource = '', ccChance = 1, unstackable = false) {
		let result = '';

		if (isControlEffect(debuffName, effects)) {
			duration--;

			if (duration == 0) {
				result = '<div>' + this.heroDesc() + ' negated <span class=\'skill\'>' + debuffName + '</span> by reducing it\'s duration to ' + formatNum(0) + ' rouunds.</div>';
			} else {
				result = super.getDebuff(source, debuffName, duration, effects, bypassControlImmune, damageSource, ccChance, unstackable);
			}
		} else {
			result = super.getDebuff(source, debuffName, duration, effects, bypassControlImmune, damageSource, ccChance, unstackable);
		}

		return result;
	}


	doBasic() {
		let result = '';
		let targets;

		let numTargets = 2;
		if (this._voidLevel >= 3) numTargets = 3;

		result = super.doBasic();

		for (let i = 1; i <= numTargets; i++) {
			targets = getRandomTargets(this, this._enemies, 1);

			if (targets.length > 0) {
				result += targets[0].getDebuff(this, 'Healing Curse', 127);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getFrontTargets(this, this._enemies);
		let targetLock;

		let damagePercent = 2;
		let petrifyChance = 0.70;
		let extraShieldChance = 0;

		if (this._voidLevel >= 4) {
			damagePercent = 4;
			petrifyChance = 0.80;
			extraShieldChance = 0.30;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Shadow Defense', damageResult);
				result += targets[i].getDebuff(this, 'petrify', 2, {}, false, '', petrifyChance);
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		targets = getAllTargets(this, this._allies);
		for (const i in targets) {
			result += targets[i].getBuff(this, 'Guardian Shadow', 127, {});
			result += targets[i].getBuff(this, 'Guardian Shadow', 127, {});
			if (random() < extraShieldChance) result += targets[i].getBuff(this, 'Guardian Shadow', 127, {});
		}

		return result;
	}
}


class Amuvor extends hero {
	passiveStats() {
		this.applyStatChange({ hpPercent: 0.3, speed: 60, attackPercent: 0.3, petrifyImmune: 1 }, 'PassiveStats');
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventAllyActive', 'eventSelfActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventAllyActive();
		}

		return result;
	}


	eventAllyActive() {
		let result = '';

		result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Energy Oblivion</span> triggered.</div>';

		const healAmount = this.calcHeal(this, this._currentStats['totalAttack'] * 2);
		result += this.getHeal(this, healAmount);
		result += this.getEnergy(this, 35);

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getLowestHPTargets(this, this._enemies, 1);
		let targetLock;

		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'] * 1.8, 'basic', 'normal');
				result += targets[0].takeDamage(this, 'Basic Attack', damageResult);

				if (targets[0]._currentStats['totalHP'] > 0) {
					result += '<div><span class=\'skill\'>Arcane Imprisonment</span> drained target\'s energy.</div>';
					result += targets[0].loseEnergy(this, 50);
				}

				basicQueue.push([this, targets[0], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let hpDamage = 0;
		let hpDamageResult = { damageAmount: 0 };
		let priestDamageResult = { damageAmount: 0 };
		const targets = getRandomTargets(this, this._enemies, 2);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 3.5);
				result = targets[i].takeDamage(this, 'Scarlet Contract', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					hpDamage = targets[i]._stats['totalHP'] * 0.21;
					if (hpDamage > this._currentStats['totalAttack'] * 15) {
						hpDamage = this._currentStats['totalAttack'] * 15;
					}

					hpDamageResult = this.calcDamage(targets[i], hpDamage, 'active', 'true');
					result += targets[i].takeDamage(this, 'Scarlet Contract HP', hpDamageResult);
				}

				if (targets[i]._currentStats['totalHP'] > 0 && targets[i]._heroClass == 'Priest') {
					priestDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 1.7);
					result += targets[i].takeDamage(this, 'Scarlet Contract Priest', priestDamageResult);
				}

				result += targets[i].getDebuff(this, 'Effect Being Healed', 2, { effectBeingHealed: 0.3 });
				activeQueue.push([this, targets[i], damageResult['damageAmount'] + hpDamageResult['damageAmount'] + priestDamageResult['damageAmount'], damageResult['critted'] || priestDamageResult['critted']]);
			}
		}

		result += this.getBuff(this, 'Crit', 3, { crit: 0.4 });

		return result;

	}
}


class Aspen extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.50, attackPercent: 0.30, crit: 0.35, armorBreak: 0.65 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.40, attackPercent: 0.20, crit: 0.35, armorBreak: 0.50 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventSelfBasic', 'eventSelfActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic();
		} else if (trigger[1] == 'enemyHorrified' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.enemyHorrified();
		}

		return result;
	}


	enemyHorrified() {
		let result = '';
		let healPercent = 1.5;
		let controlImmuneGained = 0.20;
		let damageReduceGained = 0.06;

		if (this._voidLevel >= 3) {
			healPercent = 2;
			controlImmuneGained = 0.25;
			damageReduceGained = 0.07;
		}


		const healAmount = this.calcHeal(this, this._currentStats['totalAttack'] * healPercent);
		result += this.getHeal(this, healAmount);
		result += this.getBuff(this, 'Shield', 127, { controlImmune: controlImmuneGained, damageReduce: damageReduceGained });
		return result;
	}


	eventSelfBasic() {
		let result = '';
		let attackPercentGained = 0.15;
		let critDamageGained = 0.15;
		let controlImmuneGained = 0.20;
		let damageReduceGained = 0.06;

		if (this._voidLevel >= 3) {
			attackPercentGained = 0.20;
			critDamageGained = 0.20;
			controlImmuneGained = 0.25;
			damageReduceGained = 0.07;
		}


		result += this.getBuff(this, 'Attack Percent', 127, { attackPercent: attackPercentGained });
		result += this.getBuff(this, 'Crit Damage', 127, { critDamage: critDamageGained });
		result += this.getBuff(this, 'Shield', 127, { controlImmune: controlImmuneGained, damageReduce: damageReduceGained });
		return result;
	}


	getBuff(source, buffName, duration, effects = {}, unstackable = false) {
		if ('Shield' in this._buffs && buffName == 'Shield') {
			if (Object.keys(this._buffs['Shield']).length < 5) {
				return super.getBuff(source, buffName, duration, effects, unstackable);
			} else {
				return '';
			}
		} else {
			return super.getBuff(source, buffName, duration, effects, unstackable);
		}
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		let hpDamage = 0;
		let maxDamage = 0;
		let hpDamageResult = { damageAmount: 0 };
		let additionalDamage = 0;
		let additionalDamageResult = { damageAmount: 0 };
		const targets = getLowestHPTargets(this, this._enemies, 1);
		let targetLock;

		let damagePercent = 2;
		let hpDamagePercent = 0.15;
		let hpThreshholdPercent = 0.35;
		let additionalDamagePercent = 1.6;

		if (this._voidLevel >= 2) {
			damagePercent = 4;
			hpDamagePercent = 0.20;
			hpThreshholdPercent = 0.40;
			additionalDamagePercent = 2;
		}


		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
				result += targets[0].takeDamage(this, 'Basic Attack', damageResult);

				if (targets[0]._currentStats['totalHP'] > 0) {
					hpDamage = hpDamagePercent * (targets[0]._stats['totalHP'] - targets[0]._currentStats['totalHP']);
					maxDamage = 15 * this._currentStats['totalAttack'];
					if (hpDamage > maxDamage) { hpDamage = maxDamage; }

					hpDamageResult = this.calcDamage(targets[0], hpDamage, 'basic', 'true');
					result += targets[0].takeDamage(this, 'Rage of Shadow HP', hpDamageResult);
				}

				if (targets[0]._currentStats['totalHP'] > 0) {
					result += targets[0].getDebuff(this, 'Horrify', 2);

					if (targets[0]._currentStats['totalHP'] > 0 && (targets[0]._currentStats['totalHP'] / targets[0]._stats['totalHP']) < hpThreshholdPercent) {
						additionalDamage = additionalDamagePercent * (damageResult['damageAmount'] + hpDamageResult['damageAmount']);
						additionalDamageResult = this.calcDamage(targets[0], additionalDamage, 'basic', 'true');
						result += targets[0].takeDamage(this, 'Rage of Shadow Below 35%', additionalDamageResult);

						const healAmount = this.calcHeal(this, additionalDamageResult['damageAmount']);
						result += this.getHeal(this, healAmount);
					}
				}

				basicQueue.push([this, targets[0], damageResult['damageAmount'] + hpDamageResult['damageAmount'] + additionalDamageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let hpDamage = 0;
		let maxDamage = 0;
		let hpDamageResult = { damageAmount: 0 };
		let additionalDamage = 0;
		let additionalDamageResult = { damageAmount: 0 };
		const targets = getRandomTargets(this, this._enemies, 4);
		let targetLock;
		let damageDealt = 0;

		let damagePercent = 2.6;
		let hpDamagePercent = 0.20;
		let horrifyChance = 0.50;
		let hpThreshholdPercent = 0.35;
		let additionalDamagePercent = 2.2;

		if (this._voidLevel >= 4) {
			damagePercent = 5.2;
			hpDamagePercent = 0.25;
			horrifyChance = 0.60;
			hpThreshholdPercent = 0.40;
			additionalDamagePercent = 2.5;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Dread\'s Coming', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					hpDamage = hpDamagePercent * targets[i]._currentStats['totalHP'];
					maxDamage = 15 * this._currentStats['totalAttack'];
					if (hpDamage > maxDamage) { hpDamage = maxDamage; }

					hpDamageResult = this.calcDamage(targets[i], hpDamage, 'active', 'true');
					result += targets[i].takeDamage(this, 'Dread\'s Coming HP', hpDamageResult);
				}

				if (targets[i]._currentStats['totalHP'] > 0) {
					result += targets[i].getDebuff(this, 'Horrify', 2, {}, false, '', horrifyChance);

					if (targets[i]._currentStats['totalHP'] > 0 && (targets[i]._currentStats['totalHP'] / targets[i]._stats['totalHP']) < hpThreshholdPercent) {
						additionalDamage = additionalDamagePercent * (damageResult['damageAmount'] + hpDamageResult['damageAmount']);

						additionalDamageResult = this.calcDamage(targets[i], additionalDamage, 'active', 'true');
						result += targets[i].takeDamage(this, 'Dread\'s Coming Below 35%', additionalDamageResult);

						damageDealt += additionalDamageResult['damageAmount'];
					}
				}

				activeQueue.push([this, targets[i], damageResult['damageAmount'] + hpDamageResult['damageAmount'] + additionalDamageResult['damageAmount'], damageResult['critted']]);
			}
		}


		if (damageDealt > 0) {
			const healAmount = this.calcHeal(this, damageDealt);
			result += this.getHeal(this, healAmount);
		}

		return result;
	}
}


class Belrain extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.40, attackPercent: 0.55, controlImmune: 0.30, healEffect: 0.50 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.30, attackPercent: 0.45, controlImmune: 0.30, healEffect: 0.40 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic();
		} else if (trigger[1] == 'eventSelfDied') {
			result += this.eventSelfDied();
		}

		return result;
	}


	eventSelfBasic() {
		let result = '';
		let healAmount;
		const targets = getLowestHPTargets(this, this._allies, 3);

		let healPercent = 2.5;
		if (this._voidLevel >= 2) healPercent = 5;


		for (const i in targets) {
			healAmount = this.calcHeal(targets[i], this._currentStats['totalAttack'] * healPercent);
			result += targets[i].getBuff(this, 'Heal', 2, { heal: healAmount });
		}

		return result;
	}


	eventSelfDied() {
		let result = '';
		const targets = getAllTargets(this, this._allies);
		let healAmount;

		let healPercent = 4;
		if (this._voidLevel >= 3) healPercent = 8;


		for (const i in targets) {
			healAmount = this.calcHeal(targets[i], this._currentStats['totalAttack'] * healPercent);
			result += targets[i].getBuff(this, 'Heal', 4, { heal: healAmount });
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getRandomTargets(this, this._enemies, 4);
		let targetLock;

		let damagePercent = 1.82;
		let attackPercentGained = 0.30;
		let speedGained = 30;
		let effectBeingHealedGained = 0.20;
		let dispelChance = 0.40;

		if (this._voidLevel >= 4) {
			damagePercent = 3.6;
			attackPercentGained = 0.40;
			speedGained = 40;
			effectBeingHealedGained = 0.30;
			dispelChance = 0.50;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Holylight Sparkle', damageResult);
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		targets = getRandomTargets(this, this._allies, 4);
		for (const i in targets) {
			result += targets[i].getBuff(this, 'Attack Percent', 3, { attackPercent: attackPercentGained });
			result += targets[i].getBuff(this, 'Speed', 3, { speed: speedGained });
			result += targets[i].getBuff(this, 'Effect Being Healed', 3, { effectBeingHealed: effectBeingHealedGained });

			if (random() < dispelChance) {
				for (const d in this._debuffs) {
					if (isControlEffect(d)) {
						result += this.removeDebuff(d);
					}
				}
			}
		}

		return result;
	}
}


class Carrie extends hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		super(sHeroName, iHeroPos, attOrDef);
		this._stats['revive'] = 1;
		this._stats['spiritPowerStacks'] = 0;
	}


	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.35, controlImmune: 0.3, speed: 80, dodge: 0.40 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.25, controlImmune: 0.3, speed: 60, dodge: 0.40 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if ((trigger[1] == 'eventAllyDied' || trigger[1] == 'eventEnemyDied') && this._currentStats['totalHP'] <= 0) {
			result += this.eventAllyDied();
		} else if (trigger[1] == 'devouringMark') {
			if (trigger[2]._currentStats['totalHP'] > 0) {
				result += this.devouringMark(trigger[2], trigger[3], trigger[4]);
			}
		}

		return result;
	}


	devouringMark(target, attackAmount, energyAmount) {
		let result = '';
		let damageResult = {};

		let damagePercent = 0.10;
		if (this._voidLevel >= 4) damagePercent = 0.14;


		// attack % per energy damage seems to be true damage
		damageResult = this.calcDamage(target, attackAmount * damagePercent * energyAmount, 'mark', 'energy');
		result = target.takeDamage(this, 'Devouring Mark', damageResult);

		if (target._currentStats['totalHP'] > 0) {
			result += '<div>Energy set to ' + formatNum(0) + '.</div>';
			target._currentStats['energy'] = 0;
		}

		return result;
	}


	eventAllyDied() {
		this._currentStats['spiritPowerStacks'] += 1;
		return '';
	}


	endOfRound() {
		let result = super.endOfRound();

		if (this._currentStats['totalHP'] <= 0) {
			let damageResult = {};
			const targets = getLowestHPTargets(this, this._enemies, 1);
			const maxDamage = 15 * this._currentStats['totalAttack'];

			if (targets.length > 0) {
				let damageAmount = 0.5 * (targets[0]._stats['totalHP'] - targets[0]._currentStats['totalHP']);

				if (damageAmount > maxDamage) {
					damageAmount = maxDamage;
				}

				damageResult = this.calcDamage(targets[0], damageAmount, 'passive', 'true');
				result += targets[0].takeDamage(this, 'Shadowy Spirit', damageResult);
			}


			let reviveEnergy = 100;
			let extraPowerChance = 0;

			if (this._voidLevel >= 3) {
				reviveEnergy = 150;
				extraPowerChance = 0.30;
			}

			this._currentStats['spiritPowerStacks'] += 1;
			if (random() < extraPowerChance) this._currentStats['spiritPowerStacks'] += 1;

			if (this._currentStats['spiritPowerStacks'] >= 4) {
				for (const b in this._buffs) {
					this.removeBuff(b);
				}

				for (const d in this._debuffs) {
					this.removeDebuff(d);
				}

				this._currentStats['spiritPowerStacks'] = 0;
				this._currentStats['totalHP'] = this._stats['totalHP'];
				this._currentStats['energy'] = reviveEnergy;
				result += '<div>' + this.heroDesc() + ' has revived with full health and energy.</div>';
			}
		}

		return result;
	}


	takeDamage(source, strAttackDesc, damageResult) {
		let result = '';
		result = super.takeDamage(source, strAttackDesc, damageResult);

		if (this._currentStats['totalHP'] <= 0 && damageResult['damageSource'] != 'passive') {
			this._currentStats['spiritPowerStacks'] = 0;
			result += '<div>' + this.heroDesc() + ' became a <span class=\'skill\'>Shadowy Spirit</span>.</div>';
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		let additionalDamageResult = { damageAmount: 0 };
		const targets = getRandomTargets(this, this._enemies, 1);
		let targetLock;

		let damagePercent = 1.56;
		let outburstPercent = 0.06;

		if (this._voidLevel >= 2) {
			damagePercent = 2.4;
			outburstPercent = 0.08;
		}


		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
				result = targets[0].takeDamage(this, 'Basic Attack', damageResult);

				// attack % per energy damage seems to be true damage
				if (targets[0]._currentStats['totalHP'] > 0) {
					const additionalDamageAmount = this._currentStats['totalAttack'] * outburstPercent * (targets[0]._currentStats['energy'] + 50);
					additionalDamageResult = this.calcDamage(targets[0], additionalDamageAmount, 'basic', 'energy');
					result += targets[0].takeDamage(this, 'Outburst of Magic', additionalDamageResult);
				}

				if (targets[0]._currentStats['totalHP'] > 0) {
					result += targets[0].getEnergy(this, 50);
					targets[0]._currentStats['energy'] = 0;
					result += '<div>' + targets[0].heroDesc() + ' energy set to ' + formatNum(0) + '.</div>';
				}

				basicQueue.push([this, targets[0], damageResult['damageAmount'] + additionalDamageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let additionalDamageResult = { damageAmount: 0 };
		const targets = getRandomTargets(this, this._enemies, 4);
		let targetLock;

		let damagePercent = 2.2;
		let energyDamagePercent = 0.06;

		if (this._voidLevel >= 4) {
			damagePercent = 2.2;
			energyDamagePercent = 0.06;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Energy Devouring', damageResult);

				// attack % per energy damage seems to be true damage
				if (targets[i]._currentStats['totalHP'] > 0) {
					const additionalDamageAmount = this._currentStats['totalAttack'] * energyDamagePercent * targets[i]._currentStats['energy'];
					additionalDamageResult = this.calcDamage(targets[i], additionalDamageAmount, 'active', 'energy');
					result += targets[i].takeDamage(this, 'Energy Oscillation', additionalDamageResult);
				}

				if (targets[i]._currentStats['totalHP'] > 0 && random() < 0.7) {
					result += targets[i].getDebuff(this, 'Devouring Mark', 127, { attackAmount: this._currentStats['totalAttack'] });
				}

				activeQueue.push([this, targets[i], damageResult['damageAmount'] + additionalDamageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}
}


class Cthugha extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.35, hpPercent: 0.30, damageReduce: 0.20 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.25, hpPercent: 0.20, damageReduce: 0.20 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventTookDamage' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			let dotPercent = 0.50;
			if (this._voidLevel >= 2) dotPercent = 0.70;

			let burnDamageResult = {};
			let bleedDamageResult = {};
			const targets = getRandomTargets(this, this._enemies, 3);

			for (const i in targets) {
				burnDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * dotPercent, 'passive', 'burn', 1, 1, 3);
				bleedDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * dotPercent, 'passive', 'bleed', 1, 1, 3);

				result += targets[i].getDebuff(this, 'Burn', 3, { burn: burnDamageResult['damageAmount'] }, false, 'passive');
				result += targets[i].getDebuff(this, 'Bleed', 3, { bleed: bleedDamageResult['damageAmount'] }, false, 'passive');
			}

		} else if (trigger[1] == 'eventTookDamageFromBurning' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			let attackPercentGained = 0.10;
			if (this._voidLevel >= 3) attackPercentGained = 0.15;

			result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Soul Shackle</span> triggered.</div>';
			result += this.getBuff(this, 'Attack Percent', 3, { attackPercent: attackPercentGained });

		} else if (trigger[1] == 'eventTookDamageFromBleeding' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			let healPercent = 0.60;
			if (this._voidLevel >= 3) healPercent = 0.70;

			result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Soul Shackle</span> triggered.</div>';
			const healAmount = this.calcHeal(this, this._currentStats['totalAttack'] * healPercent);
			result += this.getBuff(this, 'Heal', 3, { heal: healAmount });

		}

		return result;
	}


	takeDamage(source, strAttackDesc, damageResult) {
		let result = '';

		if (!(isMonster(source)) && ['burn', 'bleed', 'burnTrue', 'bleedTrue'].includes(damageResult['damageType'])) {
			damageResult['damageAmount'] = 0;
		}

		result = super.takeDamage(source, strAttackDesc, damageResult);

		if (damageResult['damageSource'] == 'active' || damageResult['damageSource'] == 'basic') {
			triggerQueue.push([this, 'eventTookDamage']);

			if (!(isMonster(source))) {
				if (source.hasStatus('Burn') || source.hasStatus('Burn True')) {
					triggerQueue.push([this, 'eventTookDamageFromBurning']);
				}

				if (source.hasStatus('Bleed') || source.hasStatus('Bleed True')) {
					triggerQueue.push([this, 'eventTookDamageFromBleeding']);
				}
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let detonateDamage = 0;
		let detonateDamageResult = { damageAmount: 0 };
		const targets = getRandomTargets(this, this._enemies, 3);
		let isBleedOrBurn = false;
		let targetLock;

		let damagePercent = 2.36;
		let detonatePercent = 1.2;

		if (this._voidLevel >= 4) {
			damagePercent = 4.72;
			detonatePercent = 1.5;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Terror Blade', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					detonateDamage = 0;

					for (const d in targets[i]._debuffs) {
						for (const s in targets[i]._debuffs[d]) {
							isBleedOrBurn = false;

							for (const e in targets[i]._debuffs[d][s]['effects']) {
								if (['bleed', 'burn'].includes(e)) {
									isBleedOrBurn = true;
									detonateDamage += (targets[i]._debuffs[d][s]['duration'] - 1) * targets[i]._debuffs[d][s]['effects'][e];
								}
							}

							if (isBleedOrBurn) {
								result += targets[i].removeDebuff(d, s);
							}
						}
					}

					if (detonateDamage > 0) {
						detonateDamage *= detonatePercent;
						if (detonateDamage > this._currentStats['totalAttack'] * 20) {
							detonateDamage = this._currentStats['totalAttack'] * 20;
						}

						detonateDamageResult = this.calcDamage(targets[i], detonateDamage, 'active', 'true');
						result += targets[i].takeDamage(this, 'Terror Blade Detonate', detonateDamageResult);
					}
				}

				activeQueue.push([this, targets[i], damageResult['damageAmount'] + detonateDamageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}
}


class DarkArthindol extends hero {
	passiveStats() {
		this.applyStatChange({ skillDamage: 1.0, hpPercent: 0.4, speed: 60 }, 'PassiveStats');
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfBasic' && trigger[2].length > 0 && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			if (trigger[2][0][1]._currentStats['totalHP'] > 0) {
				result += this.eventSelfBasic(trigger[2][0][1]);
			}
		} else if (trigger[1] == 'eventTookDamage' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.getBuff(this, 'Attack Percent', 6, { attackPercent: 0.03 });
			result += this.getBuff(this, 'Skill Damage', 6, { skillDamage: 0.05 });
			result += this.getEnergy(this, 10);
		}

		return result;
	}


	eventSelfBasic(target) {
		let result = '';
		result += '<div><span class=\'skill\'>Petrify</span> drained target\'s energy.</div>';
		result += target.loseEnergy(this, 50);
		result += target.getDebuff(this, 'petrify', 1);
		return result;
	}


	takeDamage(source, strAttackDesc, damageResult) {
		let result = '';
		const preHP = this._currentStats['totalHP'];

		result += super.takeDamage(source, strAttackDesc, damageResult);

		const postHP = this._currentStats['totalHP'];

		if (this.isNotSealed() && (preHP - postHP) / this._stats['totalHP'] >= 0.03) {
			triggerQueue.push([this, 'eventTookDamage']);
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		const targets = getAllTargets(this, this._enemies);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 0.98);
				result += targets[i].takeDamage(this, 'Chaotic Shade', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					result += targets[i].getDebuff(this, 'petrify', 2, {}, false, '', 0.30);

					if (random() < 0.3) {
						result += '<div><span class=\'skill\'>Chaotic Shade</span> drained target\'s energy.</div>';
						result += targets[i].loseEnergy(this, 30);
					}
				}

				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		result += this.getBuff(this, 'Damage Reduce', 2, { damageReduce: 0.4 });

		return result;
	}
}


class Delacium extends hero {
	passiveStats() {
		// apply Extreme Rage passive
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.50, hpPercent: 0.40, crit: 0.35, controlImmune: 0.30, speed: 80 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.40, hpPercent: 0.30, crit: 0.35, controlImmune: 0.30, speed: 60 }, 'PassiveStats');
		}
	}

	endOfRound() {
		let result = super.endOfRound();
		let targets = [];
		let maxTargets = 3;
		let maxToCopy = 3;
		let maxStacks = 3;
		let copyFrom = [];
		let copyTo = [];

		if (this._voidLevel >= 3) maxToCopy = 4;


		for (const i in this._enemies) {
			if (Object.keys(this._enemies[i]._debuffs).length > 0) {
				copyFrom.push(this._enemies[i]);
			}
		}

		copyFrom = getRandomTargets(this, copyFrom, 1);
		if (copyFrom.length > 0) {
			for (const i in this._enemies) {
				if (this._enemies[i].heroDesc() != copyFrom[0].heroDesc()) {
					copyTo.push(this._enemies[i]);
				}
			}

			copyTo = getRandomTargets(this, copyTo, 2);
			targets = copyFrom.concat(copyTo);
		}


		if (targets.length > 0 && this._currentStats['totalHP'] > 0) {
			const validDebuffs = [];
			let effects;

			for (const d in targets[0]._debuffs) {
				// Delacium does not copy Mihm's dot
				if (d != 'Dot') {
					effects = Object.values(targets[0]._debuffs[d])[0]['effects'];

					if (isDot(d, effects) || isAttribute(d)) {
						validDebuffs.push([d, targets[0]._debuffs[d], random()]);
					}
				}
			}

			if (validDebuffs.length < maxToCopy) { maxToCopy = validDebuffs.length; }
			if (targets.length < maxTargets) { maxTargets = targets.length; }

			validDebuffs.sort(function(a, b) {
				if (a[2] > b[2]) {
					return 1;
				} else {
					return -1;
				}
			});

			if (targets.length > 1 && maxToCopy > 0) {
				result += '<p><div>' + this.heroDesc() + ' <span class=\'skill\'>Transmissive Seed</span> triggered. Copying dots and attribute reduction debuffs.</div>';

				for (let h = 1; h < maxTargets; h++) {
					for (let d = 0; d < maxToCopy; d++) {
						const stackKeys = Object.keys(validDebuffs[d][1]);
						maxStacks = 3;
						if (stackKeys.length < maxStacks) { maxStacks = stackKeys.length; }

						for (let s = 0; s < maxStacks; s++) {
							result += targets[h].getDebuff(validDebuffs[d][1][stackKeys[s]]['source'], validDebuffs[d][0], validDebuffs[d][1][stackKeys[s]]['duration'], validDebuffs[d][1][stackKeys[s]]['effects']);
						}
					}
				}

				result += '</p>';
			}
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		let additionalDamage = 0;
		let additionalDamageResult = {};
		const targets = getRandomTargets(this, this._enemies, 3);
		let targetLock;

		let damagePercent = 2.5;
		if (this._voidLevel >= 2) damagePercent = 3.5;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
				result += targets[i].takeDamage(this, 'Basic Attack', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					additionalDamage = this._currentStats['totalAttack'] * damagePercent * (1 + Object.keys(targets[i]._debuffs).length);
					additionalDamageResult = this.calcDamage(targets[i], additionalDamage, 'basic', 'normal', 1, 0);
					result += targets[i].takeDamage(this, 'Durative Weakness', additionalDamageResult);
				}

				basicQueue.push([this, targets[i], damageResult['damageAmount'] + additionalDamageResult['damageAmount'], damageResult['critted'] || additionalDamageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let additionalDamage = 0;
		let additionalDamageResult = {};
		const targets = getRandomTargets(this, this._enemies, 4);
		let targetLock;

		let damagePercent = 4;
		if (this._voidLevel >= 4) damagePercent = 7;


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Ray of Delacium', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					additionalDamage = damagePercent * (1 + Object.keys(targets[i]._debuffs).length);
					additionalDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', additionalDamage, 0);
					result += targets[i].takeDamage(this, 'Ray of Delacium 2', additionalDamageResult);
				}

				if (targets[i]._currentStats['totalHP'] > 0 && random() < 0.7) {
					for (const b in targets[i]._debuffs) {
						for (const s in targets[i]._debuffs[b]) {
							if (isDot(b, targets[i]._debuffs[b][s]['effects']) || isAttribute(b, targets[i]._debuffs[b][s]['effects']) || isControlEffect(b, targets[i]._debuffs[b][s]['effects'])) {
								targets[i]._debuffs[b][s]['duration'] += 2;
								result += '<div><span class=\'skill\'>Ray of Delacium</span> extended duration of Debuff <span class=\'skill\'>' + b + '</span>.</div>';
							}
						}
					}
				}

				activeQueue.push([this, targets[i], damageResult['damageAmount'] + additionalDamageResult['damageAmount'], damageResult['critted'] || additionalDamageResult['critted']]);
			}
		}

		return result;
	}
}


class Elyvia extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.40, attackPercent: 0.35, effectBeingHealed: 0.40 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.30, attackPercent: 0.25, effectBeingHealed: 0.30 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic();
		} else if (['eventEnemyActive', 'eventEnemyBasic'].includes(trigger[1])) {
			result += this.eventEnemyBasic(trigger[2], trigger[3]);
		}

		return result;
	}


	eventSelfBasic() {
		let result = '';
		const targets = getRandomTargets(this, this._enemies, 1);

		let allDamageTakenGained = -0.30;
		let allDamageDealtLost = 0.50;

		if (this._voidLevel >= 2) {
			allDamageTakenGained = -0.40;
			allDamageDealtLost = 0.60;
		}

		if (targets.length > 0) {
			result += targets[0].getDebuff(this, 'Shrink', 2, { allDamageTaken: allDamageTakenGained, allDamageDealt: allDamageDealtLost }, false, '', 1, true);
		}

		return result;
	}


	eventEnemyBasic(source, e) {
		let result = '';
		let damagePercent = 3;
		let healPercent = 1.5;

		if (this._voidLevel >= 3) {
			damagePercent = 4;
			healPercent = 2;
		}


		for (const i in e) {
			if ('Fairy\'s Guard' in e[i][1]._buffs) {
				const damageResult = e[i][1].calcDamage(source, e[i][1]._currentStats['totalAttack'] * damagePercent, 'passive', 'normal', 1, 1, 0, 1, 0);
				result += source.takeDamage(e[i][1], 'Fairy\'s Guard', damageResult);

				const healAmount = e[i][1].calcHeal(e[i][1], e[i][1]._currentStats['totalAttack'] * healPercent);
				result += e[i][1].getHeal(e[i][1], healAmount);
			}
		}

		return result;
	}


	endOfRound() {
		let result = super.endOfRound();

		if (this._currentStats['totalHP'] > 0) {
			let targets = getRandomTargets(this, this._enemies);
			let speedDiff = 0;

			for (const i in targets) {
				if (targets[i]._currentStats['speed'] > this._currentStats['speed']) {
					result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Exchange, Not Steal!</span> swapped speed with ' + targets[i].heroDesc() + '.</div>';

					speedDiff = targets[i]._currentStats['speed'] - this._currentStats['speed'];
					result += this.getBuff(this, 'Exchange, Not Steal!', 1, { speed: speedDiff });
					result += targets[i].getDebuff(this, 'Exchange, Not Steal!', 1, { speed: speedDiff });

					break;
				}
			}


			targets = getRandomTargets(this, this._allies, 1);
			if (targets.length > 0) {
				result += targets[0].getBuff(this, 'Fairy\'s Guard', 2, {}, true);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getRandomTargets(this, this._enemies, 1);
		let targetLock;

		let allDamageTakenGained = -0.30;
		let allDamageDealtLost = 0.50;
		let damagePercent = 4;

		if (this._voidLevel >= 4) damagePercent = 8;

		if (this._voidLevel >= 2) {
			allDamageTakenGained = -0.40;
			allDamageDealtLost = 0.60;
		}


		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[0].takeDamage(this, 'You Miss Lilliput?!', damageResult);
				result += targets[0].getDebuff(this, 'Shrink', 2, { allDamageTaken: allDamageTakenGained, allDamageDealt: allDamageDealtLost }, false, '', 1, true);
			}
		}

		targets = getRandomTargets(this, this._allies, 3);
		for (const i in targets) {
			result += targets[i].getBuff(this, 'Fairy\'s Guard', 2, {}, true);
		}

		return result;
	}
}


class Emily extends hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		super(sHeroName, iHeroPos, attOrDef);
		this._stats['courageousTriggered'] = 0;
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventHPlte50' && this._currentStats['courageousTriggered'] == 0 && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			this._currentStats['courageousTriggered'] = 1;
			result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Courageous</span> triggered.</div>';

			let targets = getAllTargets(this, this._allies);
			for (const h in targets) {
				result += targets[h].getBuff(this, 'Attack Percent', 3, { attackPercent: 0.29 });
			}

			targets = getAllTargets(this, this._enemies);
			for (const h in targets) {
				result += targets[h].getDebuff(this, 'Armor Percent', 3, { armorPercent: 0.29 });
			}
		}

		return result;
	}


	passiveStats() {
		this.applyStatChange({ hpPercent: 0.40, speed: 50 }, 'PassiveStats');
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 3);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * 0.8, 'basic', 'normal');
				result += targets[i].takeDamage(this, 'Element Fission', damageResult);
				result += targets[i].getDebuff(this, 'Crit', 3, { crit: 0.20 });
				basicQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getAllTargets(this, this._enemies);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 1.16);
				result += targets[i].takeDamage(this, 'Nether Nightmare', damageResult);
				result += targets[i].getDebuff(this, 'Precision', 3, { precision: 0.40 });
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		targets = getAllTargets(this, this._allies);
		for (const i in targets) {
			result += targets[i].getBuff(this, 'Speed', 3, { speed: 30 });
			result += targets[i].getBuff(this, 'Attack Percent', 3, { attackPercent: 0.20 });
		}

		return result;
	}
}


class Garuda extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.35, hpPercent: 0.40, critDamage: 0.40, controlImmune: 0.30 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.25, hpPercent: 0.30, critDamage: 0.40, controlImmune: 0.30 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventAllyBasic', 'eventAllyActive'].includes(trigger[1]) && !(this.isUnderStandardControl()) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventAllyBasic(trigger[3]);
		} else if (['eventSelfBasic', 'eventSelfActive'].includes(trigger[1]) && !(this.isUnderStandardControl()) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventAllyBasic(trigger[2]);
		} else if (['eventAllyDied', 'eventEnemyDied'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventAllyDied();
		}

		return result;
	}


	eventAllyBasic(e) {
		let result = '';
		let damageResult = {};
		let damagePercent = 2.5;
		let critGained = 0.05;
		let damageReduceGained = 0.04;

		if (this._voidLevel >= 2) {
			damagePercent = 3.6;
			critGained = 0.06;
			damageReduceGained = 0.05;
		}

		result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Instinct of Hunt</span> passive triggered.</div>';

		for (const i in e) {
			if (e[i][1]._currentStats['totalHP'] > 0) {
				damageResult = this.calcDamage(e[i][1], this._currentStats['totalAttack'] * damagePercent, 'passive', 'normal');
				result += e[i][1].takeDamage(this, 'Instinct of Hunt', damageResult);
			}
		}

		result += this.getBuff(this, 'Feather Blade', 127, { damageReduce: damageReduceGained });
		result += this.getBuff(this, 'Crit', 2, { crit: critGained });

		return result;
	}


	eventAllyDied() {
		let result = '';
		let healPercent = 0.30;
		let damageReduceGained = 0.04;

		if (this._voidLevel >= 2) damageReduceGained = 0.05;
		if (this._voidLevel >= 3) healPercent = 0.35;


		result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Unbeatable Force</span> passive triggered.</div>';

		const healAmount = this.calcHeal(this, this._stats['totalHP'] * healPercent);
		result += this.getHeal(this, healAmount);
		result += this.getBuff(this, 'Feather Blade', 127, { damageReduce: damageReduceGained });
		result += this.getBuff(this, 'Feather Blade', 127, { damageReduce: damageReduceGained });

		if (this._voidLevel >= 3) {
			result += this.getBuff(this, 'Feather Blade', 127, { damageReduce: damageReduceGained });
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 3);
		let targetLock;

		let damagePercent = 4.8;
		let featherDamagePercent = 3.2;

		if (this._voidLevel >= 4) {
			damagePercent = 7.2;
			featherDamagePercent = 4.8;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Fatal Feather', damageResult);
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}


		let featherTarget;
		if ('Feather Blade' in this._buffs) {
			const numBlades = Object.keys(this._buffs['Feather Blade']);

			// eslint-disable-next-line no-unused-vars
			for (const i in numBlades) {
				featherTarget = getRandomTargets(this, targets, 1);

				if (featherTarget.length > 0) {
					targetLock = targets[0].getTargetLock(this);
					result += targetLock;

					if (targetLock == '') {
						damageResult = this.calcDamage(featherTarget[0], this._currentStats['totalAttack'], 'active', 'normal', featherDamagePercent);
						result += featherTarget[0].takeDamage(this, 'Feather Blade', damageResult);
					}
				}
			}

			result += this.removeBuff('Feather Blade');
		}

		return result;
	}
}


class FaithBlade extends hero {
	passiveStats() {
		if (this._voidLevel >= 3) {
			this.applyStatChange({ holyDamage: 0.90, speed: 80, crit: 0.30, stunImmune: 1 }, 'PassiveStats');
		} else {
			this.applyStatChange({ holyDamage: 0.70, speed: 60, crit: 0.30, stunImmune: 1 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventEnemyDied' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyDied();
		}

		return result;
	}


	eventEnemyDied() {
		let result = '';
		let energyGained = 100;
		let holyDamageGained = 0.30;

		if (this._voidLevel >= 2) {
			energyGained = 120;
			holyDamageGained = 0.40;
		}


		result += this.getEnergy(this, energyGained);
		result += this.getBuff(this, 'Holy Damage', 3, { holyDamage: holyDamageGained });
		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getLowestHPTargets(this, this._enemies, 1);
		let targetLock;

		let damagePercent = 2;
		if (this._voidLevel >= 1) damagePercent = 4;


		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal', 1, 1, 0, 1, 0);
				result += targets[0].takeDamage(this, 'Basic Attack', damageResult);
				basicQueue.push([this, targets[0], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let additionalDamageResult = { damageAmount: 0, critted: false };
		let hpDamage = 0;
		let hpDamageResult = { damageAmount: 0 };
		const targets = getLowestHPTargets(this, this._enemies, 2);
		let targetLock;

		let damagePercent = 3;
		let additionalDamagePercent = 1.08;
		let hpDamagePercent = 0.20;

		if (this._voidLevel >= 4) {
			damagePercent = 6;
			additionalDamagePercent = 2.2;
			hpDamagePercent = 0.25;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				result += targets[i].getDebuff(this, 'stun', 2);

				hpDamage = hpDamagePercent * (targets[i]._stats['totalHP'] - targets[i]._currentStats['totalHP']);
				if (hpDamage > this._currentStats['totalAttack'] * 15) { hpDamage = this._currentStats['totalAttack'] * 15; }
				hpDamageResult = this.calcDamage(targets[i], hpDamage, 'active', 'true');
				result += targets[i].takeDamage(this, 'Blade Assault HP', hpDamageResult);


				if (targets[i]._currentStats['totalHP'] > 0) {
					damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
					result += targets[i].takeDamage(this, 'Blade Assault', damageResult);
				}

				if (targets[i]._currentStats['totalHP'] > 0) {
					additionalDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', additionalDamagePercent, 1, 0, 1, 0);
					result += targets[i].takeDamage(this, 'Blade Assault 2', additionalDamageResult);
				}

				activeQueue.push([this, targets[i], damageResult['damageAmount'] + additionalDamageResult['damageAmount'] + hpDamageResult['damageAmount'], damageResult['critted'] || additionalDamageResult['critted']]);
			}
		}

		return result;
	}
}


class Gustin extends hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		super(sHeroName, iHeroPos, attOrDef);
		this._stats['linkCount'] = 0;
		this._stats['reflectAmount'] = 0;
		this._stats['demonTotemStacks'] = 0;
	}

	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.35, speed: 40, controlImmune: 0.30, effectBeingHealed: 0.40 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.25, speed: 30, controlImmune: 0.30, effectBeingHealed: 0.30 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventEnemyBasic', 'eventEnemyActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyBasic(trigger[3]);
		} else if (trigger[1] == 'eventTookDamage' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventTookDamage();
		}

		return result;
	}


	startOfBattle() {
		const targets = getRandomTargets(this, this._enemies, 1);
		const result = targets[0].getDebuff(this, 'Link of Souls', 127);
		return result;
	}


	eventTookDamage() {
		let result = '';
		const targets = getAllTargets(this, this._enemies);

		if (this._currentStats['linkCount'] < 5) {
			for (const i in targets) {
				if ('Link of Souls' in targets[i]._debuffs) {
					for (const s in targets[i]._debuffs['Link of Souls']) {
						if (targets[i]._debuffs['Link of Souls'][s]['source'].heroDesc() == this.heroDesc()) {
							const damageResult = this.calcDamage(targets[i], this._currentStats['reflectAmount'], 'passive', 'true');
							result += targets[i].takeDamage(this, 'Link of Souls', damageResult);

							this._currentStats['linkCount']++;
							this._currentStats['reflectAmount'] = 0;
							break;
						}
					}
				}
			}
		}

		return result;
	}


	endOfRound() {
		let result = super.endOfRound();
		let targets = [];
		let energyLost = 30;
		let healPercent = 0.25;
		let totemStacks = 4;

		if (this._voidLevel >= 2) energyLost = 40;
		if (this._voidLevel >= 4) {
			healPercent = 0.30;
			totemStacks = 5;
		}


		if ('Demon Totem' in this._buffs) {
			targets = getLowestHPTargets(this, this._allies, 1);
			if (targets.length > 0) {
				const healAmount = this.calcHeal(this, healPercent * targets[0]._stats['totalHP']);
				result += targets[0].getHeal(this, healAmount);
			}

			this._currentStats.demonTotemStacks = totemStacks;
		}


		if (random() < 0.5 && this._currentStats['totalHP'] > 0) {
			targets = getRandomTargets(this, this._enemies, 2);
			for (const i in targets) {
				result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Cloak of Fog</span> drained ' + targets[i].heroDesc() + ' energy.</div>';
				result += targets[i].loseEnergy(this, energyLost);
			}
		}


		let linked = false;
		targets = getRandomTargets(this, this._enemies);

		if (targets.length > 0) {
			for (const i in targets) {
				if ('Link of Souls' in targets[i]._debuffs) { linked = true; }
			}

			if (!(linked)) {
				result += targets[0].getDebuff(this, 'Link of Souls', 127);
			}
		}

		this._currentStats['linkCount'] = 0;

		return result;
	}


	eventEnemyBasic(e) {
		let result = '';
		let dispelChance = 0.60;
		if (this._voidLevel >= 4) dispelChance = 0.70;

		if ('Demon Totem' in this._buffs) {
			for (const i in e) {
				if (this._currentStats['demonTotemStacks'] > 0 && random() < dispelChance) {
					this._currentStats['demonTotemStacks']--;
					result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Demon Totem</span> triggered dispell.</div>';

					const listDebuffs = [];
					const allDebuffs = Object.keys(e[i][1]._debuffs);
					let maxDispell = 2;

					for (const d in allDebuffs) {
						if (isDispellable(d)) {
							listDebuffs.push([allDebuffs[d], random()]);
						}
					}

					listDebuffs.sort(function(a, b) {
						if (a[1] < b[1]) {
							return true;
						} else {
							return false;
						}
					});

					if (listDebuffs.length < maxDispell) { maxDispell = listDebuffs.length; }

					for (let d = 0; d < maxDispell; d++) {
						result += e[i][1].removeDebuff(listDebuffs[d][0]);
					}
				}
			}
		}

		return result;
	}


	takeDamage(source, strAttackDesc, damageResult) {
		let result = '';
		const preHP = this._currentStats['totalHP'];
		let reflectPercent = 0.70;
		if (this._voidLevel >= 3) reflectPercent = 0.80;

		result += super.takeDamage(source, strAttackDesc, damageResult);

		const postHP = this._currentStats['totalHP'];
		const damageAmount = reflectPercent * (preHP - postHP);

		if (damageAmount > 0 && !(isMonster(source))) {
			this._currentStats['reflectAmount'] += damageAmount;
			triggerQueue.push([this, 'eventTookDamage']);
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 2);
		let buffRemoved;
		let targetLock;

		let damagePercent = 2;
		let dispelChance = 0.60;
		let totemStacks = 4;

		if (this._voidLevel >= 4) {
			damagePercent = 5;
			dispelChance = 0.80;
			totemStacks = 5;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Demon Totem', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0 && random() < dispelChance) {
					buffRemoved = false;

					for (const b in targets[i]._buffs) {
						if (isDispellable(b)) {
							for (const s in targets[i]._buffs[b]) {
								if (isAttribute(b, targets[i]._buffs[b][s]['effects'])) {
									result += targets[i].removeBuff(b, s);
									buffRemoved = true;
									break;
								}
							}
						}

						if (buffRemoved) { break; }
					}
				}

				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		result += this.getBuff(this, 'Demon Totem', 3, {}, false);
		this._currentStats['demonTotemStacks'] = totemStacks;

		return result;
	}
}


class Horus extends hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		super(sHeroName, iHeroPos, attOrDef);
		this._stats['blockCount'] = 0;
	}


	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.50, attackPercent: 0.40, armorBreak: 0.50, block: 0.70 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.40, attackPercent: 0.30, armorBreak: 0.40, block: 0.60 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventEnemyActive', 'eventAllyActive', 'eventSelfActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyActive();
		} else if (trigger[1] == 'eventTookDamage' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventTookDamage();
		}

		return result;
	}


	eventTookDamage() {
		let result = '';
		let hpDamagePercent = 0.20;
		let healPercent = 0.40;

		if (this._voidLevel >= 3) {
			hpDamagePercent = 0.25;
			healPercent = 0.50;
		}


		if (this._currentStats['blockCount'] >= 3) {
			this._currentStats['blockCount'] = 0;

			for (const d in this._debuffs) {
				if (isControlEffect(d)) {
					result += this.removeDebuff(d);
				}
			}


			let damageAmount = this._stats['totalHP'] * hpDamagePercent;
			const maxDamage = this._currentStats['totalAttack'] * 25;
			if (damageAmount > maxDamage) { damageAmount = maxDamage; }

			const targets = getRandomTargets(this, this._enemies, 3);
			let totalDamage = 0;

			for (const i in targets) {
				const damageResult = this.calcDamage(targets[i], damageAmount, 'passive', 'true');
				result += targets[i].takeDamage(this, 'Crimson Contract', damageResult);
				totalDamage += damageResult['damageAmount'];
			}


			const healAmount = this.calcHeal(this, totalDamage * healPercent);
			result += this.getHeal(this, healAmount);
		}

		return result;
	}


	eventEnemyActive() {
		let result = '';
		let attackPercentGained = 0.05;
		let critDamageGained = 0.02;

		if (this._voidLevel >= 2) {
			attackPercentGained = 0.06;
			critDamageGained = 0.03;
		}

		result += this.getBuff(this, 'Attack Percent', 127, { attackPercent: attackPercentGained });
		result += this.getBuff(this, 'Crit Damage', 127, { critDamage: critDamageGained });
		return result;
	}


	takeDamage(source, strAttackDesc, damageResult) {
		const result = super.takeDamage(source, strAttackDesc, damageResult);

		if (damageResult['blocked'] == true) {
			this._currentStats['blockCount']++;
			triggerQueue.push([this, 'eventTookDamage']);
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let bleedDamageResult = {};
		let hpDamage = 0;
		let hpDamageResult = { damageAmount: 0 };
		let additionalDamageResult = { damageAmount: 0, critted: false };
		const targets = getRandomTargets(this, this._enemies, 3);
		let targetLock;

		let damagePercent = 2.06;
		let bleedPercent = 1;
		let hpDamagePercent = 0.15;
		let critDamagePercent = 1.08;

		if (this._voidLevel >= 4) {
			damagePercent = 6;
			bleedPercent = 3;
			hpDamagePercent = 0.20;
			critDamagePercent = 3;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Torment of Flesh and Soul', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					bleedDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'bleed', bleedPercent, 3);
					result += targets[i].getDebuff(this, 'Bleed', 3, { bleed: bleedDamageResult['damageAmount'] }, false, 'active');
				}

				if (targets[i]._currentStats['totalHP'] > 0 && isFrontLine(targets[i], this._enemies)) {
					hpDamage = targets[i]._stats['totalHP'] * hpDamagePercent;
					const maxDamage = this._currentStats['totalAttack'] * 15;
					if (hpDamage > maxDamage) { hpDamage = maxDamage; }

					hpDamageResult = this.calcDamage(targets[i], hpDamage, 'active', 'true');
					result += targets[i].takeDamage(this, 'Torment of Flesh and Soul Front Line', hpDamageResult);
				}

				if (targets[i]._currentStats['totalHP'] > 0 && isBackLine(targets[i], this._enemies)) {
					additionalDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', critDamagePercent, 2);
					result += targets[i].takeDamage(this, 'Torment of Flesh and Soul Back Line', additionalDamageResult);
				}

				activeQueue.push([this, targets[i], damageResult['damageAmount'] + hpDamageResult['damageAmount'] + additionalDamageResult['damageAmount'], damageResult['critted'] || additionalDamageResult['critted']]);
			}
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getFrontTargets(this, this._enemies);
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
}


class Ithaqua extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.45, crit: 0.35, critDamage: 0.5, speed: 80, controlImmune: 0.3 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.35, crit: 0.35, critDamage: 0.5, speed: 60, controlImmune: 0.3 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventSelfBasic', 'eventSelfActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfActive(trigger[2]);
		} else if (trigger[1] == 'eventEnemyDied' && trigger[2].heroDesc() == this.heroDesc() && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyDied();
		}

		return result;
	}


	eventEnemyDied() {
		let result = '';
		const targets = getRandomTargets(this, this._enemies, 1);

		let debuffDuration = 3;
		if (this._voidLevel >= 2) debuffDuration = 4;

		if (targets.length > 0) {
			result += targets[0].getDebuff(this, 'Ghost Possessed', debuffDuration, {}, false, '', 1, true);
		}

		result += this.getBuff(this, 'Armor Break', debuffDuration, { armorBreak: 1.0 });
		return result;
	}


	eventSelfActive(e) {
		let result = '';
		let damageResult = {};

		let dotPercent = 0.50;
		if (this._voidLevel >= 2) dotPercent = 0.60;


		for (const i in e) {
			if (e[i][1]._currentStats['totalHP'] > 0) {
				damageResult = this.calcDamage(e[i][1], e[i][2] * dotPercent, 'passive', 'poisonTrue', 1, 1, 2);
				result += e[i][1].getDebuff(this, 'Poison True', 2, { poisonTrue: damageResult['damageAmount'] }, false, 'passive');

				if (e[i][1]._currentStats['totalHP'] > 0 && e[i][3] == true) {
					damageResult = this.calcDamage(e[i][1], e[i][2] * dotPercent, 'passive', 'bleedTrue', 1, 1, 2);
					result += e[i][1].getDebuff(this, 'Bleed True', 2, { bleedTrue: damageResult['damageAmount'] }, false, 'passive');
				}
			}
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		let targets = this._enemies;
		let healAmount = 0;
		let targetLock;
		const alreadyTargeted = {};

		let damagePercent = 1.8;
		let healPercent = 1;
		if (this._voidLevel >= 3) damagePercent = 2.4;
		if (this._voidLevel >= 4) healPercent = 1.5;


		for (const i in targets) {
			if (targets[i]._currentStats['totalHP'] > 0) {
				targetLock = targets[i].getTargetLock(this);
				result += targetLock;

				if (targetLock == '') {
					if ('Ghost Possessed' in this._enemies[i]._debuffs) {
						damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
						result += targets[i].takeDamage(this, 'GP - Basic Attack', damageResult);
						alreadyTargeted[targets[i]._heroPos] = [this, targets[i], damageResult['damageAmount'], damageResult['critted']];

						healAmount = this.calcHeal(this, damageResult['damageAmount'] * healPercent);
						result += this.getHeal(this, healAmount);
					}
				}
			}
		}


		targets = getLowestHPTargets(this, this._enemies, 1);
		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
				result += targets[0].takeDamage(this, 'Basic Attack', damageResult);
				result += targets[0].getDebuff(this, 'Ghost Possessed', 3, {}, false, '', 1, true);

				if (targets[0]._heroPos in alreadyTargeted) {
					alreadyTargeted[targets[0]._heroPos][2] += damageResult['damageAmount'];
					alreadyTargeted[targets[0]._heroPos][3] = alreadyTargeted[targets[0]._heroPos][3] || damageResult['critted'];
				} else {
					alreadyTargeted[targets[0]._heroPos] = [this, targets[0], damageResult['damageAmount'], damageResult['critted']];
				}
			}
		}


		for (const i in alreadyTargeted) {
			basicQueue.push(alreadyTargeted[i]);
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getAllTargets(this, this._enemies);
		let healAmount = 0;
		let hpDamage = 0;
		let hpDamageResult = { damageAmount: 0 };
		let targetLock;
		const alreadyTargeted = {};

		let damagePercent = 4.4;
		let hpDamagePercent = 0.10;
		let healPercent = 1;

		if (this._voidLevel >= 4) {
			damagePercent = 8;
			hpDamagePercent = 0.12;
			healPercent = 1.5;
		}


		for (const i in targets) {
			if ('Ghost Possessed' in targets[i]._debuffs) {
				targetLock = targets[i].getTargetLock(this);
				result += targetLock;

				if (targetLock == '') {
					damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
					result += targets[i].takeDamage(this, 'GP - Ghost Possession', damageResult);

					if (targets[i]._currentStats['totalHP'] > 0) {
						hpDamage = targets[i]._stats['totalHP'] * hpDamagePercent;
						if (hpDamage > this._currentStats['totalAttack'] * 15) { hpDamage = this._currentStats['totalAttack'] * 15; }
						hpDamageResult = this.calcDamage(targets[i], hpDamage, 'active', 'true');
						result += targets[i].takeDamage(this, 'GP - Ghost Possession HP', hpDamageResult);
					}

					healAmount = this.calcHeal(this, (damageResult['damageAmount'] + hpDamageResult['damageAmount']) * healPercent);
					result += this.getHeal(this, healAmount);

					alreadyTargeted[targets[i]._heroPos] = [this, targets[i], damageResult['damageAmount'] + hpDamageResult['damageAmount'], damageResult['critted']];
				}
			}
		}


		targets = getLowestHPTargets(this, this._enemies, 1);
		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[0].takeDamage(this, 'Ghost Possession', damageResult);

				if (targets[0]._currentStats['totalHP'] > 0) {
					hpDamage = targets[0]._stats['totalHP'] * hpDamagePercent;
					if (hpDamage > this._currentStats['totalAttack'] * 15) { hpDamage = this._currentStats['totalAttack'] * 15; }
					hpDamageResult = this.calcDamage(targets[0], hpDamage, 'active', 'true');
					result += targets[0].takeDamage(this, 'Ghost Possession HP', hpDamageResult);
				}

				result += targets[0].getDebuff(this, 'Ghost Possessed', 3, {}, false, '', 1, true);


				if (targets[0]._heroPos in alreadyTargeted) {
					alreadyTargeted[targets[0]._heroPos][2] += damageResult['damageAmount'] + hpDamageResult['damageAmount'];
					alreadyTargeted[targets[0]._heroPos][3] = alreadyTargeted[targets[0]._heroPos][3] || damageResult['critted'];
				} else {
					alreadyTargeted[targets[0]._heroPos] = [this, targets[0], damageResult['damageAmount'], damageResult['critted']];
				}
			}
		}


		for (const i in alreadyTargeted) {
			activeQueue.push(alreadyTargeted[i]);
		}

		return result;
	}
}


class Kroos extends hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		super(sHeroName, iHeroPos, attOrDef);
		this._stats['flameInvasionTriggered'] = 0;
	}


	passiveStats() {
		this.applyStatChange({ hpPercent: 0.30, speed: 60, damageReduce: 0.20 }, 'PassiveStats');
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventHPlte50' && this._currentStats['flameInvasionTriggered'] == 0 && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			this._currentStats['flameInvasionTriggered'] = 1;
			result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Flame Invasion</span> triggered.</div>';

			const targets = getAllTargets(this, this._enemies);
			for (const h in targets) {
				result += targets[h].getDebuff(this, 'stun', 2, {}, false, '', 0.75);
			}
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		let targets = getBackTargets(this, this._enemies);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * 0.90, 'basic', 'normal');
				result += targets[i].takeDamage(this, 'Vicious Fire Perfusion', damageResult);
				result += targets[i].getDebuff(this, 'Armor Percent', 3, { armorPercent: 0.15 });
				basicQueue.push([this, targets[0], damageResult['damageAmount'], damageResult['critted']]);
			}
		}


		let healAmount = 0;
		targets = getRandomTargets(this, this._allies, 2);
		for (const i in targets) {
			healAmount = this.calcHeal(targets[i], targets[i]._stats['totalHP'] * 0.20);
			result += targets[i].getHeal(this, healAmount);
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getRandomTargets(this, this._enemies, 4);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 1.5);
				result += targets[i].takeDamage(this, 'Weak Curse', damageResult);
				result += targets[i].getDebuff(this, 'Weak Curse', 3, { allDamageTaken: -0.50 }, false, '', 1, true);

				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		targets = getRandomTargets(this, this._allies, 1);
		if (targets.length > 0) {
			result += targets[0].getEnergy(this, 100);
		}

		return result;
	}
}


class Michelle extends hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		super(sHeroName, iHeroPos, attOrDef);
		this._stats['revive'] = 1;
	}


	passiveStats() {
		this.applyStatChange({ controlImmune: 1.0, holyDamage: 0.60, attackPercent: 0.30, speed: 40 }, 'PassiveStats');
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventAllyActive', 'eventAllyBasic'].includes(trigger[1]) && 'Blaze of Seraph' in trigger[2]._buffs) {
			result += this.eventAllyBasic(trigger[2], trigger[3]);
		} else if (['eventSelfBasic', 'eventSelfActive'].includes(trigger[1]) && 'Blaze of Seraph' in this._buffs) {
			result += this.eventAllyBasic(this, trigger[2]);
		}

		return result;
	}


	endOfRound() {
		let result = super.endOfRound();

		if (this._currentStats['totalHP'] <= 0 && this._currentStats['revive'] == 1) {
			for (const b in this._buffs) {
				this.removeBuff(b);
			}

			for (const d in this._debuffs) {
				this.removeDebuff(d);
			}

			this._currentStats['revive'] = 0;
			this._currentStats['totalHP'] = this._stats['totalHP'];
			this._currentStats['energy'] = 100;
			result += '<div>' + this.heroDesc() + ' has revived with full health and energy.</div>';
			result += this.getBuff(this, 'Blaze of Seraph', 2, { attackAmount: this._currentStats['totalAttack'] }, true);
		}

		return result;
	}


	eventAllyBasic(source, e) {
		let result = '';
		const firstKey = Object.keys(source._buffs['Blaze of Seraph'])[0];
		const maxAmount = 5 * source._buffs['Blaze of Seraph'][firstKey]['effects']['attackAmount'];

		for (const i in e) {
			let damageAmount = e[i][1]._stats['totalHP'] * 0.06;
			if (damageAmount > maxAmount) {
				damageAmount = maxAmount;
			}

			const damageResult = this.calcDamage(e[i][1], damageAmount, 'passive', 'burnTrue', 1, 1, 2);
			result += e[i][1].getDebuff(this, 'Burn True', 2, { burnTrue: damageResult['damageAmount'] }, false, 'passive');
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getFrontTargets(this, this._enemies);
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
		let targets = getRandomTargets(this, this._enemies, 4);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 1.98);
				result += targets[i].takeDamage(this, 'Divine Sanction', damageResult);
				result += targets[i].getDebuff(this, 'stun', 2, {}, false, '', 0.40);
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		targets = getLowestHPPercentTargets(this, this._allies, 1);
		if (targets.length > 0) {
			const healAmount = this.calcHeal(targets[0], this._currentStats['totalAttack'] * 10);
			result += targets[0].getHeal(this, healAmount);
		}

		targets = getRandomTargets(this, this._allies, 1);
		if (targets.length > 0) {
			result += targets[0].getBuff(this, 'Blaze of Seraph', 3, { attackAmount: this._currentStats['totalAttack'] }, true);
		}

		return result;
	}
}


class Mihm extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.50, damageReduce: 0.30, speed: 80, controlImmune: 1.0 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.40, damageReduce: 0.30, speed: 60, controlImmune: 1.0 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventAllyDied', 'eventEnemyDied'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyDied();
		}

		return result;
	}


	eventEnemyDied() {
		let result = '';
		const targets = getAllTargets(this, this._enemies);

		let damagePercent = 2;
		if (this._voidLevel >= 3) damagePercent = 3;


		for (const i in targets) {
			const damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * damagePercent, 'passive', 'dot', 1, 1, 1);
			result += targets[i].getDebuff(this, 'Dot', 2, { dot: damageResult['damageAmount'] }, false, 'passive');
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getLowestHPTargets(this, this._enemies, 1);
		let targetLock;

		let damagePercent = 1.4;
		let energyReduced = 60;

		if (this._voidLevel >= 2) {
			damagePercent = 3;
			energyReduced = 80;
		}


		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
				result += targets[0].takeDamage(this, 'Energy Absorbing', damageResult);
				result += targets[0].loseEnergy(this, energyReduced);
				basicQueue.push([this, targets[0], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 1);
		let targetLock;

		let damagePercent = 4;
		let armorLost = 0.75;
		let attackPercentLost = 0.30;
		let speedLost = 80;

		if (this._voidLevel >= 4) {
			damagePercent = 6;
			armorLost = 1;
			attackPercentLost = 0.40;
			speedLost = 100;
		}


		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[0].takeDamage(this, 'Collapse Rays', damageResult);

				if (targets[0]._currentStats['totalHP'] > 0 && isFrontLine(targets[0], this._enemies)) {
					result += targets[0].getDebuff(this, 'Armor Percent', 3, { armorPercent: armorLost });
					result += targets[0].getDebuff(this, 'petrify', 2);
				}

				if (targets[0]._currentStats['totalHP'] > 0 && isBackLine(targets[0], this._enemies)) {
					result += targets[0].getDebuff(this, 'Attack Percent', 3, { attackPercent: attackPercentLost });
					result += targets[0].getDebuff(this, 'Speed', 3, { speed: speedLost });
				}

				activeQueue.push([this, targets[0], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}
}


class Nakia extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.45, crit: 0.35, controlImmune: 0.30, speed: 40, damageAgainstBleed: 1 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.35, crit: 0.35, controlImmune: 0.30, speed: 30, damageAgainstBleed: 0.80 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfActive' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfActive(trigger[2]);
		} else if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic(trigger[2]);
		}

		return result;
	}


	eventSelfBasic(e) {
		let result = '';
		let damageResult;
		const targets = getBackTargets(this, this._enemies);

		let bleedPercent = 1;
		let speedLost = 30;

		if (this._voidLevel >= 2) {
			bleedPercent = 2.5;
			speedLost = 40;
		}


		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * bleedPercent, 'passive', 'bleed', 1, 1, 3);
			result += targets[i].getDebuff(this, 'Bleed', 3, { bleed: damageResult['damageAmount'] }, false, 'passive');
			result += targets[i].getDebuff(this, 'Speed', 3, { speed: speedLost });
		}

		result += this.eventSelfActive(e);

		return result;
	}


	eventSelfActive(e) {
		let result = '';
		let damageResult;
		const targets = getAllTargets(this, this._enemies);
		let didCrit = false;

		let bleedPercent = 1;
		if (this._voidLevel >= 3) bleedPercent = 2.5;


		for (const i in e) {
			if (e[i][3] == true) { didCrit = true; }
		}

		for (const i in targets) {
			if ('Bleed' in targets[i]._debuffs) {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * bleedPercent, 'passive', 'bleed', 1, 1, 3);
				result += targets[i].getDebuff(this, 'Bleed', 3, { bleed: damageResult['damageAmount'] }, false, 'passive');

				if (didCrit) {
					result += targets[i].getDebuff(this, 'Bleed', 3, { bleed: damageResult['damageAmount'] }, false, 'passive');
				}
			}
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getLowestHPTargets(this, this._enemies, 1);
		let targetLock;

		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'], 'basic', 'normal');
				result += targets[0].takeDamage(this, 'Basic Attack', damageResult);
				basicQueue.push([this, targets[0], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let bleedDamageResult = { damageAmount: 0 };
		let targetLock;

		let targets = getBackTargets(this, this._enemies);
		targets = getRandomTargets(this, targets, 2);

		let damagePercent = 2.3;
		let bleedPercent = 1.98;

		if (this._voidLevel >= 4) {
			damagePercent = 5.75;
			bleedPercent = 5;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Ferocious Bite', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					bleedDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'bleed', bleedPercent, 1, 15);
					result += targets[i].getDebuff(this, 'Bleed', 15, { bleed: bleedDamageResult['damageAmount'] }, false, 'active');
				}

				if ('Speed' in targets[i]._debuffs && targets[i]._currentStats['totalHP'] > 0) {
					result += targets[i].getDebuff(this, 'Bleed', 15, { bleed: bleedDamageResult['damageAmount'] }, false, 'active');
				}

				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}
}


class Oberon extends hero {
	passiveStats() {
		this.applyStatChange({ attackPercent: 0.3, hpPercent: 0.35, speed: 40, effectBeingHealed: 0.3 }, 'PassiveStats');
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic();
		} else if (trigger[1] == 'eventTwine' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventTwine();
		}

		return result;
	}


	eventSelfBasic() {
		let result = '';
		const targets = getRandomTargets(this, this._enemies, 1);

		if (targets.length > 0) {
			result += targets[0].getDebuff(this, 'Sow Seeds', 1, { rounds: 1 });
		}

		return result;
	}


	eventTwine() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 3);

		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * 2, 'passive', 'poison', 1, 1, 3);
			result += targets[i].getDebuff(this, 'Poison', 3, { poison: damageResult['damageAmount'] }, false, 'passive');
		}


		const healAmount = this.calcHeal(this, this._currentStats['totalAttack'] * 1.8);
		result += this.getHeal(this, healAmount);
		result += this.getBuff(this, 'Attack Percent', 6, { attackPercent: 0.20 });

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 3);
		let targetLock;

		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'], 'active', 'normal', 1.85);
				result += targets[0].takeDamage(this, 'Lethal Twining', damageResult);
				result += targets[0].getDebuff(this, 'twine', 2);
				activeQueue.push([this, targets[0], damageResult['damageAmount'], damageResult['critted']]);
			}
		}


		if (targets.length > 1) {
			targetLock = targets[1].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[1], this._currentStats['totalAttack'], 'active', 'normal', 2.25);
				result += targets[1].takeDamage(this, 'Lethal Twining', damageResult);
				result += targets[1].getDebuff(this, 'Sow Seeds', 1, { rounds: 2 });
				activeQueue.push([this, targets[1], damageResult['damageAmount'], damageResult['critted']]);
			}
		}


		if (targets.length > 2) {
			targetLock = targets[2].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[2], this._currentStats['totalAttack'], 'active', 'normal', 2.65);
				result += targets[2].takeDamage(this, 'Lethal Twining', damageResult);
				result += targets[2].getDebuff(this, 'Sow Seeds', 2, { rounds: 2 });
				activeQueue.push([this, targets[2], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}
}


class Penny extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.40, hpPercent: 0.35, crit: 0.30, precision: 1.2 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.30, hpPercent: 0.25, crit: 0.30, precision: 1 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventSelfBasic', 'eventSelfActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic(trigger[2]);
		} else if (trigger[1] == 'eventTookDamage' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventTookDamage(trigger[2], trigger[3]);
		}

		return result;
	}


	eventTookDamage(target, damageAmount) {
		let result = '';
		result += '<div><span class=\'skill\'>Reflection Armor</span> consumed.</div>';
		const reflectDamageResult = this.calcDamage(target, damageAmount, 'passive', 'true');
		result += target.takeDamage(this, 'Reflection Armor', reflectDamageResult);
		return result;
	}


	eventSelfBasic(e) {
		let result = '';
		let didCrit = false;
		let damageDone = 0;

		let damagePercent = 1;
		if (this._voidLevel >= 3) damagePercent = 1.2;


		for (const i in e) {
			if (e[i][3] == true) {
				didCrit = true;
				damageDone += e[i][2];
			}
		}

		if (didCrit && damageDone > 0) {
			let damageResult = {};
			const targets = getAllTargets(this, this._enemies);

			result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Eerie Trickery</span> triggered on crit.</div>';

			for (const h in targets) {
				if (targets[h]._currentStats['totalHP'] > 0) {
					damageResult = this.calcDamage(targets[h], damageDone * damagePercent, 'passive', 'true');
					result += targets[h].takeDamage(this, 'Eerie Trickery', damageResult);
				}
			}

			result += this.getBuff(this, 'Dynamite Armor', 127, {});
			result += this.getBuff(this, 'Reflection Armor', 127, {});
		}

		return result;
	}


	takeDamage(source, strAttackDesc, damageResult) {
		let result = '';
		let tempDamageAmount = damageResult['damageAmount'];
		let offsetAmount = 0.50;

		if (this._voidLevel >= 2) offsetAmount = 0.60;


		if (['active', 'active', 'basic', 'basic'].includes(damageResult['damageSource']) && 'Reflection Armor' in this._buffs && !('Guardian Shadow' in this._buffs) && this.isNotSealed()) {
			damageResult['damageAmount'] = Math.floor(damageResult['damageAmount'] * (1 - offsetAmount));

			result += super.takeDamage(source, strAttackDesc, damageResult);

			tempDamageAmount = Math.floor(tempDamageAmount * offsetAmount);
			this._currentStats['damageHealed'] += tempDamageAmount;
			triggerQueue.push([this, 'eventTookDamage', source, tempDamageAmount]);

			const armorKeys = Object.keys(this._buffs['Reflection Armor']);
			result += this.removeBuff('Reflection Armor', armorKeys[0]);

		} else {
			result += super.takeDamage(source, strAttackDesc, damageResult);
		}

		return result;
	}


	getDebuff(source, debuffName, duration, effects = {}, bypassControlImmune = false, damageSource = 'passive', ccChance = 1, unstackable = false) {
		let result = '';
		const isControl = isControlEffect(debuffName, effects);


		if ('Dynamite Armor' in this._buffs && isControl && this.isNotSealed()) {
			let controlImmune = this._currentStats['controlImmune'];
			let rollCCHit;
			let rollCCPen;

			if (isControl) {
				if ((debuffName + 'Immune') in this._currentStats) {
					controlImmune = 1 - (1 - controlImmune) * (1 - this._currentStats[debuffName + 'Immune']);
				}

				ccChance = 1 - (1 - ccChance * (1 + source._currentStats['controlPrecision']));
				rollCCHit = random();
				rollCCPen = random();


				if (isControl && rollCCHit >= ccChance) {
					// failed CC roll
				} else if (isControl && rollCCPen < controlImmune && !(bypassControlImmune)) {
					result += '<div>' + this.heroDesc() + ' resisted debuff <span class=\'skill\'>' + debuffName + '</span>.</div>';
				} else if (
					isControl &&
          (rollCCPen >= controlImmune || !(bypassControlImmune))
          && this._artifact.includes(' Lucky Candy Bar') &&
          (this._currentStats['firstCC'] == '' || this._currentStats['firstCC'] == debuffName)
				) {
					this._currentStats['firstCC'] = debuffName;
					result += '<div>' + this.heroDesc() + ' resisted debuff <span class=\'skill\'>' + debuffName + '</span> using <span class=\'skill\'>' + this._artifact + '</span>.</div>';
				} else {
					result += '<div>' + this.heroDesc() + ' consumed <span class=\'skill\'>Dynamite Armor</span> to resist <span class=\'skill\'>' + debuffName + '</span>.</div>';

					const armorKeys = Object.keys(this._buffs['Dynamite Armor']);
					result += this.removeBuff('Dynamite Armor', armorKeys[0]);
				}
			}
		} else {
			result += super.getDebuff(source, debuffName, duration, effects, bypassControlImmune, damageSource, ccChance, unstackable);
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getFrontTargets(this, this._enemies);
		let targetLock;

		let damagePercent = 1.8;
		let critDamageGained = 0.40;

		if (this._voidLevel >= 2) {
			damagePercent = 4;
			critDamageGained = 0.50;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
				result += targets[i].takeDamage(this, 'Gunshot Symphony', damageResult);
				basicQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		result += this.getBuff(this, 'Crit Damage', 2, { critDamage: critDamageGained });
		result += this.getBuff(this, 'Reflection Armor', 127, {});

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let burnDamageResult = {};
		const targets = getHighestHPTargets(this, this._enemies, 1);
		let targetLock;

		let damagePercent = 4.5;
		let burnPercent = 1.5;

		if (this._voidLevel >= 4) {
			damagePercent = 9;
			burnPercent = 3;
		}


		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[0].takeDamage(this, 'Fatal Fireworks', damageResult);

				burnDamageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'], 'active', 'burn', burnPercent, 1, 6);
				result += targets[0].getDebuff(this, 'Burn', 6, { burn: burnDamageResult['damageAmount'] }, false, 'active');

				activeQueue.push([this, targets[0], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		result += this.getBuff(this, 'Dynamite Armor', 127, {});

		return result;
	}
}


class Sherlock extends hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		super(sHeroName, iHeroPos, attOrDef);
		this._stats['wellCalculatedStacks'] = 3;
	}


	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.35, hpPercent: 0.40, speed: 60, damageReduce: 0.30 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.25, hpPercent: 0.30, speed: 40, damageReduce: 0.30 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventHPlte30' && this._currentStats['wellCalculatedStacks'] > 1 && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventHPlte30();
		} else if (trigger[1] == 'eventGotCC' && this._currentStats['wellCalculatedStacks'] > 0 && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventGotCC(trigger[2], trigger[3], trigger[4]);
		}

		return result;
	}


	eventGotCC(source, ccName, ccStackID) {
		let result = '';

		if (ccName in this._debuffs) {
			if (ccStackID in this._debuffs[ccName]) {
				const targets = getRandomTargets(this, this._enemies, 1);
				const ccStack = this._debuffs[ccName][ccStackID];

				this._currentStats['wellCalculatedStacks'] -= 1;
				result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Well-Calculated</span> transfered <span class=\'skill\'>' + ccName + '</span.</div>';

				if (targets.length > 0) {
					result += this.removeDebuff(ccName, ccStackID);
					result += targets[0].getDebuff(this, ccName, ccStack['duration'], ccStack['effects']);
				}
			}
		}

		return result;
	}


	eventHPlte30() {
		let result = '';
		const targets = getHighestHPTargets(this, this._enemies, 1);

		let layersConsumed = 2;
		if (this._voidLevel >= 3) {
			if (random() < 0.25) layersConsumed = 1;
		}


		this._currentStats['wellCalculatedStacks'] -= layersConsumed;

		if (targets.length > 0) {
			if (targets[0]._currentStats['totalHP'] > this._currentStats['totalHP']) {
				let swapAmount = targets[0]._currentStats['totalHP'] - this._currentStats['totalHP'];
				if (swapAmount > this._currentStats['totalAttack'] * 50) { swapAmount = Math.floor(this._currentStats['totalAttack'] * 50);}

				this._currentStats['totalHP'] += swapAmount;
				targets[0]._currentStats['totalHP'] -= swapAmount;

				this._currentStats['damageHealed'] += swapAmount;
				this._currentStats['damageDealt'] += swapAmount;

				result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Deceiving Tricks</span> swapped ' + formatNum(swapAmount) + ' HP with ' + targets[0].heroDesc() + '.</div>';
			}
		}

		return result;
	}


	endOfRound() {
		let result = super.endOfRound();
		let extraLayerChance = 0.50;
		if (this._voidLevel >= 2) extraLayerChance = 0.50;


		if(random() < extraLayerChance) {
			result = '<div>' + this.heroDesc() + ' gained <span class=\'num\'>2</span> stacks of <span class=\'skill\'>Well-Calculated</span>.</div>';
			this._currentStats['wellCalculatedStacks'] += 2;
		} else {
			result = '<div>' + this.heroDesc() + ' gained <span class=\'num\'>1</span> stack of <span class=\'skill\'>Well-Calculated</span>.</div>';
			this._currentStats['wellCalculatedStacks'] += 1;
		}

		return result;
	}


	getDebuff(source, debuffName, duration, effects = {}, bypassControlImmune = false, damageSource = 'passive', ccChance = 1, unstackable = false) {
		let result = '';

		if (debuffName.includes('Mark') && this.isNotSealed() && this._currentStats['wellCalculatedStacks'] > 0) {
			this._currentStats['wellCalculatedStacks'] -= 1;
			result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Well-Calculated</span> prevented <span class=\'skill\'>' + debuffName + '</span.</div>';

		} else {
			result += super.getDebuff(source, debuffName, duration, effects, bypassControlImmune, damageSource, ccChance, unstackable);
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 1);
		let targetLock;

		let shapeshiftChance = 0.50;
		if (this._voidLevel >= 2) shapeshiftChance = 0.60;


		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'], 'basic', 'normal');
				result += targets[0].takeDamage(this, 'Basic Attack', damageResult);
				result += targets[0].getDebuff(this, 'Shapeshift', 127, { stacks: 3 }, false, '', shapeshiftChance, true);

				basicQueue.push([this, targets[0], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 2);
		let ccChance = 1.0;
		let targetLock;

		let damagePercent = 3;
		let ccReducedChance = 0.35;
		let layersGained = 2;

		if (this._voidLevel >= 4) {
			damagePercent = 8;
			ccReducedChance = 0.30;
			if (random() < 0.25) layersGained = 3;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Master Showman', damageResult);
				result += targets[i].getDebuff(this, 'Shapeshift', 127, { stacks: 3 }, false, '', ccChance, true);

				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}

			ccChance -= ccReducedChance;
		}

		result += `<div>${this.heroDesc()} gained <span class='num'>${layersGained}</span> stacks of <span class='skill'>Well-Calculated</span>.</div>`;
		this._currentStats['wellCalculatedStacks'] += layersGained;

		return result;
	}
}


class Tara extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.5, holyDamage: 1.2, controlImmune: 0.3, damageReduce: 0.3 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.4, holyDamage: 0.7, controlImmune: 0.3, damageReduce: 0.3 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventSelfBasic', 'eventSelfActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic();
		}

		return result;
	}


	eventSelfBasic() {
		let result = '';
		let damageResult = {};
		const targets = getAllTargets(this, this._enemies);

		let damagePercent = 4;
		let powerChance = 0.30;

		if (this._voidLevel >= 3) {
			damagePercent = 5.6;
			powerChance = 0.40;
		}

		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * damagePercent, 'passive', 'normal', 1, 1, 0, 1, 0);
			result += targets[i].takeDamage(this, 'Fluctuation of Light', damageResult);

			if (random() < powerChance) {
				result += targets[i].getDebuff(this, 'Power of Light', 127);
			}
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 1);
		let targetLock;

		let damagePercent = 3;
		if (this._voidLevel >= 2) damagePercent = 4.2;

		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
				result = targets[0].takeDamage(this, 'Basic Attack', damageResult);

				result += targets[0].getDebuff(this, 'Power of Light', 127);
				basicQueue.push([this, targets[0], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getRandomTargets(this, this._enemies, 1);
		let didCrit = false;
		let damageDone = 0;
		let targetLock;

		let damagePercent = 3;
		let holyBuffPercent = 0.50;
		let powerChance = 0.60;

		if (this._voidLevel >= 4) {
			damagePercent = 4.2;
			holyBuffPercent = 0.60;
			powerChance = 0.70;
		}

		if (targets.length > 0) {
			targetLock = targets[0].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				didCrit = didCrit || damageResult['critted'];
				result += targets[0].takeDamage(this, 'Seal of Light', damageResult);
				damageDone += damageResult['damageAmount'];

				if (targets[0]._currentStats['totalHP'] > 0) {
					damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
					didCrit = didCrit || damageResult['critted'];
					result += targets[0].takeDamage(this, 'Seal of Light', damageResult);
					damageDone += damageResult['damageAmount'];
				}

				if (targets[0]._currentStats['totalHP'] > 0 && random() < 0.5) {
					damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
					didCrit = didCrit || damageResult['critted'];
					result += targets[0].takeDamage(this, 'Seal of Light', damageResult);
					damageDone += damageResult['damageAmount'];
				}

				if (targets[0]._currentStats['totalHP'] > 0 && random() < 0.34) {
					damageResult = this.calcDamage(targets[0], this._currentStats['totalAttack'], 'active', 'normal', 3);
					didCrit = didCrit || damageResult['critted'];
					result += targets[0].takeDamage(this, 'Seal of Light', damageResult);
					damageDone += damageResult['damageAmount'];
				}

				result += targets[0].getDebuff(this, 'Power of Light', 127);
				activeQueue.push([this, targets[0], damageDone, didCrit]);
			}
		}


		targets = getAllTargets(this, this._enemies);
		for (const h in targets) {
			targetLock = targets[h].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				if ('Power of Light' in targets[h]._debuffs && random() < powerChance) {
					result += targets[h].getDebuff(this, 'Power of Light', 127);
				}
			}
		}

		result += this.getBuff(this, 'Holy Damage', 127, { holyDamage: holyBuffPercent });

		return result;
	}
}


class UniMax3000 extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ armorPercent: 0.4, hpPercent: 0.5, attackPercent: 0.35, controlImmune: 0.3, energy: 100 }, 'PassiveStats');
		} else {
			this.applyStatChange({ armorPercent: 0.3, hpPercent: 0.4, attackPercent: 0.25, controlImmune: 0.3, energy: 50 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic();
		} else if (['eventEnemyActive', 'eventEnemyBasic'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyActive(trigger[2], trigger[3]);
		}

		return result;
	}


	eventEnemyActive(target, e) {
		let result = '';
		let attackPercentStolen = 0.20;
		let tauntChance = 0.30;

		if (this._voidLevel >= 2) {
			attackPercentStolen = 0.25;
			tauntChance = 0.40;
		}


		if (target._currentStats['totalHP'] > 0) {
			for (const i in e) {
				if (this.heroDesc() == e[i][1].heroDesc()) {
					const attackStolen = Math.floor(target._currentStats['totalAttack'] * attackPercentStolen);

					result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Frenzied Taunt</span> triggered.</div>';
					result += target.getDebuff(this, 'Fixed Attack', 2, { fixedAttack: attackStolen });
					result += this.getBuff(this, 'Fixed Attack', 2, { fixedAttack: attackStolen });
					result += target.getDebuff(this, 'Taunt', 2, {}, false, '', tauntChance);

					break;
				}
			}
		}

		return result;
	}


	endOfRound(roundNum) {
		let result = super.endOfRound();
		let healPercent = 1.2;
		let critDamageGained = 0.50;

		if (this._voidLevel >= 3) {
			healPercent = 2;
			critDamageGained = 1;
		}


		const healAmount = this.calcHeal(this, this._currentStats['totalAttack'] * healPercent);

		result += this.getHeal(this, healAmount);
		result += this.getHeal(this, healAmount);
		result += this.getHeal(this, healAmount);

		if (roundNum == 4) {
			for (const d in this._debuffs) {
				if (isControlEffect(d)) {
					result += this.removeDebuff(d);
				}
			}

			result += this.getBuff(this, 'Crit Damage', 127, { critDamage: critDamageGained });
			result += this.getBuff(this, 'Rampage', 127);
		}

		return result;
	}


	calcDamage(target, attackDamage, damageSource, damageType, skillDamage = 1, canCrit = 1, dotRounds = 0, canBlock = 1, armorReduces = 1) {
		let result = '';

		if ('Rampage' in this._buffs) {
			result = super.calcDamage(target, attackDamage, damageSource, damageType, skillDamage, 2, dotRounds, 0, armorReduces);
		} else {
			result = super.calcDamage(target, attackDamage, damageSource, damageType, skillDamage, canCrit, dotRounds, canBlock, armorReduces);
		}

		return result;
	}


	eventSelfBasic() {
		let result = '';
		let healPercent = 1.5;
		if (this._voidLevel >= 2) healPercent = 2.5;

		const healAmount = this.calcHeal(this, this._currentStats['totalAttack'] * healPercent);
		result += this.getBuff(this, 'Heal', 2, { heal: healAmount });
		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let damageResult2 = { damageAmount: 0, critted: false };
		const targets = getBackTargets(this, this._enemies);
		let targetLock;

		let damagePercent = 4.2;
		let tauntChance = 0.50;
		let allDamageReduceGained = 0.20;

		if (this._voidLevel >= 4) {
			damagePercent = 6.4;
			tauntChance = 0.70;
			allDamageReduceGained = 0.30;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Iron Whirlwind', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					damageResult2 = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
					result += targets[i].takeDamage(this, 'Iron Whirlwind 2', damageResult2);
				}

				result += targets[i].getDebuff(this, 'Taunt', 2, {}, false, '', tauntChance);

				activeQueue.push([this, targets[i], damageResult['damageAmount'] + damageResult2['damageAmount'], damageResult['critted'] || damageResult2['critted']]);
			}
		}

		result += this.getBuff(this, 'All Damage Reduce', 2, { allDamageReduce: allDamageReduceGained });

		return result;
	}
}


class Asmodel extends hero {
	passiveStats() {
		this.applyStatChange({ hpPercent: 0.40, attackPercent: 0.35, holyDamage: 0.50, crit: 0.35, controlImmune: 0.30 }, 'PassiveStats');
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'critMark') {
			if (trigger[2]._currentStats['totalHP'] > 0) {
				result += this.critMark(trigger[2], trigger[3]);
			}
		} else if (['eventEnemyActive', 'eventEnemyBasic'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyActive(trigger[3]);
		}

		return result;
	}


	eventEnemyActive(e) {
		let result = '';

		for (const t in e) {
			if (e[t][1].heroDesc() == this.heroDesc()) {
				const targets = getAllTargets(this, this._enemies);
				let damageResult;

				for (const i in targets) {
					damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * 1.8, 'mark', 'normal');
					result += targets[i].getDebuff(this, 'Crit Mark', 127, { attackAmount: damageResult });
				}

				break;
			}
		}

		result += this.getBuff(this, 'Damage Reduce', 1, { damageReduce: 0.25 });

		return result;
	}


	critMark(target, damageResult) {
		let result = '';
		result += target.takeDamage(this, 'Crit Mark', damageResult);
		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		let markDamageResult = {};
		const targets = getFrontTargets(this, this._enemies);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * 1.6, 'basic', 'normal');
				result += targets[i].takeDamage(this, 'Basic Attack', damageResult);

				markDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * 2.5, 'mark', 'normal');
				result += targets[i].getDebuff(this, 'Crit Mark', 127, { attackAmount: markDamageResult });

				basicQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		result += this.getBuff(this, 'Crit Damage', 3, { critDamage: 0.40 });

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let markDamageResult = {};
		const targets = getRandomTargets(this, this._enemies, 4);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 2.25);
				result += targets[i].takeDamage(this, 'Divine Burst', damageResult);

				markDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * 3, 'mark', 'normal');
				result += targets[i].getDebuff(this, 'Crit Mark', 127, { attackAmount: markDamageResult });

				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		result += this.getBuff(this, 'Attack Percent', 3, { attackPercent: 0.40 });

		return result;
	}
}


class Drake extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.50, critDamage: 0.50, skillDamage: 1, controlImmune: 0.30, speed: 80 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.40, critDamage: 0.50, skillDamage: 0.70, controlImmune: 0.30, speed: 60 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventSelfActive', 'eventSelfBasic'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfActive();
		}

		return result;
	}


	eventSelfActive() {
		let dodgePercent = 0.60;
		if (this._voidLevel >= 3) dodgePercent = 0.70;
		return this.getBuff(this, 'Dodge', 1, { dodge: dodgePercent }, true);
	}


	startOfBattle() {
		let result = '';
		const targets = getLowestHPTargets(this, this._enemies, 1);

		for (const i in targets) {
			result += targets[i].getDebuff(this, 'Drake Break Defense', 2, { armorPercent: 1, dodge: 1, block: 1, allDamageReduce: 1, damageReduce: 1 }, false, 'passive', 1, true);
		}

		return result;
	}


	endOfRound() {
		const result = super.endOfRound();
		return result + this.startOfBattle();
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		let hpDamage = 0;
		let hpDamageResult = { damageAmount: 0 };
		const targets = getLowestHPTargets(this, this._enemies, 1);
		let targetLock;

		let damagePercent = 2.2;
		if (this._voidLevel >= 2) damagePercent = 4;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal');
				result += targets[i].takeDamage(this, 'Deadly Strike', damageResult);

				if ('Black Hole Mark' in targets[i]._debuffs) {
					if (targets[i]._currentStats['totalHP'] > 0) {
						hpDamage = 0.20 * targets[i]._stats['totalHP'];
						if (hpDamage > this._currentStats['totalAttack'] * 15) { hpDamage = this._currentStats['totalAttack'] * 15; }
						hpDamageResult = this.calcDamage(targets[i], hpDamage, 'basic', 'true');
						result += targets[i].takeDamage(this, 'Deadly Strike - HP', hpDamageResult);
					}
				} else {
					result += targets[i].getDebuff(this, 'Black Hole Mark', 1, { attackAmount: this._currentStats['totalAttack'] * 40, damageAmount: 0 });
				}

				basicQueue.push([this, targets[i], damageResult['damageAmount'] + hpDamageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let hpDamage = 0;
		let hpDamageResult1 = { damageAmount: 0 };
		let hpDamageResult2 = { damageAmount: 0 };
		const targets = getRandomTargets(this, this._enemies, 2);
		let targetLock;

		let damagePercent = 4;
		let hpDamagePercent = 0.20;

		if (this._voidLevel >= 4) {
			damagePercent = 7;
			hpDamagePercent = 0.25;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Annihilating Meteor', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					hpDamage = hpDamagePercent * targets[i]._stats['totalHP'];
					if (hpDamage > this._currentStats['totalAttack'] * 15) { hpDamage = this._currentStats['totalAttack'] * 15; }
					hpDamageResult1 = this.calcDamage(targets[i], hpDamage, 'active', 'true');
					result += targets[i].takeDamage(this, 'Annihilating Meteor - HP2', hpDamageResult1);
				}

				if ('Black Hole Mark' in targets[i]._debuffs) {
					if (targets[i]._currentStats['totalHP'] > 0) {
						hpDamageResult2 = this.calcDamage(targets[i], hpDamage, 'active', 'true');
						result += targets[i].takeDamage(this, 'Annihilating Meteor - HP2', hpDamageResult2);
					}
				} else {
					result += targets[i].getDebuff(this, 'Black Hole Mark', 1, { attackAmount: this._currentStats['totalAttack'] * 40, damageAmount: 0 });
				}

				basicQueue.push([this, targets[i], damageResult['damageAmount'] + hpDamageResult1['damageAmount'] + hpDamageResult2['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}
}


class Russell extends hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		super(sHeroName, iHeroPos, attOrDef);
		this._stats['isCharging'] = false;
	}


	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.40, holyDamage: 1, critDamage: 0.40, controlImmune: 0.30, speed: 80 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.30, holyDamage: 0.80, critDamage: 0.40, controlImmune: 0.30, speed: 60 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfActive' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfActive();
		} else if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic();
		}

		return result;
	}


	eventSelfBasic() {
		let result = this.eventSelfActive();
		result += this.getBuff(this, 'Light Arrow', 4);
		result += this.getBuff(this, 'Light Arrow', 4);
		return result;
	}


	eventSelfActive() {
		let result = '';
		let damageResult;
		let targets;

		let damagePercent = 3;
		if (this._voidLevel >= 2) damagePercent = 4;

		if ('Light Arrow' in this._buffs && !(this._currentStats['isCharging'])) {
			// eslint-disable-next-line no-unused-vars
			for (const i in Object.keys(this._buffs['Light Arrow'])) {
				targets = getLowestHPTargets(this, this._enemies, 1);

				for (const target of targets) {
					damageResult = this.calcDamage(target, this._currentStats['totalAttack'] * damagePercent, 'passive', 'normal');
					result += target.takeDamage(this, 'Light Arrow', damageResult);
				}
			}
		}

		return result;
	}


	startOfBattle() {
		let result = '';
		const targets = getLowestHPTargets(this, this._enemies, 2);

		let dazzleDuration = 1;
		if (this._voidLevel >= 3) dazzleDuration = 2;

		for (const i in targets) {
			result += targets[i].getDebuff(this, 'Dazzle', dazzleDuration);
		}

		return result;
	}


	endOfRound() {
		let result = super.endOfRound();

		let dazzleDuration = 1;
		let healPercent = 4;

		if (this._voidLevel >= 3) {
			dazzleDuration = 2;
			healPercent = 8;
		}

		const healAmount = this.calcHeal(this, healPercent * this._currentStats['totalAttack']);
		const targets = getLowestHPTargets(this, this._enemies, 2);

		result += this.getHeal(this, healAmount);
		result += this.getBuff(this, 'Light Arrow', 4);
		result += this.getBuff(this, 'Light Arrow', 4);

		for (const i in targets) {
			result += targets[i].getDebuff(this, 'Dazzle', dazzleDuration);
		}

		return result;
	}


	getEnergy(source, amount) {
		if (!(this._currentStats['isCharging'])) {
			return super.getEnergy(source, amount);
		} else {
			return '';
		}
	}


	getDebuff(source, debuffName, duration, effects = {}, bypassControlImmune = false, damageSource = 'passive', ccChance = 1, unstackable = false) {
		if (isControlEffect(debuffName) && this._currentStats['isCharging']) {
			return '';
		} else {
			return super.getDebuff(source, debuffName, duration, effects, bypassControlImmune, damageSource, ccChance, unstackable);
		}
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 1);
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
		let damageReducePercent = 0.40;
		let damagePercent = 16;

		if (this._voidLevel >= 4) {
			damageReducePercent = 0.50;
			damagePercent = 20;
		}


		if (this._currentStats['isCharging']) {
			let damageResult = {};
			const targets = getAllTargets(this, this._enemies);
			let targetLock;

			this._currentStats['energySnapshot'] = this._currentStats['energy'];
			this._currentStats['energy'] = 0;

			for (const i in targets) {
				targetLock = targets[i].getTargetLock(this);
				result += targetLock;

				if (targetLock == '') {
					damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
					result += targets[i].takeDamage(this, 'Radiant Arrow', damageResult);
					activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
				}
			}

			this._currentStats['isCharging'] = false;

			result += this.getBuff(this, 'Light Arrow', 4);
			result += this.getBuff(this, 'Light Arrow', 4);
			result += this.getBuff(this, 'Light Arrow', 4);
			result += this.getBuff(this, 'Light Arrow', 4);

		} else {
			result += '<div>' + this.heroDesc() + ' starts charging Radiant Arrow.</div>';
			result += this.getBuff(this, 'Crit', 2, { crit: 0.50 });
			result += this.getBuff(this, 'Damage Reduce', 2, { damageReduce: damageReducePercent });

			this._currentStats['isCharging'] = true;
		}

		return result;
	}
}


class Valkryie extends hero {
	passiveStats() {
		this.applyStatChange({ hpPercent: 0.35, attackPercent: 0.25, crit: 0.30 }, 'PassiveStats');
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventGotCC' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventGotCC();
		}

		return result;
	}


	eventGotCC() {
		let result = '';
		const targets = getRandomTargets(this, this._enemies, 3);
		let damageResult;
		const healAmount = this.calcHeal(this, this._currentStats['totalAttack'] * 2);

		result += this.getBuff(this, 'Heal', 3, { heal: healAmount });

		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], this._stats['totalHP'] * 0.03, 'passive', 'burnTrue', 1, 0, 1);
			result += targets[i].getDebuff(this, 'Burn True', 1, { burnTrue: damageResult['damageAmount'] });
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 3);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * 0.95, 'basic', 'normal');
				result += targets[i].takeDamage(this, 'Fire of the Soul', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					const burnDamageResult = this.calcDamage(targets[i], this._stats['totalHP'] * 0.06, 'basic', 'burnTrue', 1, 0, 1);
					result += targets[i].getDebuff(this, 'Burn True', 1, { burnTrue: burnDamageResult['damageAmount'] });
				}

				result += targets[i].getDebuff(this, 'Attack', 3, { attack: Math.floor(targets[i]._stats['attack'] * 0.12) });

				basicQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getRandomTargets(this, this._enemies, 3);
		let targetLock;
		let attackStolen = 0;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 1.62);
				result += targets[i].takeDamage(this, 'Flap Dance', damageResult);

				attackStolen = Math.floor(targets[i]._currentStats['totalAttack'] * 0.15);
				result += targets[i].getDebuff(this, 'Fixed Attack', 3, { fixedAttack: attackStolen });
				result += this.getBuff(this, 'Fixed Attack', 3, { fixedAttack: attackStolen });

				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		targets = getHighestHPTargets(this, this._enemies, 1);
		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._stats['totalHP'] * 0.18, 'active', 'burnTrue', 1, 0, 2);
				result += targets[i].getDebuff(this, 'Burn True', 1, { burnTrue: damageResult['damageAmount'] });
			}
		}

		return result;
	}
}


class Ormus extends hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		super(sHeroName, iHeroPos, attOrDef);
		this._stats['heartOfOrmusTriggered'] = false;
	}


	passiveStats() {
		this.applyStatChange({ hpPercent: 0.35, attackPercent: 0.25, healEffect: 0.50 }, 'PassiveStats');
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventHPlte50' && this._currentStats['heartOfOrmusTriggered'] == false && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventHPlte50();
		} else if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic(trigger[2]);
		}

		return result;
	}


	eventSelfBasic(e) {
		let result = '';
		let damageResult = {};

		for (const i in e) {
			damageResult = this.calcDamage(e[i][1], this._currentStats['totalAttack'], 'passive', 'normal');
			result += e[i][1].takeDamage(this, 'Passive 1', damageResult);
		}


		const targets = getAllTargets(this, this._allies);
		let healAmount = 0;

		for (const i in targets) {
			healAmount = this.calcHeal(targets[i], this._currentStats['totalAttack'] * 1.5);
			result += targets[i].getBuff(this, 'Heal', 2, { heal: healAmount });
		}

		return result;
	}


	eventHPlte50() {
		let result = '';
		const targets = getAllTargets(this, this._allies);

		this._currentStats['heartOfOrmusTriggered'] = true;

		for (const i in targets) {
			const healAmount = this.calcHeal(targets[i], 3 * this._currentStats['totalAttack']);

			result += targets[i].getBuff(this, 'Effect Being Healed', 3, { effectBeingHealed: 0.20 });
			result += targets[i].getBuff(this, 'Rescue Mark', 127, { attackAmount: healAmount });

			if (targets[i]._currentStats['totalHP'] <= targets[i]._stats['totalHP'] * 0.3) {
				result += targets[i].removeBuff('Rescue Mark');
				triggerQueue.push([targets[i], 'getHeal', this, healAmount]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getBackTargets(this, this._enemies);
		let targetLock;
		let healAmount = 0;

		targets = getRandomTargets(this, targets, 2);

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 1.42);
				result += targets[i].takeDamage(this, 'Blue Lightning Laser', damageResult);
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		targets = getLowestHPTargets(this, this._allies, 1);
		for (const i in targets) {
			healAmount = this.calcHeal(targets[i], this._currentStats['totalAttack'] * 3);
			result += targets[i].getHeal(this, healAmount);

			healAmount = this.calcHeal(targets[i], this._currentStats['totalAttack'] * 5);
			result += targets[i].getBuff(this, 'Rescue Mark', 127, { attackAmount: healAmount });

			if (targets[i]._currentStats['totalHP'] <= targets[i]._stats['totalHP'] * 0.3) {
				result += targets[i].removeBuff('Rescue Mark');
				triggerQueue.push([targets[i], 'getHeal', this, healAmount]);
			}
		}

		return result;
	}
}


class Rogan extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent:0.40, hpPercent: 0.35, critDamage: 0.40, damageReduce: 0.30, speed: 80 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent:0.30, hpPercent: 0.25, critDamage: 0.40, damageReduce: 0.30, speed: 60 }, 'PassiveStats');
		}
	}


	startOfBattle() {
		let result = '';
		const targets = getAllTargets(this, this._allies);

		let speedGained = 20;
		let critDamageGained = 0.20;

		if (this._voidLevel >= 3) {
			speedGained = 30;
			critDamageGained = 0.25;
		}

		for (const i in targets) {
			if (targets[i]._heroClass == 'Assassin') {
				result += targets[i].getBuff(this, 'Speed', 2, { speed: speedGained * 2 });
				result += targets[i].getBuff(this, 'Crit Damage', 2, { critDamage: critDamageGained * 2 });
			} else {
				result += targets[i].getBuff(this, 'Speed', 2, { speed: speedGained });
				result += targets[i].getBuff(this, 'Crit Damage', 2, { critDamage: critDamageGained });
			}
		}

		return result;
	}


	endOfRound() {
		let result = super.endOfRound();
		const targets = getAllTargets(this, this._allies);

		let attackPercentGained = 0.20;
		if (this._voidLevel >= 3) attackPercentGained = 0.30;

		for (const i in targets) {
			if (targets[i]._heroClass == 'Assassin') {
				result += targets[i].getBuff(this, 'attackPercent', 2, { attackPercent: attackPercentGained * 2 });
				result += targets[i].getBuff(this, 'Crit', 2, { crit: 0.20 });
			} else {
				result += targets[i].getBuff(this, 'attackPercent', 2, { attackPercent: attackPercentGained });
				result += targets[i].getBuff(this, 'Crit', 2, { crit: 0.10 });
			}
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		let maxDamage = 0;
		let hpDamage = 0;
		let hpDamageResult = { damageAmount: 0 };
		const targets = getLowestHPTargets(this, this._enemies, 1);
		let targetLock;

		let damagePercent = 2.6;
		let hpDamagePercent = 0.20;
		let healPercent = 0.30;

		if (this._voidLevel >= 2) {
			damagePercent = 4;
			hpDamagePercent = 0.25;
			healPercent = 0.40;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				let canCrit = 1;
				if (targets[i]._currentStats['totalHP'] / targets[i]._stats['totalHP'] <= 0.50) {
					canCrit = 2;
				}

				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * damagePercent, 'basic', 'normal', 1, canCrit);
				result += targets[i].takeDamage(this, 'Savagery', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					hpDamage = hpDamagePercent * (targets[i]._stats['totalHP'] - targets[i]._currentStats['totalHP']);
					maxDamage = 15 * this._currentStats['totalAttack'];
					if (hpDamage > maxDamage) { hpDamage = maxDamage; }

					hpDamageResult = this.calcDamage(targets[i], hpDamage, 'basic', 'true');
					result += targets[i].takeDamage(this, 'Savagery HP', hpDamageResult);
				}

				const healAmount = this.calcHeal(this, healPercent * (damageResult['damageAmount'] + hpDamageResult['damageAmount']));
				result += this.getHeal(this, healAmount);

				basicQueue.push([this, targets[i], damageResult['damageAmount'] + hpDamageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let maxDamage = 0;
		let hpDamage = 0;
		let hpDamageResult = { damageAmount: 0 };
		let totalDamage = 0;
		let didCrit = false;
		let targets = getLowestHPTargets(this, this._enemies, 1);
		let targetLock;

		let damagePercent = 3;
		let hpDamagePercent = 0.30;

		if (this._voidLevel >= 4) {
			damagePercent = 5.6;
			hpDamagePercent = 0.40;
		}

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				let canCrit = 1;
				didCrit = false;
				totalDamage = 0;

				if (targets[i]._currentStats['totalHP'] / targets[i]._stats['totalHP'] <= 0.50) {
					canCrit = 2;
				} else {
					canCrit = 1;
				}

				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent, canCrit);
				result += targets[i].takeDamage(this, 'Bloodthirsty Predator 1', damageResult);
				totalDamage += damageResult['damageAmount'];
				didCrit = didCrit || damageResult['critted'];

				if (targets[i]._currentStats['totalHP'] > 0) {
					if (targets[i]._currentStats['totalHP'] / targets[i]._stats['totalHP'] <= 0.50) {
						canCrit = 2;
					} else {
						canCrit = 1;
					}

					damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent, canCrit);
					result += targets[i].takeDamage(this, 'Bloodthirsty Predator 2', damageResult);
					totalDamage += damageResult['damageAmount'];
					didCrit = didCrit || damageResult['critted'];
				}

				if (targets[i]._currentStats['totalHP'] > 0) {
					hpDamage = hpDamagePercent * (targets[i]._stats['totalHP'] - targets[i]._currentStats['totalHP']);
					maxDamage = 15 * this._currentStats['totalAttack'];
					if (hpDamage > maxDamage) { hpDamage = maxDamage; }

					hpDamageResult = this.calcDamage(targets[i], hpDamage, 'active', 'true');
					result += targets[i].takeDamage(this, 'Bloodthirsty Predator HP', hpDamageResult);
					totalDamage += hpDamageResult['damageAmount'];
				}

				const healAmount = this.calcHeal(this, 0.50 * totalDamage);
				result += this.getHeal(this, healAmount);

				basicQueue.push([this, targets[i], totalDamage, didCrit]);
			}
		}


		let numTargets = 0;
		targets = getRandomTargets(this, this._allies, 3);

		for (const i in targets) {
			if (this.heroDesc() != targets[i].heroDesc()) {
				result += targets[i].getBuff(this, 'Bloodthirsty', 3, {}, true);
				numTargets++;
			}

			if (numTargets == 2) {
				break;
			}
		}


		return result;
	}
}


class Gerke extends hero {
	passiveStats() {
		this.applyStatChange({ holyDamage: 0.60, attackPercent: 0.25, hpPercent: 0.20, crit: 0.20 }, 'PassiveStats');
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic();
		} else if (['eventEnemyActive', 'eventEnemyBasic'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyActive(trigger[3]);
		}

		return result;
	}


	eventSelfBasic() {
		let result = '';
		const healAmount = this.calcHeal(this, this._currentStats['totalAttack'] * 1.95);

		result = this.getHeal(this, healAmount);
		result += this.getBuff(this, 'Holy Damage', 4, { holyDamage: 0.20 });

		return result;
	}


	eventEnemyActive(e) {
		let result = '';

		for (const t in e) {
			if (e[t][1].heroDesc() == this.heroDesc()) {
				const healAmount = this.calcHeal(this, this._currentStats['totalAttack'] * 0.40);

				result = this.getHeal(this, healAmount);
				result += this.getBuff(this, 'Holy Damage', 3, { holyDamage: 0.20 });

				break;
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getRandomTargets(this, this._enemies, 4);
		let targetLock;
		let healAmount = 0;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 1.88);
				result += targets[i].takeDamage(this, 'Divine Light', damageResult);
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}


		targets = getRandomTargets(this, this._allies, 3);
		for (const i in targets) {
			healAmount = this.calcHeal(targets[i], this._currentStats['totalAttack'] * 2.65);
			result += targets[i].getHeal(this, healAmount);
			result += targets[i].getBuff(this, 'Holy Damage', 127, { holyDamage: 0.25 });
		}


		return result;
	}
}


class Sleepless extends hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		super(sHeroName, iHeroPos, attOrDef);
		this._stats['revive'] = 1;
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic(trigger[2]);
		} else if (['eventEnemyActive', 'eventEnemyBasic'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyActive(trigger[2], trigger[3]);
		}

		return result;
	}


	eventSelfBasic(e) {
		let result = '';
		let damageResult = {};

		for (const t in e) {
			if (e[t][1]._currentStats['totalHP'] > 0) {
				damageResult = this.calcDamage(e[t][1], this._currentStats['totalAttack'] * 1.90, 'mark', 'normal');
				result += e[t][1].getDebuff(this, 'Round Mark', 1, { attackAmount: damageResult });
				result += e[t][1].getDebuff(this, 'petrify', 2, {}, false, '', 0.45);
			}
		}

		return result;
	}


	eventEnemyActive(target, e) {
		let result = '';
		let damageResult = {};

		if (target._currentStats['totalHP'] > 0) {
			for (const t in e) {
				if (e[t][1].heroDesc() == this.heroDesc()) {
					damageResult = this.calcDamage(target, this._currentStats['totalAttack'] * 1.85, 'mark', 'normal');
					result += target.getDebuff(this, 'Round Mark', 1, { attackAmount: damageResult });

					if (random() < 0.3) {
						const healAmount = this.calcHeal(this, this._stats['totalHP'] * 0.10);
						result += this.getHeal(this, healAmount);
					}

					break;
				}
			}
		}

		return result;
	}


	endOfRound() {
		let result = super.endOfRound();

		if (this._currentStats['totalHP'] <= 0 && this._currentStats['revive'] == 1) {
			for (const b in this._buffs) {
				this.removeBuff(b);
			}

			for (const d in this._debuffs) {
				this.removeDebuff(d);
			}

			this._currentStats['revive'] = 0;
			this._currentStats['totalHP'] = this._stats['totalHP'];
			this._currentStats['energy'] = 0;
			result += '<div>' + this.heroDesc() + ' has revived with full health.</div>';
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		const targets = getAllTargets(this, this._enemies, 6);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 1.24);
				result += targets[i].takeDamage(this, 'Sleepless Mark', damageResult);
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}


			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * 2.8, 'mark', 'normal');
				result += targets[i].getDebuff(this, 'Round Mark', 1, { attackAmount: damageResult });
			}


			if (random() < 0.45) {
				targetLock = targets[i].getTargetLock(this);
				result += targetLock;

				if (targetLock == '') {
					damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * 2.1, 'mark', 'normal');
					result += targets[i].getDebuff(this, 'Round Mark', 1, { attackAmount: damageResult });
				}
			}
		}

		result += this.getBuff(this, 'Damage Reduce', 3, { damageReduce: 0.15 });

		return result;
	}
}


class DasMoge extends hero {
	passiveStats() {
		this.applyStatChange({ skillDamage: 0.625, attackPercent: 0.30, hpPercent: 0.40 }, 'PassiveStats');
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic();
		} else if (['eventSelfActive', 'eventAllyActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfActive();
		}

		return result;
	}


	eventSelfBasic() {
		let result = '';
		result += this.getBuff(this, 'Attack Percent', 3, { attackPercent: 0.20 });
		result += this.getBuff(this, 'Speed', 3, { speed: 15 });
		return result;
	}


	eventSelfActive() {
		let result = '';
		result += this.getBuff(this, 'Skill Damage', 127, { skillDamage: 0.20 });
		result += this.getEnergy(this, 30);
		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let bleedDamageResult = { damageAmount: 0 };
		let rangerDamageResult = { damageAmount: 0 };
		const targets = getAllTargets(this, this._enemies);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 1.15);
				result += targets[i].takeDamage(this, 'Death Reaper', damageResult);

				bleedDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'bleed', 0.56, 3);
				result += targets[i].getDebuff(this, 'Bleed', 3, { bleed: bleedDamageResult['damageAmount'] }, false, 'active');

				if (targets[i]._heroClass == 'Ranger') {
					rangerDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'bleed', 1.05, 3);
					result += targets[i].getDebuff(this, 'Bleed', 3, { bleed: rangerDamageResult['damageAmount'] }, false, 'active');
				}

				activeQueue.push([this, targets[i], damageResult['damageAmount'] + bleedDamageResult['damageAmount'] + rangerDamageResult['damageAmount'], damageResult['critted']]);
			}
		}

		result += this.getBuff(this, 'Skill Damage', 127, { skillDamage: 0.50 });

		return result;
	}
}


class Ignis extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.50, damageReduce: 0.30, healEffect: 0.35, speed: 80 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.40, damageReduce: 0.30, healEffect: 0.25, speed: 60 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic();
		} else if (trigger[1] == 'eventSelfDied') {
			result += this.eventSelfDied();
		}

		return result;
	}


	eventSelfBasic() {
		let result = '';
		let healPercent = 0.25;
		let damageReduceGained = 0.15;

		if (this._voidLevel >= 2) {
			healPercent = 0.30;
			damageReduceGained = 0.20;
		}


		const lostAmount = Math.floor(this._currentStats['totalHP'] * 0.25);
		const damageResult = this.calcDamage(this, lostAmount, 'passive', 'true');
		result += this.takeDamage(this, 'Life Breath', damageResult);


		const targets = getLowestHPTargets(this, this._allies, 3);

		for (const i in targets) {
			const healAmount = this.calcHeal(targets[i], this._stats['totalHP'] * healPercent);
			result += targets[i].getHeal(this, healAmount);
			result += targets[i].getBuff(this, 'Damage Reduce', 2, { damageReduce: damageReduceGained });
		}

		return result;
	}


	eventSelfDied() {
		let result = '';
		const targets = getNearestTargets(this, this._allies, 1);

		let energyGained = 100;
		let controlImmuneGained = 1;

		if (this._voidLevel >= 3) {
			energyGained = 100;
			controlImmuneGained = 1;
		}


		for (const i in targets) {
			const healAmount = this.calcHeal(targets[i], targets[i]._stats['totalHP']);
			result += targets[i].getHeal(this, healAmount);
			result += targets[i].getEnergy(this, energyGained);
			result += targets[i].getBuff(this, 'Control Immune', 127, { controlImmune: controlImmuneGained });
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getFrontTargets(this, this._enemies);
		let targetLock;

		let damagePercent = 2.28;
		let healPercent = 0.50;
		let energyGained = 100;

		if (this._voidLevel >= 4) {
			damagePercent = 4;
			healPercent = 0.60;
			energyGained = 150;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Blessing of Dragonflame', damageResult);
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}


		targets = getLowestHPTargets(this, this._allies, 1);
		for (const i in targets) {
			const healAmount = this.calcHeal(targets[i], this._currentStats['totalHP'] * healPercent);
			result += targets[i].getHeal(this, healAmount);
		}


		targets = getNearestTargets(this, this._allies, 1);
		for (const i in targets) {
			result += targets[i].getBuff(this, 'Damage Reduce', 3, { damageReduce: 0.40 });
			result += targets[i].getEnergy(this, energyGained);
		}

		return result;
	}
}


class HeartWatcher extends hero {
	passiveStats() {
		this.applyStatChange({ attackPercent: 0.30, crit: 0.30, hpPercent: 0.20 }, 'PassiveStats');
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventSelfBasic', 'eventSelfActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic(trigger[2]);
		}

		return result;
	}


	eventSelfBasic(e) {
		let result = '';

		for (const i in e) {
			if (e[i][3] == true) {
				const healAmount = this.calcHeal(this, this._currentStats['totalAttack'] * 2.8);
				result = this.getHeal(this, healAmount);
				break;
			}
		}

		return result;
	}


	getWatcherMarkAmount(target, wmAmount) {
		let currAmount = 0;

		if ('Watcher Mark' in target._debuffs) {
			for (const s of Object.values(target._debuffs['Watcher Mark'])) {
				currAmount -= s['effects']['allDamageTaken'];
			}
		}

		if (currAmount - wmAmount < -3) {
			wmAmount = 3 + currAmount;
		}

		return wmAmount;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 2);
		let targetLock;
		let wmAmount = 0;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'basic', 'normal', 1.1);
				result += targets[i].takeDamage(this, 'Weakness Strike', damageResult);
				basicQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);

				wmAmount = this.getWatcherMarkAmount(targets[i], 0.35);
				result += targets[i].getDebuff(this, 'Watcher Mark', 127, { allDamageTaken: -wmAmount });
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies, 2);
		let targetLock;
		let reduceAttackAmount = 0;
		let wmAmount = 0;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 2.55);
				result += targets[i].takeDamage(this, 'Mind Torture', damageResult);
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);

				reduceAttackAmount = Math.floor(0.25 * targets[i]._stats['attack']);
				result += targets[i].getDebuff(this, 'Attack', 2, { attack: reduceAttackAmount });

				wmAmount = this.getWatcherMarkAmount(targets[i], 0.45);
				result += targets[i].getDebuff(this, 'Watcher Mark', 127, { allDamageTaken: -wmAmount });
			}
		}

		return result;
	}
}


class KingBarton extends hero {
	passiveStats() {
		this.applyStatChange({ hpPercent: 0.40, attackPercent: 0.35, controlImmune: 0.35, damageAgainstStun: 1.0 }, 'PassiveStats');
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventEnemyBasic', 'eventEnemyActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyBasic(trigger[3]);
		}

		return result;
	}


	eventEnemyBasic(e) {
		let result = '';

		for (const i in e) {
			if (e[i][1].heroDesc() == this.heroDesc()) {
				const targets = getAllTargets(this, this._enemies);
				let damageResult;

				result += this.getBuff(this, 'Attack Percent', 1, { attackPercent: 0.30 });

				for (const h in targets) {
					damageResult = this.calcDamage(targets[h], this._currentStats['totalAttack'] * 1.5, 'passive', 'normal');
					result += targets[h].takeDamage(this, 'The Call of the King', damageResult);
				}

				break;
			}
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getRandomTargets(this, this._enemies);
		let targetLock;

		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'basic', 'normal', 1.25);
				result += targets[i].takeDamage(this, 'Heroic Charge', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					result += targets[i].getDebuff(this, 'stun', 2, {}, false, '', 0.25);
				}

				basicQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let targets = getFrontTargets(this, this._enemies);
		let targetLock;


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', 3.15);
				result += targets[i].takeDamage(this, 'Hammer\'s Verdict', damageResult);
				activeQueue.push([this, targets[i], damageResult['damageAmount'], damageResult['critted']]);
			}
		}


		result += this.getBuff(this, 'Damage Reduce', 3, { damageReduce: 0.20 });
		result += this.getBuff(this, 'Attack Percent', 3, { attackPercent: 0.40 });


		targets = getAllTargets(this, this._allies);
		for (const i in targets) {
			result += targets[i].getBuff(this, 'King\'s Shelter', 3, { damageReduce: 0.10 }, true);
		}

		return result;
	}
}


class Xia extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.45, crit: 0.35, block: 0.90, controlImmune: 0.35, speed: 40 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.35, crit: 0.35, block: 0.70, controlImmune: 0.35, speed: 30 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfActive' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfActive();
		} else if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic();
		} else if (trigger[1] == 'eventEnemyDied' && trigger[2].heroDesc() == this.heroDesc() && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyDied();
		}

		return result;
	}


	eventSelfBasic() {
		let result = '';
		result += this.getBuff(this, 'Aggression', 4, {});
		result += this.getBuff(this, 'Aggression', 4, {});
		return result;
	}


	eventSelfActive() {
		let result = '';
		let targets;
		let damageResult;

		let damagePercent = 2.38;
		let bleedPercent = 1.76;

		if (this._voidLevel >= 2) {
			damagePercent = 6;
			bleedPercent = 4.4;
		}


		if ('Aggression' in this._buffs) {

			// eslint-disable-next-line no-unused-vars
			for (const s of Object.values(this._buffs['Aggression'])) {
				targets = getLowestHPTargets(this, this._enemies, 1);

				for (const i in targets) {
					damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * damagePercent, 'passive', 'normal');
					result += targets[i].takeDamage(this, 'Aggression', damageResult);

					if (targets[i]._currentStats['totalHP'] > 0) {
						damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'] * bleedPercent, 'passive', 'bleed', 1, 1, 2);
						result += targets[i].getDebuff(this, 'Bleed', 2, { bleed: damageResult['damageAmount'] }, false, 'passive');
					}
				}
			}
		}

		return result;
	}


	eventEnemyDied() {
		let healPercent = 1;
		if (this._voidLevel >= 3) healPercent = 1.2;

		const healAmount = this.calcHeal(this, this._stats['totalHP'] * healPercent);
		const result = this.getHeal(this, healAmount);
		return result;
	}


	takeDamage(source, strAttackDesc, damageResult) {
		let result = super.takeDamage(source, strAttackDesc, damageResult);

		if (damageResult['blocked'] == true && this.isNotSealed()) {
			result += this.getBuff(this, 'Aggression', 4, {});
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult = {};
		let bleedDamageResult = { damageAmount: 0 };
		const targets = getLowestHPTargets(this, this._enemies, 1);
		let targetLock;

		let damagePercent = 3.96;
		let bleedPercent = 2.9;

		if (this._voidLevel >= 4) {
			damagePercent = 10;
			bleedPercent = 7.2;
		}


		for (const i in targets) {
			targetLock = targets[i].getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
				result += targets[i].takeDamage(this, 'Whirlwind Sweep', damageResult);

				if (targets[i]._currentStats['totalHP'] > 0) {
					bleedDamageResult = this.calcDamage(targets[i], this._currentStats['totalAttack'], 'active', 'bleed', bleedPercent, 1, 2);
					result += targets[i].getDebuff(this, 'Bleed', 2, { bleed: bleedDamageResult['damageAmount'] }, false, 'active');
				}

				activeQueue.push([this, targets[i], damageResult['damageAmount'] + bleedDamageResult['damageAmount'], damageResult['critted']]);
			}
		}

		return result;
	}
}


class Tix extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.45, crit: 0.30, controlImmune: 0.30, speed: 80 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.35, crit: 0.30, controlImmune: 0.30, speed: 60 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfDied') {
			if (!isMonster(trigger[2])) result += this.eventSelfDied(trigger[2]);
		}

		return result;
	}


	eventSelfDied(target) {
		return target.getDebuff(this, 'Revenging Wraith', 127, { attackAmount: this._currentStats['totalAttack'] });
	}


	endOfRound() {
		let result = super.endOfRound();

		if (this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			const targets = getRandomTargets(this, this._enemies);
			let attDiff = 0;
			const maxDiff = this._currentStats['totalAttack'] * 3;

			for (const i in targets) {
				if (targets[i]._currentStats['totalAttack'] > this._currentStats['totalAttack']) {
					result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Nether Touch</span> swapped attack with ' + targets[i].heroDesc() + '.</div>';

					attDiff = targets[i]._currentStats['totalAttack'] - this._currentStats['totalAttack'];
					if (attDiff > maxDiff) attDiff = maxDiff;

					result += this.getBuff(this, 'Nether Touch', 1, { fixedAttack: attDiff });
					result += targets[i].getDebuff(this, 'Nether Touch', 1, { fixedAttack: attDiff });

					break;
				}
			}
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult;
		let damageResult2 = { damageAmount: 0, critted: false };
		const targets = getHighestAttackTargets(this, this._enemies, 1);

		let damagePercent = 1.8;
		let targetDamagePercent = 6;
		let reducePercent = 0.40;

		if (this._voidLevel >= 2) {
			damagePercent = 4;
			targetDamagePercent = 10;
			reducePercent = 0.50;
		}


		for (const t of targets) {
			const targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(t, this._currentStats.totalAttack * damagePercent, 'basic', 'normal');
				result += t.takeDamage(this, 'Basic Attack', damageResult);

				if (t._currentStats.totalHP > 0) {
					damageResult2 = this.calcDamage(t, t._currentStats.totalAttack * targetDamagePercent, 'basic', 'true');
					result += t.takeDamage(this, 'Basic Attack 2', damageResult2);
				}

				if (t._currentStats.totalHP > 0) {
					const reduceAttackAmount = Math.floor(reducePercent * t._stats.attack);
					result += t.getDebuff(this, 'Attack', 2, { attack: reduceAttackAmount });
				}

				basicQueue.push([this, t, damageResult.damageAmount + damageResult2.damageAmount, damageResult.critted || damageResult2.critted]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult;
		let damageResult2 = { damageAmount: 0, critted: false };
		const targets = getRandomTargets(this, this._enemies, 4);

		let damagePercent = 8;
		let ccChance = 0.50;

		if (this._voidLevel >= 4) {
			damagePercent = 12;
			ccChance = 0.60;
		}


		for (const t of targets) {
			const targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(t, this._currentStats.totalAttack, 'active', 'normal', damagePercent);
				result += t.takeDamage(this, 'Soul Explosion', damageResult);

				if (t._currentStats.totalHP > 0) {
					damageResult2 = this.calcDamage(t, t._currentStats.totalAttack, 'active', 'true', damagePercent);
					result += t.takeDamage(this, 'Soul Explosion 2', damageResult2);
				}

				if (t._currentStats.totalHP > 0) {
					const attackStolen = Math.floor(t._currentStats.totalAttack * 0.25);
					result += t.getDebuff(this, 'Fixed Attack', 3, { fixedAttack: attackStolen });
					result += this.getBuff(this, 'Fixed Attack', 3, { fixedAttack: attackStolen });
				}


				if (t._currentStats.energy >= 90) {
					result += t.getDebuff(this, 'Silence', 2, {}, false, '', ccChance);
				}

				if (t._currentStats.energy < 90) {
					result += t.getDebuff(this, 'Horrify', 2, {}, false, '', ccChance);
				}

				activeQueue.push([this, t, damageResult.damageAmount + damageResult2.damageAmount, damageResult.critted || damageResult2.critted]);
			}
		}

		return result;
	}
}


class Flora extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.50, attackPercent: 0.35, crit: 0.30, speed: 80 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.40, attackPercent: 0.25, crit: 0.30, speed: 60 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventEnemyActive', 'eventEnemyBasic'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyActive(trigger[2], trigger[3]);
		}

		return result;
	}


	eventEnemyActive(target, e) {
		let result = '';
		let allDamageDealtLost = 0.10;
		let attackPercentGained = 0.15;
		let maxStackCount = 3;

		if (this._voidLevel >= 3) {
			allDamageDealtLost = 0.15;
			attackPercentGained = 0.20;
			maxStackCount = 2;
		}


		if (target._currentStats['totalHP'] > 0) {
			for (const source of e) {
				if (this.heroDesc() == source[1].heroDesc()) {
					let stackCount = 0;

					if ('All Damage Dealt' in target._debuffs) {
						stackCount = Object.keys(target._debuffs['All Damage Dealt']).length;
					}

					if (stackCount < maxStackCount) {
						result += target.getDebuff(this, 'All Damage Dealt', 4, { allDamageDealt: allDamageDealtLost });
					}

					break;
				}
			}
		}

		result += this.getBuff(this, 'Attack Percent', 4, { attackPercent: attackPercentGained });

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult;
		let damageResult2 = { damageAmount: 0, critted: false };
		const targets = getRandomTargets(this, this._enemies, 2);
		const maxPoison = this._currentStats.totalAttack * 15;

		let damagePercent = 1.6;
		let poisonPercent = 0.15;
		let healPercent = 0.15;

		if (this._voidLevel >= 2) {
			damagePercent = 3;
			poisonPercent = 0.18;
			healPercent = 0.18;
		}


		for (const t of targets) {
			const targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(t, this._currentStats.totalAttack * damagePercent, 'basic', 'normal');
				result += t.takeDamage(this, 'Basic Attack', damageResult);

				if (t._currentStats.totalHP > 0) {
					let poisonAmount = t._stats.totalHP * poisonPercent;
					if (poisonAmount > maxPoison) poisonAmount = maxPoison;

					damageResult2 = this.calcDamage(t, poisonAmount, 'basic', 'poisonTrue', 1, 1, 2);
					result += t.getDebuff(this, 'Poison True', 2, { poisonTrue: damageResult2['damageAmount'] }, false, 'basic');
				}

				basicQueue.push([this, t, damageResult.damageAmount + damageResult2.damageAmount, damageResult.critted || damageResult2.critted]);
			}
		}


		const healAmount = this.calcHeal(this, this._stats.totalHP * healPercent);
		result += this.getBuff(this, 'Heal', 2, { heal: healAmount });

		return result;
	}


	doActive() {
		let result = '';
		let damageResult;
		let lastTarget = 0;
		const alreadyTargeted = {};

		let damagePercent = 4;
		let twineChance = 0.30;
		let damagePercentIncrease = 1;

		if (this._voidLevel >= 4) {
			damagePercent = 5;
			twineChance = 0.45;
			damagePercentIncrease = 1.2;
		}


		for (let i = 1; i <= 6; i++) {
			const targets = getRandomTargets(this, this._enemies, 2);
			let target;

			if (targets.length == 0) {
				break;
			} else if (lastTarget == targets[0]._heroPos) {
				if (targets.length == 1) {
					break;
				} else {
					target = targets[1];
				}
			} else {
				target = targets[0];
			}


			const targetLock = target.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(target, this._currentStats.totalAttack, 'active', 'normal', damagePercent);
				result += target.takeDamage(this, 'Flora\'s Pixie', damageResult);
				result += target.getDebuff(this, 'twine', 2, {}, false, '', twineChance);

				if (target._heroPos in alreadyTargeted) {
					alreadyTargeted[target._heroPos][2] += damageResult['damageAmount'];
					alreadyTargeted[target._heroPos][3] = alreadyTargeted[target._heroPos][3] || damageResult['critted'];
				} else {
					alreadyTargeted[target._heroPos] = [this, target, damageResult['damageAmount'], damageResult['critted']];
				}
			}

			lastTarget = target._heroPos;
			damagePercent += damagePercentIncrease;
			twineChance += 0.05;
		}


		for (const i in alreadyTargeted) {
			activeQueue.push(alreadyTargeted[i]);
		}

		return result;
	}
}


class Inosuke extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.35, attackPercent: 0.45, controlImmune: 0.30, speed: 80, critDamageReduce: 0.30 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.25, attackPercent: 0.35, controlImmune: 0.30, speed: 60, critDamageReduce: 0.25 }, 'PassiveStats');
		}
	}


	endOfRound() {
		let result = super.endOfRound();
		let hpDamagePercent = 0.40;
		if (this._voidLevel >= 3) hpDamagePercent = 0.50;


		if ('Swordwind Shield' in this._buffs) {
			const targets = getRandomTargets(this, this._enemies, 1);
			const maxDamage = this._currentStats.totalAttack * 15;

			for (const t of targets) {
				let damageAmount = t._currentStats.totalHP * hpDamagePercent;
				if (damageAmount > maxDamage) damageAmount = maxDamage;

				const damageResult = this.calcDamage(this, damageAmount, 'passive', 'normal');
				result += t.takeDamage(this, 'Raid Wind', damageResult);
			}
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult;
		const targets = getRandomTargets(this, this._enemies, 3);
		const maxShield = this._currentStats.totalAttack * 50;
		let damageDealt = 0;

		let damagePercent = 3;
		let shieldPercent = 0.50;
		let attackPercentGained = 0.30;
		let critDamageGained = 0.20;

		if (this._voidLevel >= 2) {
			damagePercent = 6;
			shieldPercent = 0.60;
			attackPercentGained = 0.35;
			critDamageGained = 0.25;
		}


		for (const t of targets) {
			const targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(t, this._currentStats.totalAttack * damagePercent, 'basic', 'normal');
				result += t.takeDamage(this, 'Basic Attack', damageResult);
				damageDealt += damageResult.damageAmount;
				basicQueue.push([this, t, damageResult.damageAmount, damageResult.critted]);
			}
		}


		let shieldAmount = Math.floor(damageDealt * shieldPercent);

		if ('Swordwind Shield' in this._buffs) {
			const buffStack = Object.values(this._buffs['Swordwind Shield'])[0];

			if (shieldAmount + buffStack.effects.attackAmount > maxShield) {
				buffStack.effects.attackAmount = maxShield;
			} else {
				buffStack.effects.attackAmount += shieldAmount;
			}
		} else {
			if (shieldAmount > maxShield) shieldAmount = maxShield;

			if (shieldAmount > 0) {
				result += this.getBuff(this, 'Swordwind Shield', 127, { attackAmount: shieldAmount });
			}
		}

		result += this.getBuff(this, 'Attack Percent', 4, { attackPercent: attackPercentGained });
		result += this.getBuff(this, 'Crit Damage', 4, { critDamage: critDamageGained });

		return result;
	}


	doActive() {
		let result = '';
		let damageResult;
		const targets = getRandomTargets(this, this._enemies, 3);
		const maxShield = this._currentStats.totalAttack * 50;
		let damageDealt = 0;
		let canCrit = 1;
		let extraHit = false;
		let hpDamageResult = { damageAmount: 0 };

		if ('Swordwind Shield' in this._buffs) {
			canCrit = 2;
			extraHit = true;
		}

		let damagePercent = 12;
		let shieldPercent = 0.50;
		let hpDamagePercent = 0.80;

		if (this._voidLevel >= 4) {
			damagePercent = 20;
			shieldPercent = 0.60;
			hpDamagePercent = 0.90;
		}


		for (const t of targets) {
			const targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(t, this._currentStats.totalAttack, 'active', 'normal', damagePercent, canCrit);
				result += t.takeDamage(this, 'Justicial Strike', damageResult);
				damageDealt += damageResult.damageAmount;
				activeQueue.push([this, t, damageResult.damageAmount + hpDamageResult.damageAmount, damageResult.critted]);
			}
		}


		if (extraHit) {
			const target = getRandomTargets(this, targets, 1);

			if (target.length > 0) {
				const maxHPDamage = this._currentStats.totalAttack * 50;
				let hpDamage = Math.floor(target[0]._currentStats.totalHP * hpDamagePercent);

				if (hpDamage > maxHPDamage) hpDamage = maxHPDamage;
				hpDamageResult = this.calcDamage(target[0], hpDamage, 'active', 'true', 1);
				extraHit = false;

				result += target[0].takeDamage(this, 'Justicial Strike HP', hpDamageResult);
				damageDealt += hpDamageResult.damageAmount;
			}
		}


		let shieldAmount = Math.floor(damageDealt * shieldPercent);

		if ('Swordwind Shield' in this._buffs) {
			const buffStack = Object.values(this._buffs['Swordwind Shield'])[0];

			if (shieldAmount + buffStack.effects.attackAmount > maxShield) {
				buffStack.effects.attackAmount = maxShield;
			} else {
				buffStack.effects.attackAmount += shieldAmount;
			}
		} else {
			if (shieldAmount > maxShield) shieldAmount = maxShield;

			if (shieldAmount > 0) {
				result += this.getBuff(this, 'Swordwind Shield', 127, { attackAmount: shieldAmount });
			}
		}

		return result;
	}
}


class Morax extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.40, hpPercent: 0.50, crit: 0.30, precision: 0.90, effectBeingHealed: 0.50 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.30, hpPercent: 0.40, crit: 0.30, precision: 0.70, effectBeingHealed: 0.40 }, 'PassiveStats');
		}
	}


	startOfBattle() {
		let result = this.getBuff(this, 'Extra Ammo', 127);
		result += this.getBuff(this, 'Extra Ammo', 127);
		result += this.battleFrenzy();
		return result;
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (trigger[1] == 'eventSelfBasic' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfBasic();
		}

		return result;
	}


	eventSelfBasic() {
		let result = '';
		let extraAmmoChance = 0;
		if (this._voidLevel >= 2) extraAmmoChance = 0.50;

		result += this.getBuff(this, 'Extra Ammo', 127);
		result += this.getBuff(this, 'Extra Ammo', 127);
		if (random() < extraAmmoChance) result += this.getBuff(this, 'Extra Ammo', 127);


		const listDebuffs = [];

		for (const d in this._debuffs) {
			if (isDispellable(d)) {
				listDebuffs.push(d);
			}
		}

		const rng = Math.floor(random() * listDebuffs.length);

		if (listDebuffs.length > 0) {
			result += '<div>' + this.heroDesc() + ' <span class=\'skill\'>Armament</span> removed debuff.</div>';
			result += this.removeDebuff(listDebuffs[rng]);
		}

		return result;
	}


	takeDamage(source, strAttackDesc, damageResult) {
		let result = super.takeDamage(source, strAttackDesc, damageResult);
		result += this.battleFrenzy();
		return result;
	}


	getHP(source, amountHealed) {
		let result = super.getHP(source, amountHealed);
		result += this.battleFrenzy();
		return result;
	}


	getHeal(source, amountHealed) {
		let result = super.getHeal(source, amountHealed);
		result += this.battleFrenzy();
		return result;
	}


	battleFrenzy() {
		let result = '';
		let maxADD = 1.2;
		let maxADR = 0.40;

		if (this._voidLevel >= 3) {
			maxADD = 1.6;
			maxADR = 0.50;
		}

		const currentHPPercent = 1 - (this._currentStats.totalHP / this._stats.totalHP);
		const allDamageReduceGained = maxADR * currentHPPercent;
		const allDamageDealtGained = maxADD * currentHPPercent;

		if ('Battle Frenzy' in this._buffs) {
			const buffStack = Object.values(this._buffs['Battle Frenzy'])[0];

			this._currentStats.allDamageReduce -= buffStack.effects.allDamageReduce;
			this._currentStats.allDamageDealt -= buffStack.effects.allDamageDealt;

			this._currentStats.allDamageReduce += allDamageReduceGained;
			this._currentStats.allDamageDealt += allDamageDealtGained;
			buffStack.effects.allDamageReduce = allDamageReduceGained;
			buffStack.effects.allDamageDealt = allDamageDealtGained;
		} else {
			result += this.getBuff(this, 'Battle Frenzy', 127, { allDamageReduce: allDamageReduceGained, allDamageDealt: allDamageDealtGained });
		}

		return result;
	}


	doActive() {
		let result = '';
		let numAttacks = 1;
		const alreadyTargeted = {};

		let damagePercent = 6;
		let burnDamageTakenGained = -0.30;

		if (this._voidLevel >= 4) {
			damagePercent = 8;
			burnDamageTakenGained = -0.40;
		}


		if ('Extra Ammo' in this._buffs) {
			numAttacks += Object.keys(this._buffs['Extra Ammo']).length;
			result += this.removeBuff('Extra Ammo');
		}


		for (let i = 0; i < numAttacks; i++) {
			const targets = getRandomTargets(this, getBackTargets(this, this._enemies), 1);

			for (const t of targets) {
				const targetLock = t.getTargetLock(this);
				result += targetLock;

				if (targetLock == '') {
					const damageResult = this.calcDamage(t, this._currentStats['totalAttack'], 'active', 'normal', damagePercent);
					result += t.takeDamage(this, 'Hellish Smash', damageResult);

					const burnDamageResult = this.calcDamage(t, this._currentStats['totalAttack'], 'active', 'burn', damagePercent, 0, 2);
					result += t.getDebuff(this, 'Burn', 2, { burn: burnDamageResult['damageAmount'] });

					result += t.getDebuff(this, 'Burn Damage Taken', 2, { burnDamageTaken: burnDamageTakenGained });


					if (t._heroPos in alreadyTargeted) {
						alreadyTargeted[t._heroPos][2] += damageResult['damageAmount'];
						alreadyTargeted[t._heroPos][3] = alreadyTargeted[t._heroPos][3] || damageResult['critted'];
					} else {
						alreadyTargeted[t._heroPos] = [this, t, damageResult['damageAmount'], damageResult['critted']];
					}
				}
			}
		}


		for (const i in alreadyTargeted) {
			activeQueue.push(alreadyTargeted[i]);
		}

		return result;
	}
}


class Phorcys extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ hpPercent: 0.30, attackPercent: 0.50, skillDamage: 0.90, controlImmune: 0.30, speed: 100 }, 'PassiveStats');
		} else {
			this.applyStatChange({ hpPercent: 0.20, attackPercent: 0.40, skillDamage: 0.70, controlImmune: 0.30, speed: 80 }, 'PassiveStats');
		}
	}


	endOfRound() {
		let result = super.endOfRound();
		const maxDamage = this._currentStats.totalAttack * 15;
		const targets = getAllTargets(this, this._enemies);

		let damagePercent = 0.08;
		if (this._voidLevel >= 3) damagePercent = 0.10;

		for (const target of targets) {
			let hpDamage = target._stats.totalHP * damagePercent;
			if (hpDamage > maxDamage) hpDamage = maxDamage;

			const damageResult = this.calcDamage(target, hpDamage, 'passive', 'true');
			result += target.takeDamage(this, 'Soul Resonance', damageResult);

			if (this.getSoulCorruptionAmount(target) < 0.40) {
				result += target.getDebuff(this, 'Soul Corruption', 6, { corruptedHP: damagePercent });
			}
		}

		return result;
	}


	getSoulCorruptionAmount(target) {
		let soulCorruptionAmount = 0;

		if ('Soul Corruption' in target._debuffs) {
			for (const stack of Object.values(target._debuffs['Soul Corruption'])) {
				soulCorruptionAmount += stack.effects.corruptedHP;
			}
		}

		return soulCorruptionAmount;
	}


	doBasic() {
		let result = '';
		let damageResult;
		const targets = getHighestAttackTargets(this, this._enemies, 1);

		let damagePercent = 6;
		let allDamageDealtPercentReduced = 0.25;

		if (this._voidLevel >= 2) {
			damagePercent = 8;
			allDamageDealtPercentReduced = 0.30;
		}


		for (const target of targets) {
			const targetLock = target.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(target, this._currentStats.totalAttack * damagePercent, 'basic', 'normal');
				result += target.takeDamage(this, 'Basic Attack', damageResult);
				result += target.getDebuff(this, 'Dark Coil', 3, { allDamageDealt: allDamageDealtPercentReduced }, false, '', 0, true);
				basicQueue.push([this, target, damageResult.damageAmount, damageResult.critted]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult;
		const targets = getRandomTargets(this, this._enemies, 4);

		let damagePercent = 8;
		let codPercent = 15;

		if (this._voidLevel >= 4) {
			damagePercent = 14;
			codPercent = 25;
		}


		for (const target of targets) {
			const targetLock = target.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(target, this._currentStats.totalAttack, 'active', 'normal', damagePercent);
				result += target.takeDamage(this, 'Imminent Doom', damageResult);


				const attributeBuffs = [];
				for (const [buffName, buff] of Object.entries(target._buffs)) {
					if (!isDispellable(buffName)) continue;

					for (const stack of Object.values(buff)) {
						if (isAttribute(buffName, stack.effects)) {
							attributeBuffs.push(buffName);
							break;
						}
					}
				}

				if (attributeBuffs.length > 0) {
					const randomKey = Math.floor(random() * attributeBuffs.length);
					result += target.removeBuff(attributeBuffs[randomKey]);
				}


				const snapshotDamage = this._currentStats.totalAttack * codPercent;
				result += target.getDebuff(this, 'Curse of Decay', 127, { attackAmount: snapshotDamage });
				result += target.getDebuff(this, 'Curse of Decay', 127, { attackAmount: snapshotDamage });
				result += target.getDebuff(this, 'Curse of Decay', 127, { attackAmount: snapshotDamage });


				activeQueue.push([this, target, damageResult.damageAmount, damageResult.critted]);
			}
		}

		return result;
	}
}


class SwordFlashXia extends hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		super(sHeroName, iHeroPos, attOrDef);
		this._stats['blockDodgeCount'] = 0;
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventSelfActive', 'eventSelfBasic'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSelfActive();
		} else if (trigger[1] == 'eventSharpness' && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventSharpness();
		} else if (trigger[1] == 'eventEnemyDied' && trigger[2].heroDesc() == this.heroDesc() && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventEnemyDied();
		}

		return result;
	}


	eventSelfActive() {
		return this.getBuff(this, 'Sharpness', 127, { dodge: 1 });
	}


	eventEnemyDied() {
		return this.getBuff(this, 'Impeccable Flow', 127);
	}


	takeDamage(source, strAttackDesc, damageResult) {
		let result = super.takeDamage(source, strAttackDesc, damageResult);

		if (damageResult.blocked) {
			result += this.willOfTheSword();
			// triggerQueue.push([this, 'eventTookDamage']);
		}

		return result;
	}


	getTargetLock(source) {
		let result = super.getTargetLock(source);

		if (result != '') {
			result += this.willOfTheSword();

			if ('Sharpness' in this._buffs) {
				const stackKey = Object.keys(this._buffs['Sharpness'])[0];
				result += this.removeBuff('Sharpness', stackKey);
				triggerQueue.push([this, 'eventSharpness']);
			}
		}

		return result;
	}


	eventSharpness() {
		let result = '';
		let targets = getLowestHPPercentTargets(this, this._enemies, 1);

		let damagePercent = 7.5;
		let hpDamagePercent = 0.15;

		if (this._voidLevel >= 2) {
			damagePercent = 10;
			hpDamagePercent = 0.25;
		}


		for (const target of targets) {
			const damageResult = this.calcDamage(target, this._currentStats.totalAttack * damagePercent, 'passive', 'normal', undefined, undefined, undefined, undefined, 0);
			result += target.takeDamage(this, 'Retaliation Strike', damageResult);

			if (target._currentStats.totalHP > 0) {
				result += target.takeDamage(this, 'Retaliation Strike', damageResult);
			}
		}


		if (random() < 0.33) {
			let hpDamage = hpDamagePercent * this._stats.totalHP;
			const maxDamage = 15 * this._currentStats.totalAttack;
			if (hpDamage > maxDamage) hpDamage = maxDamage;
			targets = getAllTargets(this, this._enemies);

			for (const target of targets) {
				const damageResult = this.calcDamage(target, hpDamage, 'passive', 'true');
				result += target.takeDamage(this, 'Retaliation Strike - HP', damageResult);
			}
		}

		return result;
	}


	willOfTheSword() {
		let result = '';
		let countTrigger = 8;

		if (this._voidLevel >= 3) countTrigger = 6;
		this._currentStats.blockDodgeCount++;


		while (this._currentStats.blockDodgeCount >= countTrigger) {
			this._currentStats.blockDodgeCount -= countTrigger;
			result = this.getBuff(this, 'Impeccable Flow', 127);
		}

		return result;
	}


	doBasic() {
		let result = '';
		let stackKey = null;
		const targets = getLowestHPPercentTargets(this, this._enemies, 1);
		let damagePercent = 1.6;
		let healPercent = 0.75;
		let damageDealt = 0;
		let critted = false;

		if (this._voidLevel >= 1) {
			damagePercent = 2;
			healPercent = 1;
		}


		if ('Impeccable Flow' in this._buffs) {
			stackKey = Object.keys(this._buffs['Impeccable Flow'])[0];
			damagePercent *= 2;
		}


		for (const target of targets) {
			const targetLock = target.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				for (let i = 1; i <= 5; i++) {
					if (target._currentStats.totalHP > 0) {
						const damageResult = this.calcDamage(target, this._currentStats.totalAttack * damagePercent, 'basic', 'normal', undefined, undefined, undefined, undefined, 0);
						result += target.takeDamage(this, 'Glowing Blade', damageResult);
						damageDealt += damageResult.damageAmount;
						critted = critted || damageResult.critted;
					}
				}

				basicQueue.push([this, target, damageDealt, critted]);
			}
		}


		if (stackKey) {
			const healAmount = healPercent * damageDealt;
			const healResult = this.calcHeal(this, healAmount);
			result += this.getHeal(this, healResult);
			result += this.removeBuff('Impeccable Flow', stackKey);
		}

		return result;
	}


	doActive() {
		let result = '';
		let stackKey = null;
		let targets;
		let baseDamagePercent = 3.2;
		let damageDealt = 0;

		if (this._voidLevel >= 4) baseDamagePercent = 4;


		if ('Impeccable Flow' in this._buffs) {
			stackKey = Object.keys(this._buffs['Impeccable Flow'])[0];
			targets = getAllTargets(this, this._enemies);
		} else {
			targets = getLowestHPPercentTargets(this, this._enemies, 1);
		}


		for (const target of targets) {
			let critted = false;
			let didLock = false;
			let heroDamageDealt = 0;
			let damagePercent = baseDamagePercent;

			for (let i = 1; i <= 3; i++) {
				if (target._currentStats.totalHP <= 0) break;

				const targetLock = target.getTargetLock(this);
				result += targetLock;

				if (targetLock == '') {
					const damageResult = this.calcDamage(target, this._currentStats.totalAttack, 'active', 'normal', damagePercent, undefined, undefined, undefined, 0);
					result += target.takeDamage(this, 'Void Crusher', damageResult);
					damageDealt += damageResult.damageAmount;
					heroDamageDealt += damageResult.damageAmount;
					critted = critted || damageResult.critted;
					didLock = true;
				}

				damagePercent *= 2;
			}

			if (didLock)	activeQueue.push([this, target, heroDamageDealt, critted]);
		}


		if (stackKey) {
			const healAmount = 0.30 * damageDealt;
			const healResult = this.calcHeal(this, healAmount);
			result += this.getHeal(this, healResult);
			result += this.removeBuff('Impeccable Flow', stackKey);
		}

		return result;
	}
}


class ScarletQueenHalora extends hero {
	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);


		if (['eventEnemyActive', 'eventEnemyBasic'].includes(trigger[1]) && this._currentStats.totalHP > 0 && this.isNotSealed()) {
			result += this.eventEnemyActive(trigger[2], trigger[3]);
		}

		return result;
	}


	eventEnemyActive(target, events) {
		let result = '';
		let damagePercent = 8;
		if (this._voidLevel >= 3) damagePercent = 10;


		for (const e of events) {
			if (e[1].heroDesc() != this.heroDesc()) continue;

			const allies = getAllTargets(this, this._allies);
			for (const ally of allies) {
				if (!('Queen\'s Guard' in ally._buffs && ally.isNotSealed())) continue;

				const damageResult = ally.calcDamage(target, ally._currentStats['totalAttack'] * damagePercent, 'passive', 'normal');
				result += target.takeDamage(ally, 'Queen\'s Guard', damageResult);
			}

			break;
		}

		return result;
	}


	startOfBattle() {
		let result = '';
		let allDamageDealtGained = 0.15;
		if (this._voidLevel >= 3) allDamageDealtGained = 0.20;

		const allies = getAllTargets(this, this._allies);
		for (const ally of allies) {
			if (ally.heroDesc() != this.heroDesc()) {
				result += ally.getBuff(this, 'Queen\'s Guard', 127);
				result += ally.getBuff(this, 'All Damage Dealt', 127, { allDamageDealt: allDamageDealtGained });
			}
		}

		return result;
	}


	endOfRound() {
		let result = super.endOfRound();
		let healPercent = 0.04;
		let numAlive = 0;

		if (this._voidLevel >= 2) healPercent = 0.06;

		const allies = getAllTargets(this, this._allies);
		for (const ally of allies) {
			if (ally._currentStats.totalHP > 0) numAlive++;
		}


		if (numAlive > 0) {
			const healAmount = this.calcHeal(this, this._stats['totalHP'] * healPercent * numAlive);
			result += this.getHeal(this, healAmount);
		}

		return result;
	}


	doBasic() {
		let result = '';
		const targets = getRandomTargets(this, this._enemies, 3);
		let damagePercent = 8;
		let critLost = 0.20;
		let critGained = 0.10;
		let critDamageGained = 0.10;

		if (this._voidLevel >= 1) {
			damagePercent = 10;
			critLost = 0.25;
			critGained = 0.20;
			critDamageGained = 0.15;
		}


		for (const target of targets) {
			const targetLock = target.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				const damageResult = this.calcDamage(target, this._currentStats.totalAttack * damagePercent, 'basic', 'normal');
				result += target.takeDamage(this, 'Queen\'s Edict', damageResult);
				result += target.getDebuff(this, 'Crit', 2, { crit: critLost });
				basicQueue.push([this, target, damageResult.damageAmount, damageResult.critted]);
			}
		}

		result += this.getBuff(this, 'Crit', 4, { crit: critGained });
		result += this.getBuff(this, 'Crit Damage', 4, { critDamage: critDamageGained });

		return result;
	}


	doActive() {
		let result = '';
		const targets = getAllTargets(this, this._enemies);
		let damagePercent = 12.8;
		let critDamageLost = 0.10;
		let critDamageReduceLost = 0.15;

		if (this._voidLevel >= 4) {
			damagePercent = 16;
			critDamageLost = 0.20;
			critDamageReduceLost = 0.20;
		}


		for (const target of targets) {
			const targetLock = target.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				const damageResult = this.calcDamage(target, this._currentStats.totalAttack, 'active', 'normal', damagePercent);
				let bleedDamageResult = { damageAmount: 0 };

				result += target.takeDamage(this, 'Crimson Abyss', damageResult);

				if (target._currentStats.totalHP > 0) {
					bleedDamageResult = this.calcDamage(target, this._currentStats.totalAttack, 'active', 'bleeed', damagePercent, undefined, 2);
					result += target.getDebuff(this, 'Bleed', 2, { bleed: bleedDamageResult.damageAmount }, undefined, 'active');
				}

				result += target.getDebuff(this, 'Abyssal Corruption', 127, { critDamage: critDamageLost, critDamageReduce: critDamageReduceLost });

				activeQueue.push([this, target, damageResult.damageAmount + bleedDamageResult.damageAmount, damageResult.critted]);
			}
		}

		return result;
	}
}


class Tussilago extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.40, crit: 0.30, holyDamage: 1, controlImmune: 0.30, speed: 80 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.30, crit: 0.30, holyDamage: 0.80, controlImmune: 0.30, speed: 60 }, 'PassiveStats');
		}
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventAllyActive', 'eventAllyBasic'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventAllyActive(trigger[3]);
		} else if (['eventSelfBasic', 'eventSelfActive'].includes(trigger[1]) && this._currentStats['totalHP'] > 0 && this.isNotSealed()) {
			result += this.eventAllyActive(trigger[2]);
		}

		return result;
	}


	eventAllyActive(e) {
		let result = '';
		let didCrit = false;
		let healPercent = 2;
		let debuffChance = 0.70;

		if (this._voidLevel >= 3) {
			healPercent = 3;
			debuffChance = 0.80;
		}


		for (const i in e) {
			if (e[i][3] == true) didCrit = true;
		}


		if (didCrit) {
			const healAmount = this.calcHeal(this, this._currentStats.totalAttack * healPercent);
			result += this.getHeal(this, healAmount);
		}


		if (random() < debuffChance) {
			const targets = getLowestHPPercentTargets(this, this._enemies, 2);

			for (const t of targets) {
				result += t.getDebuff(this, 'Sacred Emblem Mark', 127);
			}
		}

		return result;
	}


	doBasic() {
		let result = '';
		const targets = getLowestHPPercentTargets(this, this._enemies, 1);
		let damagePercent = 2;
		if (this._voidLevel >= 2) damagePercent = 2.4;


		for (const t of targets) {
			const targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				const markCount = 'Sacred Emblem Mark' in t._debuffs ? Object.keys(t._debuffs['Sacred Emblem Mark']).length : 0;
				let damageResult2 = { damageAmount: 0, critted: false };

				const damageResult = this.calcDamage(t, this._currentStats.totalAttack * damagePercent, 'basic', 'normal');
				result += t.takeDamage(this, 'Justice Shall Prevail', damageResult);

				if (t._currentStats.totalHP > 0 && markCount >= 1) {
					damageResult2 = this.calcDamage(t, this._currentStats.totalAttack * damagePercent, 'basic', 'normal');
					result += t.takeDamage(this, 'Justice Shall Prevail 2', damageResult2);
				}

				result += t.getDebuff(this, 'Sacred Emblem Mark', 127);
				basicQueue.push([this, t, damageResult.damageAmount + damageResult2.damageAmount, damageResult.critted || damageResult2.critted]);
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		const targets = getMostSacredEmblemTargets(this, this._enemies, 2);
		let damagePercent = 3.2;
		let divinePercent = 10;

		if (this._voidLevel >= 4) {
			damagePercent = 4;
			divinePercent = 12.5;
		}


		for (const t of targets) {
			const targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				const markCount = 'Sacred Emblem Mark' in t._debuffs ? Object.keys(t._debuffs['Sacred Emblem Mark']).length : 0;
				let damageResult2 = { damageAmount: 0, critted: false };
				let damageResult3 = { damageAmount: 0, critted: false };
				const damageResult4 = { damageAmount: 0, critted: false, blocked: false, damageSource: 'mark', damageType: 'true' };

				const damageResult = this.calcDamage(t, this._currentStats.totalAttack, 'active', 'normal', damagePercent);
				result += t.takeDamage(this, 'Punish the Sinners', damageResult);

				if (t._currentStats.totalHP > 0 && markCount >= 1) {
					damageResult2 = this.calcDamage(t, this._currentStats.totalAttack, 'active', 'normal', damagePercent);
					result += t.takeDamage(this, 'Punish the Sinners 2', damageResult2);
				}

				if (t._currentStats.totalHP > 0 && markCount >= 3) {
					damageResult3 = this.calcDamage(t, this._currentStats.totalAttack, 'active', 'normal', damagePercent);
					result += t.takeDamage(this, 'Punish the Sinners 3', damageResult3);
				}

				if (t._currentStats.totalHP > 0 && markCount >= 5) {
					damageResult4.damageAmount = divinePercent * this._currentStats.totalAttack;
					result += t.takeDamage(this, 'Divine Retribution', damageResult4, true);
					result += t.removeDebuff('Sacred Emblem Mark');
				}

				activeQueue.push([this, t, damageResult.damageAmount + damageResult2.damageAmount + damageResult3.damageAmount + damageResult4.damageAmount, damageResult.critted || damageResult2.critted || damageResult3.critted]);
			}
		}

		return result;
	}
}


class AsmodelTheDauntless extends hero {
	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if (['eventEnemyActive', 'eventEnemyBasic'].includes(trigger[1]) && this._currentStats.totalHP > 0 && this.isNotSealed()) {
			result += this.eventEnemyActive(trigger[2]);
		} else if (trigger[1] == 'eventAllyDied' && this._currentStats.totalHP > 0 && this.isNotSealed() && !isMonster(trigger[2])) {
			result += this.eventAllyDied(trigger[2]);
		}

		return result;
	}


	eventAllyDied(source) {
		let result = '';
		let healPercent = 0.12;
		let allDamageDealtGained = 0.12;

		if (this._voidLevel >= 2) {
			healPercent = 0.15;
			allDamageDealtGained = 0.15;
		}


		const healAmount = this.calcHeal(this, this._stats.totalHP * healPercent);
		result += this.getHeal(this, healAmount);
		result += this.getHeal(this, healAmount);
		result += this.getBuff(this, 'All Damage Dealt', 127, { allDamageDealt: allDamageDealtGained });

		result += source.getDebuff(this, 'Revenge', 127);
		result += source.getDebuff(this, 'Revenge', 127);

		return result;
	}


	eventEnemyActive(source) {
		let result = '';
		let critGained = 0.08;
		if (this._voidLevel >= 3) critGained = 0.10;

		result += source.getDebuff(this, 'Revenge', 127);
		result += this.getBuff(this, 'Crit', 3, { crit: critGained });

		return result;
	}


	startOfBattle() {
		let result = '';
		let allDamageReduceGained = 0.25;
		if (this._voidLevel >= 3) allDamageReduceGained = 0.35;

		const targets = getLowestHPPercentTargets(this, this._allies, 1);

		for (const t of targets) {
			result += t.getBuff(this, 'Glorious Support', 1, { allDamageReduce: allDamageReduceGained });
		}

		return result;
	}


	endOfRound() {
		const result = super.endOfRound();
		return result + this.startOfBattle();
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		let hpDamageResult = { damageAmount: 0 };
		const targets = getFrontTargets(this, this._enemies);
		let targetLock;
		const maxHPDamage = 15 * this._currentStats.totalAttack;

		let damagePercent = 6;
		let hpDamagePercent = 0.12;
		let controlImmuneGained = 0.15;

		if (this._voidLevel >= 1) {
			damagePercent = 7.5;
			hpDamagePercent = 0.15;
			controlImmuneGained = 0.20;
		}


		for (const t of targets) {
			targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(t, this._currentStats.totalAttack * damagePercent, 'basic', 'normal');
				result += t.takeDamage(this, 'Basic Attack', damageResult);

				if (t._currentStats.totalHP > 0) {
					let hpDamageAmount = t._stats.totalHP * hpDamagePercent;
					if (hpDamageAmount > maxHPDamage) hpDamageAmount = maxHPDamage;

					hpDamageResult = this.calcDamage(t, hpDamageAmount, 'basic', 'true');
					result += t.takeDamage(this, 'Basic Attack - HP', damageResult);
				}

				basicQueue.push([this, t, damageResult.damageAmount + hpDamageResult.damageAmount, damageResult.critted]);
			}
		}


		result += this.getBuff(this, 'Control Immune', 3, { controlImmune: controlImmuneGained });
		return result;
	}


	doActive() {
		let result = '';
		const alreadyTargeted = {};
		let damageResult = {};
		let targets = getBackTargets(this, this._enemies);
		let targetLock;

		let damagePercent = 8;
		let armorLost = 0.35;
		let speedLost = 50;
		let chariotDamagePercent = 6.4;

		if (this._voidLevel >= 4) {
			damagePercent = 10;
			armorLost = 0.50;
			speedLost = 80;
			chariotDamagePercent = 8;
		}


		for (const t of targets) {
			targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(t, this._currentStats.totalAttack, 'active', 'normal', damagePercent);
				result += t.takeDamage(this, 'Dauntless Smash', damageResult);

				result += t.getDebuff(this, 'Armor Percent', 4, { armorPercent: armorLost });
				result += t.getDebuff(this, 'Speed', 4, { speed: speedLost });

				alreadyTargeted[t._heroPos] = [this, t, damageResult.damageAmount, damageResult.critted];
			}
		}


		targets = getAllTargets(this, this._enemies);

		for (const t of targets) {
			targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				let damageDone = 0;
				let didCrit = false;

				let chariotDamageResult = this.calcDamage(t, this._currentStats.totalAttack, 'active', 'normal', chariotDamagePercent);
				result += t.takeDamage(this, 'Heavenly Chariot', chariotDamageResult);
				damageDone += chariotDamageResult.damageAmount;
				didCrit = didCrit || chariotDamageResult.critted;


				if ('Revenge' in t._debuffs) {
					const chariotKeys = Object.keys(t._debuffs['Revenge']);
					let chariotCount = 0;

					for (const chariotKey of chariotKeys) {
						if (t._currentStats.totalHP <= 0) break;

						chariotDamageResult = this.calcDamage(t, this._currentStats.totalAttack, 'active', 'normal', chariotDamagePercent);
						result += t.takeDamage(this, 'Heavenly Chariot', chariotDamageResult);
						damageDone += chariotDamageResult.damageAmount;
						didCrit = didCrit || chariotDamageResult.critted;
						result += t.removeDebuff('Revenge', chariotKey);

						chariotCount++;
						if (chariotCount >= 3) break;
					}
				}


				if (t._heroPos in alreadyTargeted) {
					alreadyTargeted[t._heroPos][2] += damageDone;
					alreadyTargeted[t._heroPos][3] = alreadyTargeted[t._heroPos][3] || didCrit;
				} else {
					alreadyTargeted[t._heroPos] = [this, t, damageDone, didCrit];
				}
			}
		}


		for (const i in alreadyTargeted) {
			activeQueue.push(alreadyTargeted[i]);
		}

		return result;
	}
}


class Eloise extends hero {
	constructor(sHeroName, iHeroPos, attOrDef) {
		super(sHeroName, iHeroPos, attOrDef);
		this._stats['blockCount'] = 0;
	}


	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.30, hpPercent: 0.40, block: 0.70, controlImmune: 0.30, speed: 50 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.20, hpPercent: 0.30, block: 0.60, controlImmune: 0.30, speed: 40 }, 'PassiveStats');
		}
	}


	endOfRound() {
		let result = '';
		let damageDone = 0;

		for (const target of this._enemies) {
			if (!('Scarred Soul' in target._debuffs)) continue;

			for (const stack of Object.values(target._debuffs['Scarred Soul'])) {
				if (stack.source._heroPos != this._heroPos) continue;
				if (target._currentStats.totalHP <= 0) continue;

				const damageResult = { ...stack.effects.attackAmount };
				result += this.takeDamage(this, 'Scarred Soul', damageResult);
				damageDone += damageResult.damageAmount;
			}
		}


		if (this._currentStats.totalHP > 0) {
			const healAmount = this.calcHeal(this, damageDone * 0.25);
			result += this.getHeal(this, healAmount);
		}

		return result;
	}


	handleTrigger(trigger) {
		let result = super.handleTrigger(trigger);

		if ((trigger[1] == 'eventEnemyDied' || trigger[1] == 'eventAllyDied') && this._currentStats.totalHP > 0 && this.isNotSealed()) {
			result += this.eventAllyDied();
		} else if (trigger[1] == 'eventTookDamage' && this._currentStats.totalHP > 0 && this.isNotSealed() && !this.isUnderStandardControl()) {
			result += this.eventTookDamage();
		}

		return result;
	}


	eventAllyDied() {
		let result = '';
		const targets = getAllTargets(this, this._enemies);
		let precisionLost = 0.15;

		if (this._voidLevel >= 2) precisionLost = 0.20;

		for (const t of targets) {
			result += t.getDebuff(this, 'Precision', 6, { precision: precisionLost });
		}


		result += this.getBuff(this, 'Phantom Shadow', 127);
		return result;
	}


	eventTookDamage() {
		let result = '';
		const maxDamage = this._currentStats.totalAttack * 15;
		let phantomMultiplier = 1;
		let scarDamageDone = 0;

		let damagePercent = 4;
		let scarPercent = 0.03;

		if (this._voidLevel >= 3) {
			damagePercent = 6;
			scarPercent = 0.04;
		}

		if ('Phantom Shadow' in this._buffs) {
			const stackKey = Object.keys(this._buffs['Phantom Shadow'])[0];
			result += this.removeBuff('Phantom Shadow', stackKey);
			phantomMultiplier = 1.5;
		}


		if (this._currentStats.blockCount > 0) {
			this._currentStats.blockCount = 0;

			const targets = getRandomTargets(this, this._enemies, 3);

			for (const t of targets) {
				const damageResult = this.calcDamage(t, this._currentStats.totalAttack * damagePercent, 'passive', 'normal');
				result += t.takeDamage(this, 'Game of Danger', damageResult);

				let attackAmount = t._stats.totalHP * scarPercent;
				if (attackAmount > maxDamage) attackAmount = maxDamage;
				const scarDamageResult = this.calcDamage(t, attackAmount * phantomMultiplier, 'passive', 'true');

				result += t.getDebuff(this, 'Scarred Soul', 2, { attackAmount: scarDamageResult });
				result += t.takeDamage(this, 'Scarred Soul', { ...scarDamageResult });
				scarDamageDone += scarDamageResult.damageAmount;
			}
		}


		const healAmount = this.calcHeal(this, scarDamageDone * 0.25);
		result += this.getHeal(this, healAmount);

		return result;
	}


	takeDamage(source, strAttackDesc, damageResult) {
		const result = super.takeDamage(source, strAttackDesc, damageResult);

		if (damageResult.blocked == true) {
			this._currentStats.blockCount++;
			triggerQueue.push([this, 'eventTookDamage']);
		}

		return result;
	}


	doActive() {
		let result = '';
		let damageResult;
		const maxDamage = this._currentStats.totalAttack * 15;
		const targets = getRandomTargets(this, this._enemies, 3);
		let phantomMultiplier = 1;
		let scarDamageDone = 0;

		if ('Phantom Shadow' in this._buffs) {
			const stackKey = Object.keys(this._buffs['Phantom Shadow'])[0];
			result += this.removeBuff('Phantom Shadow', stackKey);
			phantomMultiplier = 1.5;
		}

		let damagePercent = 8;
		let scarPercent = 0.12;
		let attackPercentLost = 0.15;

		if (this._voidLevel >= 4) {
			damagePercent = 10;
			scarPercent = 0.16;
			attackPercentLost = 0.20;
		}


		for (const t of targets) {
			const targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(t, this._currentStats.totalAttack, 'active', 'normal', damagePercent);
				result += t.takeDamage(this, 'Mist Dance', damageResult);

				result += t.getDebuff(this, 'Attack Percent', 2, { attackPercent: attackPercentLost });

				let attackAmount = t._stats.totalHP * scarPercent;
				if (attackAmount > maxDamage) attackAmount = maxDamage;
				const scarDamageResult = this.calcDamage(t, attackAmount * phantomMultiplier, 'passive', 'true');

				result += t.getDebuff(this, 'Scarred Soul', 2, { attackAmount: scarDamageResult });
				result += t.takeDamage(this, 'Scarred Soul', { ...scarDamageResult });
				scarDamageDone += scarDamageResult.damageAmount;

				activeQueue.push([this, t, damageResult.damageAmount, damageResult.critted]);
			}
		}


		const healAmount = this.calcHeal(this, scarDamageDone * 0.25);
		result += this.getHeal(this, healAmount);

		return result;
	}
}


class Fiona extends hero {
	passiveStats() {
		if (this._voidLevel >= 1) {
			this.applyStatChange({ attackPercent: 0.35, hpPercent: 0.50, crit: 0.30, precision: 0.70 }, 'PassiveStats');
		} else {
			this.applyStatChange({ attackPercent: 0.25, hpPercent: 0.40, crit: 0.30, precision: 0.50 }, 'PassiveStats');
		}
	}


	startOfBattle() {
		let result = '';
		const targets = getAllTargets(this, this._allies);

		const maxShield = 50 * this._currentStats.totalAttack;
		let baseShieldAmount = 10 * this._currentStats.totalAttack;
		if (this._voidLevel >= 3) baseShieldAmount = 15 * this._currentStats.totalAttack;

		for (const t of targets) {
			if ('Fiona Shield' in t._buffs) {
				const shieldKey = Object.keys(t._buffs['Fiona Shield'])[0];
				let newShieldAmount = t._buffs['Fiona Shield'][shieldKey].effects.attackAmount + baseShieldAmount;
				if (newShieldAmount > maxShield) newShieldAmount = maxShield;
				t._buffs['Fiona Shield'][shieldKey].effects.attackAmount = newShieldAmount;
				result += `<div>Fiona Shield increased to ${newShieldAmount}.</div>`;
			} else {
				result += t.getBuff(this, 'Fiona Shield', 127, { attackAmount: baseShieldAmount });
			}

			result += t.getBuff(this, 'Redemption', 127, {}, true);
		}

		return result;
	}


	endOfRound() {
		let result = '';
		const targets = getLowestHPPercentTargets(this, this._allies, 2);

		const maxShield = 50 * this._currentStats.totalAttack;
		let shieldAmount = 5 * this._currentStats.totalAttack;
		if (this._voidLevel >= 3) shieldAmount = 7.5 * this._currentStats.totalAttack;

		for (const t of targets) {
			if ('Fiona Shield' in t._buffs) {
				const shieldKey = Object.keys(t._buffs['Fiona Shield'])[0];
				let newShieldAmount = t._buffs['Fiona Shield'][shieldKey].effects.attackAmount + shieldAmount;
				if (newShieldAmount > maxShield) newShieldAmount = maxShield;
				t._buffs['Fiona Shield'][shieldKey].effects.attackAmount = newShieldAmount;
				result += `<div>Fiona Shield increased to ${newShieldAmount}.</div>`;
			} else {
				result += t.getBuff(this, 'Fiona Shield', 127, { attackAmount: shieldAmount });
			}

			result += t.getBuff(this, 'Redemption', 127, {}, true);
		}

		return result;
	}


	doBasic() {
		let result = '';
		let damageResult = {};
		const targets = getSanctionTargets(this, this._enemies, 1);

		let damagePercent = 3.2;
		let controlRemovalChance = 0.9;

		if (this._voidLevel >= 2) {
			damagePercent = 4.8;
			controlRemovalChance = 1;
		}


		for (const t of targets) {
			const targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				damageResult = this.calcDamage(t, this._currentStats.totalAttack * damagePercent, 'basic', 'normal');
				result += t.takeDamage(this, 'This is my Goodwill', damageResult);
				result += t.getDebuff(this, 'Sanction Mark', 127);

				basicQueue.push([this, t, damageResult.damageAmount, damageResult.critted]);
			}
		}


		if (random() < controlRemovalChance) {
			const allies = getRandomTargets(this, this._allies);

			for (const a of allies) {
				if (a.isUnderControl()) {
					const controlDebuffs = [];

					for (const d of Object.keys(a._debuffs)) {
						if (isControlEffect(d)) controlDebuffs.push([d]);
					}

					result += a.removeDebuff(controlDebuffs[Math.floor(random() * controlDebuffs.length)]);
					break;
				}
			}
		}

		return result;
	}


	doActive() {
		let result = '';
		const targets = getSanctionTargets(this, this._enemies, 1);
		let damagePercent = 6;
		let shieldMult = 12;

		if (this._voidLevel >= 4) {
			damagePercent = 8;
			shieldMult = 20;
		}


		for (const t of targets) {
			const targetLock = t.getTargetLock(this);
			result += targetLock;

			if (targetLock == '') {
				let numAttacks = 1;
				let damageDone = 0;
				let critted = false;

				if ('Sanction Mark' in t._debuffs) {
					numAttacks += Object.keys(t._debuffs['Sanction Mark']).length;
					if (numAttacks > 8) numAttacks = 8;
				}

				for (let i = 1; i <= numAttacks; i++) {
					const damageResult = this.calcDamage(t, this._currentStats.totalAttack, 'active', 'normal', damagePercent);
					result += t.takeDamage(this, 'Taste My Hammer', damageResult);
					damageDone += damageResult.damageAmount;
					critted = critted || damageResult.critted;
				}

				result += t.getDebuff(this, 'Sanction Mark', 127);
				activeQueue.push([this, t, damageDone, critted]);
			}
		}


		const allies = getLowestHPPercentTargets(this, this._allies, 3);
		const maxShield = 50 * this._currentStats.totalAttack;
		const shieldAmount = shieldMult * this._currentStats.totalAttack;

		for (const a of allies) {
			if ('Fiona Shield' in a._buffs) {
				const shieldKey = Object.keys(a._buffs['Fiona Shield'])[0];
				let newShieldAmount = a._buffs['Fiona Shield'][shieldKey].effects.attackAmount + shieldAmount;
				if (newShieldAmount > maxShield) newShieldAmount = maxShield;
				a._buffs['Fiona Shield'][shieldKey].effects.attackAmount = newShieldAmount;
				result += `<div>Fiona Shield increased to ${newShieldAmount}.</div>`;
			} else {
				result += a.getBuff(this, 'Fiona Shield', 127, { attackAmount: shieldAmount });
			}

			result += a.getBuff(this, 'Redemption', 127, {}, true);
		}

		return result;
	}
}


const heroMapping = {
	'hero': hero,
	'Carrie': Carrie,
	'Sherlock': Sherlock,
	'Rogan': Rogan,
	'Russell': Russell,
	'Drake': Drake,
	'Ignis': Ignis,
	'Aida': Aida,
	'Garuda': Garuda,
	'Tix': Tix,
	'Michelle': Michelle,
	'AmenRa': AmenRa,
	'KingBarton': KingBarton,
	'Flora': Flora,
	'Aspen': Aspen,
	'Elyvia': Elyvia,
	'UniMax3000': UniMax3000,
	'Ormus': Ormus,
	'Belrain': Belrain,
	'Asmodel': Asmodel,
	'Kroos': Kroos,
	'Inosuke': Inosuke,
	'DasMoge': DasMoge,
	'Mihm': Mihm,
	'DarkArthindol': DarkArthindol,
	'Gustin': Gustin,
	'Emily': Emily,
	'Valkryie': Valkryie,
	'Horus': Horus,
	'Tara': Tara,
	'Nakia': Nakia,
	'Cthugha': Cthugha,
	'HeartWatcher': HeartWatcher,
	'Penny': Penny,
	'Xia': Xia,
	'Oberon': Oberon,
	'Ithaqua': Ithaqua,
	'Gerke': Gerke,
	'Delacium': Delacium,
	'Amuvor': Amuvor,
	'Sleepless': Sleepless,
	'FaithBlade': FaithBlade,
	'Morax': Morax,
	'Phorcys': Phorcys,
	'SwordFlashXia': SwordFlashXia,
	'ScarletQueenHalora': ScarletQueenHalora,
	'Tussilago': Tussilago,
	'AsmodelTheDauntless': AsmodelTheDauntless,
	'Eloise': Eloise,
	'Fiona': Fiona,
	'StarWingJahra': StarWingJahra,
	'Gloria': Gloria,
};


export { heroMapping };
