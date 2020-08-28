var oBin1;
var oBin2;
var oBin3;
var oBin4;
var oBin5;
var oBin6;
var oBin7;
var oBin8;
var oBin9;
var arrBins;
var arrResults;
var simNum;
var totalStars;

var startOrdDice;
var startLuckDice;
var startStars;
var startPos;
var startMushroom1;
var startMushroom2;
var startMushroom3;
var startMoveBackwards;
var startDoubleStars;
var startDoubleNextRoll;
var startRollTwice;

var simRunning = false;
var totalSims = 1000000;

var lsPrefix = "imp_";

function init() {
  var acc = document.getElementsByClassName("accordion");
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      this.classList.toggle("active");

      /* Toggle between hiding and showing the active panel */
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
    if (localStorage.getItem(lsPrefix + "ordinary") !== null) {
      document.getElementById("ordinary").value = localStorage.getItem(lsPrefix + "ordinary");
      document.getElementById("lucky").value = localStorage.getItem(lsPrefix + "lucky");
      document.getElementById("stars").value = localStorage.getItem(lsPrefix + "stars");
      document.getElementById("startPos").value = localStorage.getItem(lsPrefix + "startPos");
      document.getElementById("mushroom1").value = localStorage.getItem(lsPrefix + "mushroom1");
      document.getElementById("mushroom2").value = localStorage.getItem(lsPrefix + "mushroom2");
      document.getElementById("mushroom3").value = localStorage.getItem(lsPrefix + "mushroom3");
      document.getElementById("activeTarot").value = localStorage.getItem(lsPrefix + "activeTarot");
      document.getElementById("reward1").value = localStorage.getItem(lsPrefix + "reward1");
      document.getElementById("reward2").value = localStorage.getItem(lsPrefix + "reward2");
      document.getElementById("reward3").value = localStorage.getItem(lsPrefix + "reward3");
      document.getElementById("reward4").value = localStorage.getItem(lsPrefix + "reward4");
      document.getElementById("reward5").value = localStorage.getItem(lsPrefix + "reward5");
      document.getElementById("reward6").value = localStorage.getItem(lsPrefix + "reward6");
      document.getElementById("reward7").value = localStorage.getItem(lsPrefix + "reward7");
      document.getElementById("reward8").value = localStorage.getItem(lsPrefix + "reward8");
    } else {
      localStorage.setItem(lsPrefix + "ordinary", 78);
      localStorage.setItem(lsPrefix + "lucky", 0);
      localStorage.setItem(lsPrefix + "stars", 0);
      localStorage.setItem(lsPrefix + "startPos", 0);
      localStorage.setItem(lsPrefix + "mushroom1", 1);
      localStorage.setItem(lsPrefix + "mushroom2", 1);
      localStorage.setItem(lsPrefix + "mushroom3", 1);
      localStorage.setItem(lsPrefix + "activeTarot", "None");
      localStorage.setItem(lsPrefix + "reward1", 1250);
      localStorage.setItem(lsPrefix + "reward2", 2500);
      localStorage.setItem(lsPrefix + "reward3", 3750);
      localStorage.setItem(lsPrefix + "reward4", 1800);
      localStorage.setItem(lsPrefix + "reward5", 7500);
      localStorage.setItem(lsPrefix + "reward6", 1000);
      localStorage.setItem(lsPrefix + "reward7", 10000);
      localStorage.setItem(lsPrefix + "reward8", 8400);
    }
  }
  
  
  oBin1 = document.getElementById("bin1");
  oBin2 = document.getElementById("bin2");
  oBin3 = document.getElementById("bin3");
  oBin4 = document.getElementById("bin4");
  oBin5 = document.getElementById("bin5");
  oBin6 = document.getElementById("bin6");
  oBin7 = document.getElementById("bin7");
  oBin8 = document.getElementById("bin8");
  oBin9 = document.getElementById("bin9");
  arrBins = [oBin1, oBin2, oBin3, oBin4, oBin5, oBin6, oBin7, oBin8, oBin9]; 
  
  updateStrat();
}


function storeLocal(i) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem(lsPrefix + i.id, i.value);
  }
}


