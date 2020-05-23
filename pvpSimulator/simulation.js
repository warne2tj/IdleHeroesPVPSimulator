var basicQueue = [];
var activeQueue = [];
var triggerQueue = [];

function runSim() {
  var oCombatLog = document.getElementById("combatLog");
  var numSims = document.getElementById("numSims").value;
  var roundNum = 0;
  var winCount = 0;
  var orderOfAttack = [];
  var numOfHeroes = 0;
  var result = {};
  var monsterResult = "";
  var someoneWon = "";
  var endRoundDesc = "";
  var numLiving = 0;
  var tempTrigger;
  var currentHero;
  
  var attMonsterName = document.getElementById("attMonster").value;
  var attMonster = new baseMonsterStats[attMonsterName]["className"](attMonsterName, "att");
  
  var defMonsterName = document.getElementById("defMonster").value;
  var defMonster = new baseMonsterStats[defMonsterName]["className"](defMonsterName, "def");
  
  oCombatLog.innerHTML = "";
  
  for (var i = 0; i < attHeroes.length; i++) {
    attHeroes[i]._damageDealt = 0;
    attHeroes[i]._damageHealed = 0;
  }
  
  for (var i = 0; i < defHeroes.length; i++) {
    defHeroes[i]._damageDealt = 0;
    defHeroes[i]._damageHealed = 0;
  }
  
  for (var simIterNum = 1; simIterNum <= numSims; simIterNum++) {
    // @ start of single simulation
    
    if(numSims == 1) {oCombatLog.innerHTML += "<p class ='logSeg'>Simulation #" + formatNum(simIterNum) +" Started.</p>"};
    someoneWon = "";
    attMonster._energy = 0;
    defMonster._energy = 0;
    
    // snapshot stats as they are
    numOfHeroes = attHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (attHeroes[i]._heroName != "None") {
        attHeroes[i].snapshotStats();
        attHeroes[i]._buffs = {};
        attHeroes[i]._debuffs = {};
      }
    }
    
    numOfHeroes = defHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (defHeroes[i]._heroName != "None") {
        defHeroes[i].snapshotStats();
        defHeroes[i]._buffs = {};
        defHeroes[i]._debuffs = {};
      }
    }
    
    // trigger start of battle abilities
    for (var h in attHeroes) {
      if ((attHeroes[h].isNotSealed() && attHeroes[h]._currentStats["totalHP"] > 0) || attHeroes[h]._currentStats["revive"] == 1) {
        temp = attHeroes[h].startOfBattle();
        if(numSims == 1) {oCombatLog.innerHTML += temp;}
      }
    }
    
    for (var h in defHeroes) {
      if (defHeroes[h].isNotSealed() && defHeroes[h]._currentStats["totalHP"] > 0) {
        temp = defHeroes[h].startOfBattle();
        if(numSims == 1) {oCombatLog.innerHTML += temp;}
      }
    }
    
    for (roundNum = 1; roundNum <= 15; roundNum++) {
      // @ start of round
      
      // Output detailed combat log only if running a single simulation
      if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Round " + formatNum(roundNum) + " Start</p>";}
      
      
      orderOfAttack = attHeroes.concat(defHeroes);
      
      while (orderOfAttack.length > 0) {
        // @ start of hero action
        basicQueue = [];
        activeQueue = [];
        triggerQueue = [];
        
        
        orderOfAttack.sort(speedSort);
        currentHero = orderOfAttack.shift();
        
        if (currentHero._currentStats["totalHP"] > 0) {
          if(currentHero.isUnderStandardControl()) {
            if(numSims == 1) {oCombatLog.innerHTML += "<p>" + currentHero.heroDesc() + " is under control effect, turn skipped.</p>";}
          } else {
            if(numSims == 1) {oCombatLog.innerHTML += "<p></p>";}
            
            // decide on action
            if (currentHero._currentStats["energy"] >= 100 && !("Silence" in currentHero._debuffs)) {
              // set hero energy to 0
              currentHero._currentStats["energy"] = 0;
              
              // do active
              result = currentHero.doActive();
              if(numSims == 1) {oCombatLog.innerHTML += "<div>" + result + "</div>";}
              
              // monster gains energy from hero active
              if (currentHero._attOrDef == "att") {
                if (attMonster._monsterName != "None") {
                  monsterResult = "<div>" + attMonster.heroDesc() + " gained " + formatNum(10) + " energy. ";
                  attMonster._energy += 10;
                  monsterResult += "Energy at " + formatNum(attMonster._energy) + ".</div>"
                  if(numSims == 1) {oCombatLog.innerHTML += monsterResult;}
                }
                
              } else {
                if (defMonster._monsterName != "None") {
                  monsterResult = "<div>" + defMonster.heroDesc() + " gained " + formatNum(10) + " energy. ";
                  defMonster._energy += 10;
                  monsterResult += "Energy at " + formatNum(defMonster._energy) + ".</div>"
                  if(numSims == 1) {oCombatLog.innerHTML += monsterResult;}
                }
              }
              
              // check for Aida's Balance Mark debuffs
              if ("Balance Mark" in currentHero._debuffs) {
                var firstKey = Object.keys(currentHero._debuffs["Balance Mark"])[0];
                triggerQueue.push([currentHero._debuffs["Balance Mark"][firstKey]["source"], "balanceMark", currentHero, currentHero._debuffs["Balance Mark"][firstKey]["effects"]["attackAmount"]]);
              }
              
              for (var h in currentHero._allies) {
                triggerQueue.push([currentHero._allies[h], "eventAllyActive", currentHero, activeQueue]);
              }
              
              for (var h in currentHero._enemies) {
                triggerQueue.push([currentHero._enemies[h], "eventEnemyActive", currentHero, activeQueue]);
              }
  
  
              // get energy after getting hit by active
              temp = "";
              for (var i=0; i<activeQueue.length; i++) {
                if (activeQueue[i][1]._currentStats["totalHP"] > 0) {
                  if (activeQueue[i][2] > 0) {
                    if (activeQueue[i][3] == true) {
                      // double energy on being critted
                      temp += activeQueue[i][1].getEnergy(activeQueue[i][1], 20);
                    } else {
                      temp += activeQueue[i][1].getEnergy(activeQueue[i][1], 10);
                    }
                  }
                }
              }
              if(numSims == 1) {oCombatLog.innerHTML += temp;}
              
            } else if ("Horrify" in currentHero._debuffs) {
              if(numSims == 1) {oCombatLog.innerHTML += "<p>" + currentHero.heroDesc() + " is Horrified, basic attack skipped.</p>";}
              
            } else {
              // do basic
              result = currentHero.doBasic();
              if(numSims == 1) {oCombatLog.innerHTML += "<div>" + result + "</div>";}  
              
              // hero gains 50 energy after doing basic
              temp = currentHero.getEnergy(currentHero, 50);
              if(numSims == 1) {oCombatLog.innerHTML += temp;}
              
              for (var h in currentHero._allies) {
                triggerQueue.push([currentHero._allies[h], "eventAllyBasic", currentHero, basicQueue]);
              }
              
              for (var h in currentHero._enemies) {
                triggerQueue.push([currentHero._enemies[h], "eventEnemyBasic", currentHero, basicQueue]);
              }
              
              // get energy after getting hit by basic
              temp = "";
              for (var i=0; i<basicQueue.length; i++) {
                if (basicQueue[i][1]._currentStats["totalHP"] > 0) {
                  if (basicQueue[i][2] > 0) {
                    if (basicQueue[i][3] == true) {
                      // double energy on being critted
                      temp += basicQueue[i][1].getEnergy(basicQueue[i][1], 20);
                    } else {
                      temp += basicQueue[i][1].getEnergy(basicQueue[i][1], 10);
                    }
                  }
                }
              }
              if(numSims == 1) {oCombatLog.innerHTML += temp;}
            }
          }
              
              
          // process triggers and events    
          temp = processQueue();
          if(numSims == 1) {oCombatLog.innerHTML += temp;}
          someoneWon = checkForWin();
          if (someoneWon != "") {break;}
        }
      }
      
      if (someoneWon != "") {break;}
      
      // trigger end of round stuff
      if(numSims == 1) {oCombatLog.innerHTML += "<p></p><div class='logSeg'>End of round " + formatNum(roundNum) + ".</div>";}
      
      
      // handle monster stuff
      if (attMonster._monsterName != "None") {
        monsterResult = "<p></p><div>" + attMonster.heroDesc() + " gained " + formatNum(20) + " energy. ";
        attMonster._energy += 20;
        monsterResult += "Energy at " + formatNum(attMonster._energy) + ".</div>"
      
        if (attMonster._energy >= 100) {
          monsterResult += attMonster.doActive();
        }
        
        if(numSims == 1) {oCombatLog.innerHTML += monsterResult;}
      }
      
      if (defMonster._monsterName != "None") {
        monsterResult = "<p></p><div>" + defMonster.heroDesc() + " gained " + formatNum(20) + " energy. ";
        defMonster._energy += 20;
        monsterResult += "Energy at " + formatNum(defMonster._energy) + ".</div>"
      
        if (defMonster._energy >= 100) {
          monsterResult += defMonster.doActive();
        }
        
        if(numSims == 1) {oCombatLog.innerHTML += monsterResult;}
      }
      
      temp = processQueue();
      if(numSims == 1) {oCombatLog.innerHTML += temp;}
      someoneWon = checkForWin();
      if (someoneWon != "") {break;}
      
      
      // handle attacker end of round
      if(numSims == 1) {oCombatLog.innerHTML += "<p></p>";}
      for (var h in attHeroes) {
        temp = "";
        
        if (attHeroes[h]._currentStats["totalHP"] > 0) {
          temp += attHeroes[h].tickBuffs();
          temp += attHeroes[h].tickDebuffs();
        }
          
        if (attHeroes[h]._currentStats["totalHP"] > 0 && attHeroes[h].isNotSealed()) {
          temp += attHeroes[h].tickEnable3();
        }
        
        if ((attHeroes[h]._currentStats["totalHP"] > 0 && attHeroes[h].isNotSealed()) || attHeroes[h]._currentStats["revive"] == 1) {
          temp += attHeroes[h].endOfRound(roundNum);
        }
        
        if(numSims == 1) {oCombatLog.innerHTML += temp;}
      }
      
      
      // handle defender end of round
      if(numSims == 1) {oCombatLog.innerHTML += "<p></p>";}
      for (var h in defHeroes) {
        temp = "";
        
        if (defHeroes[h]._currentStats["totalHP"] > 0) {
          temp += defHeroes[h].tickBuffs();
          temp += defHeroes[h].tickDebuffs();
        }
          
        if (defHeroes[h]._currentStats["totalHP"] > 0 && defHeroes[h].isNotSealed()) {
          temp += defHeroes[h].tickEnable3();
        }
        
        if ((defHeroes[h]._currentStats["totalHP"] > 0 && defHeroes[h].isNotSealed()) || defHeroes[h]._currentStats["revive"] == 1) {
          temp += defHeroes[h].endOfRound(roundNum);
        }
        
        if(numSims == 1) {oCombatLog.innerHTML += temp;}
      }
      
      temp = processQueue();
      if(numSims == 1) {oCombatLog.innerHTML += temp;}
      someoneWon = checkForWin();
      if (someoneWon != "") {break;}
      
      
      // @ end of round
    }
    
    if (someoneWon == "att") {
      winCount++;
      if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Attacker wins!</p>";}
    } else {
      if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Defender wins!</p>";}
    }
    
    
    numOfHeroes = attHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (attHeroes[i]._heroName != "None") {
        attHeroes[i]._damageDealt += attHeroes[i]._currentStats["damageDealt"];
        attHeroes[i]._currentStats["damageDealt"] = 0;
        attHeroes[i]._damageHealed += attHeroes[i]._currentStats["damageHealed"];
        attHeroes[i]._currentStats["damageHealed"] = 0;
      }
    }
    
    numOfHeroes = defHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (defHeroes[i]._heroName != "None") {
        defHeroes[i]._damageDealt += defHeroes[i]._currentStats["damageDealt"];
        defHeroes[i]._currentStats["damageDealt"] = 0;
        defHeroes[i]._damageHealed += defHeroes[i]._currentStats["damageHealed"];
        defHeroes[i]._currentStats["damageHealed"] = 0;
      }
    }
    
    if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Simulation #" + formatNum(simIterNum) +" Ended.</p>"};
    
    // @ end of simulation
  }
  
  oCombatLog.innerHTML += "<p class='logSeg'>Attacker won " + winCount + " out of " + numSims + " (" + formatNum((winCount/numSims * 100).toFixed(2)) + "%).</p>";
  
  // damage summary
  oCombatLog.innerHTML += "<p><div class='logSeg'>Attacker average damage summary.</div>";
  for (var i = 0; i < attHeroes.length; i++) {
    if (attHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div><span class='att'>" + attHeroes[i]._heroName + "</span>: " + formatNum(Math.floor(attHeroes[i]._damageDealt / numSims)) + "</div>";
    }
  }
  if (attMonster._monsterName != "None") {
    oCombatLog.innerHTML += "<div><span class='att'>" + attMonster._monsterName + "</span>: " + formatNum(Math.floor(attMonster._currentStats["damageDealt"] / numSims)) + "</div>";
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.innerHTML += "<p><div class='logSeg'>Defender average damage summary.</div>";
  for (var i = 0; i < defHeroes.length; i++) {
    if (defHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div><span class='def'>" + defHeroes[i]._heroName + "</span>: " + formatNum(Math.floor(defHeroes[i]._damageDealt / numSims)) + "</div>";
    }
  }
  if (defMonster._monsterName != "None") {
    oCombatLog.innerHTML += "<div><span class='def'>" + defMonster._monsterName + "</span>: " + formatNum(Math.floor(defMonster._currentStats["damageDealt"] / numSims)) + "</div>";
  }
  oCombatLog.innerHTML += "</p>";
  
  // healing and damage prevention summary
  oCombatLog.innerHTML += "<p><div class='logSeg'>Attacker average healing and damage prevention summary.</div>";
  for (var i = 0; i < attHeroes.length; i++) {
    if (attHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div><span class='att'>" + attHeroes[i]._heroName + "</span>: " + formatNum(Math.floor(attHeroes[i]._damageHealed / numSims)) + "</div>";
    }
  }
  if (attMonster._monsterName != "None") {
    oCombatLog.innerHTML += "<div><span class='att'>" + attMonster._monsterName + "</span>: " + formatNum(Math.floor(attMonster._currentStats["damageHealed"] / numSims)) + "</div>";
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.innerHTML += "<p><div class='logSeg'>Defender average healing and damage prevention summary.</div>";
  for (var i = 0; i < defHeroes.length; i++) {
    if (defHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div><span class='def'>" + defHeroes[i]._heroName + "</span>: " + formatNum(Math.floor(defHeroes[i]._damageHealed / numSims)) + "</div>";
    }
  }
  if (defMonster._monsterName != "None") {
    oCombatLog.innerHTML += "<div><span class='def'>" + defMonster._monsterName + "</span>: " + formatNum(Math.floor(defMonster._currentStats["damageHealed"] / numSims)) + "</div>";
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.scrollTop = 0;
  
  return winCount;
}
  
  
// process all triggers and events
function processQueue() {
  var result = "";
  var temp = "";
  var copyQueue;
  
  while (triggerQueue.length > 0) {
    copyQueue = triggerQueue.slice();
    triggerQueue = [];
    // stopped here
    
    copyQueue.sort(function(a,b) {
      if (a[0]._attOrDef == "att" && b[0]._attOrDef == "def") {
        return -1;
      } else if (a[0]._attOrDef == "def" && b[0]._attOrDef == "att") {
        return 1;
      } else if (a[0]._heroPos < b[0]._heroPos) {
        return -1;
      } else {
        return 1;
      }
    });
    
    for (var i in copyQueue) {
      if ((copyQueue[i][0]._currentStats["totalHP"] > 0 && copyQueue[i][0].isNotSealed())
        || copyQueue[i][0]._heroName == "Carrie"
        || copyQueue[i][1].includes("Mark")
        || copyQueue[i][1] == "eventSelfDied"
      ) {
        result += copyQueue[i][0].handleTrigger(copyQueue[i]);
      }
    }
  }
  
  return result;
}


function checkForWin() {
  var attAlive = 0;
  var defAlive = 0;
  var numOfHeroes = 0;
  
  numOfHeroes = attHeroes.length;
  for (var i = 0; i < numOfHeroes; i++) {
    if (attHeroes[i]._currentStats["totalHP"] > 0 || (attHeroes[i]._currentStats["revive"] == 1 && attHeroes[i]._heroName != "Carrie")) {
      attAlive++;
    }
  }
  
  numOfHeroes = defHeroes.length;
  for (var i = 0; i < numOfHeroes; i++) {
    if (defHeroes[i]._currentStats["totalHP"] > 0 || (defHeroes[i]._currentStats["revive"] == 1 && defHeroes[i]._heroName != "Carrie")) {
      defAlive++;
    }
  }

  if (attAlive == 0 && defAlive >= 0) {
    return "def";
  } else if (attAlive > 0 && defAlive == 0) {
    return "att";
  } else {
    return "";
  }
}