define(['Q'], function(Q) {
  var deferred = Q.defer(),
      promise = deferred.promise;
  return {
    outgoing: function(cb) {
      promise.then(null, cb, cb);
    },
    incoming: function() {
      console.log("mapper.js: incoming", arguments);
      deferred.notify("hello from mapper.js")
    }
  };
});
