// node --max-old-space-size=4096 --expose-gc .\imp\exactMemo.js
const startOrdDice = 1;
const startLuckDice = 0;
const startStars = 198;
const startPos = 5;
const startDoubleNextRoll = false;
const startMoveBackwards = false;
const startDoubleStars = false;
const startRollTwice = false;
const startMushroom1 = 3;
const startMushroom2 = 3;
const startMushroom3 = 3;
const startBoardState = [0, 3, 3, 3, 2 + startMushroom1, 0, 3, 3, 3, 3, 0, 2 + startMushroom2, 3, 3, 3, 0, 3, 3, 2 + startMushroom3, 3, 0];

const importantTarot = [3, 5, 6, 7, 9];
const twoDiceDist = [[2, 1], [3, 2], [4, 3], [5, 4], [6, 5], [7, 6], [8, 5], [9, 4], [10, 3], [11, 2], [12, 1]];

// 32 dice takes roughly 6 minutes, anything more runs out of heap space
const maxDice = 32;


// const maxRss = 0;
// const maxHeapTotal = 0;
// const maxHeapUsed = 0;

// const start = new Date();
// eslint-disable-next-line no-unused-vars
const expectedValue = calcEV(startOrdDice, startLuckDice, startStars, startPos, startDoubleNextRoll, startMoveBackwards, startDoubleStars, startRollTwice, [...startBoardState]);
// const end = new Date();
// const secondsTaken = (end - start) / 1000;
// console.log(expectedValue, secondsTaken, maxRss / 1024 / 1024, maxHeapTotal / 1024 / 1024, maxHeapUsed / 1024 / 1024);


