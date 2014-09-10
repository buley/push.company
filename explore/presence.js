define(['q', 'react', 'dash', 'jquery', 'underscore', 'explore/trig' ], function(Q, React, dash, $, _, trig) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context = {},
      current = {};
  module.resolve();

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        var distance,
            notify = false,
            prev;
        if (!!state.location && JSON.stringify(current) !== JSON.stringify(state.location)) {
          if (!!current) {
            notify = true;
            distance = trig.distance(current, state.location);
            prev = current;
            prev.duration = Date.now() - prev.arrived;
            prev.distance = Infinity === distance ? null : distance;
            current = state.location;
            current.arrived = Date.now();
            console.log("MOVED");
            deferred.notify(_.extend(state, {location: state.location, previous_location: prev}));
          } else {
            current = state.location;
            current.arrived = Date.now();
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
