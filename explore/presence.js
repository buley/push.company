define(['q', 'react', 'dash', 'jquery', 'underscore', 'explore/trig' ], function(Q, React, dash, $, _, trig) {
  var durationMinimumMilliseconds = function(radius) {
        return ((2 * radius) / 0.001385824); //3.1mph
      },
      deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      augmented,
      neighborhood,
      vicinity,
      fetchNeighbors = function(lat, lon, radius) {
        console.log('fetching neighbors',arguments);
      },
      fetchVicinity = function(lat, lon, radius) {
        var def = Q.defer();
        $.ajax({
          dataType: 'json',
          url: [
            'http://23.236.54.41/presence?',
            'latitude=' + lat + '&',
            'longitude='+ lon + '&',
            'max=1000&limit=10&radius=' + radius
            ].join(""),
          method: 'GET',
          success: function(data) {
            vicinity = data.Data;
            context = _.extend(context, {vicinity: vicinity});
            deferred.notify(context);
            def.resolve(vicinity);
          }
        });
        return def.promise;
      };

  dash.get.database({'database': 'push' })(function(ctx){
    ctx.store_key_path = 'Id';
    ctx.store = 'Places4';
    dash.get.store(ctx)(function(ctx2){
      ctx2.index = 'Name';
      ctx2.index_key_path = 'Name';
      ctx2.index_unique = false;
      ctx2.index_multi_entry = false;
      dash.get.index(ctx2)(function(ctx3){
        ctx2.index = 'Latitude';
        ctx2.index_key_path = 'Latitude';
        ctx2.index_unique = false;
        ctx2.index_multi_entry = false;
        dash.get.index(ctx2)(function(ctx4){
          ctx2.index = 'Longitude';
          ctx2.index_key_path = 'Longitude';
          ctx2.index_unique = false;
          ctx2.index_multi_entry = false;
          dash.get.index(ctx2)(function(ctx4){
            module.resolve();
            console.log('dash done',ctx3, ctx4);
          });
        });
      });
    });
  });

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        var distance,
            notify = false;
        if (!!state.location) {
          context = _.extend({}, state);
          if (!!augmented) {
            if (augmented.latitude !== state.location.latitude ||
              augmented.longitude !== state.location.longitude) {
              distance = trig.distance(augmented, state.location);
              augmented.duration = Date.now() - augmented.arrived;
              if (augmented.duration > durationMinimumMilliseconds(augmented.radius)) {
                console.log("LONG ENOUGH", augmented.duration, durationMinimumMilliseconds(augmented.radius));
              }
              augmented.distance = Infinity === distance ? null : distance;
              context = _.extend(state, {location: state.location, previous_location: augmented});
              notify = true;
              augmented = {
                  latitude: state.location.latitude,
                  longitude: state.location.longitude,
                  radius: state.location.radius,
                  arrived:  Date.now()
              };
              if (augmented.latitude !== 0.0 && augmented.longitude !== 0.0) {
                fetchVicinity(augmented.latitude, augmented.longitude, augmented.radius).then(function(vicinity) {
                  fetchNeighbors(augmented.latitude, augmented.longitude, augmented.radius);
                });
              }
            }
          } else {
            augmented = {
                latitude: state.location.latitude,
                longitude: state.location.longitude,
                radius: state.location.radius,
                arrived:  Date.now()
            };
            if (augmented.latitude !== 0.0 && augmented.longitude !== 0.0) {
              fetchVicinity(augmented.latitude, augmented.longitude, augmented.radius).then(function(vicinity) {
                fetchNeighbors(augmented.latitude, augmented.longitude, augmented.radius);
              });
            }
          }

          if (!!neighborhood && !context.neighborhood) {
            context.neighborhood = neighborhood;
          }

          if (true === notify) {
            deferred.notify(context);
          }

        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
