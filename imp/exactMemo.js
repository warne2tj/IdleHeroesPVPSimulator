// 48 dice takes roughly 22 minutes, anything more runs out of heap space
// need additional heap space if calculating large numbers of dice
// node --max-old-space-size=10000 --expose-gc .\imp\exactMemo.js

const importantTarot = [3, 5, 6, 7, 9];
const twoDiceDist = [[2, 1], [3, 2], [4, 3], [5, 4], [6, 5], [7, 6], [8, 5], [9, 4], [10, 3], [11, 2], [12, 1]];
const luckyChoices = [
	[4, 5, 6],
	[3, 4, 6],
	[2, 3, 6],
	[1, 2, 6],
	[1, 5, 6],
	[5, 6],
	[4, 5, 6],
	[3, 4, 6],
	[3, 6],
	[2, 5],
	[1, 6],
	[6],
	[6],
	[5, 6],
	[4, 6],
	[2, 4, 5, 6],
	[2, 4],
	[1, 3],
	[2, 6],
	[1, 5, 6],
	[4, 5, 6],
];


const nodeJSMode = typeof window === 'undefined' ? true : false;

if (nodeJSMode) {
	const startOrdDice = 25;
	const startLuckDice = 1;
	const startStars = 111;
	const startPos = 19;
	const startMushroom1 = 2;
	const startMushroom2 = 3;
	const startMushroom3 = 2;
	const startDoubleNextRoll = false;
	const startMoveBackwards = false;
	const startDoubleStars = false;
	const startRollTwice = false;
	const startBoardState = [0, 3, 3, 3, 2 + startMushroom1, 0, 3, 3, 3, 3, 0, 2 + startMushroom2, 3, 3, 3, 0, 3, 3, 2 + startMushroom3, 3, 0];

	const start = new Date();
	const expectedValue = calcEV(startOrdDice, startLuckDice, startStars, startPos, startDoubleNextRoll, startMoveBackwards, startDoubleStars, startRollTwice, [...startBoardState]);
	const end = new Date();
	const secondsTaken = (end - start) / 1000;
	console.log(expectedValue, secondsTaken);
}