function runImpSim() {
  if (!(simRunning)) {
    arrResults = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    simNum = 0;
    totalStars = 0;
    simRunning = true;
    
    // get starting conditions
    startOrdDice = parseInt(document.getElementById("ordinary").value);
    startLuckDice = parseInt(document.getElementById("lucky").value);
    startStars = parseInt(document.getElementById("stars").value);
    startPos = parseInt(document.getElementById("startPos").value);
    startMushroom1 = parseInt(document.getElementById("mushroom1").value);
    startMushroom2 = parseInt(document.getElementById("mushroom2").value);
    startMushroom3 = parseInt(document.getElementById("mushroom3").value);
    startMoveBackwards = false;
    startDoubleStars = false;
    startDoubleNextRoll = false;
    startRollTwice = false;
    
    switch (document.getElementById("activeTarot").value) {
      case "MoveBackwards":
        startMoveBackwards = true;
        break;
        
      case "DoubleStars":
        startDoubleStars = true;
        break;
        
      case "DoubleNextRoll":
        startDoubleNextRoll = true;
        break;
        
      case "RollTwice":
        startRollTwice = true;
        break;
    }
    
    setTimeout(nextSimBlock, 1);
  }
}

function nextSimBlock() {
  if (simNum < totalSims) {
    var binNum;
    
    var ordDice;
    var luckDice;
    var stars;
    var pos;
    var tarot;
    var potentials;
    var doubleNextRoll;
    var moveBackwards;
    var doubleStars;
    var rollTwice;
    var roll;
    var decision;
    
    
    var boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    // simulate
    for (var i = 0; i < 1000; i++) {
      // reset starting conditions
      ordDice = startOrdDice;
      luckDice = startLuckDice;
      stars = startStars;
      pos = startPos;
      
      boardState[4] = 2 + startMushroom1;
      boardState[11] = 2 + startMushroom2;
      boardState[18] = 2 + startMushroom3;
      
      doubleNextRoll = startDoubleNextRoll;
      moveBackwards = startMoveBackwards;
      doubleStars = startDoubleStars;
      rollTwice = startRollTwice;
      
      
      // simulate
      while (ordDice > 0 || luckDice > 0) {
        decision = getStrat(ordDice, luckDice, stars, pos, doubleNextRoll, rollTwice, moveBackwards, boardState);
        
        if (decision[2] == 0) { break; }
        rollTwice = false;
        ordDice = decision[0];
        luckDice = decision[1];
        roll = decision[2];
        
        // double next roll tarot active
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
          
          if (pos == 5) {
            ordDice++;
          } else if (pos == 20) {
            luckDice++;
          } else if (pos == 10) {
            // tarot card
            tarot = Math.floor(Math.random() * 9 + 1);
            
            /*if (tarot == 1) {
              potentials = [];
              if (boardState[4] < 5) { potentials.push([4, Math.random()]); }
              if (boardState[11] < 5) { potentials.push([11, Math.random()]); }
              if (boardState[18] < 5) { potentials.push([18, Math.random()]); }
              
              if (potentials.length > 0) {
                potentials.sort(function(a,b) {
                  if (a[1] < b[1]) {
                    return -1;
                  } else {
                    return 1;
                  }
                });
                
                boardState[potentials[0][0]]++;
              }
              
            } else if (tarot == 2) {
              potentials = [];
              if (boardState[4] > 3) { potentials.push([4, Math.random()]); }
              if (boardState[11] > 3) { potentials.push([11, Math.random()]); }
              if (boardState[18] > 3) { potentials.push([18, Math.random()]); }
              
              if (potentials.length > 0) {
                potentials.sort(function(a,b) {
                  if (a[1] < b[1]) {
                    return -1;
                  } else {
                    return 1;
                  }
                });
                
                boardState[potentials[0][0]]--;
              }
              
            } else*/ if (tarot == 3) {
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
            
          } else if (pos == 4 || pos == 11 || pos == 18) {
            if (boardState[pos] < 5) { boardState[pos]++; }
          }
        }
      }
      
      // convert unused dice to stars
      stars += (ordDice + luckDice) * 2;
      
      
      // update results
      totalStars += stars;
      
      if (stars < 80) {
        binNum = 0;
      } else if (stars < 110) {
        binNum = 1;
      } else if (stars < 140) {
        binNum = 2;
      } else if (stars < 170) {
        binNum = 3;
      } else if (stars < 200) {
        binNum = 4;
      } else if (stars < 230) {
        binNum = 5;
      } else if (stars < 260) {
        binNum = 6;
      } else if (stars < 300) {
        binNum = 7;
      } else if (stars >= 300) {
        binNum = 8;
      }
      
      arrResults[binNum]++;
      simNum++;
    }
    
    // update results and expected values
    var percent;
    for (var i = 0; i < 9; i++) {
      percent = 100.0 * arrResults[i] / totalSims;
      arrBins[i].innerHTML = percent.toFixed(4) + "%&nbsp;";
      
      if (Math.round(percent) < 1) {
        arrBins[i].style.width = "1%";
      } else {
        arrBins[i].style.width = Math.round(percent) + "%";
      }
    }
    
    
    
    setTimeout(nextSimBlock, 1);
    
  } else {
    simRunning = false;
    
    var runningSum = 0;
    for (var i = 8; i > 0; i--) {
      runningSum += arrResults[i];
      document.getElementById("chance" + i).innerHTML = (runningSum / totalSims * 100).toFixed(4);
    }
      
    updateValues();
    document.getElementById("avgStars").innerHTML = (1.0 * totalStars / totalSims).toFixed(4);
  }
}


