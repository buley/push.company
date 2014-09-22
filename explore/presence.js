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
      meta = "Meta",
      context = {},
      deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      augmented,
      previous,
      neighborhood,
      vicinity,
      mergeStats = function(to, from) {
        to = to || {};
        from = from || {};
        var a1, a2, a3, a4;
        for (a1 in from) {
          if (from.hasOwnProperty(a1)) {
            if ("All" === a1) {
              for (a2 in from[a1]) {
                if (from[a1].hasOwnProperty(a2)) {
                  for (a3 in from[a1][a2]) {
                    if (from[a1][a2].hasOwnProperty(a3)) {
                      to[a1] = to[a1] || {};
                      to[a1][a2] = to[a1][a2] || {};
                      if ("last" === a3) {
                        if (!to[a1][a2][a3] || to[a1][a2][a3] < from[a1][a2][a3]) {
                          to[a1][a2][a3] = from[a1][a2][a3];
                        }
                      } else if ("first" === a3) {
                        if (!to[a1][a2][a3] || to[a1][a2][a3] > from[a1][a2][a3]) {
                          to[a1][a2][a3] = from[a1][a2][a3];
                        }
                      } else {
                        to[a1][a2][a3] = to[a1][a2][a3] || 0;
                        to[a1][a2][a3] += from[a1][a2][a3];
                      }
                    }
                  }
                }
              }
            } else {
              for (a2 in from[a1]) {
                if (from[a1].hasOwnProperty(a2)) {
                  for (a3 in from[a1][a2]) {
                    if (from[a1][a2].hasOwnProperty(a3)) {
                      for (a4 in from[a1][a2][a3]) {
                        if (from[a1][a2][a3].hasOwnProperty(a4)) {
                          to[a1] = to[a1] || {};
                          to[a1][a2] = to[a1][a2] || {};
                          to[a1][a2][a3] = to[a1][a2][a3] || {};
                          if ("last" === a4) {
                            if (!to[a1][a2][a3][a4] || to[a1][a2][a3][a4] < from[a1][a2][a3][a4]) {
                              to[a1][a2][a3][a4] = from[a1][a2][a3][a4];
                            }
                          } else if ("first" === a4) {
                            if (!to[a1][a2][a3][a4] || to[a1][a2][a3][a4] > from[a1][a2][a3][a4]) {
                              to[a1][a2][a3][a4] = from[a1][a2][a3][a4];
                            }
                          } else {
                            to[a1][a2][a3][a4] = to[a1][a2][a3][a4] || 0;
                            to[a1][a2][a3][a4] += from[a1][a2][a3][a4];
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return to;
      },
      summarizeBlips = function() {
        var def = Q.defer();
                dash.get.entries({
            database: "Push",
            store: "Blips",
            index_left_open: "",
            reduce: function(reduced, el) {
              reduced = reduced || { fresh: true };
              reduced[el.Id] = reduced[el.Id] || el;
              reduced[el.Id].Blips = reduced[el.Id].Blips || [];
              reduced[el.Id].Blips.push(_.extend({}, {
                City: el.City,
                State: el.State,
                Zip: el.Zip,
                ZipPlus4: el.ZipPlus4,
                Id: el.BlipId,
                Latitude: el.ClientLatitude,
                Longitude: el.ClientLongitude,
                Radius: el.ClientRadius,
                Duration: el.ClientDuration,
                Distance: el.ClientDistance,
                Day: el.ClientDay,
                Month: el.ClientMonth,
                Year: el.ClientYear,
                Hour: el.ClientHour
              }));

              if (true === reduced[el.Id].fresh) {
                var attr;
                for (attr in reduced[el.Id]) {
                  if (reduced[el.Id].hasOwnProperty(attr)) {
                    if (null !== attr.match(/Client/)) {
                      delete reduced[el.Id][attr];
                    }
                  }
                }
                delete reduced[el.Id].fresh;
              }
              return reduced;
            },            map: function(e) {
                var d = XDate(e.ClientDepart);
                e.ClientYear = d.toString("yyyy");
                e.ClientMonth = d.toString("MMMM");
                e.ClientDay = d.toString("dddd");
                e.ClientHour = d.toString("HH");
                return e;
            }
        })(function(c) {
            var Id,
                cblips,
                cities = {},
                zips = {},
                zipsplus = {},
                reduced = c.reduced,
                finished = {},
                q, qlen;
            for (Id in reduced) {
              if (reduced.hasOwnProperty(Id)) {
                if ("fresh" === Id) {
                  continue;
                }
                var x = 0, item, obj, combined, distance, duration,
                  options = {
                    'All': Infinity,
                    'Present': 0,
                    'Mile': 1609.34,
                    'HalfMile': 804.67200,
                    'QuarterMile': 402.33600,
                    'Ft1000': 304.8,
                    'Ft750': 228.6,
                    'Ft500': 152.4,
                    'Ft300': 91.44,
                    'Ft150': 45.72,
                    'Ft100': 30.48,
                    'Ft75': 22.86,
                    'Ft50': 15.24,
                    'Ft25': 7.62,
                    'Ft10': 3.048
                  },
                  attr,
                  items = [ 'All', 'Hour', 'Day', 'Month', 'Year' ],
                      z = 0,
                      zlen = items.length,
                      zitem,
                      xval,
                      zattr;

                cblips = reduced[Id].Blips;
                for (x = 0; x < cblips.length; x += 1) {
                  item = cblips[x];
                  combined = Math.pow(( item.Distance / item.Duration ), -1/2);
                  distance = item.Distance;
                  duration = item.Duration;
                  options.present = item.Radius;
                  if (distance > 0.0 ) {
                    finished[Id] = finished[Id] || {};
                    finished[Id].BlipIds = finished[Id].BlipIds || [];
                    finished[Id].BlipIds.push(item.Id);
                    finished[Id].Stats = finished[Id].Stats || {
                      Day: {},
                      Week: {},
                      Month: {},
                      Year: {},
                      All: {}
                    };
                    for (attr in options) {
                      if (options.hasOwnProperty(attr)) {
                        if (distance < options[attr]) {

                          for (z = 0; z < zlen; z += 1) {
                            zattr = items[z];
                            if ( 'All' === zattr ) {
                              finished[Id].Stats[zattr] = finished[Id].Stats[zattr] || {};
                              finished[Id].Stats[zattr][attr] = finished[Id].Stats[zattr][attr] || {
                                total: 0,
                                count: 0,
                                score: 0,
                                last: 0,
                                first: Date.now()
                              };
                              finished[Id].Stats[zattr][attr].total += duration;
                              finished[Id].Stats[zattr][attr].count += 1;
                              finished[Id].Stats[zattr][attr].score += combined;
                              finished[Id].Stats[zattr][attr].last = Date.now();
                            } else {
                              xval = item[zattr];
                              finished[Id].Stats[zattr] = finished[Id].Stats[zattr] || {};
                              finished[Id].Stats[zattr][xval] = finished[Id].Stats[zattr][xval] || {};
                              finished[Id].Stats[zattr][xval][attr] = finished[Id].Stats[zattr][xval][attr] || {
                                total: 0,
                                count: 0,
                                score: 0,
                                last: 0,
                                first: Date.now()
                              };
                              finished[Id].Stats[zattr][xval][attr].total += duration;
                              finished[Id].Stats[zattr][xval][attr].count += 1;
                              finished[Id].Stats[zattr][xval][attr].score += combined;
                              finished[Id].Stats[zattr][xval][attr].last = Date.now();
                            }

                            cities[item.City] = cities[item.City] || {
                              total: 0,
                              count: 0,
                              score: 0,
                              last: 0,
                              first: Date.now()
                            };
                            cities[item.City].total += duration;
                            cities[item.City].count += 1;
                            cities[item.City].score += combined;
                            cities[item.City].last = Date.now();

                            zips[item.Zip] = zips[item.Zip] || {
                              total: 0,
                              count: 0,
                              score: 0,
                              last: 0,
                              first: Date.now()
                            };
                            zips[item.Zip].total += duration;
                            zips[item.Zip].count += 1;
                            zips[item.Zip].score += combined;
                            zips[item.Zip].last = Date.now();

                            zipsplus[item.ZipPlus4] = zipsplus[item.ZipPlus4] || {
                              total: 0,
                              count: 0,
                              score: 0,
                              last: 0,
                              first: Date.now()
                            };
                            zipsplus[item.ZipPlus4].total += duration;
                            zipsplus[item.ZipPlus4].count += 1;
                            zipsplus[item.ZipPlus4].score += combined;
                            zipsplus[item.ZipPlus4].last = Date.now();

                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            for ( Id in finished ) {
              if (finished.hasOwnProperty(Id)) {
                (function(Xid) {
                  dash.get.entry({database:database, store: store, key: Xid })(function(e){
                    var entry = e.entry;
                    entry.Stats = entry.Stats || {};
                    entry.Stats = mergeStats( entry.Stats, finished[Xid].Stats );
                    dash.update.entry({database:"Push",store: "Places", data: entry })(function() {
                      for (q = 0, qlen = finished[Xid].BlipIds.length; q < qlen; q += 1) {
                        dash.remove.entry({database:"Push",store:"Blips",key: finished[Xid].BlipIds[q]});
                      }
                    });
                  });
                }(Id));
              }
            }

            dash.get.entry({database: database,store: meta, index_key: "Key", key: "Cities" })(function(e) {
              if (!e.entry || !e.entry.Value) {
                e.entry = e.entry || {};
                e.entry.Value = cities;
              } else {
                var city, attr, map = e.entry.Value || {};
                for(city in cities) {
                  if (cities.hasOwnProperty(city)) {
                    map[city] = map[city] || {
                      total: 0,
                      count: 0,
                      score: 0,
                      last: 0,
                      first: Date.now()
                    };
                    map[city].total += cities[city].total;
                    map[city].count += cities[city].count;
                    map[city].score += cities[city].score;
                    if (!map[city].last || cities[city].last > map[city].last) {
                      map[city].last = cities[city].last;
                    }
                    if (!map[city].first || cities[city].first < map[city].first) {
                      map[city].first = cities[city].first;
                    }
                  }
                }
                e.entry.Value = map;
              }
              dash.update.entry({database: database, store: meta, data: e.entry});

            }, function(e){
              dash.add.entry({database: database, store: meta, data: {
                Key: "Cities",
                Value: cities
              }});
            });

            dash.get.entry({database: database,store: meta, index: "Key", key: "Zips" })(function(e) {
              if (!e.entry || !e.entry.Value) {
                e.entry = e.entry || {};
                e.entry.Value = zips;
              } else {
                var zip, attr, map = e.entry.Value || {};
                for(zip in zips) {
                  if (zips.hasOwnProperty(zip)) {
                    map[zip] = map[zip] || {
                      total: 0,
                      count: 0,
                      score: 0,
                      last: 0,
                      first: Date.now()
                    };
                    map[zip].total += zips[zip].total;
                    map[zip].count += zips[zip].count;
                    map[zip].score += zips[zip].score;
                    if (!map[zip].last || zips[zip].last > map[zip].last) {
                      map[zip].last = zips[zip].last;
                    }
                    if (!map[zip].first || zips[zip].first < map[zip].first) {
                      map[zip].first = zips[zip].first;
                    }
                  }
                }
                e.entry.Value = map;
              }
              dash.update.entry({database: database, store: meta, data: e.entry});
          }, function(e){
              dash.add.entry({database: database, store: meta, data: {
                Key: "Zips",
                Value: zips
              }});
            });
            dash.get.entry({database: database,store: meta, index_key: "Key", key: "ZipPlus4s" })(function(e) {
              if (!e.entry || !e.entry.Value) {
                e.entry = e.entry || {};
                e.entry.Value = zipsplus;
              } else {
                //merge
              }
              dash.update.entry({database: database, store: meta, data: e.entry});
            }, function(e){
              dash.add.entry({database: database, store: meta, data: {
                Key: "ZipPlus4s",
                Value: zipsplus
              }});
            });
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
      installMeta = function() {
        var def = Q.defer();
        dash.get.index({
          database: database,
          store: meta,
          store_key_path: 'Id',
          auto_increment: true,
          index: 'Key',
          index_key_path: 'Key',
          index_unique: true,
          index_multi_entry: false
        })(function(ctx3){
          dash.get.index({
            database: database,
            store: meta,
            index: 'Value',
            index_key_path: 'Value'
          })(function(ctx4){
            def.resolve();
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
      },
      updatePosition = function(nosummary) {
        var x = 0,
            y = 0,
            location,
            places,
            vicinity = context.vicinity,
            place,
            all,
            head = Q.defer(),
            tail = head.promise;
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
              tail = tail.then(function() {
                dash.add.entry({
                  database: database,
                  store: blips,
                  store_key_path: "BlipId",
                  auto_increment: true,
                  data: place
                });
              });
            }
          }
        }
        tail.then(function() {
          summarizeBlips();
        });
        head.resolve();
      };

  addBehaviors().then(function() {
    installPlaces().then(function() {
      installBlips().then(function() {
        installMeta().then(function() {
          module.resolve();
          summarizeBlips();
        });
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
        context = _.extend({}, state);
        if (!!state.location) {
          if (!!augmented) {
            if (augmented.latitude !== state.location.latitude ||
              augmented.longitude !== state.location.longitude) {
              distance = trig.distance(augmented, state.location);
              augmented.duration = Date.now() - augmented.arrived;
              if (augmented.duration > durationMinimumMilliseconds(augmented.radius)) {
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
                  fetchNeighbors(augmented.latitude, augmented.longitude, augmented.radius).then(function(neighbors) {
                    updatePosition();
                  })
                });
              } else {
                updatePosition();
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
                fetchNeighbors(augmented.latitude, augmented.longitude, augmented.radius)(function() {
                  updatePosition();
                });
              });
            } else {
              updatePosition();
            }
          }

          if (!!neighborhood && !context.neighborhood) {
            context.neighborhood = neighborhood;
          }

          if (true === notify) {
            deferred.notify(context);
          }

        } else {
          updatePosition(true);
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
