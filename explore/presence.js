define(['q'], function(Q) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer();
  module.resolve();
  return {
    outgoing: function(cb) {
      console.log("presence.js: outgoing", typeof cb)
      promise.then(null, cb, cb);
    },
    incoming: function() {
      console.log("presence.js: incoming", arguments);
      deferred.notify("hello from presence.js");
    },
    ready: module.promise.then.bind(module.promise)
  }
});