function updateValues() {
  var runningSum = 0;
  var runningRewards = 0;
  var reward = 0;
  var currentStars = parseInt(document.getElementById("stars").value);
  var threshholds = [0, 80, 110, 140, 170, 200, 230, 260, 300];
  var chance;
  var expValue;
  
  for (var i = 1; i <= 8; i++) {
    if (currentStars >= threshholds[i]) {
      document.getElementById("value" + i).innerHTML = 0;
    } else {
      runningRewards += parseInt(document.getElementById("reward" + i).value);
      chance = parseFloat(document.getElementById("chance" + i).innerHTML) / 100;
      expValue = Math.round(chance * runningRewards);
      runningSum += expValue;
      document.getElementById("value" + i).innerHTML = expValue;
    }
  }
}


function getStrat(ordDice, luckDice, stars, pos, doubleNextRoll, rollTwice, moveBackwards, boardState) {
  var nextTier;
  var roll = 0;
  
  // check stars needed for next tier
  if (ordDice < 5) {
    if ((stars % 300) < 80) {
      nextTier = 80 - (stars % 300);
    } else {
      nextTier = 30 - (((stars % 300) - 80) % 30);
    }
    
    if ((ordDice + luckDice) * 2 >= nextTier) {
      return [ordDice, luckDice, roll];
    }
  }
  
  // decide which dice to use
  if (luckDice > 1 && boardState[18] < 5 && pos < 18 && pos >= 12 && pos != 15) {
    // use lucky to upgrade mushroom 3
    luckDice--;
    roll = 18 - pos;
    
  } else if (luckDice > 1 && boardState[18] == 5 && boardState[11] < 5 && pos < 11 && pos >= 5) {
    // use lucky to upgrade mushroom 2 if mushroom 3 is maxed
    luckDice--;
    roll = 11 - pos;
    
  } else if (luckDice > 1 && boardState[18] == 5 && boardState[4] < 5 && pos < 4) {
    // use lucky to upgrade mushroom 1 if mushroom 3 is maxed
    luckDice--;
    roll = 4 - pos;
    
  } else if (luckDice > 1 && boardState[18] == 5 && boardState[4] < 5 && pos >= 19) {
    // use lucky to upgrade mushroom 1 if mushroom 3 is maxed
    luckDice--;
    roll = 20 - pos + 4;
    
  } else if (luckDice > 1 && boardState[18] == 5 && boardState[11] == 5 && boardState[4] == 5 && pos < 3 ) {
    // get free ordinary
    luckDice--;
    roll = 5 - pos;
    
  } else if (luckDice > 1 && boardState[18] == 5 && boardState[11] == 5 && boardState[4] == 5 && pos >= 19 ) {
    // get free ordinary
    luckDice--;
    roll = 20 - pos + 5;
    
  } else if (luckDice > 0 && pos == 10 && doubleNextRoll) {
    // get free lucky
    luckDice--;
    roll = 5;
    
  } else if (luckDice > 0 && pos == 10 && rollTwice) {
    // get free lucky
    luckDice--;
    roll = 10;
    
  } else if (luckDice > 0 && pos != 15 && pos < 19 && pos >= 14) {
    // get free lucky
    luckDice--;
    roll = 20 - pos;
    
  } else if (luckDice > 0 && ordDice <= 1 && pos == 19) {
    // get free ordinary
    luckDice--;
    roll = 6;
    
  } else if (luckDice > 0 && ordDice <= 3 && pos == 20) {
    // get free ordinary
    luckDice--;
    roll = 5;
    
  } else if (luckDice > 0 && ordDice <= 3 && pos == 0) {
    // get free ordinary
    luckDice--;
    roll = 5;
    
  } else if (luckDice > 0 && ordDice <= 2 && pos == 1) {
    // get free ordinary
    luckDice--;
    roll = 4;
    
  } else if (luckDice > 0 && ordDice <= 1 && pos == 2) {
    // get free ordinary
    luckDice--;
    roll = 3;
    
  } else if (ordDice == 0) {
    // out of ordinary dice
    if (pos == 10 && moveBackwards) {
      if (luckDice > 1) {
        // move backwards tarot active, minimize damage
        roll = 1;
      } else {
        // no progress can be made, just save last dice
        return [ordDice, luckDice, roll];
      }
    } else if (pos == 20) {
      // get free ordinary
      roll = 5;
    } else if (pos < 5) {
      // get free ordinary 
      roll = 5 - pos;
    } else {
      if (luckDice > 1 || (pos != 4 && pos != 11)) {
        // move as far as possible
        roll = 6;
      } else {
        // no progress can be made, just save last dice
        return [ordDice, luckDice, roll];
      }
    }
    luckDice--;
    
  } else {
    // roll an ordinary dice
    ordDice--;
    roll = Math.floor(Math.random() * 6 + 1);
    
    if (rollTwice) {
      roll += Math.floor(Math.random() * 6 + 1);
    }
  }
  
  return [ordDice, luckDice, roll];
}


