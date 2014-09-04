requirejs.config({
    baseUrl: '../',
    paths: {
    'q': '/bower_components/q/q',
		'dash': '/bower_components/dash/lib/dash',
		'mapbox': '/bower_components/mapbox.js/mapbox',
		'underscore': '/bower_components/underscore/underscore',
		'jquery': '/bower_components/jquery/dist/jquery',
		'react': '/bower_components/react/react'
    },
	shim: {
		'q': {
			exports: 'Q'
		},
		'dash': {
			exports: 'dash'
		},
		'mapbox': {
			exports: 'L'
		},
		'underscore': {
			exports: '_'
		},
		'jquery': {
			exports: 'jQuery'
		},
		'react': {
			exports: 'React'
		}
	}
});

requirejs(['q', 'jquery', 'underscore', 'react', 'dash', 'mapbox'], function(Q, $, _, React, dash, L) {
	var module = Q.defer(),
    getParams = function() {
      return [ 38.538901, -121.700335, 15 ];
    },
    params = getParams(),
    lat = params[0],
    lon = params[1],
    radius = params[2],
    map,
    doMap = function() {
      L.mapbox.accessToken = 'pk.eyJ1IjoiYnVsZXkiLCJhIjoiZWwySzE4cyJ9.tKVH4x1b-W4ag-s7jqRKlA';
      map = L.mapbox.map('map', 'buley.j737pbkc');
      var locd= false;
          install = function(cb) {
            addDatabases(function() {
              addStores( function() {
                addIndexes(function() {
                  if ('function' === typeof cb) {
                    cb();
                  }
                } );
              } );
            } );
          },
      map.setView( L.latLng(lat, lon), 14 );
      L.circleMarker( L.latLng(lat, lon), { radius: radius }).addTo(map);
    },
    doData = function() {

      dash.get.store({"database": "push", "store": "Places1", "store_key_path": "Id"})(function(ctx) {

          ctx.index = "Name";
          ctx.index_key_path = "Name";
          ctx.index_multi_entry = false; //same as default
          ctx.index_unique = false; //same as default

          dash.get.index(ctx)(function(c) {
            ctx.index = 'Area';
            ctx.index_key_path = 'area';
            dash.get.index(c)(function(z) {

              $.ajax( {
                method: 'GET',
                dataType: 'json',
                url: 'http://23.236.54.41/?latitude=' + lat + '&longitude=' + lon + '&max=1000',
                success: function(data) {
                  var x,
                      xlen = data.Data.length,
                      item;
                  for(x = 0; x < xlen; x += 1) {
                    item = data.Data[x];
                    var z, zlen = item.Places.length;
                    for (z = 0; z < zlen; z += 1) {
                      dash.add.entry({"database": "push", "store": "Places1", "data": item.Places[z]})(function(d) { console.log("Added", d); })
                    }
                    L.marker( L.latLng(item.Location.Latitude, item.Location.Longitude)).addTo(map);
                  }
                }
              } );
            });
        });

      }, function(d) { console.log("Not Added", d); })

    };

    require(['explore/presence', 'explore/mapper'], function(presence, mapper) {
      var state = { init: Date.now() },
          previous_state = JSON.stringify(state),
          deferred = Q.defer(),
          promise = deferred.promise,
          container = React.createClass({
            getInitialState: function() {
              console.log('main getInitialState');
              return {};
            },
            componentWillMount: function() {
              console.log('main componentWillMount');
            },
            componentDidMount: function() {
              console.log('main did mount');
              component = this;
            },
            componentWillReceiveProps: function() {
              console.log('main componentWillReceiveProps');
            },
            render: function() {
              return React.DOM.div(null, !!context ? context.init - context.timestamp : null);
            }
          }),
          component,
          internal = Q.defer(),
          incoming = function(interface) {
            interface.then(null, null, function(context) {
                console.log('new props', components);
              var next_state = JSON.stringify(context);
              if (next_state !== previous_state) {
                previous_state = next_state;
                deferred.notify(state);
              } else {
                console.log('updating props', context);
                if (!!component) {
                  component.replaceProps(context);
                }
              }
            })
          },
          ready = function() {
            component = container.apply(this, components)
            React.renderComponent(
              component,
              document.getElementById('explore'),
              function() {
                component = this;
                component.setProps(state);
                module.resolve(component);
                deferred.notify(state);
              }
            );
          },
          interfaces = arguments,
          loaded = 1,
          classes = [],
          components = [ null, "Test123" ],
          forEachHandler = function(interface) {
            var readyHandler = function(comp) {
                  interface.incoming(promise);
                  interface.outgoing(incoming);
                  if (!!comp) {
                    components.push(comp(state));
                    classes.push(comp);
                  }
                  if (loaded === interfaces.length) {
                    ready();
                  } else {
                    loaded = loaded + 1;
                  }
                };
            interface.ready(readyHandler);
          };

      setInterval(function() {
        state.timestamp = Date.now();
        internal.notify(state);
      }, 1000);
      Array.prototype.forEach.call(interfaces, forEachHandler);

      incoming(internal.promise);

    });
	return module.promise;
});
