define(['q',
  'react',
  'dash',
  'jquery',
  'underscore',
  'xdate',
  'explore/trig',
  'changes',
  'collect',
  'live',
  'map',
  'mapreduce',
  'match',
  'shorthand',
  'stats'
], function(Q, React, dash, $, _, XDate, trig, changes, collect, live, map, mapreduce, match, shorthand, stats) {
  var durationMinimumMilliseconds = function(radius) {
        return ((2 * radius) / 0.001385824); //3.1mph
      },
      database = "Push",
      store = "Places",
      blips = "Blips",
      deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      augmented,
      previous,
      neighborhood,
      vicinity,
      summarizeBlips = function() {
        var def = Q.defer();
                dash.get.entries({
            database: "Push",
            store: "Blips",
            index_left_open: "",
            reduce: function(reduced, el) {
              reduced = reduced || {};
              reduced[el.Id] = reduced[el.Id] || el;
              reduced[el.Id].Blips = reduced[el.Id].Blips || [];
              reduced[el.Id].Blips.push({
                Latitude: el.ClientLatitude,
                Longitude: el.ClientLongitude,
                Radius: el.ClientRadius,
                Duration: el.ClientDuration,
                Distance: el.ClientDistance
              });
              return reduced;
            },
            map: function(e) {
                var d = XDate(e.ClientDepart);
                e.ClientYear = d.toString("yyyy");
                e.ClientMonth = d.toString("MMMM");
                e.ClientDay = d.toString("ddd");
                e.ClientHours = d.toString("HH");
                return e;
            }
        })(function(c) {
            console.log("FINISHED", c);
            def.resolve(c);
        }, null, null);
        return def.promise;
      },
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
      installBlips = function() {
        var def = Q.defer();
        dash.get.index({
          database: database,
          store: blips,
          store_key_path: 'BlipId',
          auto_increment: true,
          index: 'Id',
          index_key_path: 'Id'
        })(function(ctx0){
          dash.get.index({
            database: database,
            store: blips,
            store_key_path: 'Blips',
            auto_increment: true,
            index: 'Id',
            index_key_path: 'Id'
          })(function(ctx6){
            dash.get.index({
              database: database,
              store: blips,
              index: 'Latitude',
              index_key_path: 'Latitude'
            })(function(ctx7){
              dash.get.index({
                database: database,
                store: blips,
                index: 'Longitude',
                index_key_path: 'Longitude'
              })(function(ctx8){
                dash.get.index({
                  database: database,
                  store: blips,
                  index: 'ClientDuration',
                  index_key_path: 'ClientDuration'
                })(function(ctx9){
                  dash.get.index({
                    database: database,
                    store: blips,
                    index: 'ClientDepart',
                    index_key_path: 'ClientDepart'
                  })(function(ctx10){
                    dash.get.index({
                      database: database,
                      store: blips,
                      index: 'ClientLatitude',
                      index_key_path: 'ClientLatitude'
                    })(function(ctx7){
                      dash.get.index({
                        database: database,
                        store: blips,
                        index: 'ClientLongitude',
                        index_key_path: 'ClientLongitude'
                      })(function(ctx8){
                        dash.get.index({
                          database: database,
                          store: blips,
                          index: 'ClientDistance',
                          index_key_path: 'ClientDistance'
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
      installPlaces = function() {
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
              def.resolve();
            });
          });
        });
        return def.promise;
      },
      addBehaviors = function() {
        var def = Q.defer();
        [ changes, collect, live, mapreduce, match, shorthand, stats ].forEach(function(influence) {
          dash.add.behavior(influence);
        });
        def.resolve();
        return def.promise;
      };

  addBehaviors().then(function() {
    installPlaces().then(function() {
      installBlips().then(function() {
        module.resolve();
      });
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
              previous = augmented;
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
                    var x = 0,
                        y = 0,
                        location,
                        places,
                        vicinity = state.vicinity,
                        place;
                    if (!!vicinity) {
                      for (x = 0; x < vicinity.length; x += 1) {
                        location = vicinity[x];
                        places = location.Places;
                        for (y = 0; y < places.length; y += 1) {
                          place = places[y];
                          place.ClientDistance = location.Location.Distance;
                          place.ClientDepart = Date.now()
                          place.ClientDuration = place.ClientDepart - previous.arrived;
                          place.ClientArrived = previous.arrived;
                          place.ClientRadius = previous.radius;
                          place.ClientLatitude = previous.latitude;
                          place.ClientLongitude = previous.longitude;
                          console.log('update vicinity',place);
                          dash.add.entry( {
                            database: database,
                            store: blips,
                            store_key_path: "BlipId",
                            auto_increment: true,
                            data: place
                          })(function(ct) {
                            console.log('added',ct);
                          })
                        }
                      }
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
