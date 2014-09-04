define(['q'], function(Q) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer();
  module.resolve();
  return {
    outgoing: function(cb) {
      console.log("mapper.js: outgoing", typeof cb)
      promise.then(null, cb, cb);
    },
    incoming: function(interface) {
      console.log("mapper.js: incoming", arguments)
      interface.notify(function() {
        console.log("mapper.js: incoming notification", arguments);
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
