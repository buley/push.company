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
    incoming: function(interface) {
      console.log("presence.js: incoming", arguments);
      interface.notify(function() {
        console.log("presence.js: incoming notify", arguments);
      })
    },
    ready: module.promise.then.bind(module.promise)
  }
});
