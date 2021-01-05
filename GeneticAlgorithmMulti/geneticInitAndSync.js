import { evolve, createRandomTeams, heroNames, numGenes, dnaLength } from './gaBreed.js';


let allTeams = {};
let simRunning = false;
let stopLoop = false;
let attIndex = 0;
let defIndex = 0;
const lsPrefix = 'ga_';

let numWorkers = 6;
let workerStatus = [];

function initialize() {
	const acc = document.getElementsByClassName('colorC');
	for (let i = 0; i < acc.length; i++) {
		acc[i].classList.toggle('activeC');
		acc[i].nextElementSibling.style.maxHeight = acc[i].nextElementSibling.scrollHeight + 'px';

		acc[i].addEventListener('click', function() {
			this.classList.toggle('activeC');

			const panel = this.nextElementSibling;
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
			} else {
				panel.style.maxHeight = panel.scrollHeight + 'px';
			}
		});
	}


	// check local storage
	if (typeof (Storage) !== 'undefined') {
		if (localStorage.getItem(lsPrefix + 'numWorkers') !== null) {
			document.getElementById('numSims').value = localStorage.getItem(lsPrefix + 'numSims');
			document.getElementById('genCount').value = localStorage.getItem(lsPrefix + 'genCount');
			document.getElementById('numCreate').value = localStorage.getItem(lsPrefix + 'numCreate');
			document.getElementById('configText').value = localStorage.getItem(lsPrefix + 'configText');
			document.getElementById('numWorkers').value = localStorage.getItem(lsPrefix + 'numWorkers');
			document.getElementById('useSeed').checked = localStorage.getItem(lsPrefix + 'useSeed');

		} else {
			localStorage.setItem(lsPrefix + 'numSims', document.getElementById('numSims').value);
			localStorage.setItem(lsPrefix + 'genCount', document.getElementById('genCount').value);
			localStorage.setItem(lsPrefix + 'numCreate', document.getElementById('numCreate').value);
			localStorage.setItem(lsPrefix + 'configText', document.getElementById('configText').value);
			localStorage.setItem(lsPrefix + 'useSeed', document.getElementById('useSeed').checked);
			localStorage.setItem(lsPrefix + 'numWorkers', document.getElementById('numWorkers').value);
		}
	}

	createWorkerThreads();
}


function createWorkerThreads() {
	const log = document.getElementById('summaryLog');

	if (simRunning) {
		log.innerHTML = 'Simulation currently running, stop simulation first.';
		return;
	}


	numWorkers = Number.parseInt(document.getElementById('numWorkers').value);

	if (typeof (Worker) !== 'undefined') {
		for (const worker of workerStatus) {
			worker[0].terminate();
		}

		workerStatus = [];

		for (let i = 1; i <= numWorkers; i++) {
			const worker = new Worker('./simWorker.js', { type: 'module' });
			worker.onmessage = processWorker;
			workerStatus.push([worker, false]);
		}
	} else {
		log.innerHTML = 'Browser does not support web workers.';
	}

}


function storeLocal(i) {
	if (typeof (Storage) !== 'undefined') {
		if (i.id == 'useSeed') {
			localStorage.setItem(lsPrefix + i.id, i.checked);
		} else {
			localStorage.setItem(lsPrefix + i.id, i.value);
		}
	}
}


function runMassLoop() {
	const oLog = document.getElementById('summaryLog');

	if (simRunning == true) {
		oLog.innerHTML = '<p>Simulation already running.</p>' + oLog.innerHTML;
	} else {
		const oConfig = document.getElementById('configText');
		const numSims = parseInt(document.getElementById('numSims').value);
		const jsonConfig = JSON.parse(oConfig.value);
		let species;
		let teamIndex = 0;

		allTeams = {};
		attIndex = 0;
		defIndex = 0;

		for (const t in jsonConfig) {
			allTeams[teamIndex] = {};
			allTeams[teamIndex]['dna'] = jsonConfig[t];
			allTeams[teamIndex]['teamName'] = t;
			allTeams[teamIndex]['pet'] = jsonConfig[t][dnaLength];
			allTeams[teamIndex]['attWins'] = 0;
			allTeams[teamIndex]['defWins'] = 0;
			allTeams[teamIndex]['weakAgainst'] = 'None';
			allTeams[teamIndex]['weakAgainstWins'] = 0;

			let p;
			species = '';
			for (p = 0; p < dnaLength; p += numGenes) {
				species += jsonConfig[t][p] + ', ';
			}
			species += jsonConfig[t][p];

			allTeams[teamIndex]['species'] = species;
			teamIndex++;
		}

		simRunning = true;
		stopLoop = false;
		oLog.innerHTML = '<p>Starting mass simulation.</p>';

		// start workers
		for (let i = 0; i < workerStatus.length; i++) {
			workerStatus[i][1] = true;
			workerStatus[i][0].postMessage(['init', attIndex, defIndex, i, numSims, jsonConfig]);
			defIndex++;
		}
	}

}

