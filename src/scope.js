/**
 * Created by rancongjie on 16/12/11.
 */
/**
 * 不应该是全局的，后面会改造成注入的
 * @Scope constructor
 */
function Scope() {
  this.$$watchers = [];
  //标示最后一个脏值watch，减短digest loop
  this.$$lastDirtyWatch = null;
}
/**
 * 初始化watch值
 */
function initWatchVal() {
}

/**
 * $watch
 * @param watchFn
 * @param listenerFn
 */
Scope.prototype.$watch = function (watchFn, listenerFn) {
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || function () {

    },
    last: initWatchVal
  };
  this.$$watchers.push(watcher);
  this.$$lastDirtyWatch = null;
};

/**
 * $digest
 */
Scope.prototype.$digest = function () {
  var ttl = 10;
  var dirty;
  this.$$lastDirtyWatch = null;
  do {
    dirty = this.$$digestOnce();
    if (dirty && !(ttl--)) {
      throw "10 digest iterations reached";
    }
  } while (dirty);
};

/**
 * disgest loop
 * @returns {boolean}
 */
Scope.prototype.$$digestOnce = function () {
  var self = this;
  var newVal, oldVal, dirty = false;
  _.forEach(this.$$watchers, function (watcher) {
    newVal = watcher.watchFn(self);
    oldVal = watcher.last;
    if (newVal !== oldVal) {
      self.$$lastDirtyWatch = watcher;
      watcher.last = newVal;
      watcher.listenerFn(newVal, oldVal === initWatchVal ? newVal : oldVal, self);
      dirty = true;
    } else if (self.$$lastDirtyWatch === watcher) {
      return false;
    }
  });
  return dirty;
};