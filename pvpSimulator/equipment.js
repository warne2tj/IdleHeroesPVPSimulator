const weapons = {
	'None': {
		set: '',
		stats: {},
		limit: '',
		limitStats: {},
	},

	'Warrior\'s Epee': {
		set: '',
		stats: { attack: 3704, attackPercent: 0.07 },
		limit: 'Warrior',
		limitStats: { attackPercent: 0.06, block: 0.1 },
	},

	'Weaver\'s Staff': {
		set: '',
		stats: { attack: 3704, attackPercent: 0.07 },
		limit: 'Mage',
		limitStats: { attackPercent: 0.06, crit: 0.05 },
	},

	'Minstrel\'s Bow': {
		set: '',
		stats: { attack: 3704, attackPercent: 0.07 },
		limit: 'Ranger',
		limitStats: { attackPercent: 0.06, crit: 0.05 },
	},

	'Assassin\'s Blade': {
		set: '',
		stats: { attack: 3704, attackPercent: 0.07 },
		limit: 'Assassin',
		limitStats: { attackPercent: 0.06, crit: 0.05 },
	},

	'Oracle\'s Staff': {
		set: '',
		stats: { attack: 3704, attackPercent: 0.07 },
		limit: 'Priest',
		limitStats: { attackPercent: 0.06, attackPercent2: 0.05 },
	},

	'6* Thorny Flame Whip': {
		set: 'Thorny Flame Suit',
		stats: { attack: 3704, critDamage: 0.05 },
		limit: '',
		limitStats: {},
	},

	'5* Glory Warrior Sword': {
		set: 'Glory Suit',
		stats: { attack: 2464, critDamage: 0.03 },
		limit: '',
		limitStats: {},
	},
};


const armors = {
	'None': {
		set: '',
		stats: {},
		limit: '',
		limitStats: {},
	},

	'Warrior\'s Armor': {
		set: '',
		stats: { hp: 52449, hpPercent: 0.07 },
		limit: 'Warrior',
		limitStats: { hpPercent: 0.06, damageReduce: 0.05 },
	},

	'Weaver\'s Robe': {
		set: '',
		stats: { hp: 52449, hpPercent: 0.07 },
		limit: 'Mage',
		limitStats: { hpPercent: 0.06, precision: 0.1 },
	},

	'Minstrel\'s Cape': {
		set: '',
		stats: { hp: 52449, hpPercent: 0.07 },
		limit: 'Ranger',
		limitStats: { hpPercent: 0.06, block: 0.05 },
	},

	'Assassin\'s Cape': {
		set: '',
		stats: { hp: 52449, hpPercent: 0.07 },
		limit: 'Assassin',
		limitStats: { hpPercent: 0.06, armorBreak: 0.1 },
	},

	'Oracle\'s Cape': {
		set: '',
		stats: { hp: 52449, hpPercent: 0.07 },
		limit: 'Priest',
		limitStats: { hpPercent: 0.06, damageReduce: 0.05 },
	},

	'6* Flame Armor': {
		set: 'Thorny Flame Suit',
		stats: { hp: 52449, damageReduce: 0.02 },
		limit: '',
		limitStats: {},
	},

	'5* Glory Armor': {
		set: 'Glory Suit',
		stats: { hp: 32455, damageReduce: 0.01 },
		limit: '',
		limitStats: {},
	},
};


