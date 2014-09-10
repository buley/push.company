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
          }
          current = state.location;
          current.arrived = Date.now();
          context = _.extend(state, {location: current, previous_location: prev});
          if (true === notify) {
            deferred.notify(context);
          }
        } else {
          context = state;
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
