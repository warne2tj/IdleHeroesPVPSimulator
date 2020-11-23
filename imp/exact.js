const startOrdDice = 3;
const startLuckDice = 3;
const startStars = 0;
const startPos = 14;
const startDoubleNextRoll = false;
const startMoveBackwards = false;
const startDoubleStars = false;
const startRollTwice = false;
const startMushroom1 = 3;
const startMushroom2 = 3;
const startMushroom3 = 3;
const startBoardState = [0, 3, 3, 3, 2 + startMushroom1, 0, 3, 3, 3, 3, 0, 2 + startMushroom2, 3, 3, 3, 0, 3, 3, 2 + startMushroom3, 3, 0];
const importantTarot = [3, 5, 6, 7, 9];
const maxDice = 6;

const start = new Date();
const expectedValue = calcEV(startOrdDice, startLuckDice, startStars, startPos, startDoubleNextRoll, startMoveBackwards, startDoubleStars, startRollTwice, [...startBoardState]);
const end = new Date();
console.log(expectedValue, (end - start) / 1000);


function calcEV(ordDice, luckDice, stars, pos, doubleNextRoll, moveBackwards, doubleStars, rollTwice, boardState) {
	if (ordDice + luckDice > maxDice) throw new Error(`Maximum dice of ${maxDice} exceeded. Calculation will take too long.`);

	// recurse ending condition
	if (ordDice == 0 && luckDice == 0) return [stars, 'No dice left.'];


	// check stars needed for next tier
	// and end recursion if next tier can be reached by letting dice convert
	const starMod = stars % 300;
	let nextTier;

	if (starMod < 200) {
		nextTier = 200 - starMod;
	} else if (starMod < 230) {
		nextTier = 230 - starMod;
	} else if (starMod < 260) {
		nextTier = 260 - starMod;
	} else {
		nextTier = 300 - starMod;
	}

	if ((ordDice + luckDice) * 2 >= nextTier) {
		return [stars + (ordDice + luckDice) * 2, 'Let dice convert.'];
	}


	// get EV of using dice
	const luckyEV = [];
	const ordinaryEV = [];
	let roll = 0;
	let rollResults;


	// EV of lucky dice
	if (luckDice > 0) {
		for (let x = 1; x <= 6; x++) {
			roll = x;

			if (rollTwice) {
				for (let y = 1; y <= 6; y++) {
					roll += y;
				}
			}

			if (pos + roll == 10) {
				const tarotEV = [];

				const unimportantRollResults = resolveRoll(ordDice, luckDice - 1, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, 1);
				const unimportantTarot = calcEV(
					unimportantRollResults.ordDice,
					unimportantRollResults.luckDice,
					unimportantRollResults.stars,
					unimportantRollResults.pos,
					unimportantRollResults.doubleNextRoll,
					unimportantRollResults.moveBackwards,
					unimportantRollResults.doubleStars,
					unimportantRollResults.rollTwice,
					unimportantRollResults.boardState,
				);

				for (let i = 0; i < 4; i++) {
					tarotEV.push(unimportantTarot);
				}

				for (const tarot of importantTarot) {
					rollResults = resolveRoll(ordDice, luckDice - 1, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, tarot);

					tarotEV.push(calcEV(
						rollResults.ordDice,
						rollResults.luckDice,
						rollResults.stars,
						rollResults.pos,
						rollResults.doubleNextRoll,
						rollResults.moveBackwards,
						rollResults.doubleStars,
						rollResults.rollTwice,
						rollResults.boardState,
					));
				}

				const tarotResults = tarotEV.reduce((prev, curr) => {
					return curr[0] + prev;
				}, 0) / tarotEV.length;

				luckyEV.push([tarotResults, `Use lucky to roll ${roll}.`]);

			} else {
				rollResults = resolveRoll(ordDice, luckDice - 1, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, 0);

				luckyEV.push(calcEV(
					rollResults.ordDice,
					rollResults.luckDice,
					rollResults.stars,
					rollResults.pos,
					rollResults.doubleNextRoll,
					rollResults.moveBackwards,
					rollResults.doubleStars,
					rollResults.rollTwice,
					rollResults.boardState,
				));
			}
		}
	}


	// EV of ordinary dice
	if (ordDice > 0) {
		for (let x = 1; x <= 6; x++) {
			roll = x;

			if (rollTwice) {
				for (let y = 1; y <= 6; y++) {
					roll += y;
				}
			}

			if (pos + roll == 10) {
				const tarotEV = [];

				const unimportantRollResults = resolveRoll(ordDice - 1, luckDice, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, 1);
				const unimportantTarot = calcEV(
					unimportantRollResults.ordDice,
					unimportantRollResults.luckDice,
					unimportantRollResults.stars,
					unimportantRollResults.pos,
					unimportantRollResults.doubleNextRoll,
					unimportantRollResults.moveBackwards,
					unimportantRollResults.doubleStars,
					unimportantRollResults.rollTwice,
					unimportantRollResults.boardState,
				);

				for (let i = 0; i < 4; i++) {
					tarotEV.push(unimportantTarot);
				}

				for (const tarot of importantTarot) {
					rollResults = resolveRoll(ordDice - 1, luckDice, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, tarot);

					tarotEV.push(calcEV(
						rollResults.ordDice,
						rollResults.luckDice,
						rollResults.stars,
						rollResults.pos,
						rollResults.doubleNextRoll,
						rollResults.moveBackwards,
						rollResults.doubleStars,
						rollResults.rollTwice,
						rollResults.boardState,
					));
				}

				const tarotResults = tarotEV.reduce((prev, curr) => {
					return curr[0] + prev;
				}, 0) / tarotEV.length;

				ordinaryEV.push([tarotResults, 'Ordinary tarot.']);

			} else {
				rollResults = resolveRoll(ordDice - 1, luckDice, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, 0);

				ordinaryEV.push(calcEV(
					rollResults.ordDice,
					rollResults.luckDice,
					rollResults.stars,
					rollResults.pos,
					rollResults.doubleNextRoll,
					rollResults.moveBackwards,
					rollResults.doubleStars,
					rollResults.rollTwice,
					rollResults.boardState,
				));
			}
		}
	}


	// get max for lucky, avg for ordinary
	const luckyResults = luckyEV.reduce((prev, curr, index) => {
		if (curr[1] == 'Let dice convert.') {
			return curr;
		} else if (curr[0] > prev[0]) {
			curr[1] = `Use lucky dice to roll ${index + 1}`;
			return curr;
		} else {
			return prev;
		}
	}, [0, 'No lucky dice.']);


	let ordinaryResults = 0;
	if (ordinaryEV.length > 0) {
		ordinaryResults = ordinaryEV.reduce((prev, curr) => {
			return curr[0] + prev;
		}, 0) / ordinaryEV.length;
	}


	if (ordinaryResults >= luckyResults[0]) {
		return [ordinaryResults, 'Use ordinary dice.'];
	} else {
		return luckyResults;
	}
}


