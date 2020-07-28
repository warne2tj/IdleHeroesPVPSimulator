var attHeroes = [];
var defHeroes = [];
var allTeams = {};
var simRunning = false;
var stopLoop = false;
var attIndex = 0;
var defIndex = 1;
var isSeeded = false;


var heroNames = Object.keys(baseHeroStats).slice(1);
var stoneNames = Object.keys(stones).slice(1);
var monsterNames = Object.keys(baseMonsterStats).slice(1);
var artifactNames = ["Antlers Cane", "Demon Bell", "Staff Punisher of Immortal", "Magic Stone Sword", "Augustus Magic Ball",
  "The Kiss of Ghost", "Lucky Candy Bar", "Wildfire Torch", "Golden Crown", "Ruyi Scepter"];
var equipments = ["Class Gear", "Split HP", "Split Attack", "No Armor"];
var enables1 = ["Vitality", "Mightiness", "Growth"];
var enables2 = ["Shelter", "LethalFightback", "Vitality2"];
var enables3 = ["Resilience", "SharedFate", "Purify"];
var enables4 = ["Vitality", "Mightiness", "Growth"];
var enables5 = ["BalancedStrike", "UnbendingWill"];


var w0;
var w1;
var w2;
var w3;
var w4;
var w5;
var workerStatus;

