var attHeroes = [];
var defHeroes = [];
var allTeams = {};
var simRunning = false;
var stopLoop = false;
var attIndex = 0;
var defIndex = 0;
var isSeeded = false;
var lsPrefix = "ga_";


var w0;
var w1;
var w2;
var w3;
var w4;
var w5;
var workerStatus;
  
  
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
        var totalFights = teamKeys.length * numSims;
        
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
