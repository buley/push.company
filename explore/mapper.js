define(['q', 'react', 'mapbox'], function(Q, React, L) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      map,
      context = {},
      marker,
      component = React.createClass({
        componentDidMount: function() {
            L.mapbox.accessToken = 'pk.eyJ1IjoiYnVsZXkiLCJhIjoiZWwySzE4cyJ9.tKVH4x1b-W4ag-s7jqRKlA';
            map = L.mapbox.map('map', 'buley.j737pbkc');
            marker.setLatLng(L.latLng(this.props.location.longitude, this.props.location.longitude));
        },
        componentWillReceiveProps: function(props) {
          console.log('props',props);
          var lat = props.location.latitude,
              long = props.location.longitude;
          map.setView(L.latLng(lat, lon), 14);
          if (!marker) {
            marker = L.circleMarker( L.latLng(lat, lon), { radius: radius }).addTo(map);
          } else {
            marker.setLatLng(L.latLng(lat, lon));
            marker.setRadius({ radius: radius })
          }
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
