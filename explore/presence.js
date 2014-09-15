define(['q',
  'react',
  'dash',
  'jquery',
  'underscore',
  'explore/trig',
  'cache',
  'changes',
  'collect',
  'live',
  'map',
  'mapreduce',
  'match',
  'shorthand',
  'stats'
], function(Q, React, dash, $, _, trig, cache, changes, collect, live, map, mapreduce, match, shorthand, stats) {
  var durationMinimumMilliseconds = function(radius) {
        return ((2 * radius) / 0.001385824); //3.1mph
      },
      database = "Push",
      store = "Places",
      presence = "Presence",
      deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      augmented,
      neighborhood,
      vicinity,
      fetchNeighbors = function(lat, lon, radius) {
        var def = Q.defer();
        neighborhood = [];
        dash.get.entries({
          database: database,
          store: store,
          store_key_path: 'Id'
        })(function(ctx) {
          context = _.extend(context, {neighborhood: neighborhood});
          deferred.notify(context);
          def.resolve(ctx);
        }, null, function(ctx){
          neighborhood.push(ctx.entry);
        });
        return def.promise;
      },
      fetchVicinity = function(lat, lon, radius) {
        var def = Q.defer();
        $.ajax({
          dataType: 'json',
          url: [
            'http://23.236.54.41/presence?',
            'latitude=' + lat + '&',
            'longitude='+ lon + '&',
            'max=500&limit=100&radius=' + radius
            ].join(""),
          method: 'GET',
          success: function(data) {
            vicinity = data.Data;
            context = _.extend(context, {vicinity: vicinity});
            deferred.notify(context);
            def.resolve(vicinity);
            if (!!vicinity && vicinity.length > 0) {
              vicinity.forEach(function(item) {
                if (!!item.Places && item.Places.length > 0) {
                  item.Places.forEach(function(place) {
                    place.Latitude = item.Location.Latitude;
                    place.Longitude = item.Location.Longitude;
                    place.Radius = item.Location.Radius;
                    dash.add.entry({
                      database: database,
                      store: store,
                      data: place
                    })(function(ctx){
                      console.log("Place added", ctx.data);
                    }, function(ctx){
                      console.log("Place not added", ctx);
                    }, function(ctx){
                      console.log("Place notify", ctx);
                    });
                  });
                }
              });
            }
          }
        });
        return def.promise;
      },
      installStorage = function() {
        var def = Q.defer();
        dash.get.index({
          database: database,
          store: store,
          store_key_path: 'Id',
          index: 'Name',
          index_key_path: 'Name'
        })(function(ctx3){
          dash.get.index({
            database: database,
            store: store,
            index: 'Latitude',
            index_key_path: 'Latitude'
          })(function(ctx4){
            dash.get.index({
              database: database,
              store: store,
              index: 'Longitude',
              index_key_path: 'Longitude'
            })(function(ctx5){
              dash.get.index({
                database: database,
                store: presence,
                store_key_path: 'VisitId',
                auto_increment: true,
                index: 'Id',
                index_key_path: 'Id'
              })(function(ctx6){
                dash.get.index({
                  database: database,
                  store: presence,
                  index: 'Latitude',
                  index_key_path: 'Latitude'
                })(function(ctx7){
                  dash.get.index({
                    database: database,
                    store: presence,
                    index: 'Longitude',
                    index_key_path: 'Longitude'
                  })(function(ctx8){
                    dash.get.index({
                      database: database,
                      store: presence,
                      index: 'Duration',
                      index_key_path: 'Duration'
                    })(function(ctx9){
                      dash.get.index({
                        database: database,
                        store: presence,
                        index: 'Timestamp',
                        index_key_path: 'Timestamp'
                      })(function(ctx10){
                        dash.get.index({
                          database: database,
                          store: presence,
                          index: 'Distance',
                          index_key_path: 'Distance'
                        })(function(ctx11){
                          def.resolve();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
        return def.promise;
      },
      addBehaviors = function() {
        var def = Q.defer();
        [ cache, changes, collect, live, map, mapreduce, match, shorthand, stats ].forEach(function(influence) {
          dash.add.behavior(influence);
        });
        def.resolve();
        return def.promise;
      }

  addBehaviors.then(function() {
    installStorage.then(function() {
      module.resolve();
    });
  })

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        var distance,
            notify = false,
            presence_eligible;
        if (!!state.location) {
          context = _.extend({}, state);
          if (!!augmented) {
            if (augmented.latitude !== state.location.latitude ||
              augmented.longitude !== state.location.longitude) {
              distance = trig.distance(augmented, state.location);
              augmented.duration = Date.now() - augmented.arrived;
              if (augmented.duration > durationMinimumMilliseconds(augmented.radius)) {
                console.log("LONG ENOUGH", augmented.duration, durationMinimumMilliseconds(augmented.radius));
                presence_eligible = true;
              } else {
                presence_eligible = false;
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
                  //mapreduce vicinity
                  fetchNeighbors(augmented.latitude, augmented.longitude, augmented.radius).then(function(neighbors) {
                    //mapreduce neighbors
                    console.log('update previous places', presence_eligible);
                    console.log("CURRENT");
                    if (!!state.vicinity) {
                      console.log('update vicinity',state.vicinity);
                    }
                    if (!!state.neighborhood) {
                      console.log('update neighborhood',state.neighborhood);
                    }
                  })
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
