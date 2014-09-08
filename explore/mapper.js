define(['q', 'react', 'mapbox'], function(Q, React, L) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      map,
      context = {},
      marker,
      component = React.createClass({
        componentDidMount: function() {
            map = L.mapbox.map(this.getDOMNode(), 'buley.j737pbkc')
            if (!marker) {
              marker = L.circleMarker( L.latLng(this.props.location.longitude, this.props.location.longitude), { radius: this.props.location.radius } );
              console.log('adding',marker,map);
              marker.addTo(map);
            } else {
              marker.setLatLng(L.latLng(this.props.location.longitude, this.props.location.longitude));
              marker.setRadius({ radius: this.props.location.radius })
            }
        },
        render: function() {
          return React.DOM.div({id: "map"});
        }
      });

  module.resolve(component);

  L.mapbox.accessToken = 'pk.eyJ1IjoiYnVsZXkiLCJhIjoiZWwySzE4cyJ9.tKVH4x1b-W4ag-s7jqRKlA';

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
