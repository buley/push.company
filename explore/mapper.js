define(['q'], function(Q) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context;
  module.resolve();
  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        console.log('mapper.js: incoming', state);
        context = state;
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
