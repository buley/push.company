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

	React.renderComponent(
	  React.DOM.div(null, 'Hello, world'),
	  document.getElementById('explore'),
    function() {
      require(['explore/presence', 'explore/mapper'], function(presence, mapper) {
        var deferred = Q.defer(),
            promise = deferred.promise,
            incoming = function(interface) {
              interface.then(null, null, function() {
                console.log("app.js: incoming", arguments);
              })
            },
            ready = function() {
              console.log('saying hello');
              deferred.notify("hello from app.js");
              module.resolve();
            },
            interfaces = arguments;
            forEachHandler = function(interface) {
              var loaded = 1,
                  readyHandler = function(state) {
                    interface.incoming(promise);
                    interface.outgoing(incoming);
                    console.log('added',loaded, loaded === interfaces.length);
                    if (loaded === interfaces.length) {
                      ready();
                    } else {
                      loaded = loaded + 1;
                    }
                  };
              interface.ready(readyHandler);
            };


        Array.prototype.forEach.call(interfaces, forEachHandler);

      });
    }
	);
	return module.promise;
});
