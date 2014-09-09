define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      watch_id,
      getParams = function() {
        return [ 38.538901, -121.700335, 15 ];
      },
      params = getParams(),
      lat = params[0],
      lon = params[1],
      radius = params[2],
      current = {
        latitude: lat,
        longitude: lon,
        radius: radius
      },
      incoming = function(interface) {
        interface.then(null, null, function(state) {
          if (!context) {
            context = _.extend({ location: current }, state);
            deferred.notify(context);
          } else {
            if (!!state.route) {
              if (!!state.route.hash.latitude && !!state.route.hash.latitude) {
                current.latitude = state.route.hash.latitude;
                current.longitude = state.route.hash.longitude;
                context.route = current;
                if (!!context.route.hash) {
                  delete context.route.hash.latitude;
                  delete context.route.hash.longitude;
                }
                console.log('REROUTE IS SET', context.route);
                deferred.notify(context);
              }
            }
          }

        });
      },
      map,
      context,
      onPosition = function(position) {
        current.latitude = position.coords.latitude;
        current.longitude = position.coords.longitude;
        current.radius = position.coords.accuracy;
        if (!context) {
          context = _.extend({location: current}, {});
        } else {
          context = _.extend({location: current}, context);
        }
        deferred.notify(context);
      },
      onPositionError = function(err) {
        console.log("location.js position error", err);
      };

  module.resolve();

  if (!!navigator && !!navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onPosition);
    watch_id = navigator.geolocation.watchPosition(onPosition, onPositionError, {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
    });
  }

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: incoming,
    ready: module.promise.then.bind(module.promise)
  };
});
