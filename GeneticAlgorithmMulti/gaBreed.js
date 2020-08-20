var artifactLevel = "Glittery ";
var numEnhancedArtifacts = 3;

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


function getHero(heroName) {
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
    value += "\"" + artifactLevel + sHero.allowedArtifacts[Math.floor(Math.random() * sHero.allowedArtifacts.length)] + "\", ";
    value += sHero.allowedEnables[Math.floor(Math.random() * sHero.allowedEnables.length)] + ",\n";
    
  } else {
    value += "\"" + equipments[Math.floor(Math.random() * equipments.length)] + "\", ";
    value += "\"" + stoneNames[Math.floor(Math.random() * stoneNames.length)] + "\", ";
    value += "\"" + artifactLevel + artifactNames[Math.floor(Math.random() * artifactNames.length)] + "\", ";

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
  var strHero;
  var arrEnhArtifacts = [1, 2, 3, 4, 5, 6];
  var tempEnhArtifacts;
  
  isSeeded = seeded;

  oConfig.value = "{\n";
  for(i=0; i<numCreate; i++) {
    arrEnhArtifacts = shuffle(arrEnhArtifacts);
    tempEnhArtifacts = arrEnhArtifacts.slice(0, numEnhancedArtifacts);
    
    oConfig.value += "\"" + i + "\": [\n";

    for (h=1; h<=6; h++) {
      heroName = heroNames[Math.floor(Math.random() * heroNames.length)];
      strHero = getHero(heroName);
      
      if (!(tempEnhArtifacts.includes(h))) {
        strHero = strHero.replace(artifactLevel, "");
      }
      
      oConfig.value += strHero;
    }

    oConfig.value += "  \"" + monsterNames[Math.floor(Math.random() * monsterNames.length)] + "\"\n";

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

  parentB = Math.floor(Math.pow(Math.random(), 1.2) * (end - start)) + start;
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
          child1[g] = artifactLevel + artifactNames[Math.floor(Math.random() * artifactNames.length)];
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
          child1[g+4] = artifactLevel + sHero.allowedArtifacts[Math.floor(Math.random() * sHero.allowedArtifacts.length)];
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
  
  
  // limit enhanced artifacts
  var arrPotentialArtifacts = [];
  for (let h=0; h<6; h++) {
    let g = h * 10 + 4;
    
    if (child1[g].includes(artifactLevel)) {
      arrPotentialArtifacts.push(g);
    }
  }
  
  if (arrPotentialArtifacts.length > numEnhancedArtifacts) {
    arrPotentialArtifacts = shuffle(arrPotentialArtifacts);
    for (a = numEnhancedArtifacts; a < arrPotentialArtifacts.length; a++) {
      child1[arrPotentialArtifacts[a]] = child1[arrPotentialArtifacts[a]].replace(artifactLevel, "");
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


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}