function resolveRoll(ordDice, luckDice, stars, pos, doubleNextRoll, moveBackwards, doubleStars, rollTwice, boardState, roll, tarot) {
	if (doubleNextRoll) {
		doubleNextRoll = false;
		roll *= 2;
	}

	// resolve roll
	if (pos == 15 && roll % 2 == 1) {
		// odd number on karma
		pos -= roll;

	} else if (moveBackwards) {
		// move backwards tarot
		moveBackwards = false;
		pos -= roll;

	} else {
		// check starry mushrooms
		if (pos < 4 && pos + roll >= 4) {
			stars += boardState[4];
		} else if(pos >= 18 && roll >= (6 - pos + 18)) {
			stars += boardState[4];
		}

		if (pos < 11 && pos + roll >= 11) {
			stars += boardState[11];

			if (doubleStars) {
				doubleStars = false;
				stars += boardState[11];
			}
		}

		if (pos < 18 && pos + roll >= 18) {
			stars += boardState[18];
		}

		// resolve current location
		pos = ((pos + roll - 1) % 20) + 1;

		if ((pos % 5) != 0) {
			if (boardState[pos] < 5) { boardState[pos]++; }
		}

		if (pos == 5) {
			ordDice++;
		} else if (pos == 20) {
			luckDice++;
		} else if (pos == 10) {
			// tarot card
			if (tarot == 3) {
				moveBackwards = true;
			} else if (tarot == 5) {
				doubleStars = true;
			} else if (tarot == 6) {
				doubleNextRoll = true;
			} else if (tarot == 7) {
				pos = 0;
			} else if (tarot == 9) {
				rollTwice = true;
			}

		}
	}

	return {
		ordDice,
		luckDice,
		stars,
		pos,
		doubleNextRoll,
		moveBackwards,
		doubleStars,
		rollTwice,
		boardState,
	};
}