function updateStrat() {
  // get starting conditions
  var ordDice = parseInt(document.getElementById("ordinary").value);
  var luckDice = parseInt(document.getElementById("lucky").value);
  var stars = parseInt(document.getElementById("stars").value);
  var pos = parseInt(document.getElementById("startPos").value);
  var mushroom1 = parseInt(document.getElementById("mushroom1").value);
  var mushroom2 = parseInt(document.getElementById("mushroom2").value);
  var mushroom3 = parseInt(document.getElementById("mushroom3").value);
  var moveBackwards = false;
  var doubleNextRoll = false;
  var rollTwice = false;
  var boardState = [0, 0, 0, 0, 2 + mushroom1, 0, 0, 0, 0, 0, 0, 2 + mushroom2, 0, 0, 0, 0, 0, 0, 2 + mushroom3, 0, 0];
  var decision;
  
  switch (document.getElementById("activeTarot").value) {
    case "MoveBackwards":
      moveBackwards = true;
      break;
      
    case "DoubleNextRoll":
      doubleNextRoll = true;
      break;
      
    case "RollTwice":
      rollTwice = true;
      break;
  }

  decision = getStrat(ordDice, luckDice, stars, pos, doubleNextRoll, rollTwice, moveBackwards, boardState);
  
  if (decision[2] == 0) {
    document.getElementById("strategy").innerHTML = "Simulator's Next Move: Don't use any dice and let them convert to stars";
  } else if (decision[1] == luckDice) {
    document.getElementById("strategy").innerHTML = "Simulator's Next Move: Use ordinary dice";
  } else {
    document.getElementById("strategy").innerHTML = "Simulator's Next Move: Use lucky dice to roll " + decision[2].toString();
  }
}