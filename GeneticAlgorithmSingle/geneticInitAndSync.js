var attHeroes = [];
var defHeroes = [];
var allTeams = {};
var simRunning = false;
var stopLoop = false;
var attIndex = 0;
var defIndex = 1;
var isSeeded = false;
var lsPrefix = "ga_";


function initialize() {
  // layout stuff
  var acc = document.getElementsByClassName("colorA");
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      this.classList.toggle("activeA");

      /* Toggle between hiding and showing the active panel */
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }

  var acc = document.getElementsByClassName("colorB");
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("activeB");

      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }

  var acc = document.getElementsByClassName("colorC");
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("activeC");

      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
  
  
  // check local storage
  if (typeof(Storage) !== "undefined") {
    if (localStorage.getItem(lsPrefix + "numSims") !== null) {
      document.getElementById("numSims").value = localStorage.getItem(lsPrefix + "numSims");
      document.getElementById("genCount").value = localStorage.getItem(lsPrefix + "genCount");
      document.getElementById("numCreate").value = localStorage.getItem(lsPrefix + "numCreate");
      document.getElementById("configText").value = localStorage.getItem(lsPrefix + "configText");
    } else {
      localStorage.setItem(lsPrefix + "numSims", document.getElementById("numSims").value);
      localStorage.setItem(lsPrefix + "genCount", document.getElementById("genCount").value);
      localStorage.setItem(lsPrefix + "numCreate", document.getElementById("numCreate").value);
      localStorage.setItem(lsPrefix + "configText", document.getElementById("configText").value);
    }
  }
}


function storeLocal(i) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem(lsPrefix + i.id, i.value);
  }
}


function runMassLoop() {
  var oLog = document.getElementById("summaryLog");

  if (simRunning == true) {
    oLog.innerHTML = "<p>Simulation already running.</p>" + oLog.innerHTML;
  } else {
    var oConfig = document.getElementById("configText");
    var numSims = parseInt(document.getElementById("numSims").value);
    var jsonConfig = JSON.parse(oConfig.value);
    var team;
    var tHero;
    var species;
    var teamIndex = 0;

    allTeams = {};
    attIndex = 0;
    defIndex = 1;

    for (var t in jsonConfig) {
      allTeams[teamIndex] = {};
      allTeams[teamIndex]["dna"] = jsonConfig[t];
      allTeams[teamIndex]["teamName"] = t;
      allTeams[teamIndex]["pet"] = jsonConfig[t][60];
      allTeams[teamIndex]["attWins"] = 0;
      allTeams[teamIndex]["defWins"] = 0;
      allTeams[teamIndex]["weakAgainst"] = "None";
      allTeams[teamIndex]["weakAgainstWins"] = 0;

      team = [];
      species = "";

      for (var p = 0; p < 60; p += 10) {
        species += jsonConfig[t][p] + ", ";
        tHero = new baseHeroStats[jsonConfig[t][p]]["className"](jsonConfig[t][p], Math.floor(p / 10), "");

        tHero._heroLevel = 330;
        tHero._skin = jsonConfig[t][p+1];
        tHero._stone = jsonConfig[t][p+3];
        tHero._artifact = jsonConfig[t][p+4];
        tHero._enable1 = jsonConfig[t][p+5];
        tHero._enable2 = jsonConfig[t][p+6];
        tHero._enable3 = jsonConfig[t][p+7];
        tHero._enable4 = jsonConfig[t][p+8];
        tHero._enable5 = jsonConfig[t][p+9];

        if (jsonConfig[t][p+2] == "Class Gear") {
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = classGearMapping[tHero._heroClass]["armor"];
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = classGearMapping[tHero._heroClass]["accessory"];

        } else if (jsonConfig[t][p+2] == "Split HP") {
          tHero._weapon = "6* Thorny Flame Whip";
          tHero._armor = classGearMapping[tHero._heroClass]["armor"];
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = "6* Flame Necklace";

        } else if (jsonConfig[t][p+2] == "Split Attack") {
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = "6* Flame Armor";
          tHero._shoe = "6* Flame Boots";
          tHero._accessory = "6* Flame Necklace";

        } else if (jsonConfig[t][p+2] == "No Armor") {
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = "None";
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = classGearMapping[tHero._heroClass]["accessory"];
        }

        team.push(tHero);
      }

      species += jsonConfig[t][p];
      allTeams[teamIndex]["species"] = species;
      allTeams[teamIndex]["team"] = team;
      teamIndex++;
    }

    simRunning = true;
    stopLoop = false;
    oLog.innerHTML = "<p>Starting mass simulation.</p>";

    // start first matchup
    setTimeout(nextMatchup, 1);
  }
}


