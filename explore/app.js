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
		'Q': {
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
	console.log("AMD",arguments);
	var module = Q.defer(),
    getParams = function() {
      return [ 38.538901, -121.700335, 15 ];
    },
    params = getParams(),
    lat = params[0],
    lon = params[1],
    radius = params[2],
		module_promise = module.promise,
    doMap = function() {
      L.mapbox.accessToken = 'pk.eyJ1IjoiYnVsZXkiLCJhIjoiZWwySzE4cyJ9.tKVH4x1b-W4ag-s7jqRKlA';
      var map = L.mapbox.map('map', 'buley.j737pbkc'),
          locd= false;
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
	doOther = function() {
			var getQueryStringValue = function(qs, variable) {
					var pair,
							vars = qs.split('&'),
							i;
					for (i = 0; i < vars.length; i++) {
							pair = vars[i].split('%3D');
							if (decodeURIComponent(pair[0]) === variable) {
									return decodeURIComponent(pair[1]);
							}
					}
				}, appendQuery = function() {
var x = getQueryStringValue( window.location.hash.replace(/^#/, ''), 'x' ),
    msg;
if ( !!x ) {
  try {
    msg = JSON.parse( x );
    if (!!msg) {
      $( '#content' ).append( [
        '<article style="padding: 10px; margin-bottom: 10px; border-bottom: 1px solid #1a1a1a; background: #ccc;">',
        JSON.stringify( msg ),
        '</article>'
      ].join('') );
    }
  } catch( e ) {
    //nothing yet
  }
  window.location.hash = "#ready=true";
}
e.preventDefault();
e.stopPropigation();
};
$('#wrapper').on('click', 'a', function(e) {
$( '#content' ).html('');
e.preventDefault();
e.stopPropigation();
});
window.addEventListener( 'popstate', appendQuery );
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
	module.resolve();
	React.renderComponent(
	  React.DOM.div(null, 'Hello, world'),
	  document.getElementById('explore'),
    function() {
      doMap();
      doData();
		doOther();
    }
	);
	return module_promise;
});
