define(['q', 'react', 'dash', 'jquery', 'underscore', 'explore/trig' ], function(Q, React, dash, $, _, trig) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      augmented,
      fetchNeighbors = function(lat, lon, radius) {
        console.log('fetching neighbors',arguments);
        $.ajax({
          url: [
            'http://23.236.54.41/presence?',
            'latitude=' + lat + '&',
            'longitude='+ lon + '&',
            'max=1000&limit=10&radius=' + radius
            ].join(""),
          method: 'GET',
          success: function(data) {
            console.log('data',data);
          }
        })
      };
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
            if (augmented.latitude !== state.location.latitude ||
              augmented.longitude !== state.location.longitude) {
              distance = trig.distance(augmented, state.location);
              augmented.duration = Date.now() - augmented.arrived;
              augmented.distance = Infinity === distance ? null : distance;
              deferred.notify(_.extend(state, {location: state.location, previous_location: augmented}));
              augmented = {
                  latitude: state.location.latitude,
                  longitude: state.location.longitude,
                  radius: state.location.radius,
                  arrived:  Date.now()
              };
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