var lsPrefix = "ga_";
  
  
function initialize() {
  var acc = document.getElementsByClassName("colorC");
  for (var i = 0; i < acc.length; i++) {
    acc[i].classList.toggle("activeC");
    acc[i].nextElementSibling.style.maxHeight = acc[i].nextElementSibling.scrollHeight + "px";
    
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
  
  
  if (typeof(Worker) !== "undefined") {
    w0 = new Worker("./simWorker.js");
    w0.onmessage = processWorker;
    
    w1 = new Worker("./simWorker.js");
    w1.onmessage = processWorker;
    
    w2 = new Worker("./simWorker.js");
    w2.onmessage = processWorker;
    
    w3 = new Worker("./simWorker.js");
    w3.onmessage = processWorker;
    
    w4 = new Worker("./simWorker.js");
    w4.onmessage = processWorker;
    
    w5 = new Worker("./simWorker.js");
    w5.onmessage = processWorker;
    
    workerStatus = [[w0, false], [w1, false], [w2, false], [w3, false], [w4, false], [w5, false]];
  } else {
    document.getElementById("summaryLog").innerHTML = "Browser does not support web workers."
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
    defIndex = 0;
    
    for (var t in jsonConfig) {
      allTeams[teamIndex] = {};
      allTeams[teamIndex]["dna"] = jsonConfig[t];
      allTeams[teamIndex]["teamName"] = t;
      allTeams[teamIndex]["pet"] = jsonConfig[t][60];
      allTeams[teamIndex]["attWins"] = 0;
      allTeams[teamIndex]["defWins"] = 0;
      allTeams[teamIndex]["weakAgainst"] = "None";
      allTeams[teamIndex]["weakAgainstWins"] = 0;
      
      species = "";
      for (var p = 0; p < 60; p += 10) {
        species += jsonConfig[t][p] + ", ";
      }
      species += jsonConfig[t][p];
      
      allTeams[teamIndex]["species"] = species;
      teamIndex++;
    }
    
    simRunning = true;
    stopLoop = false;
    oLog.innerHTML = "<p>Starting mass simulation.</p>";
    
    // start workers
    for (var i = 0; i < workerStatus.length; i++) {
      workerStatus[i][1] = true;
      workerStatus[i][0].postMessage(["init", attIndex, defIndex, i, numSims, jsonConfig]);
      defIndex++;
    }
  }
  
}

function processWorker(e) {
  var oLog = document.getElementById("summaryLog");
  var numSims = parseInt(document.getElementById("numSims").value);
  var teamKeys = Object.keys(allTeams);
  var wid = e.data[0];
  var numAttWins = e.data[3];
  var numDefWins = numSims - numAttWins;
  
  
  workerStatus[wid][1] = false;
  allTeams[e.data[1]]["attWins"] += numAttWins;
  allTeams[e.data[2]]["defWins"] += numDefWins;
  
  if (numAttWins > allTeams[e.data[2]]["weakAgainstWins"]) {
    allTeams[e.data[2]]["weakAgainst"] = allTeams[e.data[1]]["teamName"];
    allTeams[e.data[2]]["weakAgainstWins"] = numAttWins;
  }
    
  oLog.innerHTML = "<div><span class='att'>" + allTeams[e.data[1]]["teamName"] + " (" + allTeams[e.data[1]]["species"] + ")</span> versus <span class='def'>" + allTeams[e.data[2]]["teamName"] + " (" + allTeams[e.data[2]]["species"] + ")</span>: Won <span class='num'>" + numAttWins + "</span> out of <span class='num'>" + numSims + "</span>.</div>" + oLog.innerHTML;
  
  
  if (attIndex >= teamKeys.length || stopLoop) {
    var isDone = true;
    
    for (var i = 0; i < workerStatus.length; i++) {
      if (workerStatus[i][1] == true) {
        isDone = false;
      }
    }
    // check for all workers done
    
    if (isDone) {
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
    }
  } else {
    // start next matchup
    workerStatus[wid][1] = true;
    workerStatus[wid][0].postMessage(["run", attIndex, defIndex]);
    
    
    defIndex++;
    if (defIndex >= teamKeys.length) {
      attIndex++;
      defIndex = 0;
      
      if (attIndex < teamKeys.length) {
        oLog.innerHTML = "";
      }
    }
  }
}


function getHero(heroName, skinsList, equipmentList, stoneList, artifactList) {
  var skinNames = Object.keys(skins[heroName]);
  var legendarySkins = [];
  var sHero = seededHeroes[heroName];

  
  for (var s in skinNames) {
    if (skinNames[s].substring(0, 9) == "Legendary") {
      legendarySkins.push(skinNames[s]);
    }
  }

  
  var value = "  \"" + heroName + "\", ";
  value += "\"" + legendarySkins[Math.floor(Math.random() * legendarySkins.length)] + "\", ";
  
  if (isSeeded && heroName in seededHeroes) {
    value += "\"" + sHero.allowedEquipments[Math.floor(Math.random() * sHero.allowedEquipments.length)] + "\", ";
    value += "\"" + sHero.allowedStones[Math.floor(Math.random() * sHero.allowedStones.length)] + "\", ";
    value += "\"" + sHero.allowedArtifacts[Math.floor(Math.random() * sHero.allowedArtifacts.length)] + "\", ";
    value += sHero.allowedEnables[Math.floor(Math.random() * sHero.allowedEnables.length)] + ",\n";
    
  } else {
    value += "\"" + equipments[Math.floor(Math.random() * equipments.length)] + "\", ";
    value += "\"" + stoneNames[Math.floor(Math.random() * stoneNames.length)] + "\", ";
    value += "\"" + artifactNames[Math.floor(Math.random() * artifactNames.length)] + "\", ";

    value += "\"" + enables1[Math.floor(Math.random() * enables1.length)] + "\", ";
    value += "\"" + enables2[Math.floor(Math.random() * enables2.length)] + "\", ";
    value += "\"" + enables3[Math.floor(Math.random() * enables3.length)] + "\", ";
    value += "\"" + enables4[Math.floor(Math.random() * enables4.length)] + "\", ";
    value += "\"" + enables5[Math.floor(Math.random() * enables5.length)] + "\",\n";
    
  }
  
  return value;
}


function createRandomTeams(seeded) {
  var heroName = "";
  var oConfig = document.getElementById("configText");
  var numCreate = parseInt(document.getElementById("numCreate").value);
  
  isSeeded = seeded;
  
  oConfig.value = "{\n";
  for(i=0; i<numCreate; i++) {
    oConfig.value += "\"" + i + "\": [\n";
    
    for (h=1; h<=6; h++) {
      heroName = heroNames[Math.floor(Math.random() * heroNames.length)];
      oConfig.value += getHero(heroName);
    }
    
    oConfig.value += "  \"" + monsterNames[Math.floor(Math.random() * monsterNames.length)] + "\"\n";
    
    if (i<(numCreate-1)) {
      oConfig.value += "],\n";
    } else {
      oConfig.value += "]\n";
    }
  }
  
  oConfig.value += "}";
  
  
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem(lsPrefix + "configText", document.getElementById("configText").value);
  }
  
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
  
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem(lsPrefix + "configText", document.getElementById("configText").value);
  }
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
  
  var heroName = "";
  var skinNames;
  var legendarySkins;
  
  
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
          child1[g] = heroNames[Math.floor(Math.random() * heroNames.length)];
          
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
          child1[g] = stoneNames[Math.floor(Math.random() * stoneNames.length)];
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
  if (Math.random() < posSwapRate) {
    child1[60] = monsterNames[Math.floor(Math.random() * monsterNames.length )];
  }

  // swap hero positions
  if (Math.random() < posSwapRate) {
    let swap1 = Math.floor(Math.random() * 6);
    let swap2 = Math.floor(Math.random() * 6);
    
    let tempHero = child1[swap1 * 10];
    let tempSkin = child1[swap1 * 10 + 1];
    
    child1[swap1 * 10] = child1[swap2 * 10];
    child1[swap2 * 10] = tempHero;
    
    child1[swap1 * 10 + 1] = child1[swap2 * 10 + 1];
    child1[swap2 * 10 + 1] = tempSkin;
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
        
        let strEnables = "\"" + child1.slice(g+5, g+10).join("\", \"") + "\"";
        if (sHero.allowedEnables.indexOf(strEnables) < 0) {
          strEnables = sHero.allowedEnables[Math.floor(Math.random() * sHero.allowedEnables.length)];
          strEnables = strEnables.replace(/"/g, "");
          let arrEnables = strEnables.split(", ");
          
          for (let j = 5; j < 10; j++) {
            child1[g+j] = arrEnables[j-5];
          }
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