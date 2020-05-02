function formatNum(num) {
  return "<span class ='num'>" + num.toLocaleString() + "</span>";
}


// UUIDv4
function uuid() {
  return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}


function isMonster(source) {
  if ("_monsterName" in source) {
    return true;
  } else {
    return false;
  }
}


function isControlEffect(strName, effects) {
  if (["stun", "petrify", "freeze", "entangle", "Seal of Light"].includes(strName)) {
    return true;
  } else if ("petrify" in effects) {
    return true;
  } else if ("freeze" in effects) {
    return true;
  } else if ("entangle" in effects) {
    return true;
  } else if ("Seal of Light" in effects) {
    return true;
  } else {
    return false;
  }
}


function getFrontTargets(source, arrTargets) {
  var targets = [];
  
  if (arrTargets[0]._currentStats["totalHP"] > 0) {
    targets.push(arrTargets[0]);
  }
  if (arrTargets[1]._currentStats["totalHP"] > 0) {
    targets.push(arrTargets[1]);
  }
  
  if (targets.length == 0) {
    for (var h=2; h<arrTargets.length; h++) {
      if (arrTargets[h]._currentStats["totalHP"] > 0) {
        targets.push(arrTargets[h]);
      }
    }
  }
  
  return targets;
}


function getAllTargets(source, arrTargets) {
  // in anticipation of Unimax
  var livingTargets = [];
  
  for (var i=0; i<arrTargets.length; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      livingTargets.push(arrTargets[i]);
    }
  }
  
  return livingTargets;
}


function getRandomTargets(source, arrTargets) {
  var copyTargets = [];
  
  for (var i=0; i<arrTargets.length; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      arrTargets[i]._rng = Math.random();
      copyTargets.push(arrTargets[i]);
    }
  }
  
  copyTargets.sort(function(a,b) {
    if (a._rng > b._rng) {
      return 1;
    } else if (a._rng < b._rng) {
      return -1;
    } else {
      return 0;
    }
  });
  
  return copyTargets;
}


function getLowestHPTargets(source, arrTargets) {
  // get living targets with lowest current HP
  var copyTargets = [];
  
  for (var i=0; i<arrTargets.length; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      copyTargets.push(arrTargets[i]);
    }
  }
  
  copyTargets.sort(function(a,b) {
    if (a._currentStats["totalHP"] > b._currentStats["totalHP"]) {
      return 1;
    } else if (a._currentStats["totalHP"] < b._currentStats["totalHP"]) {
      return -1;
    } else if (a._heroPos < b._heroPos) {
      return -1;
    } else {
      return 1;
    }
  });
  
  return copyTargets;
}


function getHighestHPTargets(source, arrTargets) {
  // get living target with highest current HP
  var copyTargets = [];
  
  for (var i=0; i<arrTargets.length; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      copyTargets.push(arrTargets[i]);
    }
  }
  
  copyTargets.sort(function(a,b) {
    if (a._currentStats["totalHP"] > b._currentStats["totalHP"]) {
      return -1;
    } else if (a._currentStats["totalHP"] < b._currentStats["totalHP"]) {
      return 1;
    } else if (a._heroPos < b._heroPos) {
      return -1;
    } else {
      return 1;
    }
  });
  
  return copyTargets;
}