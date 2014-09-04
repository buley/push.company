define(['q'], function(Q) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context;
  module.resolve();
  return {
    outgoing: function(interface) {
      console.log("presence.js: outgoing")
      interface(promise);
    },
    incoming: function(interface) {
      console.log("presence.js: incoming", arguments);
      interface.then(null, null, function() {
        state.interfaces = state.interfaces || {};
        state.interfaces.presence = {
          bar: function() {
            console.log('presence.js: bar');
          }
        };
        deferred.notify(state);
        context = state;
      })
    },
    ready: module.promise.then.bind(module.promise)
  }
});
