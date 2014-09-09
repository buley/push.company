define(['q', 'react'], function(Q, React, L) {
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
        latutude: lat,
        longitude: lon,
        radius: radius
      },
      incoming = function(interface) {
        if (!!component) {
          var state = component.props || {};
          if (!state || !state.location) {
            state.location = current;
            deferred.notify(state);
          }
        }
        interface.then(null, null, function(state) {
          context = state;
        });
      },
      map,
      context = {},
      onPosition = function(position) {
        current.latitude = position.coords.latitude;
        current.longitude = position.coords.longitude;
        current.radius = position.coords.accuracy;
        context.location = current;
        deferred.notify(context);
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
