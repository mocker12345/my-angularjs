/**
 * Created by rancongjie on 16/12/11.
 */
function Scope() {
  this.$$watchers = [];
}
function initWatchVal() {
}

Scope.prototype.$watch = function (watchFn, listenerFn) {
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || function () {

    },
    last: initWatchVal
  };
  this.$$watchers.push(watcher);
};

Scope.prototype.$digest = function () {
  var ttl = 10;
  var dirty;
  do {
    dirty = this.$$digestOnce();
    if (dirty && !(ttl--)) {
      throw "10 digest iterations reached"; }
  } while (dirty);
};

Scope.prototype.$$digestOnce = function () {
  var self = this;
  var newVal, oldVal, dirty;
  _.forEach(this.$$watchers, function (watcher) {
    newVal = watcher.watchFn(self);
    oldVal = watcher.last;
    if (newVal !== oldVal) {
      watcher.last = newVal;
      watcher.listenerFn(newVal, oldVal === initWatchVal ? newVal : oldVal, self);
      dirty = true;
    }
  });
  return dirty;
};