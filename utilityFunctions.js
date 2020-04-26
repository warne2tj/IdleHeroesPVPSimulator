function formatNum(num) {
  return "<span class ='num'>" + num.toLocaleString() + "</span>";
}


function getRandomTargets(arrTargets) {
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


function getFirstTarget(arrTargets) {
  // get first living target
  for (var i=0; i<arrTargets.length; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      return arrTargets[i];
    }
  }
}


function getLowestHPTarget(arrTargets) {
  // get first living target with lowest current HP
  var target = new hero("None");
  
  for (var i=0; i<arrTargets.length; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0 && (target._heroName == "None" || arrTargets[i]._currentStats["totalHP"] < target._currentStats["totalHP"])) {
      target = arrTargets[i];
    }
  }
  
  return target;
}