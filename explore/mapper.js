define(['q'], function(Q) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer();
  module.resolve();
  return {
    outgoing: function(interface) {
      console.log("mapper.js: outgoing")
      interface(promise);
    },
    incoming: function(interface) {
      console.log("mapper.js: incoming", arguments)
      interface.then(null, null, function() {
        console.log("mapper.js: incoming notification", arguments);
        deferred.notify("hello from mapper.js");
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
