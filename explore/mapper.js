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
            map = L.mapbox.map(this.getDOMNode(), 'buley.j737pbkc')
        },
        render: function() {
          if (!marker) {
            marker = L.circleMarker( L.latLng(this.props.location.longitude, this.props.location.longitude), { radius: this.props.location.radius } );
            marker.addTo(map);
          } else {
            marker.setLatLng(L.latLng(this.props.location.longitude, this.props.location.longitude));
            marker.setRadius({ radius: this.props.location.radius })
          }
          return React.DOM.div({id: "map"}, (this.props.init - this.props.timestamp).toString());
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
