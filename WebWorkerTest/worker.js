class testClass {
  constructor(str) {
    this._obj = {"key": str};
  }
  
  modify() {
    this._obj["key"] += " modded";
  }
}

class overTest extends testClass {
  modify() {
    super.modify();
  }
}


var testObj;

self.onmessage = doCall;

function doCall(e) {
  testObj = e.data;
  console.log(testObj);
  testObj.modify();
  setTimeout("doWork()", 5000);
}

function doWork() {
  postMessage({"oldValue": testObj._obj["key"]});
}