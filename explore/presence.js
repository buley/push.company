define(['q', 'react', 'dash', 'jquery', 'underscore', 'explore/trig' ], function(Q, React, dash, $, _, trig) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context = {},
      current,
      augmented;
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
            prev = augmented;
            prev.duration = Date.now() - prev.arrived;
            prev.distance = Infinity === distance ? null : distance;
            console.log("OBJ",_.extend(state, {location: current, previous_location: prev}));
            console.log("CURR WAS",current);
            current = state.location;
            //deferred.notify(_.extend(state, {location: current, previous_location: prev}));
            augmented = _.extend({}, state.location);
            augmented.arrived = Date.now();
          } else if (!!state.location) {
            current = state.location;
            augmented = _.extend({}, state.location);
            augmented.arrived = Date.now();
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
