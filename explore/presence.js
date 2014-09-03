define(['Q'], function(Q) {
  var deferred = Q.defer(),
      promise = deferred.promise;
  return {
    outgoing: function(cb) {
      promise.then(null, cb, cb);
    },
    incoming: function() {
      console.log("presence.js: incoming", arguments);
      deferred.resolve("hello from presence.js");
    }
  }
});
