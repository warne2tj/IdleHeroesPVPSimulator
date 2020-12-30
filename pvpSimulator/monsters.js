import { isDot, getRandomTargets } from './utilityFunctions.js';


class monster {
	constructor(sMonsterName, attOrDef) {
		this._monsterName = sMonsterName;
		this._attOrDef = attOrDef;
		this._heroClass = 'monster';
		this._allies = [];
		this._enemies = [];

		this._currentStats = {
			'damageDealt': 0,
			'damageHealed': 0,
			'healEffect': 0.0,
		};

		this._energy = 0;
	}


	heroDesc() {
		return '<span class=\'' + this._attOrDef + '\'>' + this._monsterName + ' (' + this._energy + ' energy)</span>';
	}


	calcDamage(target, attackDamage, damageSource, damageType) {
		let damageAmount = attackDamage;
		let allDamageReduce = target._currentStats['allDamageReduce'];
		let dotReduce = 0;

		if (isDot(damageType)) {
			dotReduce = target._currentStats['dotReduce'];
		}

		if (allDamageReduce > 0.75) allDamageReduce = 0.75;
		if (dotReduce > 1) dotReduce = 1;

		damageAmount = Math.floor(damageAmount * (1 - allDamageReduce) * (1 - dotReduce));
		if (damageAmount < 1) damageAmount = 1;

		return {
			'damageAmount': damageAmount,
			'critted': false,
			'blocked': false,
			'damageSource': damageSource,
			'damageType': damageType,
		};
	}


	calcHeal(target, healAmount) {
		let effectBeingHealed = 1 + target._currentStats['effectBeingHealed'];
		if (effectBeingHealed < 0) { effectBeingHealed = 0; }

		return Math.floor(healAmount * effectBeingHealed);
	}


	doActive() {
		let result = '';

		result = '<div><span class=\'' + this._attOrDef + '\'>' + this._monsterName + '</span> used <span class=\'skill\'>Active Template</span>.</div>';

		this._energy = 0;
		return result;
	}
}


class mDyne extends monster {
	doActive() {
		let result = '';
		let damageResult = [];
		let targets = getRandomTargets(this, this._enemies, 4);

		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], 402068, 'monster', 'true');
			result += targets[i].takeDamage(this, 'Emerald Nourishing', damageResult);
		}


		let healAmount = 0;
		targets = getRandomTargets(this, this._allies, 4);

		for (const i in targets) {
			result += targets[i].getBuff(this, 'Armor Percent', 2, { armorPercent: 0.37 });
			result += targets[i].getBuff(this, 'Attack Percent', 2, { attackPercent: 0.15 });

			healAmount = this.calcHeal(targets[i], targets[i]._stats['totalHP'] * 0.2);
			result += targets[i].getHeal(this, healAmount);
		}

		this._energy = 0;

		return result;
	}
}


class mFenlier extends monster {
	doActive() {
		let result = '';
		let damageResult = [];
		let targets = getRandomTargets(this, this._enemies, 4);

		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], 602441, 'monster', 'true');
			result += targets[i].takeDamage(this, 'Violent Bite', damageResult);

			damageResult = this.calcDamage(targets[i], 559177, 'monster', 'bleedTrue');
			result += targets[i].getDebuff(this, 'Bleed True', 3, { bleedTrue: damageResult['damageAmount'] }, false, 'monster');
		}


		targets = getRandomTargets(this, this._allies, 4);
		for (const i in targets) {
			result += targets[i].getBuff(this, 'Damage Against Bleeding', 3, { damageAgainstBleeding: 0.8 });
		}

		this._energy = 0;

		return result;
	}
}


class mFox extends monster {
	doActive() {
		let result = '';
		let damageResult = [];
		let targets = getRandomTargets(this, this._enemies, 4);

		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], 636573, 'monster', 'true');
			result += targets[i].takeDamage(this, 'Soul Shock', damageResult);
			result += targets[i].getDebuff(this, 'Silence', 2, {}, false, '', 0.40);
		}

		targets = getRandomTargets(this, this._allies, 4);
		for (const i in targets) {
			result += targets[i].getEnergy(this, 62);
		}

		this._energy = 0;

		return result;
	}
}


class mIceGolem extends monster {
	doActive() {
		let result = '';
		let damageResult = [];
		let targets = getRandomTargets(this, this._enemies, 4);

		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], 809114, 'monster', 'true');
			result += targets[i].takeDamage(this, 'Frozen', damageResult);
			result += targets[i].getDebuff(this, 'freeze', 2, {}, false, '', 0.36);
		}

		targets = getRandomTargets(this, this._allies, 4);
		for (const i in targets) {
			result += targets[i].getBuff(this, 'Damage Against Frozen', 2, { damageAgainstFrozen: 1.2 });
		}

		this._energy = 0;

		return result;
	}
}


