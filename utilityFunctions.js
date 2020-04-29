function formatNum(num) {
  return "<span class ='num'>" + num.toLocaleString() + "</span>";
}


// UUIDv4
function uuid() {
  return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
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


function getFirstTarget(source, arrTargets) {
  // get first living target
  for (var i=0; i<arrTargets.length; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      return arrTargets[i];
    }
  }
  
  return new hero("None");
}


function getLowestHPTarget(source, arrTargets) {
  // get first living target with lowest current HP
  var target = new hero("None");
  
  for (var i=0; i<arrTargets.length; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0 && (target._heroName == "None" || arrTargets[i]._currentStats["totalHP"] < target._currentStats["totalHP"])) {
      target = arrTargets[i];
    }
  }
  
  return target;
}