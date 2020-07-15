var attHeroes = [];
var defHeroes = [];
var allTeams = {};
var simRunning = false;
var stopLoop = false;
var attIndex = 0;
var defIndex = 1;
var isSeeded = false;


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
}


function runMassLoop() {
  var oLog = document.getElementById("summaryLog");

  if (simRunning == true) {
    oLog.innerHTML = "<p>Simulation already running.</p>" + oLog.innerHTML;
  } else {
    var oConfig = document.getElementById("configText");
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
      var heroNames = Object.keys(baseHeroStats);
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

function getHero(heroName, skinsList, equipmentList, stoneList, artifactList) {
  var enables1 = ["Vitality", "Mightiness", "Growth"];
  var enables2 = ["Shelter", "LethalFightback", "Vitality2"];
  var enables3 = ["Resilience", "SharedFate", "Purify"];
  var enables4 = ["Vitality", "Mightiness", "Growth"];
  var enables5 = ["BalancedStrike", "UnbendingWill"];

  var value = "";
  value += "  \"" + heroName + "\", ";
  value += "\"" + skinsList[Math.floor(Math.random() * skinsList.length)] + "\", ";
  value += "\"" + equipmentList[Math.floor(Math.random() * equipmentList.length)] + "\", ";
  value += "\"" + stoneList[Math.floor(Math.random() * stoneList.length)] + "\", ";
  value += "\"" + artifactList[Math.floor(Math.random() * artifactList.length)] + "\", ";

  // Need to pass in allowed enables.
  value += "\"" + enables1[Math.floor(Math.random() * enables1.length)] + "\", ";
  value += "\"" + enables2[Math.floor(Math.random() * enables2.length)] + "\", ";
  value += "\"" + enables3[Math.floor(Math.random() * enables3.length)] + "\", ";
  value += "\"" + enables4[Math.floor(Math.random() * enables4.length)] + "\", ";
  value += "\"" + enables5[Math.floor(Math.random() * enables5.length)] + "\",\n";
  return value;
}

function createRandomTeams(seeded) {
  var heroNames = Object.keys(baseHeroStats);
  var heroName = "";
  var skinNames;
  var legendarySkins;
  var stoneNames = Object.keys(stones).slice(1);
  var monsterNames = Object.keys(baseMonsterStats);
  var oConfig = document.getElementById("configText");
  var numCreate = parseInt(document.getElementById("numCreate").value);

  var artifactNames = ["Antlers Cane", "Demon Bell", "Staff Punisher of Immortal", "Magic Stone Sword", "Augustus Magic Ball",
    "The Kiss of Ghost", "Lucky Candy Bar", "Wildfire Torch", "Golden Crown", "Ruyi Scepter"];
  var equipments = ["Class Gear", "Split HP", "Split Attack", "No Armor"];
  
  isSeeded = seeded;

  oConfig.value = "{\n";
  for(i=0; i<numCreate; i++) {
    oConfig.value += "\"" + i + "\": [\n";

    for (h=1; h<=6; h++) {
      if (seeded) {
        var seededHeroesNames = Object.keys(seededHeroes);
        heroName = seededHeroesNames[Math.floor(Math.random() * seededHeroesNames.length)];
      } else {
        heroName = heroNames[Math.floor(Math.random() * (heroNames.length - 1)) + 1];
      }
      skinNames = Object.keys(skins[heroName]);
      legendarySkins = [];
      for (var s in skinNames) {
        if (skinNames[s].substring(0, 9) == "Legendary") {
          legendarySkins.push(skinNames[s]);
        }
      }

      if (isSeeded && heroName in seededHeroes) {
        let sHero = seededHeroes[heroName];
        oConfig.value += getHero(heroName, legendarySkins, sHero.allowedEquipments, sHero.allowedStones, sHero.allowedArtifacts);
      } else {
        oConfig.value += getHero(heroName, legendarySkins, equipments, stoneNames, artifactNames);
      }
    }

    oConfig.value += "  \"" + monsterNames[Math.floor(Math.random() * (monsterNames.length - 1)) + 1] + "\"\n";

    if (i<(numCreate-1)) {
      oConfig.value += "],\n";
    } else {
      oConfig.value += "]\n";
    }
  }

  oConfig.value += "}";
  oConfig.select();
  oConfig.setSelectionRange(0, oConfig.value.length);
  document.execCommand("copy");
}

function evolve(teamKeys) {
  var t=0;
  var oConfig = document.getElementById("configText");
  var dna1;
  var dnaString1;
  var child = [];
  var mutationRate = 0.01;
  var swapRate = 0.10;

  var numCreate = teamKeys.length;
  var i10p = Math.floor(numCreate * 0.1);
  var i20p = Math.floor(numCreate * 0.2);
  var i30p = Math.floor(numCreate * 0.3);
  var i50p = Math.floor(numCreate * 0.5);
  var i60p = Math.floor(numCreate * 0.6);
  var i80p = Math.floor(numCreate * 0.8);
  var i90p = Math.floor(numCreate * 0.9);

  // speciation
  var arrTeams = [];
  var heroCount = {};
  var teamDNA;
  var tempTeam;
  var similarityScore;
  var speciesCount;

  for (let i in baseHeroStats) {
    heroCount[i] = 0;
  }


  oConfig.value = "{\n";

  // clone top 10%
  for (t=0; t<i10p; t++) {
    dna1 = allTeams[teamKeys[t]]["dna"];
    dnaString1 = "\"" + t + "\": [\n";

    for (let h=0; h<6; h++) {
      dnaString1 += " ";

      for (let g=0; g<10; g++) {
        dnaString1 += " \"" + dna1[h*10 + g] + "\",";
      }

      dnaString1 += "\n";
    }


    tempTeam = Object.assign({}, heroCount);
    for (let g = 0; g < 60; g += 10) {
      tempTeam[dna1[g]]++;
    }
    arrTeams.push(tempTeam);


    dnaString1 += "  \"" + dna1[60] + "\"\n],\n"
    oConfig.value += dnaString1;
  }


  // breed
  while (t < numCreate) {
    child = breed(teamKeys, 0, i90p, mutationRate * (Math.floor(t / 10) + 1), swapRate * (Math.floor(t / 10) + 1));

    teamDNA = child[0];
    tempTeam = Object.assign({}, heroCount);
    speciesCount = 0;

    for (let g = 0; g < 60; g += 10) {
      tempTeam[teamDNA[g]]++;
    }

    for (let x in arrTeams) {
      similarityScore = 0;

      for (let h in arrTeams[x]) {
        if (arrTeams[x][h] > 0 && tempTeam[h] > 0) {
          if (arrTeams[x][h] > tempTeam[h]) {
            similarityScore += tempTeam[h];
          } else {
            similarityScore += arrTeams[x][h];
          }
        }
      }

      if (similarityScore / 6 >= 0.5) {
        speciesCount++;
      }
    }

    if (speciesCount < i10p) {
      if (t == numCreate-1) {
        oConfig.value += "\"" + t + "\": [" + child[1] + "\n]\n";
      } else {
        oConfig.value += "\"" + t + "\": [" + child[1] + "\n],\n";
      }

      arrTeams.push(tempTeam);
      t++;
    }
  }


  oConfig.value += "}";
  document.getElementById("genCount").value = parseInt(document.getElementById("genCount").value) + 1;
  runMassLoop();
}


function breed(teamKeys, start, end, mutationRate, posSwapRate) {
  var parentA;
  var parentB;
  var dna1;
  var dna2;
  var child1;
  var dnaString1;
  var pos1 = 0;
  var pos2 = 0;

  var temp = "";
  var crossOver;

  var heroNames = Object.keys(baseHeroStats);
  var heroName = "";
  var skinNames;
  var legendarySkins;
  var stoneNames = Object.keys(stones);
  var monsterNames = Object.keys(baseMonsterStats);

  var artifactNames = ["Antlers Cane", "Demon Bell", "Staff Punisher of Immortal", "Magic Stone Sword", "Augustus Magic Ball",
    "The Kiss of Ghost", "Lucky Candy Bar", "Wildfire Torch", "Golden Crown", "Ruyi Scepter"];
  var equipments = ["Class Gear", "Split HP", "Split Attack", "No Armor"];
  var enables1 = ["Vitality", "Mightiness", "Growth"];
  var enables2 = ["Shelter", "LethalFightback", "Vitality2"];
  var enables3 = ["Resilience", "SharedFate", "Purify"];
  var enables4 = ["Vitality", "Mightiness", "Growth"];
  var enables5 = ["BalancedStrike", "UnbendingWill"];


  parentA = Math.floor(Math.pow(Math.random(), 1.2) * (end - start)) + start;
  dna1 = allTeams[teamKeys[parentA]]["dna"];

  parentB = parentA;
  while (parentA == parentB) {
    parentB = Math.floor(Math.pow(Math.random(), 1.2) * (end - start)) + start;
  }
  dna2 = allTeams[teamKeys[parentB]]["dna"];


  // breed
  crossOver = Math.floor(Math.random() * 60) + 1;
  if (crossOver % 10 == 1) { crossOver++; }
  child1 = [];

  for (var g = 0; g < crossOver; g++) {
    child1.push(dna1[g]);
  }

  for (var g = crossOver; g < 60; g++) {
    child1.push(dna2[g]);
  }

  if (crossOver == 60) {
    child1.push(dna2[60]);
  } else {
    child1.push(dna1[60]);
  }


  // mutate child 1 genes
  for (var g = 0; g < 60; g++) {
    if (Math.random() < mutationRate) {
      switch(g % 10) {
        case 0:
          child1[g] = heroNames[Math.floor(Math.random() * (heroNames.length - 1)) + 1];

          skinNames = Object.keys(skins[child1[g]]);
          legendarySkins = [];
          for (var s in skinNames) {
            if (skinNames[s].substring(0, 9) == "Legendary") {
              legendarySkins.push(skinNames[s]);
            }
          }
          skinName = legendarySkins[Math.floor(Math.random() * legendarySkins.length)];
          child1[g+1] = skinName;
          break;

        case 1:
          skinNames = Object.keys(skins[child1[g-1]]);
          legendarySkins = [];
          for (var s in skinNames) {
            if (skinNames[s].substring(0, 9) == "Legendary") {
              legendarySkins.push(skinNames[s]);
            }
          }
          skinName = legendarySkins[Math.floor(Math.random() * legendarySkins.length)];
          child1[g] = skinName;
          break;

        case 2:
          child1[g] = equipments[Math.floor(Math.random() * equipments.length)];
          break;

        case 3:
          child1[g] = stoneNames[Math.floor(Math.random() * (stoneNames.length - 1)) + 1];
          break;

        case 4:
          child1[g] = artifactNames[Math.floor(Math.random() * artifactNames.length)];
          break;

        case 5:
          child1[g] = enables1[Math.floor(Math.random() * enables1.length)];
          break;

        case 6:
          child1[g] = enables2[Math.floor(Math.random() * enables2.length)];
          break;

        case 7:
          child1[g] = enables3[Math.floor(Math.random() * enables3.length)];
          break;

        case 8:
          child1[g] = enables4[Math.floor(Math.random() * enables4.length)];
          break;

        case 9:
          child1[g] = enables5[Math.floor(Math.random() * enables5.length)];
          break;
      }
    }
  }

  // mutate child 1 pet
  if (Math.random() < mutationRate) {
    child1[60] = monsterNames[Math.floor(Math.random() * (monsterNames.length - 1)) + 1];
  }
  
  
  // check for seeded
  if (isSeeded) {
    for (let i = 0; i < 6; i++) {
      let g = i * 10;
      if (child1[g] in seededHeroes) {
        let sHero = seededHeroes[child1[g]];
        
        if (sHero.allowedEquipments.indexOf(child1[g+2]) < 0) {
          child1[g+2] = sHero.allowedEquipments[Math.floor(Math.random() * sHero.allowedEquipments.length)];
        }
        
        if (sHero.allowedStones.indexOf(child1[g+3]) < 0) {
          child1[g+3] = sHero.allowedStones[Math.floor(Math.random() * sHero.allowedStones.length)];
        }
        
        if (sHero.allowedArtifacts.indexOf(child1[g+4]) < 0) {
          child1[g+4] = sHero.allowedArtifacts[Math.floor(Math.random() * sHero.allowedArtifacts.length)];
        }
      }
    }
  }


  // output child genes
  dnaString1 = "";
  for (var h=0; h<6; h++) {
    dnaString1 += "\n ";

    for (var g=0; g<10; g++) {
      dnaString1 += " \"" + child1[h*10 + g] + "\",";
    }
  }
  dnaString1 += "\n  \"" + child1[60] + "\"";

  return [child1, dnaString1];
}