const shoes = {
	'None': {
		set: '',
		stats: {},
		limit: '',
		limitStats: {},
	},

	'Warrior\'s Boots': {
		set: '',
		stats: { hp: 32367, hpPercent: 0.07 },
		limit: 'Warrior',
		limitStats: { hpPercent: 0.06, speed: 20 },
	},

	'Weaver\'s Boots': {
		set: '',
		stats: { hp: 32367, hpPercent: 0.07 },
		limit: 'Mage',
		limitStats: { hpPercent: 0.06, speed: 20 },
	},

	'Minstrel\'s Boots': {
		set: '',
		stats: { hp: 32367, hpPercent: 0.07 },
		limit: 'Ranger',
		limitStats: { hpPercent: 0.06, speed: 20 },
	},

	'Assassin\'s Boots': {
		set: '',
		stats: { hp: 32367, hpPercent: 0.07 },
		limit: 'Assassin',
		limitStats: { hpPercent: 0.06, speed: 20 },
	},

	'Oracle\'s Boots': {
		set: '',
		stats: { hp: 32367, hpPercent: 0.07 },
		limit: 'Priest',
		limitStats: { hpPercent: 0.06, speed: 20 },
	},

	'6* Flame Boots': {
		set: 'Thorny Flame Suit',
		stats: { hp: 32367, block: 0.04 },
		limit: '',
		limitStats: {},
	},

	'5* Glory Boots': {
		set: 'Glory Suit',
		stats: { hp: 20146, block: 0.02 },
		limit: '',
		limitStats: {},
	},
};


const accessories = {
	'None': {
		set: '',
		stats: {},
		limit: '',
		limitStats: {},
	},

	'Warrior\'s Necklace': {
		set: '',
		stats: { attack: 2469, attackPercent: 0.07 },
		limit: 'Warrior',
		limitStats: { attackPercent: 0.06, controlImmune: 0.05 },
	},

	'Weaver\'s Necklace': {
		set: '',
		stats: { attack: 2469, attackPercent: 0.07 },
		limit: 'Mage',
		limitStats: { attackPercent: 0.06, skillDamage: 0.1 },
	},

	'Minstrel\'s Ring': {
		set: '',
		stats: { attack: 2469, attackPercent: 0.07 },
		limit: 'Ranger',
		limitStats: { attackPercent: 0.06, damageReduce: 0.05 },
	},

	'Assassin\'s Ring': {
		set: '',
		stats: { attack: 2469, attackPercent: 0.07 },
		limit: 'Assassin',
		limitStats: { attackPercent: 0.06, critDamage: 0.05 },
	},

	'Ring of the Oracle': {
		set: '',
		stats: { attack: 2469, attackPercent: 0.07 },
		limit: 'Priest',
		limitStats: { attackPercent: 0.06, hpPercent: 0.05 },
	},

	'6* Flame Necklace': {
		set: 'Thorny Flame Suit',
		stats: { attack: 2469, skillDamage: 0.05 },
		limit: '',
		limitStats: {},
	},

	'5* Glory Ring': {
		set: 'Glory Suit',
		stats: { attack: 1643, skillDamage: 0.03 },
		limit: '',
		limitStats: {},
	},
};


// Set order seems to matter, ordered in order of weakest to strongest set.
const setBonus = {
	'Glory Suit': {
		2: { hpPercent: 0.15 },
		3: { attackPercent: 0.2 },
		4: { hpPercent: 0.08 },
	},

	'Thorny Flame Suit': {
		2: { hpPercent: 0.16 },
		3: { attackPercent: 0.21 },
		4: { hpPercent: 0.08 },
	},
};


// for mass testing
const classGearMapping = {
	'Warrior': {
		weapon: 'Warrior\'s Epee',
		armor: 'Warrior\'s Armor',
		shoe: 'Warrior\'s Boots',
		accessory: 'Warrior\'s Necklace',
	},

	'Mage': {
		weapon: 'Weaver\'s Staff',
		armor: 'Weaver\'s Robe',
		shoe: 'Weaver\'s Boots',
		accessory: 'Weaver\'s Necklace',
	},

	'Ranger': {
		weapon: 'Minstrel\'s Bow',
		armor: 'Minstrel\'s Cape',
		shoe: 'Minstrel\'s Boots',
		accessory: 'Minstrel\'s Ring',
	},

	'Assassin': {
		weapon: 'Assassin\'s Blade',
		armor: 'Assassin\'s Cape',
		shoe: 'Assassin\'s Boots',
		accessory: 'Assassin\'s Ring',
	},

	'Priest': {
		weapon: 'Oracle\'s Staff',
		armor: 'Oracle\'s Cape',
		shoe: 'Oracle\'s Boots',
		accessory: 'Ring of the Oracle',
	},
};


export { weapons, shoes, accessories, armors, setBonus, classGearMapping };