class mJormangund extends monster {
	doActive() {
		let result = '';
		let damageResult = [];
		let targets = getRandomTargets(this, this._enemies, 4);

		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], 593312, 'monster', 'true');
			result += targets[i].takeDamage(this, 'Toxic Track', damageResult);

			damageResult = this.calcDamage(targets[i], 548328, 'monster', 'poisonTrue');
			result += targets[i].getDebuff(this, 'Poison', 3, { poisonTrue: damageResult['damageAmount'] }, false, 'monster');
		}


		targets = getRandomTargets(this, this._allies, 4);
		for (const i in targets) {
			result += targets[i].getBuff(this, 'Damage Against Poisoned', 3, { damageAgainstPoisoned: 0.8 });
		}

		this._energy = 0;

		return result;
	}
}


class mNiederhog extends monster {
	doActive() {
		let result = '';
		let damageResult = [];
		let targets = getRandomTargets(this, this._enemies, 4);

		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], 809114, 'monster', 'true');
			result += targets[i].takeDamage(this, 'Dragon Sigh', damageResult);
			result += targets[i].getDebuff(this, 'stun', 2, {}, false, '', 0.36);
		}

		targets = getRandomTargets(this, this._allies, 4);
		for (const i in targets) {
			result += targets[i].getBuff(this, 'Holy Damage', 2, { holyDamage: 0.75 });
		}

		this._energy = 0;

		return result;
	}
}


class mPhoenix extends monster {
	doActive() {
		let result = '';
		let damageResult = [];
		let targets = getRandomTargets(this, this._enemies, 4);

		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], 451830, 'monster', 'true');
			result += targets[i].takeDamage(this, 'Blazing Spirit', damageResult);

			damageResult = this.calcDamage(targets[i], 363465, 'monster', 'burnTrue');
			result += targets[i].getDebuff(this, 'Burn True', 3, { burnTrue: damageResult['damageAmount'] }, false, 'monster');
		}


		let healAmount = 0;
		targets = getRandomTargets(this, this._allies, 4);
		for (const i in targets) {
			healAmount = this.calcHeal(targets[i], 500535);
			result += targets[i].getBuff(this, 'Heal', 3, { heal: healAmount });
			result += targets[i].getBuff(this, 'Damage Against Burning', 15, { damageAgainstBurning: 0.8 });
		}

		this._energy = 0;

		return result;
	}
}


class mSphinx extends monster {
	doActive() {
		let result = '';
		let damageResult = [];
		let targets = getRandomTargets(this, this._enemies, 4);

		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], 636141, 'monster', 'true');
			result += targets[i].takeDamage(this, 'Subduction Hit', damageResult);
			result += targets[i].getDebuff(this, 'Armor Percent', 3, { armorPercent: 0.37 });
			result += targets[i].getDebuff(this, 'Speed', 3, { speed: 37 });
		}


		targets = getRandomTargets(this, this._allies, 4);
		for (const i in targets) {
			result += targets[i].getBuff(this, 'Attack Percent', 2, { attackPercent: 0.25 });
		}

		this._energy = 0;

		return result;
	}
}


class mStoneGolem extends monster {
	doActive() {
		let result = '';
		let damageResult = [];
		let targets = getRandomTargets(this, this._enemies, 4);

		for (const i in targets) {
			damageResult = this.calcDamage(targets[i], 809114, 'monster', 'true');
			result += targets[i].takeDamage(this, 'Death Stares', damageResult);
			result += targets[i].getDebuff(this, 'petrify', 2, {}, false, '', 0.36);
		}

		targets = getRandomTargets(this, this._allies, 4);
		for (const i in targets) {
			result += targets[i].getBuff(this, 'Crit Damage', 2, { critDamage: 0.75 });
		}

		this._energy = 0;

		return result;
	}
}


const monsterMapping = {
	'monster': monster,
	'mStoneGolem': mStoneGolem,
	'mPhoenix': mPhoenix,
	'mFox': mFox,
	'mJormangund': mJormangund,
	'mIceGolem': mIceGolem,
	'mFenlier': mFenlier,
	'mDyne': mDyne,
	'mNiederhog': mNiederhog,
	'mSphinx': mSphinx,
};


export { monsterMapping };