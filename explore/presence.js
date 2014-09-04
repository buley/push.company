define(['q'], function(Q) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer();
  module.resolve();
  return {
    outgoing: function(interface) {
      console.log("presence.js: outgoing")
      interface(promise);
    },
    incoming: function(interface) {
      console.log("presence.js: incoming", arguments);
      interface.then(null, null, function() {
        console.log("presence.js: incoming notify", arguments);
      })
    },
    ready: module.promise.then.bind(module.promise)
  }
});
