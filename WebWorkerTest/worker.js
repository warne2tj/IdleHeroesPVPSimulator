var testObj;

self.onmessage = doCall;

function doCall(e) {
  testObj = e.data;
  testObj.modify();
  setTimeout("doWork()", 5000);
}

function doWork() {
  postMessage({"oldValue": testObj._obj["key"]});
}