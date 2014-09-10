define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      watch_id,
      current = {
        latitude: 0.0,
        longitude: 0.0,
        radius: 0.0
      },
      incoming = function(interface) {
        interface.then(null, null, function(state) {
          if (!context) {
            context = _.extend({ location: current }, state);
            deferred.notify(context);
          } else {
            context = state;
            if (!!context.route && !!!!context.route.hash) {
              if (!!context.route.hash.latitude || !!context.route.hash.longitude) {
                if (!!context.route.hash.latitude) {
                  current.latitude = context.route.hash.latitude;
                  context.location = current;
                  if (!!context.route.hash) {
                    delete context.route.hash.latitude;
                  }
                }
                if (!!context.route.hash.longitude) {
                  current.longitude = context.route.hash.longitude;
                  context.location = current;
                  if (!!context.route.hash) {
                    delete context.route.hash.longitude;
                  }
                }
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
