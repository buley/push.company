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
        if (!!state.location) {
          if (!!current) {
            if (JSON.stringify(current) !== JSON.stringify(state.location)) {
              distance = trig.distance(current, state.location);
              prev = augmented;
              prev.duration = Date.now() - prev.arrived;
              prev.distance = Infinity === distance ? null : distance;
              context = _.extend(state, {location: current, previous_location: prev});
              current = JSON.parse(JSON.stringify(state.location));
              augmented = _.extend({}, state.location);
              augmented.arrived = Date.now();
              deferred.notify(context);
            }
          } else {
            current = JSON.parse(JSON.stringify(state.location));;
            augmented = _.extend({}, state.location);
            augmented.arrived = Date.now();
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