function processWorker(e) {
	const oLog = document.getElementById('summaryLog');
	const numSims = parseInt(document.getElementById('numSims').value);
	const teamKeys = Object.keys(allTeams);
	const wid = e.data[0];
	const numAttWins = e.data[3];
	const numDefWins = numSims - numAttWins;


	workerStatus[wid][1] = false;
	allTeams[e.data[1]]['attWins'] += numAttWins;
	allTeams[e.data[2]]['defWins'] += numDefWins;

	if (numAttWins > allTeams[e.data[2]]['weakAgainstWins']) {
		allTeams[e.data[2]]['weakAgainst'] = allTeams[e.data[1]]['teamName'];
		allTeams[e.data[2]]['weakAgainstWins'] = numAttWins;
	}

	oLog.innerHTML = '<div><span class=\'att\'>' + allTeams[e.data[1]]['teamName'] + ' (' + allTeams[e.data[1]]['species'] + ')</span> versus <span class=\'def\'>' + allTeams[e.data[2]]['teamName'] + ' (' + allTeams[e.data[2]]['species'] + ')</span>: Won <span class=\'num\'>' + numAttWins + '</span> out of <span class=\'num\'>' + numSims + '</span>.</div>' + oLog.innerHTML;


	if (attIndex >= teamKeys.length || stopLoop) {
		let isDone = true;

		for (let i = 0; i < workerStatus.length; i++) {
			if (workerStatus[i][1] == true) {
				isDone = false;
			}
		}
		// check for all workers done

		if (isDone) {
			simRunning = false;

			if (stopLoop) {
				oLog.innerHTML = '<p>Loop stopped by user.</p>' + oLog.innerHTML;
			} else {
				let summary = '';
				const totalFights = teamKeys.length * numSims;

				teamKeys.sort(function(a, b) {
					if (allTeams[a]['attWins'] > allTeams[b]['attWins']) {
						return -1;
					} else if (allTeams[a]['attWins'] < allTeams[b]['attWins']) {
						return 1;
					} else if (allTeams[a]['defWins'] > allTeams[b]['defWins']) {
						return -1;
					} else if (allTeams[a]['defWins'] < allTeams[b]['defWins']) {
						return 1;
					} else {
						return 0;
					}
				});


				// get first 10% "most diverse" teams by looking at similarity score
				let rank = 1;
				const maxRank = Math.floor(teamKeys.length * 0.1);
				let diffFound;
				let similarityScore;
				const heroCount = {};
				let teamDNA;
				const arrTeams = [];
				let tempTeam;

				for (const hName in heroNames) {
					heroCount[heroNames[hName]] = 0;
				}

				for (const p in teamKeys) {
					if (rank <= maxRank) {
						teamDNA = allTeams[teamKeys[p]]['dna'];
						tempTeam = Object.assign({}, heroCount);
						diffFound = true;

						for (let g = 0; g < dnaLength; g += numGenes) {
							tempTeam[teamDNA[g]]++;
						}

						for (const x in arrTeams) {
							similarityScore = 0;

							for (const h in arrTeams[x]) {
								if (arrTeams[x][h] > 0 && tempTeam[h] > 0) {
									if (arrTeams[x][h] > tempTeam[h]) {
										similarityScore += tempTeam[h];
									} else {
										similarityScore += arrTeams[x][h];
									}
								}
							}

							if (similarityScore / 6 >= 0.5) {
								diffFound = false;
							}
						}

						if (diffFound) {
							allTeams[teamKeys[p]]['rank'] = rank;
							rank++;
							arrTeams.push(tempTeam);
						} else {
							allTeams[teamKeys[p]]['rank'] = maxRank + 1;
						}
					} else {
						allTeams[teamKeys[p]]['rank'] = maxRank + 1;
					}
				}

				teamKeys.sort(function(a, b) {
					if (allTeams[a]['rank'] < allTeams[b]['rank']) {
						return -1;
					} else if (allTeams[a]['rank'] > allTeams[b]['rank']) {
						return 1;
					} else if (allTeams[a]['attWins'] > allTeams[b]['attWins']) {
						return -1;
					} else if (allTeams[a]['attWins'] < allTeams[b]['attWins']) {
						return 1;
					} else if (allTeams[a]['defWins'] > allTeams[b]['defWins']) {
						return -1;
					} else if (allTeams[a]['defWins'] < allTeams[b]['defWins']) {
						return 1;
					} else {
						return 0;
					}
				});


				// output summary data
				for (const p in teamKeys) {
					summary += 'Team ' + allTeams[teamKeys[p]]['teamName'] + ' (' + allTeams[teamKeys[p]]['species'] + ') - Attack win rate (' + Math.round(allTeams[teamKeys[p]]['attWins'] / totalFights * 100, 2) + '%), ';
					summary += 'Diversity rank (' + allTeams[teamKeys[p]]['rank'] + '), ';
					summary += 'Defense win rate (' + Math.round(allTeams[teamKeys[p]]['defWins'] / totalFights * 100, 2) + '%), ';
					summary += 'Weakest against team ' + allTeams[teamKeys[p]]['weakAgainst'] + ' (' + Math.round(allTeams[teamKeys[p]]['weakAgainstWins'] / numSims * 100, 2) + '%)\n';
				}

				document.getElementById('generationLog').value += 'Generation ' + document.getElementById('genCount').value + ' summary.\n' + summary + '\n';

				evolve(allTeams, teamKeys);

				document.getElementById('genCount').value = parseInt(document.getElementById('genCount').value) + 1;
				if (typeof (Storage) !== 'undefined') {
					localStorage.setItem(lsPrefix + 'genCount', document.getElementById('genCount').value);
				}

				runMassLoop();
			}
		}
	} else {
		// start next matchup
		workerStatus[wid][1] = true;
		workerStatus[wid][0].postMessage(['run', attIndex, defIndex]);


		defIndex++;
		if (defIndex >= teamKeys.length) {
			attIndex++;
			defIndex = 0;

			if (attIndex < teamKeys.length) {
				oLog.innerHTML = '';
			}
		}
	}
}


function callCreateRandomTeams() {
	const seeded = document.getElementById('useSeed').checked;
	createRandomTeams(seeded);
}


function setStopLoop() {
	stopLoop = true;
}


window.callCreateRandomTeams = callCreateRandomTeams;
window.initialize = initialize;
window.storeLocal = storeLocal;
window.runMassLoop = runMassLoop;
window.setStopLoop = setStopLoop;
window.createWorkerThreads = createWorkerThreads;