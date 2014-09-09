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
          context = _.extend(context, state);
          deferred.notify(context);
        });
      },
      map,
      context = {},
      onPosition = function(position) {
        current.latitude = position.coords.latitude;
        current.longitude = position.coords.longitude;
        current.radius = position.coords.accuracy;
        deferred.notify(_.extend(context, {location: current}));
      },
      onPositionError = function(err) {
        console.log("location.js position error", err);
      }

  module.resolve();
  navigator.geolocation.getCurrentPosition(onPosition);

  watch_id = navigator.geolocation.watchPosition(onPosition, onPositionError, {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
  });

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: incoming,
    ready: module.promise.then.bind(module.promise)
  };
});