function nextMatchup() {
  var oLog = document.getElementById("summaryLog");
  var numSims = document.getElementById("numSims").value;
  var teamKeys = Object.keys(allTeams);

  if (attIndex >= teamKeys.length || stopLoop) {
    simRunning = false;

    if (stopLoop) {
      oLog.innerHTML = "<p>Loop stopped by user.</p>" + oLog.innerHTML;
    } else {
      var summary = "";
      var totalFights = (teamKeys.length - 1) * numSims;

      teamKeys.sort(function(a,b) {
        if (allTeams[a]["attWins"] > allTeams[b]["attWins"]) {
          return -1;
        } else if (allTeams[a]["attWins"] < allTeams[b]["attWins"]) {
          return 1;
        } else if (allTeams[a]["defWins"] > allTeams[b]["defWins"]) {
          return -1;
        } else if (allTeams[a]["defWins"] < allTeams[b]["defWins"]) {
          return 1;
        } else {
          return 0;
        }
      });


      // get first 10% "most diverse" teams by looking at similarity score
      var rank = 1;
      var maxRank = Math.floor(teamKeys.length * 0.1);
      var diffFound;
      var similarityScore;
      var heroCount = {};
      var teamDNA;
      var arrTeams = [];
      var tempTeam;

      for (var i in heroNames) {
        heroCount[heroNames[i]] = 0;
      }

      for (var p in teamKeys) {
        if (rank <= maxRank) {
          teamDNA = allTeams[teamKeys[p]]["dna"];
          tempTeam = Object.assign({}, heroCount);
          diffFound = true;

          for (var g = 0; g < 60; g += 10) {
            tempTeam[teamDNA[g]]++;
          }

          for (var x in arrTeams) {
            similarityScore = 0;

            for (var h in arrTeams[x]) {
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
            allTeams[teamKeys[p]]["rank"] = rank;
            rank++;
            arrTeams.push(tempTeam);
          } else {
            allTeams[teamKeys[p]]["rank"] = maxRank + 1;
          }
        } else {
          allTeams[teamKeys[p]]["rank"] = maxRank + 1;
        }
      }

      teamKeys.sort(function(a,b) {
        if (allTeams[a]["rank"] < allTeams[b]["rank"]) {
          return -1;
        } else if (allTeams[a]["rank"] > allTeams[b]["rank"]) {
          return 1;
        } else if (allTeams[a]["attWins"] > allTeams[b]["attWins"]) {
          return -1;
        } else if (allTeams[a]["attWins"] < allTeams[b]["attWins"]) {
          return 1;
        } else if (allTeams[a]["defWins"] > allTeams[b]["defWins"]) {
          return -1;
        } else if (allTeams[a]["defWins"] < allTeams[b]["defWins"]) {
          return 1;
        } else {
          return 0;
        }
      });



      // output summary data
      for (var p in teamKeys) {
        summary += "Team " + allTeams[teamKeys[p]]["teamName"] + " (" + allTeams[teamKeys[p]]["species"] + ") - Attack win rate (" + Math.round(allTeams[teamKeys[p]]["attWins"] / totalFights * 100, 2) + "%), ";
        summary += "Diversity rank (" + allTeams[teamKeys[p]]["rank"] + "), ";
        summary += "Defense win rate (" + Math.round(allTeams[teamKeys[p]]["defWins"] / totalFights * 100, 2) + "%), ";
        summary += "Weakest against team " + allTeams[teamKeys[p]]["weakAgainst"] + " (" + Math.round(allTeams[teamKeys[p]]["weakAgainstWins"] / numSims * 100, 2) + "%)\n";
      }

      document.getElementById("generationLog").value += "Generation " + document.getElementById("genCount").value + " summary.\n" + summary + "\n";

      evolve(teamKeys);
        
      document.getElementById("genCount").value = parseInt(document.getElementById("genCount").value) + 1;
      if (typeof(Storage) !== "undefined") {
        localStorage.setItem(lsPrefix + "genCount", document.getElementById("genCount").value);
      }
        
      runMassLoop();
    }

  } else {
    if (attIndex != defIndex) {
      var numWins = 0;

      attHeroes = allTeams[attIndex]["team"];
      defHeroes = allTeams[defIndex]["team"];

      document.getElementById("attMonster").value = allTeams[attIndex]["pet"];
      document.getElementById("defMonster").value = allTeams[defIndex]["pet"];

      for (var p = 0; p < 6; p++) {
        attHeroes[p]._attOrDef = "att";
        attHeroes[p]._allies = attHeroes;
        attHeroes[p]._enemies = defHeroes;

        defHeroes[p]._attOrDef = "def";
        defHeroes[p]._allies = defHeroes;
        defHeroes[p]._enemies = attHeroes;
      }

      for (var p = 0; p < 6; p++) {
        attHeroes[p].updateCurrentStats();
        defHeroes[p].updateCurrentStats();
      }

      numAttWins = runSim();
      numDefWins = numSims - numAttWins;

      allTeams[attIndex]["attWins"] += numAttWins;
      allTeams[defIndex]["defWins"] += numDefWins;

      if (numAttWins > allTeams[defIndex]["weakAgainstWins"]) {
        allTeams[defIndex]["weakAgainst"] = allTeams[attIndex]["teamName"];
        allTeams[defIndex]["weakAgainstWins"] = numAttWins;
      }

      oLog.innerHTML = "<div><span class='att'>" + allTeams[attIndex]["teamName"] + " (" + allTeams[attIndex]["species"] + ")</span> versus <span class='def'>" + allTeams[defIndex]["teamName"] + " (" + allTeams[defIndex]["species"] + ")</span>: Won " + formatNum(numAttWins) + " out of " + formatNum(numSims) + ".</div>" + oLog.innerHTML;
    }

    // start next matchup
    defIndex++;
    if (defIndex == teamKeys.length) {
      attIndex++;
      defIndex = 0;
      oLog.innerHTML = "";
    }

    setTimeout(nextMatchup, 1);
  }
}