define(['q', 'react', 'dash', 'jquery', 'underscore', 'explore/trig'], function(Q, React, dash, $, _, trig) {
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

  dash.get.database({'database': 'push5', 'store': 'Places1', store_key_path: 'Id' })(function(ctx2){
    console.log('d1',ctx2.db, ctx2.objectstore);
      dash.get.index({
        database: 'push5',
        store: 'Places1',
        index: 'Name',
        index_key_path: 'Name'
      })(function(ctx3){
        console.log('d3',ctx3);
        dash.get.index({
          database: 'push5',
          store: 'Places1',
          index: 'Latitude',
          index_key_path: 'Latitude'
        })(function(ctx4){
          console.log('d4',ctx4);
          dash.get.index({
            database: 'push5',
            store: 'Places1',
            index: 'Longitude',
            index_key_path: 'Longitude'
          })(function(ctx5){
            console.log('dash done',ctx3, ctx4, ctx5);
          });
        });
      });
  });

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
