define(['q', 'react', 'mapbox'], function(Q, React, L) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      getParams = function() {
        return [ 38.538901, -121.700335, 15 ];
      },
      params = getParams(),
      lat = params[0],
      lon = params[1],
      radius = params[2],
      map,
      context = {},
      component = React.createClass({
        componentDidMount: function(props) {

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
        render: function() {
          return React.DOM.div({id: "mapper"}, (this.props.init - this.props.timestamp).toString());
        }
      });
  module.resolve(component);

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        context = state;
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
