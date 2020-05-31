var oBin1;
var oBin2;
var oBin3;
var oBin4;
var oBin5;
var oBin6;
var arrBins;
var arrResults;
var simNum;
var totalDrops;

var startHoursLeft;
var startMinsLeft;
var startSecsLeft;
var startDaily;
var startCurrentNum;
var startDropChance;
var startMinDrop;
var startMaxDrop;

var simRunning = false;
var totalSims = 1000000;

var lsPrefix = "cd_";


function init() {
  // check local storage
  if (typeof(Storage) !== "undefined") {
    if (localStorage.getItem(lsPrefix + "daily") !== null) {
      document.getElementById("daily").value = localStorage.getItem(lsPrefix + "daily");
      document.getElementById("currentNum").value = localStorage.getItem(lsPrefix + "currentNum");
      document.getElementById("dropChance").value = localStorage.getItem(lsPrefix + "dropChance");
      document.getElementById("minDrop").value = localStorage.getItem(lsPrefix + "minDrop");
      document.getElementById("maxDrop").value = localStorage.getItem(lsPrefix + "maxDrop");
    } else {
      localStorage.setItem(lsPrefix + "daily", 100);
      localStorage.setItem(lsPrefix + "currentNum", 100);
      localStorage.setItem(lsPrefix + "dropChance", 0.44);
      localStorage.setItem(lsPrefix + "minDrop", 1);
      localStorage.setItem(lsPrefix + "maxDrop", 3);
    }
  }
  
  oBin1 = document.getElementById("bin1");
  oBin2 = document.getElementById("bin2");
  oBin3 = document.getElementById("bin3");
  oBin4 = document.getElementById("bin4");
  oBin5 = document.getElementById("bin5");
  oBin6 = document.getElementById("bin6");
  arrBins = [oBin1, oBin2, oBin3, oBin4, oBin5, oBin6]; 
  
  updateTime();
}


function updateTime() {
  var d = new Date();
  var dEnd = new Date(d.toUTCString());
  var numDaysAdd = 6 - ((d.getUTCDay() + 2) % 7);
  
  dEnd.setUTCDate(d.getUTCDate() + numDaysAdd);
  dEnd.setUTCHours(23);
  dEnd.setUTCMinutes(57);
  dEnd.setUTCSeconds(48);
  
  var secsDiff = Math.floor((dEnd - d) / 1000);
  var hoursLeft = Math.floor(secsDiff / 60 / 60);
  var minsLeft = Math.floor((secsDiff - (hoursLeft * 60 * 60)) / 60);
  var secsLeft = secsDiff % 60;
  
  document.getElementById("hoursLeft").value = hoursLeft;
  document.getElementById("minsLeft").value = minsLeft;
  document.getElementById("secsLeft").value = secsLeft;
}


function storeLocal(i) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem(lsPrefix + i.id, i.value);
  }
}


function runDropSim() {
  if (!(simRunning)) {
    arrResults = [0, 0, 0, 0, 0, 0];
    simNum = 0;
    totalDrops = 0;
    simRunning = true;
    
    // get starting conditions
    startHoursLeft = parseInt(document.getElementById("hoursLeft").value);
    startMinsLeft = parseInt(document.getElementById("minsLeft").value);
    startSecsLeft = parseInt(document.getElementById("secsLeft").value);
    startDaily = parseInt(document.getElementById("daily").value);
    startCurrentNum = parseInt(document.getElementById("currentNum").value);
    startDropChance = parseFloat(document.getElementById("dropChance").value);
    startMinDrop = parseInt(document.getElementById("minDrop").value);
    startMaxDrop = parseInt(document.getElementById("maxDrop").value);
    
    setTimeout(nextSimBlock, 1);
  }
}

function nextSimBlock() {
  if (simNum < totalSims) {
    var binNum;
    var numDrops;
    var currentNum;
    var dropsLeft = Math.floor((startHoursLeft * 60 * 60 + startMinsLeft * 60 + startSecsLeft) / 60 / 5);
    var dailyAdd = Math.floor((startHoursLeft * 60 * 60 + startMinsLeft * 60 + startSecsLeft + 132) / 60 / 60 / 24) * startDaily
    
    // simulate
    for (var i = 0; i < 1000; i++) {
      // reset starting conditions
      numDrops = startCurrentNum + dailyAdd;
      
      // simulate
      for (var j = 0; j < dropsLeft; j++) {
        if (Math.random() < startDropChance) {
          numDrops += Math.floor(Math.random() * (startMaxDrop - startMinDrop + 1)) + startMinDrop;
        }
      }
      
      // update results
      totalDrops += numDrops;
      
      if (numDrops < 1500) {
        binNum = 0;
      } else if (numDrops < 2300) {
        binNum = 1;
      } else if (numDrops < 2700) {
        binNum = 2;
      } else if (numDrops < 3100) {
        binNum = 3;
      } else if (numDrops < 3600) {
        binNum = 4;
      } else if (numDrops >= 3600) {
        binNum = 5;
      }
      
      arrResults[binNum]++;
      simNum++;
    }
    
    // update results and expected values
    var percent;
    for (var i = 0; i < arrResults.length; i++) {
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
    document.getElementById("avgDrops").innerHTML = (1.0 * totalDrops / totalSims).toFixed(4);
  }
}