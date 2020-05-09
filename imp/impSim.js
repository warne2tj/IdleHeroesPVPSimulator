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

var simRunning = false;
var totalSims = 1000000;

function init() {
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
      
      doubleNextRoll = false;
      moveBackwards = false;
      doubleStars = false;
      rollTwice = false;
      
      
      // simulate
      while (ordDice > 0 || luckDice > 0) {
        // decide which dice to use
        if (luckDice > 0 && pos == 10 && doubleNextRoll) {
          luckDice--;
          roll = 5;
          
        } else if (luckDice > 0 && pos == 10 && rollTwice) {
          rollTwice = false;
          luckDice--;
          roll = 10;
          
        } else if (luckDice > 0 && pos != 15 && pos < 19 && pos >= 14) {
          luckDice--;
          roll = 20 - pos;
          
        } else if (ordDice == 0) {
          luckDice--;
          if (pos == 15) {
            roll = 4;
          } else if (pos == 10 && moveBackwards) {
            roll = 1;
          } else if (pos == 20) {
            roll = 5;
          } else if (pos < 4) {
            roll = 4 - pos;
          } else {
            roll = 6;
          }
          
        } else {
          ordDice--;
          roll = Math.floor(Math.random() * 6 + 1);
          
          if (rollTwice) {
            rollTwice = false;
            roll += Math.floor(Math.random() * 6 + 1);
          }
        }
        
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
            
            if (tarot == 1) {
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
              
            } else if (tarot == 3) {
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
    
    // update results
    var percent;
    for (var i = 0; i < 9; i++) {
      percent = 100.0 * arrResults[i] / simNum;
      arrBins[i].innerHTML = percent.toFixed(3) + "%&nbsp;";
      arrBins[i].style.width = Math.round(percent) + "%";
    }
    
    setTimeout(nextSimBlock, 1);
    
  } else {
    simRunning = false;
    alert("Simulation finished. Average stars is " + (1.0 * totalStars / totalSims).toFixed(3) + ".");
  }
}
