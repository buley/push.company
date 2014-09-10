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
          var notify = false;
          if (!context) {
            context = _.extend(_.extend({}, state), { location: current });
          } else {
            context = _.extend({}, state);
            if (!!context.route && !!context.route.hash) {
              if (!!context.route.hash.latitude || !!context.route.hash.longitude) {
                if (!!context.route.hash.latitude) {
                  current.latitude = context.route.hash.latitude;
                  context.location = current;
                  delete context.route.hash.latitude;
                }
                if (!!context.route.hash.longitude) {
                  current.longitude = context.route.hash.longitude;
                  context.location = current;
                  delete context.route.hash.longitude;
                }
                notify = true;
              }
              if (!!context.route.hash.radius) {
                current.radius = context.route.hash.radius;
                context.location = current;
                delete context.route.hash.radius;
                notify = true;
              }
            }
          }
          if (true === notify) {
            deferred.notify(context);
          }
        });
      },
      map,
      context,
      onPosition = function(position) {
        if (position.coords.latitude !== current.latitude ||
            position.coords.longitude !== current.longitude ||
            position.coords.accuracy !== current.radius) {
          current.latitude = position.coords.latitude;
          current.longitude = position.coords.longitude;
          current.radius = position.coords.accuracy;
          if (!context) {
            context = _.extend({}, {location: current});
          } else {
            context = _.extend(context, {location: current});
          }
          //deferred.notify(context);
        }
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