function calcEV(ordDice, luckDice, stars, pos, doubleNextRoll, moveBackwards, doubleStars, rollTwice, boardState, memo = new Map(), level = 0) {
	if (ordDice + luckDice > maxDice) throw new Error(`Maximum dice of ${maxDice} exceeded. Calculation will take too long.`);
	if ((doubleNextRoll || moveBackwards || doubleStars || rollTwice) && pos != 10) throw new Error('Tarot active but position not on tarot hut.');


	// recurse ending condition
	if (ordDice == 0 && luckDice == 0) {
		const endTier = calcTier(stars);
		return [stars, 'No dice left.', endTier];
	}


	// check stars needed for next tier
	// and end recursion if next tier can be reached by letting dice convert
	const starMod = stars % 300;
	let nextTier;

	if (starMod < 80) {
		nextTier = 80 - starMod;
	} else if (starMod < 110) {
		nextTier = 110 - starMod;
	} else if (starMod < 140) {
		nextTier = 140 - starMod;
	} else if (starMod < 170) {
		nextTier = 170 - starMod;
	} else if (starMod < 200) {
		nextTier = 200 - starMod;
	} else if (starMod < 230) {
		nextTier = 230 - starMod;
	} else if (starMod < 260) {
		nextTier = 260 - starMod;
	} else {
		nextTier = 300 - starMod;
	}

	if ((ordDice + luckDice) == Math.ceil(nextTier / 2)) {
		const finalStars = stars + (ordDice + luckDice) * 2;
		const endTier = calcTier(finalStars);
		return [finalStars, 'Let dice convert.', endTier];
	}


	// check memo
	const memoKey = `${ordDice},${luckDice},${stars},${pos},${doubleNextRoll},${moveBackwards},${doubleStars},${rollTwice},${boardState[4]},${boardState[11]},${boardState[18]}`;
	if (memo.has(memoKey)) {
		return memo.get(memoKey);
	}


	const luckyEV = [];
	const ordinaryEV = [];


	// EV of lucky dice
	if (luckDice > 0) {
		if (rollTwice) {
			const rollChoices = [8, 10];

			for (const roll of rollChoices) {
				const rollResults = resolveRoll(ordDice, luckDice - 1, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, 0);

				const rollEV = calcEV(
					rollResults.ordDice,
					rollResults.luckDice,
					rollResults.stars,
					rollResults.pos,
					rollResults.doubleNextRoll,
					rollResults.moveBackwards,
					rollResults.doubleStars,
					rollResults.rollTwice,
					rollResults.boardState,
					memo,
					level + 1,
				);

				rollEV[1] = `Use lucky dice to roll ${roll}.`;
				luckyEV.push(rollEV);
			}
		} else {
			let rollChoices;

			if (doubleNextRoll) {
				rollChoices = [4, 5];
			} else if (moveBackwards) {
				rollChoices = [1, 6];
			} else if (pos == 15) {
				rollChoices = [1, 2, 4, 5, 6];
			} else {
				rollChoices = [1, 2, 3, 4, 5, 6];
			}

			for (const roll of rollChoices) {
				if (pos + roll == 10 && ordDice + luckDice > 1) {
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
						memo,
						level + 1,
					);

					for (let i = 0; i < 4; i++) {
						tarotEV.push(unimportantTarot);
					}

					for (const tarot of importantTarot) {
						const rollResults = resolveRoll(ordDice, luckDice - 1, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, tarot);

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
							memo,
							level + 1,
						));
					}

					const tarotResults = tarotEV.reduce((prev, curr) => {
						return [curr[0] + prev[0], 'Use lucky dice.', curr[2] + prev[2]];
					}, [0, 'Use lucky dice.', 0]);

					tarotResults[0] /= tarotEV.length;
					tarotResults[1] = `Use lucky dice to roll ${roll}.`;
					tarotResults[2] /= tarotEV.length;
					luckyEV.push(tarotResults);

				} else {
					const rollResults = resolveRoll(ordDice, luckDice - 1, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, 0);

					const rollEV = calcEV(
						rollResults.ordDice,
						rollResults.luckDice,
						rollResults.stars,
						rollResults.pos,
						rollResults.doubleNextRoll,
						rollResults.moveBackwards,
						rollResults.doubleStars,
						rollResults.rollTwice,
						rollResults.boardState,
						memo,
						level + 1,
					);

					rollEV[1] = `Use lucky dice to roll ${roll}.`;
					luckyEV.push(rollEV);
				}
			}
		}
	}


	// EV of ordinary dice
	if (ordDice > 0) {
		if (rollTwice) {
			for (const roll of twoDiceDist) {
				const rollResults = resolveRoll(ordDice - 1, luckDice, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, 0);

				const tempEV = calcEV(
					rollResults.ordDice,
					rollResults.luckDice,
					rollResults.stars,
					rollResults.pos,
					rollResults.doubleNextRoll,
					rollResults.moveBackwards,
					rollResults.doubleStars,
					rollResults.rollTwice,
					rollResults.boardState,
					memo,
					level + 1,
				);

				tempEV[1] = 'Use ordinary dice.';

				for (let y = 0; y < roll[1]; y++) {
					ordinaryEV.push(tempEV);
				}
			}
		} else {
			for (let roll = 1; roll <= 6; roll++) {
				if (pos + roll == 10 && ordDice + luckDice > 1) {
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
						memo,
						level + 1,
					);

					for (let i = 0; i < 4; i++) {
						tarotEV.push(unimportantTarot);
					}

					for (const tarot of importantTarot) {
						const rollResults = resolveRoll(ordDice - 1, luckDice, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, tarot);

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
							memo,
							level + 1,
						));
					}

					const tarotResults = tarotEV.reduce((prev, curr) => {
						return [curr[0] + prev[0], 'Use ordinary dice.', curr[2] + prev[2]];
					}, [0, 'Use ordinary dice.', 0]);

					tarotResults[0] /= tarotEV.length;
					tarotResults[1] = 'Use ordinary dice.';
					tarotResults[2] /= tarotEV.length;
					ordinaryEV.push(tarotResults);

				} else {
					const rollResults = resolveRoll(ordDice - 1, luckDice, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, 0);

					const rollEV = calcEV(
						rollResults.ordDice,
						rollResults.luckDice,
						rollResults.stars,
						rollResults.pos,
						rollResults.doubleNextRoll,
						rollResults.moveBackwards,
						rollResults.doubleStars,
						rollResults.rollTwice,
						rollResults.boardState,
						memo,
						level + 1,
					);

					rollEV[1] = 'Use ordinary dice.';
					ordinaryEV.push(rollEV);
				}
			}
		}
	}


	// get max for lucky, avg for ordinary
	const luckyResults = luckyEV.reduce((prev, curr) => {
		if (curr[2] > prev[2]) {
			return curr;
		}if (curr[2] == prev[2] && curr[0] >= prev[0]) {
			return curr;
		} else {
			return prev;
		}
	}, [0, 'No lucky dice.', 0]);


	let ordinaryResults = [0, 'No ordinary dice.', 0];
	if (ordinaryEV.length > 0) {
		ordinaryResults = ordinaryEV.reduce((prev, curr) => {
			return [curr[0] + prev[0], 'Use ordinary dice.', curr[2] + prev[2]];
		}, [0, 'Use ordinary dice.', 0]);
		ordinaryResults[0] /= ordinaryEV.length;
		ordinaryResults[2] /= ordinaryEV.length;
	}

	/*
	if (level == 0) {
		console.log(memo.size);
	}

	const memoryUsage = process.memoryUsage();
	if (memoryUsage.rss > maxRss) maxRss = memoryUsage.rss;
	if (memoryUsage.heapTotal > maxHeapTotal) maxHeapTotal = memoryUsage.heapTotal;
	if (memoryUsage.heapUsed > maxHeapUsed) maxHeapUsed = memoryUsage.heapUsed;
	*/

	if (ordinaryResults[2] > luckyResults[2]) {
		memo.set(memoKey, ordinaryResults);
		return ordinaryResults;
	} else if (ordinaryResults[2] == luckyResults[2] && ordinaryResults[0] >= luckyResults[0]) {
		memo.set(memoKey, ordinaryResults);
		return ordinaryResults;
	} else {
		memo.set(memoKey, luckyResults);
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


function calcTier(stars) {
	if (stars >= 300) {
		return 8;
	} else if (stars >= 260) {
		return 7;
	} else if (stars >= 230) {
		return 6;
	} else if (stars >= 200) {
		return 5;
	} else if (stars >= 170) {
		return 4;
	} else if (stars >= 140) {
		return 3;
	} else if (stars >= 110) {
		return 2;
	} else if (stars >= 80) {
		return 1;
	} else {
		return 0;
	}
}


export { calcEV };