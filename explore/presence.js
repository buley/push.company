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
            console.log('CURRENT',current.latitude, current.longitude);
            console.log('STATE',state.location.latitude, state.location.longitude);
            if (current.latitude !== state.location.latitude || current.longitude !== state.location.longitude) {
              distance = trig.distance(current, state.location);
              prev = augmented;
              prev.duration = Date.now() - prev.arrived;
              prev.distance = Infinity === distance ? null : distance;
              console.log("PREV",JSON.stringify(prev));
              console.log("CURR",JSON.stringify(current));
              context = _.extend(state, {location: current, previous_location: prev});
              current = state.location;
              augmented = _.extend({}, state.location);
              augmented.arrived = Date.now();
              deferred.notify(context);
            }
          } else {
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
