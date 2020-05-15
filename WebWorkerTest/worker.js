self.onmessage = doCall;

function doCall(e) {
  setTimeout("doWork('" + e.data["testObj"] + "')", 5000);
}

function doWork(obj) {
  postMessage({"oldValue": obj._obj["key"]});
}