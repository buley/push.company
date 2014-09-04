define(['q'], function(Q) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer();
  module.resolve();
  return {
    outgoing: function(cb) {
      promise.then(null, cb, cb);
    },
    incoming: function() {
      console.log("mapper.js: incoming", arguments);
      deferred.notify("hello from mapper.js")
    },
    ready: module.promise.then.bind(module.promise)
  };
});