function calcEV(ordDice, luckDice, stars, pos, doubleNextRoll, moveBackwards, doubleStars, rollTwice, boardState, memos = [new Map()], level = 0) {
	const totalDice = ordDice + luckDice;

	// recurse ending condition
	if (ordDice <= 0 && luckDice <= 0) {
		const endTier = calcTier(stars);
		return [stars, endTier, -2];
	}

	// check memo
	const memoKey = `${ordDice},${luckDice},${stars},${pos},${doubleNextRoll ? 1 : 0}${moveBackwards ? 1 : 0}${doubleStars ? 1 : 0}${rollTwice ? 1 : 0}${boardState[4]}${boardState[11]}${boardState[18]}`;

	for (const memo of memos) {
		const memoValue = memo.get(memoKey);
		if (memoValue) return [memoValue[0], memoValue[1], 0];
	}


	// calc ev of letting dice convert
	const convertStars = stars + totalDice * 2;
	const convertTier = calcTier(convertStars);
	const convertEV = [convertStars, convertTier, -1];


	const luckyEV = [0, 0, 6];
	const ordinaryEV = [0, 0, 0];


	// EV of lucky dice
	if (luckDice > 0) {
		let rollChoices;

		if (doubleNextRoll && luckDice > 1) {
			rollChoices = [4, 5];
		} else if (doubleNextRoll) {
			rollChoices = [5];
		} else if (moveBackwards) {
			rollChoices = [1];
		} else if (rollTwice && luckDice > 1) {
			rollChoices = [8, 10];
		} else if (rollTwice) {
			rollChoices = [10];
		} else {
			rollChoices = luckyChoices[pos];
		}


		for (const roll of rollChoices) {
			if (pos + roll == 10 && ordDice + luckDice > 1) {
				const tarotEV = [0, 0, 6];


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
					memos,
					level + 1,
				);

				tarotEV[0] += unimportantTarot[0] * 4;
				tarotEV[1] += unimportantTarot[1] * 4;


				for (const tarot of importantTarot) {
					const rollResults = resolveRoll(ordDice, luckDice - 1, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, tarot);

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
						memos,
						level + 1,
					);

					tarotEV[0] += rollEV[0];
					tarotEV[1] += rollEV[1];
				}

				tarotEV[0] = tarotEV[0] / 9;
				tarotEV[1] = tarotEV[1] / 9;

				if (tarotEV[1] > luckyEV[1] || (tarotEV[1] == luckyEV[1] && tarotEV[0] >= luckyEV[0])) {
					luckyEV[0] = tarotEV[0];
					luckyEV[1] = tarotEV[1];
					luckyEV[2] = roll;
				}

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
					memos,
					level + 1,
				);

				if (rollEV[1] > luckyEV[1] || (rollEV[1] == luckyEV[1] && rollEV[0] >= luckyEV[0])) {
					luckyEV[0] = rollEV[0];
					luckyEV[1] = rollEV[1];
					luckyEV[2] = roll;
				}
			}
		}
	}


	// EV of ordinary dice
	if (ordDice > 0) {
		if (rollTwice) {
			for (const [roll, mult] of twoDiceDist) {
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
					memos,
					level + 1,
				);

				ordinaryEV[0] += rollEV[0] * mult;
				ordinaryEV[1] += rollEV[1] * mult;
			}

			ordinaryEV[0] = ordinaryEV[0] / 36;
			ordinaryEV[1] = ordinaryEV[1] / 36;

		} else {
			for (let roll = 1; roll <= 6; roll++) {
				if (pos + roll == 10 && ordDice + luckDice > 1) {
					const tarotEV = [0, 0, 0];


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
						memos,
						level + 1,
					);

					tarotEV[0] += unimportantTarot[0] * 4;
					tarotEV[1] += unimportantTarot[1] * 4;


					for (const tarot of importantTarot) {
						const rollResults = resolveRoll(ordDice - 1, luckDice, stars, pos, doubleNextRoll, moveBackwards, doubleStars, false, [...boardState], roll, tarot);

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
							memos,
							level + 1,
						);

						tarotEV[0] += rollEV[0];
						tarotEV[1] += rollEV[1];
					}

					ordinaryEV[0] += tarotEV[0] / 9;
					ordinaryEV[1] += tarotEV[1] / 9;
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
						memos,
						level + 1,
					);

					ordinaryEV[0] += rollEV[0];
					ordinaryEV[1] += rollEV[1];
				}
			}

			ordinaryEV[0] = ordinaryEV[0] / 6;
			ordinaryEV[1] = ordinaryEV[1] / 6;
		}
	}


	const memo = memos[memos.length - 1];
	if (memo.size >= 14999999) memos.push(new Map());
	if (nodeJSMode && level == 0) console.log(ordinaryEV, luckyEV, memos.length, memo.size);


	if ((convertEV[1] > luckyEV[1] && convertEV[1] > ordinaryEV[1]) || (convertEV[1] >= luckyEV[1] && convertEV[1] >= ordinaryEV[1] && convertEV[0] >= luckyEV[0] && convertEV[0] >= ordinaryEV[0])) {
		memo.set(memoKey, [convertEV[0], convertEV[1]]);
		return convertEV;

	} else if (ordinaryEV[1] > luckyEV[1] || (ordinaryEV[1] == luckyEV[1] && ordinaryEV[0] >= luckyEV[0])) {
		memo.set(memoKey, [ordinaryEV[0], ordinaryEV[1]]);
		return ordinaryEV;

	} else {
		memo.set(memoKey, [luckyEV[0], luckyEV[1]]);
		return luckyEV;
	}
}


function resolveRoll(ordDice, luckDice, stars, pos, doubleNextRoll, moveBackwards, doubleStars, rollTwice, boardState, roll, tarot) {
	if (doubleNextRoll) {
		doubleNextRoll = false;
		roll *= 2;
	}

	// resolve roll
	if (pos == 15 && (roll % 2) == 1) {
		// odd number on karma
		pos -= roll;

	} else if (moveBackwards) {
		// move backwards tarot
		moveBackwards = false;
		pos -= roll;

	} else {
		const newPos = pos + roll;

		// check starry mushrooms
		if (pos < 4 && (newPos >= 4)) {
			stars += boardState[4];
		} else if (pos >= 18 && newPos >= 24) {
			stars += boardState[4];
		}

		if (pos < 11 && newPos >= 11) {
			stars += boardState[11];

			if (doubleStars) {
				doubleStars = false;
				stars += boardState[11];
			}
		}

		if (pos < 18 && newPos >= 18) {
			stars += boardState[18];
		}

		// resolve current location
		pos = ((newPos - 1) % 20) + 1;

		// if ((pos % 5) != 0) {
		if (pos == 4 || pos == 11 || pos == 18) {
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