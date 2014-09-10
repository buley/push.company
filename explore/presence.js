define(['q', 'react', 'dash', 'jquery', 'underscore', 'explore/trig' ], function(Q, React, dash, $, _, trig) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context = {},
      augmented;
  module.resolve();

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        var distance,
            notify = false;
        if (!!state.location) {
          if (!!augmented) {
            console.log('CURRENT',augmented.latitude, augmented.longitude);
            console.log('STATE',state.location.latitude, state.location.longitude);
            if (augmented.latitude !== state.location.latitude ||
              augmented.longitude !== state.location.longitude) {
              distance = trig.distance(augmented, state.location);
              augmented.duration = Date.now() - augmented.arrived;
              augmented.distance = Infinity === distance ? null : distance;
              console.log("PREV",JSON.stringify(augmented));
              console.log("CURR",JSON.stringify(agumented));
              context = _.extend(state, {location: state.location, previous_location: augmented});
              augmented = {
                  latitude: state.location.latitude,
                  longitude: state.location.longitude,
                  radius: state.location.radius,
                  arrived:  Date.now()
              };
              deferred.notify(context);
            }
          } else {
            augmented = {
                latitude: state.location.latitude,
                longitude: state.location.longitude,
                radius: state.location.radius,
                arrived:  Date.now()
            };
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
